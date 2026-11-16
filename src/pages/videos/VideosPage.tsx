import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Heart,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  Send,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber } from '../../utils/format';
import { ZeppMedia } from '../../components/common/ZeppMedia';

export const VideosPage: React.FC = () => {
  const {
    videos,
    users,
    toggleLikeVideo,
    toggleSaveVideo,
    addCommentToVideo,
    incrementShareVideo,
    toggleFollowUser,
  } = useZepp();

  const [searchParams] = useSearchParams();
  const initialVideoId = searchParams.get('v');
  const initialIdx = initialVideoId
    ? Math.max(0, videos.findIndex((v) => v.id === initialVideoId))
    : 0;

  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Never autoplay audio unexpectedly
  const [progressSec, setProgressSec] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const activeVideo = videos[activeIdx] || videos[0];
  const creator = users.find((u) => u.id === activeVideo?.creatorId);

  useEffect(() => {
    setProgressSec(0);
  }, [activeIdx]);

  useEffect(() => {
    if (!isPlaying || !activeVideo) return;
    const timer = window.setInterval(() => {
      setProgressSec((prev) => (prev >= activeVideo.durationSec ? 0 : prev + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, activeVideo]);

  if (!activeVideo) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addCommentToVideo(activeVideo.id, commentInput);
    setCommentInput('');
  };

  const progressPct = Math.min(100, (progressSec / activeVideo.durationSec) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
            Zepp Short Videos
          </h1>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
            Kenyan creators, recipes, travel, and live sound · Muted by default
          </p>
        </div>
        <span className="font-mono-num text-xs font-semibold text-[#71819C] dark:text-[#A6B6D0]">
          {activeIdx + 1} / {videos.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vertical Video Stage */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[400px] aspect-[9/16] rounded-[32px] overflow-hidden shadow-2xl border border-white/75 dark:border-blue-400/20 bg-[#142443]">
            {/* Poster & subtle motion zoom when playing */}
            <ZeppMedia
              src={activeVideo.posterUrl}
              alt={activeVideo.title}
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Top Playback & Audio Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
              <div className="px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md text-white text-[11px] font-semibold">
                {activeVideo.category}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={isMuted ? 'Unmute audio preview' : 'Mute audio'}
                  className="min-h-[40px] min-w-[40px] rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/65 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="min-h-[40px] min-w-[40px] rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/65 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Center Tap Play/Pause Overlay */}
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause playback' : 'Resume playback'}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              {!isPlaying && (
                <span className="w-16 h-16 rounded-full bg-white/85 text-[#1769E8] flex items-center justify-center shadow-xl">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </span>
              )}
            </button>

            {/* Right Action Rail inside Video Frame */}
            <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => toggleLikeVideo(activeVideo.id)}
                className="flex flex-col items-center gap-1 text-white"
              >
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                    activeVideo.likedByMe ? 'bg-[#E55353]' : 'bg-black/45 hover:bg-black/65'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${activeVideo.likedByMe ? 'fill-current' : ''}`}
                  />
                </span>
                <span className="text-[11px] font-bold tabular-nums">
                  {formatCompactNumber(activeVideo.likesCount)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCommentsOpen((v) => !v)}
                className="flex flex-col items-center gap-1 text-white"
              >
                <span className="w-11 h-11 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold tabular-nums">
                  {activeVideo.comments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleSaveVideo(activeVideo.id)}
                className="flex flex-col items-center gap-1 text-white"
              >
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                    activeVideo.savedByMe ? 'bg-[#1769E8]' : 'bg-black/45 hover:bg-black/65'
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${activeVideo.savedByMe ? 'fill-current' : ''}`}
                  />
                </span>
                <span className="text-[11px] font-bold">Save</span>
              </button>

              <button
                type="button"
                onClick={() => incrementShareVideo(activeVideo.id)}
                className="flex flex-col items-center gap-1 text-white"
              >
                <span className="w-11 h-11 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-bold tabular-nums">
                  {formatCompactNumber(activeVideo.sharesCount)}
                </span>
              </button>
            </div>

            {/* Bottom Scrim Info */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 pt-14 bg-gradient-to-t from-black/90 via-black/55 to-transparent text-white space-y-2.5">
              {creator && (
                <div className="flex items-center gap-2.5">
                  <Link to={`/profile/${creator.id}`} className="flex items-center gap-2 min-w-0">
                    <ZeppMedia
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="w-9 h-9 rounded-xl object-cover border border-white/60"
                    />
                    <span className="text-sm font-bold truncate">{creator.name}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFollowUser(creator.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 ${
                      creator.isFollowing
                        ? 'bg-white/20 text-white'
                        : 'bg-[#287BFA] text-white'
                    }`}
                  >
                    {creator.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              )}

              <div>
                <h2 className="text-sm font-bold leading-snug">{activeVideo.title}</h2>
                <p className="text-xs text-white/85 mt-0.5 pr-12">{activeVideo.caption}</p>
                <p className="text-[11px] text-white/75 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {activeVideo.location} ·{' '}
                  {formatCompactNumber(activeVideo.viewsCount)} views · 0:
                  {String(progressSec).padStart(2, '0')} / 0:{activeVideo.durationSec}
                </p>
              </div>

              {/* Scrubber bar */}
              <div className="h-1 w-full rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-full bg-[#287BFA] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Video Queue + Comments Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Next / Previous Video Controls */}
          <div className="zepp-glass rounded-3xl p-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
              className="flex-1 py-2.5 px-4 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-45"
            >
              <ChevronUp className="w-4 h-4" /> Previous Video
            </button>
            <button
              type="button"
              disabled={activeIdx === videos.length - 1}
              onClick={() => setActiveIdx((i) => Math.min(videos.length - 1, i + 1))}
              className="flex-1 py-2.5 px-4 rounded-xl zepp-btn-primary text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-45"
            >
              Next Video <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Comments Drawer / Box */}
          <div className="zepp-glass rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                Comments ({activeVideo.comments.length})
              </h3>
              {commentsOpen && (
                <button
                  type="button"
                  onClick={() => setCommentsOpen(false)}
                  className="text-xs font-semibold text-[#71819C]"
                >
                  Collapse
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto">
              {activeVideo.comments.length === 0 ? (
                <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                  Be the first to comment on this video.
                </p>
              ) : (
                activeVideo.comments.map((c) => {
                  const u = users.find((usr) => usr.id === c.userId);
                  return (
                    <div key={c.id} className="flex items-start gap-2.5">
                      {u && (
                        <ZeppMedia
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-7 h-7 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-xs font-bold text-[#142443] dark:text-[#F0F5FF]">
                          {u?.name || 'Zepp Member'}{' '}
                          <span className="font-normal text-[#98A6BA]">{c.createdAt}</span>
                        </p>
                        <p className="text-xs text-[#1C2B45] dark:text-[#DCEAFF] mt-0.5">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 zepp-neu-input rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-3.5 py-2 rounded-xl zepp-btn-primary text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Post
              </button>
            </form>
          </div>

          {/* Up Next Playlist */}
          <div className="zepp-glass rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Up Next
            </h3>
            <div className="space-y-2">
              {videos.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full flex items-center gap-3 p-2 rounded-2xl text-left transition-colors ${
                    idx === activeIdx
                      ? 'bg-[#DCEAFF]/80 dark:bg-[#1769E8]/25'
                      : 'hover:bg-[#DCEAFF]/40 dark:hover:bg-white/5'
                  }`}
                >
                  <ZeppMedia
                    src={v.posterUrl}
                    alt={v.title}
                    className="w-12 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#142443] dark:text-[#F0F5FF] line-clamp-1">
                      {v.title}
                    </p>
                    <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] truncate">
                      {v.location} · 0:{v.durationSec}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
