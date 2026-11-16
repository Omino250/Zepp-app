import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Edit3,
  MapPin,
  MessageCircle,
  Sparkles,
  Store,
  UserPlus,
} from 'lucide-react';
import { AccountType } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber } from '../../utils/format';
import { ZeppMedia } from '../../components/common/ZeppMedia';
import { PostCard } from '../../components/cards/PostCard';
import { Modal } from '../../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const {
    users,
    posts,
    businesses,
    currentUser,
    toggleFollowUser,
    updateCurrentUserProfile,
    setAccountTypeForCurrentUser,
    sendChatMessage,
  } = useZepp();
  const navigate = useNavigate();

  const profileUser = users.find((u) => u.id === userId) || currentUser;
  const isOwn = profileUser.id === currentUser.id;

  const [tab, setTab] = useState<'posts' | 'media' | 'saved' | 'pro'>('posts');
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(profileUser.name);
  const [editBio, setEditBio] = useState(profileUser.bio);
  const [editLocation, setEditLocation] = useState(profileUser.location);

  const userPosts = posts.filter((p) => p.authorId === profileUser.id);
  const mediaPosts = userPosts.filter((p) => p.mediaUrls.length > 0);
  const savedPosts = posts.filter((p) => p.savedByMe);
  const linkedBiz = profileUser.businessId
    ? businesses.find((b) => b.id === profileUser.businessId)
    : undefined;

  const handleOpenEdit = () => {
    setEditName(currentUser.name);
    setEditBio(currentUser.bio);
    setEditLocation(currentUser.location);
    setEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name: editName.trim() || currentUser.name,
      bio: editBio.trim(),
      location: editLocation.trim() || currentUser.location,
    });
    setEditOpen(false);
  };

  const handleMessageUser = () => {
    sendChatMessage(profileUser.id, `Hi ${profileUser.name.split(' ')[0]}!`);
    navigate('/messages');
  };

  return (
    <div className="space-y-6">
      {/* Cover & Identity */}
      <section className="zepp-glass rounded-3xl overflow-hidden">
        <ZeppMedia
          src={profileUser.coverUrl}
          alt={`${profileUser.name} cover`}
          className="w-full h-44 sm:h-52 object-cover"
        />

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="flex items-end gap-4">
              <ZeppMedia
                src={profileUser.avatarUrl}
                alt={profileUser.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-[#142443] shadow-lg bg-white shrink-0"
              />
              <div className="pt-10 sm:pt-0">
                <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
                  {profileUser.name}
                </h1>
                <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                  @{profileUser.username} · {profileUser.demoRoleLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {isOwn ? (
                <>
                  <button
                    type="button"
                    onClick={handleOpenEdit}
                    className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-bold flex items-center gap-1.5"
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Studio Hub
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => toggleFollowUser(profileUser.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      profileUser.isFollowing ? 'zepp-btn-secondary' : 'zepp-btn-primary'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {profileUser.isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button
                    type="button"
                    onClick={handleMessageUser}
                    className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#1769E8]" /> Message
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-[#1C2B45] dark:text-[#E5EEFF] leading-relaxed max-w-2xl">
            {profileUser.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#71819C] dark:text-[#A6B6D0]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1769E8]" />
              {profileUser.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1769E8]" />
              Joined {profileUser.joinedDate}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 pt-2 border-t border-[#DCEAFF]/80 dark:border-blue-400/15 text-sm">
            <div>
              <span className="font-mono-num font-extrabold text-[#142443] dark:text-white">
                {formatCompactNumber(profileUser.followersCount)}
              </span>{' '}
              <span className="text-xs text-[#71819C] dark:text-[#A6B6D0]">Followers</span>
            </div>
            <div>
              <span className="font-mono-num font-extrabold text-[#142443] dark:text-white">
                {formatCompactNumber(profileUser.followingCount)}
              </span>{' '}
              <span className="text-xs text-[#71819C] dark:text-[#A6B6D0]">Following</span>
            </div>
            <div>
              <span className="font-mono-num font-extrabold text-[#142443] dark:text-white">
                {userPosts.length}
              </span>{' '}
              <span className="text-xs text-[#71819C] dark:text-[#A6B6D0]">Posts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 p-1.5 zepp-glass rounded-2xl overflow-x-auto max-w-full">
        {[
          { id: 'posts', label: 'Posts' },
          { id: 'media', label: `Media (${mediaPosts.length})` },
          ...(isOwn ? [{ id: 'saved', label: `Saved (${savedPosts.length})` }] : []),
          { id: 'pro', label: 'Account Mode' },
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

      {/* Tab Content */}
      {tab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="zepp-glass rounded-3xl p-10 text-center space-y-3">
              <p className="text-sm font-bold">No posts shared yet</p>
              {isOwn && (
                <Link
                  to="/create"
                  className="inline-block px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
                >
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            userPosts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}

      {tab === 'media' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {mediaPosts.length === 0 ? (
            <div className="col-span-full zepp-glass rounded-3xl p-10 text-center text-sm text-[#71819C]">
              No photo or video media yet.
            </div>
          ) : (
            mediaPosts.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl overflow-hidden aspect-square border border-white/70 dark:border-blue-400/15"
              >
                <ZeppMedia
                  src={p.mediaUrls[0]}
                  alt={p.content}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'saved' && isOwn && (
        <div className="space-y-4">
          {savedPosts.length === 0 ? (
            <div className="zepp-glass rounded-3xl p-10 text-center text-sm text-[#71819C]">
              Bookmark posts from Home or Explore to find them here.
            </div>
          ) : (
            savedPosts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}

      {tab === 'pro' && (
        <div className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1769E8]" />
                Personal & Professional Capabilities
              </h2>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
                Current mode: <strong className="capitalize">{profileUser.accountType}</strong>
              </p>
            </div>
            {linkedBiz && (
              <Link
                to={`/businesses/${linkedBiz.id}`}
                className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" /> Open Storefront
              </Link>
            )}
          </div>

          {isOwn && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {(
                [
                  {
                    type: 'personal',
                    title: 'Personal Account',
                    desc: 'Standard social feed, events booking, and messaging.',
                  },
                  {
                    type: 'creator',
                    title: 'Creator Account',
                    desc: 'Unlock Creator Analytics and audience insights.',
                  },
                  {
                    type: 'business',
                    title: 'Business Account',
                    desc: 'Manage KES product listings, promotions, and enquiries.',
                  },
                  {
                    type: 'organiser',
                    title: 'Event Organiser',
                    desc: 'Publish events and monitor ticket category sales.',
                  },
                ] as { type: AccountType; title: string; desc: string }[]
              ).map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setAccountTypeForCurrentUser(item.type)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    currentUser.accountType === item.type
                      ? 'bg-[#EDF4FF] dark:bg-[#1769E8]/25 border-[#1769E8]'
                      : 'zepp-glass-subtle hover:border-[#287BFA]/40'
                  }`}
                >
                  <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-1">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Demonstration Profile"
        subtitle="Changes persist locally in your browser"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Display Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Location</label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Bio</label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full zepp-neu-input rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
