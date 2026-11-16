import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Plus, X } from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { ZeppMedia } from '../common/ZeppMedia';

export const StoriesBar: React.FC = () => {
  const { stories, users, currentUser, markStoryViewed } = useZepp();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const activeStory = activeIndex !== null ? stories[activeIndex] : null;
  const activeAuthor = activeStory
    ? users.find((u) => u.id === activeStory.userId)
    : undefined;

  useEffect(() => {
    if (activeIndex === null) return;
    setProgress(0);
    const current = stories[activeIndex];
    if (current && !current.viewed) {
      markStoryViewed(current.id);
    }

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeIndex < stories.length - 1) {
            setActiveIndex(activeIndex + 1);
          } else {
            setActiveIndex(null);
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [activeIndex, stories.length]);

  const openStory = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  return (
    <>
      <section aria-label="Stories" className="zepp-glass rounded-3xl p-4">
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar pb-1">
          {/* Add Story button */}
          <Link
            to="/create?mode=story"
            className="flex flex-col items-center gap-1.5 shrink-0 w-[72px] group"
          >
            <div className="relative w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-br from-[#DCEAFF] to-[#EDF4FF] dark:from-[#1A2D54] dark:to-[#101E3A] border border-dashed border-[#287BFA]/60 flex items-center justify-center">
              <ZeppMedia
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full rounded-[14px] object-cover opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg zepp-btn-primary flex items-center justify-center shadow">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#142443] dark:text-[#DCEAFF] truncate w-full text-center">
              Add Story
            </span>
          </Link>

          {/* Story Items */}
          {stories.map((story, idx) => {
            const user = users.find((u) => u.id === story.userId);
            if (!user) return null;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => openStory(idx)}
                className="flex flex-col items-center gap-1.5 shrink-0 w-[72px] group text-left"
              >
                <div
                  className={`w-16 h-16 rounded-2xl p-[2.5px] transition-transform group-hover:scale-[1.03] ${
                    story.viewed
                      ? 'bg-[#98A6BA]/45'
                      : 'bg-gradient-to-tr from-[#1769E8] via-[#287BFA] to-[#60A5FA]'
                  }`}
                >
                  <div className="w-full h-full rounded-[13px] overflow-hidden bg-white dark:bg-[#0D1930] p-[2px]">
                    <ZeppMedia
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full rounded-[11px] object-cover"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#1C2B45] dark:text-[#DCEAFF] truncate w-full text-center">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Story Viewer Overlay */}
      {activeStory && activeAuthor && (
        <div
          className="fixed inset-0 z-50 bg-[#081020]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Story viewer"
        >
          <div className="relative w-full max-w-md h-[82vh] max-h-[760px] rounded-3xl overflow-hidden bg-[#142443] shadow-2xl border border-white/20 flex flex-col">
            {/* Progress bars */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-1.5">
              {stories.map((s, i) => (
                <div
                  key={s.id}
                  className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width:
                        i < (activeIndex ?? 0)
                          ? '100%'
                          : i === activeIndex
                            ? `${progress}%`
                            : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ZeppMedia
                  src={activeAuthor.avatarUrl}
                  alt={activeAuthor.name}
                  className="w-9 h-9 rounded-xl object-cover border border-white/60"
                />
                <div className="min-w-0 text-white">
                  <p className="text-sm font-bold truncate">{activeAuthor.name}</p>
                  <p className="text-[11px] text-white/80 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {activeStory.location} · {activeStory.createdAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Close story"
                className="min-h-[40px] min-w-[40px] rounded-xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Visual */}
            <ZeppMedia
              src={activeStory.mediaUrl}
              alt={activeStory.caption}
              className="w-full h-full object-cover"
            />

            {/* Measured contrast scrim */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white">
              <p className="text-sm font-medium leading-relaxed">{activeStory.caption}</p>
            </div>

            {/* Prev / Next navigation */}
            <button
              type="button"
              onClick={() =>
                setActiveIndex((idx) => (idx !== null && idx > 0 ? idx - 1 : idx))
              }
              disabled={activeIndex === 0}
              aria-label="Previous story"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center disabled:opacity-30 transition-colors z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((idx) =>
                  idx !== null && idx < stories.length - 1 ? idx + 1 : null
                )
              }
              aria-label="Next story"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
