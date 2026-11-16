import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Film,
  MapPin,
  Search,
  Store,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber, formatKes } from '../../utils/format';
import { ZeppMedia } from '../../components/common/ZeppMedia';
import { PostCard } from '../../components/cards/PostCard';

const DISCOVERY_CATEGORIES = [
  'All',
  'Trending',
  'Entertainment',
  'Lifestyle',
  'Technology',
  'Business',
  'Fashion',
  'Sports',
  'Food',
  'Travel',
  'Education',
  'Events',
];

const SUGGESTED_SEARCHES = [
  'Nairobi',
  'Mombasa',
  'Coffee',
  'Tech',
  'Music',
  'Linen',
  'Rift Valley',
];

export const ExplorePage: React.FC = () => {
  const {
    users,
    businesses,
    events,
    posts,
    videos,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    toggleFollowUser,
    currentUser,
  } = useZepp();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const applyQuickQuery = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    setSearchParams({ q: term });
  };

  const normalizedQuery = query.trim().toLowerCase();

  const categoryMatches = (text: string) => {
    if (activeCategory === 'All' || activeCategory === 'Trending') return true;
    const cat = activeCategory.toLowerCase();
    const hay = text.toLowerCase();
    if (cat === 'food') return hay.includes('food') || hay.includes('coffee') || hay.includes('culinary') || hay.includes('dining');
    if (cat === 'entertainment') return hay.includes('music') || hay.includes('festival') || hay.includes('concert') || hay.includes('nightlife');
    if (cat === 'lifestyle') return hay.includes('nairobi') || hay.includes('lifestyle') || hay.includes('ceramics');
    return hay.includes(cat);
  };

  const matchedUsers = useMemo(() => {
    return users
      .filter((u) => u.id !== currentUser.id)
      .filter((u) => {
        const text = `${u.name} ${u.username} ${u.bio} ${u.location} ${u.creatorCategory || ''}`;
        const matchesQ = !normalizedQuery || text.toLowerCase().includes(normalizedQuery);
        return matchesQ && categoryMatches(text);
      });
  }, [users, currentUser.id, normalizedQuery, activeCategory]);

  const matchedBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const text = `${b.name} ${b.category} ${b.city} ${b.description}`;
      const matchesQ = !normalizedQuery || text.toLowerCase().includes(normalizedQuery);
      return matchesQ && categoryMatches(text);
    });
  }, [businesses, normalizedQuery, activeCategory]);

  const matchedEvents = useMemo(() => {
    return events.filter((e) => {
      const text = `${e.title} ${e.category} ${e.city} ${e.venue} ${e.description}`;
      const matchesQ = !normalizedQuery || text.toLowerCase().includes(normalizedQuery);
      return matchesQ && (activeCategory === 'Events' || categoryMatches(text));
    });
  }, [events, normalizedQuery, activeCategory]);

  const matchedPosts = useMemo(() => {
    return posts.filter((p) => {
      const text = `${p.content} ${p.location} ${p.hashtags.join(' ')}`;
      const matchesQ = !normalizedQuery || text.toLowerCase().includes(normalizedQuery);
      return matchesQ && categoryMatches(text);
    });
  }, [posts, normalizedQuery, activeCategory]);

  const matchedVideos = useMemo(() => {
    return videos.filter((v) => {
      const text = `${v.title} ${v.caption} ${v.category} ${v.location}`;
      const matchesQ = !normalizedQuery || text.toLowerCase().includes(normalizedQuery);
      return matchesQ && categoryMatches(text);
    });
  }, [videos, normalizedQuery, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
            Explore Kenya on Zepp
          </h1>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
            Discover creators, Kenyan businesses, upcoming events, and trending conversations.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#71819C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, @usernames, businesses, events, or #hashtags..."
              className="w-full zepp-neu-input rounded-2xl pl-11 pr-10 py-3 text-sm text-[#142443] dark:text-white placeholder:text-[#98A6BA] focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSearchParams({});
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[#71819C] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl zepp-btn-primary text-xs font-bold whitespace-nowrap shrink-0"
          >
            Search
          </button>
        </form>

        {/* Recent & Suggested Searches */}
        <div className="space-y-2.5 pt-1">
          {recentSearches.length > 0 && (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-[#71819C] dark:text-[#A6B6D0] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Recent:
                </span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => applyQuickQuery(term)}
                    className="px-2.5 py-1 rounded-lg zepp-glass-subtle text-xs font-medium text-[#1C2B45] dark:text-[#DCEAFF] hover:border-[#1769E8]/40"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[11px] font-semibold text-[#71819C] hover:text-[#E55353] flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-[#71819C] dark:text-[#A6B6D0]">
              Suggested:
            </span>
            {SUGGESTED_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => applyQuickQuery(term)}
                className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {DISCOVERY_CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? 'zepp-btn-primary text-white'
                    : 'zepp-glass-subtle text-[#1C2B45] dark:text-[#DCEAFF] hover:border-[#1769E8]/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Creators & People */}
      {matchedUsers.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1769E8]" />
              People & Creators ({matchedUsers.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {matchedUsers.slice(0, 6).map((person) => (
              <div
                key={person.id}
                className="zepp-glass rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <Link to={`/profile/${person.id}`} className="flex items-center gap-3 min-w-0">
                  <ZeppMedia
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                      {person.name}
                    </p>
                    <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] truncate">
                      @{person.username} · {person.location}
                    </p>
                    <p className="text-[11px] font-medium text-[#1769E8] dark:text-[#60A5FA] mt-0.5">
                      {formatCompactNumber(person.followersCount)} followers · {person.demoRoleLabel}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFollowUser(person.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 ${
                    person.isFollowing ? 'zepp-btn-secondary' : 'zepp-btn-primary'
                  }`}
                >
                  {person.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Short Videos */}
      {matchedVideos.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Film className="w-4 h-4 text-[#1769E8]" />
              Trending Short Videos
            </h2>
            <Link
              to="/videos"
              className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              Open Video Feed
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {matchedVideos.slice(0, 3).map((vid) => (
              <Link
                key={vid.id}
                to={`/videos?v=${vid.id}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/70 dark:border-blue-400/15 shadow-sm"
              >
                <ZeppMedia
                  src={vid.posterUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-3.5 flex flex-col justify-end text-white">
                  <p className="text-xs font-bold leading-snug line-clamp-2">{vid.title}</p>
                  <p className="text-[11px] text-white/80 mt-1 tabular-nums">
                    {vid.location} · {formatCompactNumber(vid.viewsCount)} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {matchedEvents.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1769E8]" />
              Events & Experiences
            </h2>
            <Link
              to="/events"
              className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              All Events
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchedEvents.slice(0, 4).map((evt) => (
              <Link
                key={evt.id}
                to={`/events/${evt.id}`}
                className="zepp-glass rounded-2xl overflow-hidden hover:border-[#1769E8]/40 transition-colors flex flex-col"
              >
                <ZeppMedia
                  src={evt.coverUrl}
                  alt={evt.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4 space-y-1.5 flex-1">
                  <p className="text-[11px] font-semibold text-[#1769E8] dark:text-[#60A5FA]">
                    {evt.category} · {evt.dateStr}
                  </p>
                  <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] line-clamp-1">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {evt.venue}, {evt.city}
                  </p>
                  <p className="font-mono-num text-xs font-bold text-[#142443] dark:text-white pt-1">
                    From {formatKes(Math.min(...evt.ticketCategories.map((t) => t.priceKes)))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Businesses */}
      {matchedBusinesses.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#1769E8]" />
              Kenyan Businesses
            </h2>
            <Link
              to="/businesses"
              className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
            >
              View Directory
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {matchedBusinesses.slice(0, 4).map((biz) => (
              <Link
                key={biz.id}
                to={`/businesses/${biz.id}`}
                className="zepp-glass rounded-2xl p-4 flex items-center gap-3.5 hover:border-[#1769E8]/40 transition-colors"
              >
                <ZeppMedia
                  src={biz.logoUrl}
                  alt={biz.name}
                  className="w-12 h-12 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                    {biz.name}
                  </h3>
                  <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] truncate">
                    {biz.category} · {biz.city}
                  </p>
                  <p className="text-[11px] font-medium text-[#1769E8] dark:text-[#60A5FA] mt-0.5">
                    {biz.products.length} products in KES
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Matching Posts */}
      {matchedPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
            Featured Posts ({matchedPosts.length})
          </h2>
          <div className="space-y-4">
            {matchedPosts.slice(0, 5).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty Search Result */}
      {matchedUsers.length === 0 &&
        matchedBusinesses.length === 0 &&
        matchedEvents.length === 0 &&
        matchedPosts.length === 0 && (
          <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
            <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
              No matching demonstration content
            </h2>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
              Try searching for Nairobi, Mombasa, coffee, tech, or switch category to All.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveCategory('All');
                setSearchParams({});
              }}
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              Reset Explore Filters
            </button>
          </div>
        )}
    </div>
  );
};
