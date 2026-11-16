import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Compass, Store, Ticket, TrendingUp, Users } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber, formatKes } from '../../utils/format';
import { ZeppMedia } from '../common/ZeppMedia';

export const RightContextRail: React.FC = () => {
  const location = useLocation();
  const { users, events, businesses, bookings, currentUser, toggleFollowUser } = useZepp();

  const path = location.pathname;

  const suggestedAccounts = users
    .filter((u) => u.id !== currentUser.id && !u.isFollowing)
    .slice(0, 4);

  const popularCreators = users
    .filter((u) => u.accountType === 'creator')
    .slice(0, 3);

  const upcomingEvents = events.slice(0, 3);
  const featuredBusinesses = businesses.slice(0, 3);

  const trendingTopics = [
    { tag: '#NairobiTech', posts: '2.4K posts' },
    { tag: '#MombasaEvents', posts: '1.8K posts' },
    { tag: '#TembeaKenya', posts: '3.1K posts' },
    { tag: '#KenyanCoffee', posts: '940 posts' },
    { tag: '#MadeInKenya', posts: '1.5K posts' },
  ];

  const isEventsView = path.startsWith('/events');
  const isBusinessView = path.startsWith('/businesses');
  const isExploreView = path.startsWith('/explore');

  return (
    <aside className="space-y-5 sticky top-6">
      {/* Contextual Top Card based on active route */}
      {isEventsView && (
        <div className="zepp-glass rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#1769E8]" />
              Your Demo Passes
            </h2>
            <Link
              to="/saved"
              className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              View All
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
              Book any event to preview a non-redeemable Zepp digital ticket here.
            </p>
          ) : (
            <div className="space-y-2.5">
              {bookings.slice(0, 2).map((b) => {
                const evt = events.find((e) => e.id === b.eventId);
                return (
                  <Link
                    key={b.id}
                    to="/saved"
                    className="block p-3 rounded-2xl zepp-glass-subtle hover:border-[#1769E8]/35 transition-colors"
                  >
                    <p className="text-xs font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                      {evt?.title || 'Zepp Event'}
                    </p>
                    <p className="font-mono-num text-[11px] text-[#1769E8] dark:text-[#60A5FA] mt-0.5">
                      {b.reference} · {b.quantity}× {b.categoryName}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isBusinessView && (
        <div className="zepp-glass rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#1769E8]" />
              Promoted Shops
            </h2>
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              Business Hub
            </Link>
          </div>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] leading-relaxed">
            Explore Kenyan brands pricing in KES. Switch to a Business or Creator account in the sidebar to test analytics.
          </p>
        </div>
      )}

      {/* Trending Topics */}
      <div className="zepp-glass rounded-3xl p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#1769E8]" />
            Trending in Kenya
          </h2>
          <Link
            to="/explore"
            className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
          >
            Explore
          </Link>
        </div>
        <div className="divide-y divide-[#DCEAFF]/70 dark:divide-blue-400/10">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.tag}
              to={`/explore?q=${encodeURIComponent(topic.tag)}`}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2 group"
            >
              <span className="text-[13px] font-semibold text-[#1C2B45] dark:text-[#E5EEFF] group-hover:text-[#1769E8] dark:group-hover:text-[#60A5FA] transition-colors">
                {topic.tag}
              </span>
              <span className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] tabular-nums">
                {topic.posts}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Creators (especially on Explore) or Suggested Accounts */}
      <div className="zepp-glass rounded-3xl p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1769E8]" />
            {isExploreView ? 'Popular Creators' : 'Suggested Accounts'}
          </h2>
          <Link
            to="/explore"
            className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-3">
          {(isExploreView ? popularCreators : suggestedAccounts).map((person) => (
            <div key={person.id} className="flex items-center justify-between gap-3">
              <Link to={`/profile/${person.id}`} className="flex items-center gap-2.5 min-w-0">
                <ZeppMedia
                  src={person.avatarUrl}
                  alt={person.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                    {person.name}
                  </p>
                  <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] truncate">
                    @{person.username} · {formatCompactNumber(person.followersCount)}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => toggleFollowUser(person.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  person.isFollowing
                    ? 'zepp-btn-secondary'
                    : 'bg-[#DCEAFF]/85 dark:bg-[#1769E8]/25 text-[#1769E8] dark:text-[#93C5FD] hover:bg-[#DCEAFF]'
                }`}
              >
                {person.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      {!isEventsView && (
        <div className="zepp-glass rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1769E8]" />
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              Browse
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <Link
                key={evt.id}
                to={`/events/${evt.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-2xl hover:bg-[#DCEAFF]/45 dark:hover:bg-white/5 transition-colors"
              >
                <ZeppMedia
                  src={evt.coverUrl}
                  alt={evt.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                    {evt.title}
                  </p>
                  <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] truncate">
                    {evt.city} · {evt.dateStr}
                  </p>
                  <p className="font-mono-num text-[11px] font-semibold text-[#1769E8] dark:text-[#60A5FA]">
                    From {formatKes(Math.min(...evt.ticketCategories.map((t) => t.priceKes)))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Businesses */}
      {!isBusinessView && (
        <div className="zepp-glass rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1769E8]" />
              Featured Businesses
            </h2>
            <Link
              to="/businesses"
              className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              Directory
            </Link>
          </div>
          <div className="space-y-2.5">
            {featuredBusinesses.map((biz) => (
              <Link
                key={biz.id}
                to={`/businesses/${biz.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded-2xl hover:bg-[#DCEAFF]/45 dark:hover:bg-white/5 transition-colors"
              >
                <ZeppMedia
                  src={biz.logoUrl}
                  alt={biz.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                    {biz.name}
                  </p>
                  <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] truncate">
                    {biz.category} · {biz.city}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
