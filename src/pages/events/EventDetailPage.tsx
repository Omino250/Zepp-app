import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  ShieldCheck,
  Ticket,
  Users,
} from 'lucide-react';
import { TicketBooking } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { formatKes } from '../../utils/format';
import { ZeppMedia } from '../../components/common/ZeppMedia';
import { TicketModal } from '../../components/modals/TicketModal';

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams();
  const {
    events,
    users,
    currentUser,
    toggleSaveEvent,
    createDemoBooking,
    pushToast,
  } = useZepp();

  const event = events.find((e) => e.id === eventId);
  const organiser = event ? users.find((u) => u.id === event.organiserId) : undefined;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    event?.ticketCategories[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState(currentUser.name);
  const [attendeeEmail, setAttendeeEmail] = useState(
    currentUser.email || 'attendee.demo@zepp.ke'
  );
  const [attendeePhone, setAttendeePhone] = useState(
    currentUser.phone || '+254 712 000 000'
  );
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa Demo' | 'Card Demo'>(
    'M-Pesa Demo'
  );
  const [confirmedBooking, setConfirmedBooking] = useState<TicketBooking | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  if (!event) {
    return (
      <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
        <h1 className="text-lg font-bold text-[#142443] dark:text-[#F0F5FF]">
          Event not found
        </h1>
        <Link
          to="/events"
          className="inline-block px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const activeCategory =
    event.ticketCategories.find((c) => c.id === selectedCategoryId) ||
    event.ticketCategories[0];

  const subtotal = (activeCategory?.priceKes ?? 0) * quantity;
  const serviceFee = subtotal === 0 ? 0 : Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  const handleConfirmPayment = () => {
    if (!activeCategory) return;
    const booking = createDemoBooking({
      eventId: event.id,
      categoryId: activeCategory.id,
      quantity,
      attendeeName: attendeeName.trim() || currentUser.name,
      attendeeEmail: attendeeEmail.trim() || 'demo@zepp.ke',
      attendeePhone: attendeePhone.trim() || '+254 712 000 000',
      paymentMethod,
    });
    setConfirmedBooking(booking);
    setStep(6);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      {/* Hero Cover Card */}
      <section className="zepp-glass rounded-3xl overflow-hidden">
        <div className="relative h-60 sm:h-72">
          <ZeppMedia
            src={event.coverUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
            <p className="text-xs font-semibold text-[#93C5FD]">
              {event.category} · {event.city}, Kenya
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-1">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#1C2B45] dark:text-[#DCEAFF]">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#1769E8]" />
                {event.dateStr}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-[#1769E8]" />
                {event.timeStr}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#1769E8]" />
                {event.venue}, {event.city}
              </span>
              <span className="flex items-center gap-1.5 font-medium tabular-nums">
                <Users className="w-4 h-4 text-[#1769E8]" />
                {event.attendeesCount.toLocaleString()} attending
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveEvent(event.id)}
                className="px-3.5 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold flex items-center gap-1.5"
              >
                <Bookmark className={`w-4 h-4 ${event.savedByMe ? 'fill-current text-[#1769E8]' : ''}`} />
                {event.savedByMe ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => pushToast('Event share link copied (demo).', 'success')}
                className="px-3.5 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[#1C2B45] dark:text-[#E5EEFF]">
            {event.description}
          </p>

          {/* Organiser + Stylised Venue Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {organiser && (
              <Link
                to={`/profile/${organiser.id}`}
                className="p-4 rounded-2xl zepp-glass-subtle flex items-center gap-3 hover:border-[#1769E8]/40 transition-colors"
              >
                <ZeppMedia
                  src={organiser.avatarUrl}
                  alt={organiser.name}
                  className="w-12 h-12 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[#71819C] dark:text-[#A6B6D0]">
                    Organised by
                  </p>
                  <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                    {organiser.name}
                  </p>
                  <p className="text-xs text-[#1769E8] dark:text-[#60A5FA]">
                    @{organiser.username} · {organiser.demoRoleLabel}
                  </p>
                </div>
              </Link>
            )}

            {/* Stylised Map-Style Location Preview (no invented geocoding) */}
            <div className="p-4 rounded-2xl zepp-glass-subtle relative overflow-hidden flex items-center justify-between gap-3">
              <div className="relative z-10">
                <p className="text-[11px] font-semibold text-[#71819C] dark:text-[#A6B6D0]">
                  Venue Location Preview
                </p>
                <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                  {event.venue}
                </p>
                <p className="text-xs text-[#1769E8] dark:text-[#60A5FA]">
                  {event.city}, Kenya
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#DCEAFF] dark:bg-[#1769E8]/25 text-[#1769E8] dark:text-[#93C5FD] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Ticket Booking Journey */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCEAFF]/80 dark:border-blue-400/15">
          <div>
            <h2 className="text-lg font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#1769E8]" />
              Ticket Booking Journey
            </h2>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
              Step {step} of 6 · Simulated KES booking flow (no real charge)
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <span
                key={s}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  step >= s ? 'bg-[#1769E8]' : 'bg-[#DCEAFF] dark:bg-blue-400/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Ticket Category */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Step 1: Select Ticket Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.ticketCategories.map((cat) => {
                const active = activeCategory?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      active
                        ? 'bg-[#EDF4FF] dark:bg-[#1769E8]/25 border-[#1769E8]'
                        : 'zepp-glass-subtle hover:border-[#287BFA]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                        {cat.name}
                      </span>
                      <span className="font-mono-num text-sm font-extrabold text-[#1769E8] dark:text-[#60A5FA]">
                        {formatKes(cat.priceKes)}
                      </span>
                    </div>
                    <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-1">
                      {cat.description}
                    </p>
                    <p className="text-[11px] font-medium text-[#20A574] mt-2 tabular-nums">
                      {cat.available} passes remaining
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl zepp-btn-primary text-xs font-bold"
              >
                Continue to Quantity
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Quantity */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Step 2: Select Quantity
            </h3>
            <div className="p-4 rounded-2xl zepp-glass-subtle flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                  {activeCategory?.name}
                </p>
                <p className="font-mono-num text-xs text-[#71819C] dark:text-[#A6B6D0]">
                  {formatKes(activeCategory?.priceKes ?? 0)} per pass
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl zepp-btn-secondary font-bold text-base"
                >
                  −
                </button>
                <span className="font-mono-num text-base font-bold w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(activeCategory?.available || 10, q + 1))
                  }
                  className="w-10 h-10 rounded-xl zepp-btn-secondary font-bold text-base"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl zepp-btn-secondary text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl zepp-btn-primary text-xs font-bold"
              >
                Review Price Breakdown
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Price Breakdown */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Step 3: Price Breakdown
            </h3>
            <div className="p-4 rounded-2xl zepp-glass-subtle space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#71819C] dark:text-[#A6B6D0]">
                  {quantity} × {activeCategory?.name}
                </span>
                <span className="font-mono-num font-semibold">{formatKes(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71819C] dark:text-[#A6B6D0]">
                  Platform Service Fee (5%)
                </span>
                <span className="font-mono-num font-semibold">{formatKes(serviceFee)}</span>
              </div>
              <div className="pt-2.5 border-t border-[#DCEAFF] dark:border-blue-400/15 flex justify-between text-base font-extrabold text-[#142443] dark:text-white">
                <span>Total (KES)</span>
                <span className="font-mono-num text-[#1769E8] dark:text-[#60A5FA]">
                  {formatKes(total)}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl zepp-btn-secondary text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl zepp-btn-primary text-xs font-bold"
              >
                Enter Attendee Details
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Attendee Information */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Step 4: Attendee Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl zepp-btn-secondary text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-xl zepp-btn-primary text-xs font-bold"
              >
                Proceed to Simulated Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Simulated Payment */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Step 5: Simulated Payment Method
            </h3>
            <div className="p-3.5 rounded-2xl bg-[#DCEAFF]/60 dark:bg-[#1769E8]/20 text-xs text-[#142443] dark:text-[#DCEAFF] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#1769E8] shrink-0 mt-0.5" />
              <span>
                Prototype checkout simulation. Designed for future M-Pesa Daraja API integration. No real payment or credentials are processed.
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['M-Pesa Demo', 'Card Demo'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    paymentMethod === method
                      ? 'bg-[#EDF4FF] dark:bg-[#1769E8]/25 border-[#1769E8]'
                      : 'zepp-glass-subtle'
                  }`}
                >
                  <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                    {method}
                  </p>
                  <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
                    {method === 'M-Pesa Demo'
                      ? `Simulate STK prompt to ${attendeePhone}`
                      : 'Simulate instant Kenyan debit/credit approval'}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2.5 rounded-xl zepp-btn-secondary text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-6 py-3 rounded-xl zepp-btn-primary text-xs font-bold"
              >
                Confirm Demo Booking ({formatKes(total)})
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Booking Confirmation */}
        {step === 6 && confirmedBooking && (
          <div className="py-4 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#20A574] mx-auto" />
            <div>
              <h3 className="text-lg font-extrabold text-[#142443] dark:text-[#F0F5FF]">
                Demonstration Booking Confirmed
              </h3>
              <p className="font-mono-num text-xs font-bold text-[#1769E8] dark:text-[#60A5FA] mt-1">
                Reference: {confirmedBooking.reference} · Non-Redeemable Demo Pass
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTicketModalOpen(true)}
                className="px-5 py-2.5 rounded-xl zepp-btn-primary text-xs font-bold"
              >
                View Digital Demo Ticket
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl zepp-btn-secondary text-xs font-bold"
              >
                Book Another Pass
              </button>
            </div>
          </div>
        )}
      </section>

      <TicketModal
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        booking={confirmedBooking}
        event={event}
      />
    </div>
  );
};
