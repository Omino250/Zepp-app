import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Send,
  Share2,
  Store,
  Trash2,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { Post } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber, formatKes } from '../../utils/format';
import { ZeppMedia } from '../common/ZeppMedia';
import { Modal } from '../common/Modal';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    users,
    events,
    businesses,
    currentUser,
    toggleLikePost,
    toggleSavePost,
    sharePost,
    addCommentToPost,
    toggleFollowUser,
    reportPost,
    deleteOwnPost,
    toggleBlockUser,
  } = useZepp();

  const [carouselIdx, setCarouselIdx] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading information');

  const author = users.find((u) => u.id === post.authorId);
  if (!author) return null;

  const isOwn = author.id === currentUser.id;
  const linkedEvent = post.eventId ? events.find((e) => e.id === post.eventId) : undefined;
  const linkedBusiness = post.businessId
    ? businesses.find((b) => b.id === post.businessId)
    : undefined;

  const totalComments =
    post.comments.length +
    post.comments.reduce((acc, c) => acc + c.replies.length, 0);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToPost(post.id, commentText);
    setCommentText('');
  };

  const handleReplySubmit = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addCommentToPost(post.id, replyText, parentId);
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <article className="zepp-glass rounded-3xl p-5 sm:p-6 transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/profile/${author.id}`} className="shrink-0">
            <ZeppMedia
              src={author.avatarUrl}
              alt={author.name}
              className="w-11 h-11 rounded-2xl object-cover border border-white/80 dark:border-blue-300/20"
            />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/profile/${author.id}`}
                className="font-bold text-[15px] text-[#142443] dark:text-[#F0F5FF] hover:text-[#1769E8] dark:hover:text-[#60A5FA] transition-colors truncate"
              >
                {author.name}
              </Link>
              <span className="text-xs text-[#71819C] dark:text-[#A6B6D0] truncate">
                @{author.username}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5 flex-wrap">
              <span>{post.location}</span>
              <span aria-hidden="true">·</span>
              <span>{post.createdAt}</span>
              {author.accountType !== 'personal' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#1769E8] dark:text-[#60A5FA] font-medium">
                    {author.demoRoleLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 relative">
          {!isOwn && (
            <button
              type="button"
              onClick={() => toggleFollowUser(author.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
                author.isFollowing
                  ? 'zepp-btn-secondary'
                  : 'bg-[#DCEAFF]/80 dark:bg-[#1769E8]/25 text-[#1769E8] dark:text-[#93C5FD] hover:bg-[#DCEAFF]'
              }`}
            >
              {author.isFollowing ? (
                <>
                  <UserMinus className="w-3.5 h-3.5" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Follow
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Post options"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10 text-[#71819C] transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-48 zepp-glass rounded-2xl p-1.5 shadow-xl">
              {isOwn && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    deleteOwnPost(post.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#E55353] rounded-xl hover:bg-[#E55353]/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Demo Post
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setReportOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C2B45] dark:text-[#F0F5FF] rounded-xl hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10 transition-colors"
              >
                <Flag className="w-4 h-4 text-[#EBAA43]" />
                Report Content
              </button>
              {!isOwn && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    toggleBlockUser(author.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#71819C] dark:text-[#A6B6D0] rounded-xl hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10 transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                  Block @{author.username}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sponsored distinction line */}
      {post.isSponsored && (
        <p className="mt-3 text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA]">
          {post.sponsoredLabel || 'Sponsored · Demo Business Promotion'}
        </p>
      )}

      {/* Body text */}
      <p className="mt-3 text-[15px] leading-relaxed text-[#1C2B45] dark:text-[#E5EEFF] whitespace-pre-line">
        {post.content}
      </p>

      {/* Hashtags as clean unboxed inline typography */}
      {post.hashtags.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2.5 flex-wrap text-xs font-medium text-[#1769E8] dark:text-[#60A5FA]">
          {post.hashtags.map((tag) => (
            <Link
              key={tag}
              to={`/explore?q=${encodeURIComponent(tag)}`}
              className="hover:underline"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Media container */}
      {post.mediaUrls.length > 0 && (
        <div className="mt-4 relative rounded-2xl overflow-hidden border border-white/70 dark:border-blue-300/15 bg-[#EDF4FF] dark:bg-[#0D1930]">
          <ZeppMedia
            src={post.mediaUrls[carouselIdx] || post.mediaUrls[0]}
            alt={`Media shared by ${author.name}`}
            className="w-full max-h-[420px] object-cover"
          />

          {(post.kind === 'video' || post.kind === 'short') && (
            <Link
              to="/videos"
              className="absolute inset-0 flex items-center justify-center bg-[#142443]/25 hover:bg-[#142443]/35 transition-colors group"
              aria-label="Open in Zepp Videos"
            >
              <div className="w-14 h-14 rounded-full bg-white/90 text-[#1769E8] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </Link>
          )}

          {post.mediaUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setCarouselIdx((i) => (i - 1 + post.mediaUrls.length) % post.mediaUrls.length)
                }
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 dark:bg-[#142443]/85 text-[#142443] dark:text-white flex items-center justify-center shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCarouselIdx((i) => (i + 1) % post.mediaUrls.length)
                }
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 dark:bg-[#142443]/85 text-[#142443] dark:text-white flex items-center justify-center shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45">
                {post.mediaUrls.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCarouselIdx(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === carouselIdx ? 'bg-white' : 'bg-white/45'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Linked Event strip */}
      {linkedEvent && (
        <Link
          to={`/events/${linkedEvent.id}`}
          className="mt-4 flex items-center justify-between gap-4 p-3.5 rounded-2xl zepp-glass-subtle hover:border-[#1769E8]/40 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#DCEAFF] dark:bg-[#1769E8]/25 text-[#1769E8] dark:text-[#93C5FD] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                {linkedEvent.title}
              </p>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] truncate">
                {linkedEvent.dateStr} · {linkedEvent.city} · From{' '}
                <span className="font-mono-num font-semibold text-[#1769E8] dark:text-[#60A5FA]">
                  {formatKes(
                    Math.min(...linkedEvent.ticketCategories.map((t) => t.priceKes))
                  )}
                </span>
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] whitespace-nowrap shrink-0">
            View Event
          </span>
        </Link>
      )}

      {/* Linked Business strip */}
      {linkedBusiness && (
        <Link
          to={`/businesses/${linkedBusiness.id}`}
          className="mt-4 flex items-center justify-between gap-4 p-3.5 rounded-2xl zepp-glass-subtle hover:border-[#1769E8]/40 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#DCEAFF] dark:bg-[#1769E8]/25 text-[#1769E8] dark:text-[#93C5FD] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                {linkedBusiness.name}
              </p>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] truncate">
                {linkedBusiness.category} · {linkedBusiness.city} ·{' '}
                {linkedBusiness.products.length} listed offerings
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] whitespace-nowrap shrink-0">
            Visit Shop
          </span>
        </Link>
      )}

      {/* Action bar */}
      <div className="mt-4 pt-3 border-t border-[#DCEAFF]/80 dark:border-blue-400/15 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => toggleLikePost(post.id)}
            className={`min-h-[40px] px-3 rounded-xl flex items-center gap-2 text-xs font-semibold transition-colors ${
              post.likedByMe
                ? 'text-[#E55353] bg-[#E55353]/10'
                : 'text-[#71819C] dark:text-[#A6B6D0] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-current' : ''}`} />
            <span className="tabular-nums">{formatCompactNumber(post.likesCount)}</span>
          </button>

          <button
            type="button"
            onClick={() => setCommentsOpen((v) => !v)}
            className="min-h-[40px] px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#71819C] dark:text-[#A6B6D0] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="tabular-nums">{totalComments}</span>
          </button>

          <button
            type="button"
            onClick={() => sharePost(post.id)}
            className="min-h-[40px] px-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#71819C] dark:text-[#A6B6D0] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="tabular-nums">{formatCompactNumber(post.sharesCount)}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => toggleSavePost(post.id)}
          aria-label={post.savedByMe ? 'Remove from saved' : 'Save post'}
          className={`min-h-[40px] min-w-[40px] px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            post.savedByMe
              ? 'text-[#1769E8] dark:text-[#60A5FA] bg-[#DCEAFF]/75 dark:bg-[#1769E8]/20'
              : 'text-[#71819C] dark:text-[#A6B6D0] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.savedByMe ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">{post.savedByMe ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Expandable Comments */}
      {commentsOpen && (
        <div className="mt-4 pt-4 border-t border-[#DCEAFF]/60 dark:border-blue-400/10 space-y-3">
          {post.comments.length === 0 ? (
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
              No comments yet. Start the conversation below.
            </p>
          ) : (
            <div className="space-y-3">
              {post.comments.map((comment) => {
                const cUser = users.find((u) => u.id === comment.userId);
                return (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      {cUser && (
                        <ZeppMedia
                          src={cUser.avatarUrl}
                          alt={cUser.name}
                          className="w-7 h-7 rounded-xl object-cover shrink-0 mt-0.5"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#142443] dark:text-[#F0F5FF]">
                            {cUser?.name || 'Zepp Member'}
                          </span>
                          <span className="text-[#98A6BA]">{comment.createdAt}</span>
                        </div>
                        <p className="text-[13px] text-[#1C2B45] dark:text-[#DCEAFF] mt-0.5">
                          {comment.text}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingToId((id) => (id === comment.id ? null : comment.id))
                          }
                          className="text-[11px] font-semibold text-[#1769E8] dark:text-[#60A5FA] mt-1 hover:underline"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="pl-9 space-y-2">
                        {comment.replies.map((rep) => {
                          const rUser = users.find((u) => u.id === rep.userId);
                          return (
                            <div key={rep.id} className="flex items-start gap-2">
                              {rUser && (
                                <ZeppMedia
                                  src={rUser.avatarUrl}
                                  alt={rUser.name}
                                  className="w-6 h-6 rounded-lg object-cover shrink-0"
                                />
                              )}
                              <div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-semibold text-[#142443] dark:text-[#F0F5FF]">
                                    {rUser?.name}
                                  </span>
                                  <span className="text-[#98A6BA]">{rep.createdAt}</span>
                                </div>
                                <p className="text-xs text-[#1C2B45] dark:text-[#DCEAFF]">
                                  {rep.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {replyingToId === comment.id && (
                      <form
                        onSubmit={(e) => handleReplySubmit(e, comment.id)}
                        className="pl-9 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${cUser?.name || 'comment'}...`}
                          className="flex-1 zepp-neu-input rounded-xl px-3 py-1.5 text-xs text-[#1C2B45] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-xl zepp-btn-primary text-xs font-semibold"
                        >
                          Reply
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <ZeppMedia
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-xl object-cover shrink-0"
            />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 zepp-neu-input rounded-xl px-3.5 py-2 text-xs text-[#1C2B45] dark:text-white placeholder:text-[#98A6BA] focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              aria-label="Submit comment"
              className="min-h-[36px] px-3.5 rounded-xl zepp-btn-primary text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Post
            </button>
          </form>
        </div>
      )}

      {/* Report Modal */}
      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report Post"
        subtitle="Demonstration moderation & safety workflow"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
            Select why you are flagging this demonstration post by @{author.username}.
          </p>
          <div className="space-y-2">
            {[
              'Misleading information',
              'Spam or unwanted promotion',
              'Harassment or abusive language',
              'Inappropriate media',
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-3 p-3 rounded-2xl zepp-glass-subtle cursor-pointer"
              >
                <input
                  type="radio"
                  name={`report_${post.id}`}
                  checked={reportReason === reason}
                  onChange={() => setReportReason(reason)}
                  className="accent-[#1769E8]"
                />
                <span className="text-sm text-[#142443] dark:text-[#F0F5FF]">{reason}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                reportPost(post.id, reportReason);
                setReportOpen(false);
              }}
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              Submit Report
            </button>
          </div>
        </div>
      </Modal>
    </article>
  );
};
