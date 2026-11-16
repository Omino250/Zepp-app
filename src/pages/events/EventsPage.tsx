import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Calendar, MapPin, Ticket, Users } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { formatKes } from '../../utils/format';
import { ZeppMedia } from '../../components/common/ZeppMedia';

const EVENT_CATEGORIES = [
  'All',
  'Festivals',
  'Music',
  'Concerts',
  'Nightlife',
  'Sports',
  'Business Conferences',
  'Education',
  'Food & Dining',
  'Travel',
  'Beach Activities',
  'Cultural Experiences',
];

const CITIES = ['All Cities', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kakamega'];

export const EventsPage: React.FC = () => {
  const { events, users, bookings, toggleSaveEvent } = useZepp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const catMatch =
        selectedCategory === 'All' ||
        evt.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Music' &&
          (evt.category === 'Concerts' || evt.category === 'Festivals'));
      const cityMatch = selectedCity === 'All Cities' || evt.city === selectedCity;
      return catMatch && cityMatch;
    });
  }, [events, selectedCategory, selectedCity]);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
              Events & Experiences
            </h1>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
              Discover concerts, summits, coastal festivals, and trail days across Kenya.
            </p>
          </div>
          <Link
            to="/saved"
            className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <Ticket className="w-4 h-4 text-[#1769E8]" />
            My Demo Passes ({bookings.length})
          </Link>
        </div>

        {/* City Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CITIES.map((city) => {
            const active = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? 'zepp-btn-primary text-white'
                    : 'zepp-glass-subtle text-[#1C2B45] dark:text-[#DCEAFF] hover:border-[#1769E8]/40'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {EVENT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#DCEAFF] dark:bg-[#1769E8]/35 text-[#1769E8] dark:text-[#93C5FD]'
                    : 'text-[#71819C] dark:text-[#A6B6D0] hover:text-[#142443] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
          <Calendar className="w-8 h-8 text-[#1769E8] mx-auto" />
          <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
            No events match this filter yet
          </h2>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
            Reset filters or publish a new demonstration event from the Studio Hub.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedCity('All Cities');
            }}
            className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
          >
            Show All Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredEvents.map((evt) => {
            const organiser = users.find((u) => u.id === evt.organiserId);
            const minPrice = Math.min(...evt.ticketCategories.map((t) => t.priceKes));
            return (
              <article
                key={evt.id}
                className="zepp-glass rounded-3xl overflow-hidden flex flex-col hover:border-[#1769E8]/40 transition-colors"
              >
                <div className="relative">
                  <Link to={`/events/${evt.id}`}>
                    <ZeppMedia
                      src={evt.coverUrl}
                      alt={evt.title}
                      className="w-full h-44 object-cover"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleSaveEvent(evt.id)}
                    aria-label={evt.savedByMe ? 'Remove saved event' : 'Save event'}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-colors ${
                      evt.savedByMe
                        ? 'bg-[#1769E8] text-white'
                        : 'bg-white/85 dark:bg-[#142443]/85 text-[#142443] dark:text-white'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${evt.savedByMe ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA]">
                      {evt.category} · {evt.dateStr}
                    </p>
                    <Link to={`/events/${evt.id}`}>
                      <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF] hover:text-[#1769E8] transition-colors leading-snug">
                        {evt.title}
                      </h2>
                    </Link>
                    <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {evt.venue}, {evt.city}
                    </p>
                    {organiser && (
                      <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        By {organiser.name} · {evt.attendeesCount.toLocaleString()} going
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#DCEAFF]/70 dark:border-blue-400/15 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0]">
                        Starting from
                      </p>
                      <p className="font-mono-num text-sm font-extrabold text-[#142443] dark:text-white">
                        {formatKes(minPrice)}
                      </p>
                    </div>
                    <Link
                      to={`/events/${evt.id}`}
                      className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-bold whitespace-nowrap shrink-0"
                    >
                      Book Tickets
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
