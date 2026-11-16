import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Image as ImageIcon, PlusSquare, Sparkles } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { StoriesBar } from '../../components/stories/StoriesBar';
import { PostCard } from '../../components/cards/PostCard';
import { ZeppMedia } from '../../components/common/ZeppMedia';
import { ZeppLogo } from '../../components/common/ZeppLogo';

type FeedTab = 'for-you' | 'following' | 'trending';

export const HomePage: React.FC = () => {
  const { posts, users, currentUser, settings } = useZepp();
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');

  const visiblePosts = useMemo(() => {
    const nonBlocked = posts.filter(
      (p) => !settings.blockedUserIds.includes(p.authorId)
    );

    if (activeTab === 'following') {
      const followedIds = new Set(
        users.filter((u) => u.isFollowing || u.id === currentUser.id).map((u) => u.id)
      );
      return nonBlocked.filter((p) => followedIds.has(p.authorId));
    }

    if (activeTab === 'trending') {
      return [...nonBlocked].sort(
        (a, b) =>
          b.likesCount + b.sharesCount * 2 - (a.likesCount + a.sharesCount * 2)
      );
    }

    return nonBlocked;
  }, [posts, users, currentUser.id, settings.blockedUserIds, activeTab]);

  return (
    <div className="space-y-5">
      {/* Stories Section */}
      <StoriesBar />

      {/* Quick Post Launch Card */}
      <div className="zepp-glass rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <ZeppMedia
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-2xl object-cover shrink-0"
          />
          <Link
            to="/create"
            className="flex-1 zepp-neu-input rounded-2xl px-4 py-2.5 text-sm text-[#71819C] dark:text-[#A6B6D0] hover:text-[#142443] dark:hover:text-white transition-colors truncate"
          >
            Share a moment, event, or update from {currentUser.location}...
          </Link>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/create?mode=photo"
            className="min-h-[40px] px-3 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
          >
            <ImageIcon className="w-4 h-4 text-[#1769E8]" />
            Photo
          </Link>
          <Link
            to="/create?mode=event"
            className="min-h-[40px] px-3 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-[#20A574]" />
            Event
          </Link>
          <Link
            to="/create"
            className="min-h-[40px] px-3.5 py-2 rounded-xl zepp-btn-primary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
          >
            <PlusSquare className="w-4 h-4" />
            Create
          </Link>
        </div>
      </div>

      {/* Feed Organisation Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div
          role="tablist"
          aria-label="Feed organisation"
          className="inline-flex items-center gap-1 p-1.5 zepp-glass rounded-2xl"
        >
          {[
            { id: 'for-you', label: 'For You' },
            { id: 'following', label: 'Following' },
            { id: 'trending', label: 'Trending' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setActiveTab(tab.id as FeedTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? 'zepp-btn-primary text-white'
                    : 'text-[#71819C] dark:text-[#A6B6D0] hover:text-[#142443] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-[#71819C] dark:text-[#A6B6D0] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1769E8]" />
          Kenyan Demonstration Feed
        </span>
      </div>

      {/* Feed Stream */}
      {visiblePosts.length === 0 ? (
        <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
          <ZeppLogo variant="loading" size="md" className="mx-auto" />
          <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
            No posts in this view yet
          </h2>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] max-w-sm mx-auto">
            Follow Kenyan creators and businesses in Explore or switch back to For You to browse the full demonstration stream.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('for-you')}
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              View For You
            </button>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold"
            >
              Explore Accounts
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
