import React from 'react';
import { Calendar, MapPin, ShieldAlert, Ticket } from 'lucide-react';
import { TicketBooking, ZeppEvent } from '../../types';
import { formatKes } from '../../utils/format';
import { Modal } from '../common/Modal';
import { ZeppLogo } from '../common/ZeppLogo';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  booking: TicketBooking | null;
  event: ZeppEvent | undefined;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  open,
  onClose,
  booking,
  event,
}) => {
  if (!booking || !event) return null;

  // Deterministic pseudo-QR matrix derived from booking reference
  const cells = Array.from({ length: 49 }, (_, idx) => {
    const code = booking.reference.charCodeAt(idx % booking.reference.length);
    const row = Math.floor(idx / 7);
    const col = idx % 7;
    const corner =
      (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
    return corner || (code + idx * 7) % 3 !== 0;
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Zepp Digital Pass"
      subtitle="Demonstration Ticket Preview"
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#EBAA43]/15 border border-[#EBAA43]/35 text-[#8A5A0A] dark:text-[#FCD34D] text-xs font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            DEMO TICKET — NON-REDEEMABLE. Generated locally for prototype demonstration only.
          </span>
        </div>

        <div className="rounded-3xl overflow-hidden border border-[#1769E8]/20 bg-white/85 dark:bg-[#101E3A]/90 shadow-md">
          <div className="bg-gradient-to-br from-[#287BFA] to-[#1557D8] text-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ZeppLogo variant="symbol" size="sm" />
                <div>
                  <p className="text-[11px] font-medium text-blue-100">Zepp Events Pass</p>
                  <p className="font-mono-num text-sm font-bold tracking-wide">
                    {booking.reference}
                  </p>
                </div>
              </div>
              <Ticket className="w-6 h-6 text-white/85" />
            </div>
            <h3 className="text-lg font-bold mt-4 leading-snug">{event.title}</h3>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[#71819C] dark:text-[#A6B6D0]">Attendee</p>
                <p className="font-semibold text-[#142443] dark:text-[#F0F5FF] mt-0.5">
                  {booking.attendeeName}
                </p>
              </div>
              <div>
                <p className="text-[#71819C] dark:text-[#A6B6D0]">Ticket Category</p>
                <p className="font-semibold text-[#142443] dark:text-[#F0F5FF] mt-0.5">
                  {booking.quantity} × {booking.categoryName}
                </p>
              </div>
              <div className="flex items-start gap-1.5 col-span-2">
                <Calendar className="w-3.5 h-3.5 text-[#1769E8] mt-0.5 shrink-0" />
                <span className="text-[#1C2B45] dark:text-[#DCEAFF] font-medium">
                  {event.dateStr} · {event.timeStr}
                </span>
              </div>
              <div className="flex items-start gap-1.5 col-span-2">
                <MapPin className="w-3.5 h-3.5 text-[#1769E8] mt-0.5 shrink-0" />
                <span className="text-[#1C2B45] dark:text-[#DCEAFF] font-medium">
                  {event.venue}, {event.city}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#DCEAFF] dark:border-blue-400/20 pt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">Total Paid (Simulated)</p>
                <p className="font-mono-num text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
                  {formatKes(booking.totalKes)}
                </p>
                <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
                  Method: {booking.paymentMethod}
                </p>
              </div>

              <div
                className="p-2.5 rounded-2xl bg-white border border-slate-200 shrink-0"
                aria-label={`QR visual for booking ${booking.reference}`}
              >
                <div className="grid grid-cols-7 gap-1 w-20 h-20">
                  {cells.map((filled, idx) => (
                    <div
                      key={idx}
                      className={`rounded-[2px] ${filled ? 'bg-[#142443]' : 'bg-slate-100'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl zepp-btn-primary text-sm font-semibold"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};
