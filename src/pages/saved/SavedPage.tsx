import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Calendar, MapPin, Ticket } from 'lucide-react';
import { TicketBooking } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { formatKes } from '../../utils/format';
import { PostCard } from '../../components/cards/PostCard';
import { ZeppMedia } from '../../components/common/ZeppMedia';
import { TicketModal } from '../../components/modals/TicketModal';

export const SavedPage: React.FC = () => {
  const { posts, events, bookings } = useZepp();
  const [tab, setTab] = useState<'tickets' | 'posts' | 'events'>('tickets');
  const [activeBooking, setActiveBooking] = useState<TicketBooking | null>(null);

  const savedPosts = posts.filter((p) => p.savedByMe);
  const savedEvents = events.filter((e) => e.savedByMe);

  return (
    <div className="space-y-6">
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
            Saved & Demo Tickets
          </h1>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
            Access your bookmarked posts, saved Kenyan events, and non-redeemable digital passes.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1.5 zepp-glass-subtle rounded-2xl">
          {[
            { id: 'tickets', label: `Demo Passes (${bookings.length})` },
            { id: 'posts', label: `Saved Posts (${savedPosts.length})` },
            { id: 'events', label: `Saved Events (${savedEvents.length})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as typeof tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                tab === item.id
                  ? 'zepp-btn-primary text-white'
                  : 'text-[#71819C] dark:text-[#A6B6D0]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {tab === 'tickets' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
              <Ticket className="w-8 h-8 text-[#1769E8] mx-auto" />
              <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                No demonstration bookings yet
              </p>
              <Link
                to="/events"
                className="inline-block px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookings.map((bk) => {
                const evt = events.find((e) => e.id === bk.eventId);
                return (
                  <div
                    key={bk.id}
                    className="zepp-glass rounded-3xl p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <p className="font-mono-num text-xs font-bold text-[#1769E8] dark:text-[#60A5FA]">
                        {bk.reference} · Demo Non-Redeemable
                      </p>
                      <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
                        {evt?.title || 'Zepp Event'}
                      </h2>
                      <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                        {bk.quantity} × {bk.categoryName} ·{' '}
                        <span className="font-mono-num font-semibold">
                          {formatKes(bk.totalKes)}
                        </span>
                      </p>
                      {evt && (
                        <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> {evt.venue}, {evt.city}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveBooking(bk)}
                      className="w-full py-2.5 px-4 rounded-xl zepp-btn-primary text-xs font-bold"
                    >
                      Open Digital Pass
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'posts' && (
        <div className="space-y-4">
          {savedPosts.length === 0 ? (
            <div className="zepp-glass rounded-3xl p-10 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-[#1769E8] mx-auto" />
              <p className="text-sm font-bold">No saved posts yet</p>
            </div>
          ) : (
            savedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {tab === 'events' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedEvents.length === 0 ? (
            <div className="sm:col-span-2 zepp-glass rounded-3xl p-10 text-center space-y-2">
              <Calendar className="w-8 h-8 text-[#1769E8] mx-auto" />
              <p className="text-sm font-bold">No saved events yet</p>
            </div>
          ) : (
            savedEvents.map((evt) => (
              <Link
                key={evt.id}
                to={`/events/${evt.id}`}
                className="zepp-glass rounded-3xl overflow-hidden flex flex-col"
              >
                <ZeppMedia
                  src={evt.coverUrl}
                  alt={evt.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4 space-y-1">
                  <p className="text-xs font-semibold text-[#1769E8]">{evt.dateStr}</p>
                  <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                    {evt.title}
                  </h2>
                  <p className="text-xs text-[#71819C]">
                    {evt.venue}, {evt.city}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      <TicketModal
        open={Boolean(activeBooking)}
        onClose={() => setActiveBooking(null)}
        booking={activeBooking}
        event={events.find((e) => e.id === activeBooking?.eventId)}
      />
    </div>
  );
};
