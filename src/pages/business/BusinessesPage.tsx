import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Store, Users } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber, formatKes } from '../../utils/format';
import { ZeppMedia } from '../../components/common/ZeppMedia';

export const BusinessesPage: React.FC = () => {
  const { businesses, toggleFollowBusiness } = useZepp();
  const [cityFilter, setCityFilter] = useState('All');
  const [query, setQuery] = useState('');

  const cities = ['All', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kakamega'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      const cityOk = cityFilter === 'All' || b.city === cityFilter;
      const qOk =
        !q ||
        `${b.name} ${b.category} ${b.city} ${b.description}`.toLowerCase().includes(q);
      return cityOk && qOk;
    });
  }, [businesses, cityFilter, query]);

  return (
    <div className="space-y-6">
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
              Kenyan Business Ecosystem
            </h1>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
              Browse local brands, coffee roasters, apparel studios, tech hubs, and eco-tours priced in KES.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-bold whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            Business Hub
          </Link>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#71819C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter Kenyan businesses by name, category, or city..."
            className="w-full zepp-neu-input rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCityFilter(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                cityFilter === c
                  ? 'zepp-btn-primary text-white'
                  : 'zepp-glass-subtle text-[#1C2B45] dark:text-[#DCEAFF]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
          <Store className="w-8 h-8 text-[#1769E8] mx-auto" />
          <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
            No businesses found for "{query || cityFilter}"
          </p>
          <button
            type="button"
            onClick={() => {
              setCityFilter('All');
              setQuery('');
            }}
            className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
          >
            Reset Directory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((biz) => (
            <article
              key={biz.id}
              className="zepp-glass rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <Link to={`/businesses/${biz.id}`}>
                  <ZeppMedia
                    src={biz.coverUrl}
                    alt={biz.name}
                    className="w-full h-36 object-cover"
                  />
                </Link>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ZeppMedia
                        src={biz.logoUrl}
                        alt={biz.name}
                        className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-white/80"
                      />
                      <div className="min-w-0">
                        <Link to={`/businesses/${biz.id}`}>
                          <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF] hover:text-[#1769E8] truncate">
                            {biz.name}
                          </h2>
                        </Link>
                        <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] truncate">
                          {biz.category} · {biz.demoStatusNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#1C2B45] dark:text-[#DCEAFF] line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#71819C] dark:text-[#A6B6D0]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {biz.city}
                    </span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Users className="w-3.5 h-3.5" />{' '}
                      {formatCompactNumber(biz.followersCount)} followers
                    </span>
                  </div>

                  {biz.products[0] && (
                    <div className="p-3 rounded-2xl zepp-glass-subtle flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#142443] dark:text-[#F0F5FF] truncate">
                        Featured: {biz.products[0].name}
                      </span>
                      <span className="font-mono-num font-bold text-[#1769E8] dark:text-[#60A5FA] shrink-0">
                        {formatKes(biz.products[0].priceKes)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleFollowBusiness(biz.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold ${
                    biz.isFollowing ? 'zepp-btn-secondary' : 'bg-[#DCEAFF] text-[#1769E8]'
                  }`}
                >
                  {biz.isFollowing ? 'Following' : 'Follow Shop'}
                </button>
                <Link
                  to={`/businesses/${biz.id}`}
                  className="flex-1 py-2 px-3 rounded-xl zepp-btn-primary text-xs font-bold text-center"
                >
                  Explore Profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
