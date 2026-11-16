import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Info,
  MessageCircle,
  Plus,
  Search,
  Send,
  Smile,
} from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { ZeppMedia } from '../../components/common/ZeppMedia';
import { Modal } from '../../components/common/Modal';

const QUICK_EMOJIS = ['👋', '🔥', '🙌', '☕', '🇰🇪', '🎉', '👏', '💙'];

export const MessagesPage: React.FC = () => {
  const {
    conversations,
    users,
    currentUser,
    sendChatMessage,
    markConversationRead,
  } = useZepp();

  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [draft, setDraft] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredConversations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return conversations.filter((c) => {
      const user = users.find((u) => u.id === c.participantId);
      if (!user) return false;
      if (!q) return true;
      return `${user.name} ${user.username}`.toLowerCase().includes(q);
    });
  }, [conversations, users, searchTerm]);

  const activeConv =
    conversations.find((c) => c.id === selectedConvId) || filteredConversations[0];
  const activeParticipant = activeConv
    ? users.find((u) => u.id === activeConv.participantId)
    : undefined;

  const handleSelectConv = (convId: string) => {
    setSelectedConvId(convId);
    markConversationRead(convId);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParticipant || !draft.trim()) return;
    sendChatMessage(activeParticipant.id, draft);
    setDraft('');
    setEmojiOpen(false);
  };

  const handleStartNewChat = (userId: string) => {
    const existing = conversations.find((c) => c.participantId === userId);
    if (existing) {
      setSelectedConvId(existing.id);
    } else {
      sendChatMessage(userId, 'Habari! Reaching out via Zepp Messages.');
    }
    setNewChatOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
            Messages
          </h1>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
            Local demonstration messaging — messages are stored locally in your browser session.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNewChatOpen(true)}
          className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Chat
        </button>
      </div>

      <div className="zepp-glass rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[310px_minmax(0,1fr)] min-h-[560px]">
        {/* Conversation List */}
        <div className="border-b md:border-b-0 md:border-r border-[#DCEAFF]/80 dark:border-blue-400/15 flex flex-col">
          <div className="p-3.5 border-b border-[#DCEAFF]/60 dark:border-blue-400/10">
            <div className="relative">
              <Search className="w-4 h-4 text-[#71819C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full zepp-neu-input rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#DCEAFF]/50 dark:divide-blue-400/10 max-h-[260px] md:max-h-[500px]">
            {filteredConversations.map((conv) => {
              const user = users.find((u) => u.id === conv.participantId);
              if (!user) return null;
              const lastMsg = conv.messages[conv.messages.length - 1];
              const active = activeConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => handleSelectConv(conv.id)}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                    active
                      ? 'bg-[#DCEAFF]/75 dark:bg-[#1769E8]/25'
                      : 'hover:bg-[#DCEAFF]/35 dark:hover:bg-white/5'
                  }`}
                >
                  <ZeppMedia
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-11 h-11 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                        {user.name}
                      </p>
                      <span className="text-[10px] text-[#98A6BA] shrink-0">
                        {conv.lastUpdated}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] truncate">
                        {lastMsg?.text || 'Start a conversation'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#1769E8] text-white text-[10px] font-bold flex items-center justify-center tabular-nums shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Chat Thread */}
        {activeConv && activeParticipant ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="px-5 py-3.5 border-b border-[#DCEAFF]/70 dark:border-blue-400/15 flex items-center justify-between gap-3">
              <Link
                to={`/profile/${activeParticipant.id}`}
                className="flex items-center gap-3 min-w-0"
              >
                <ZeppMedia
                  src={activeParticipant.avatarUrl}
                  alt={activeParticipant.name}
                  className="w-10 h-10 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                    {activeParticipant.name}
                  </p>
                  <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] truncate">
                    @{activeParticipant.username} · {activeParticipant.location}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setDetailsOpen((v) => !v)}
                aria-label="Conversation details"
                className="min-h-[40px] min-w-[40px] rounded-xl zepp-btn-secondary flex items-center justify-center"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {detailsOpen && (
              <div className="px-5 py-3 bg-[#EDF4FF]/80 dark:bg-[#101E3A] border-b border-[#DCEAFF] dark:border-blue-400/15 text-xs flex items-center justify-between gap-3">
                <span className="text-[#1C2B45] dark:text-[#DCEAFF]">
                  {activeParticipant.bio}
                </span>
                <Link
                  to={`/profile/${activeParticipant.id}`}
                  className="font-semibold text-[#1769E8] dark:text-[#60A5FA] whitespace-nowrap shrink-0"
                >
                  View Profile
                </Link>
              </div>
            )}

            {/* Message History */}
            <div className="flex-1 p-5 space-y-3 overflow-y-auto max-h-[380px]">
              {activeConv.messages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isMine
                          ? 'zepp-btn-primary text-white rounded-br-md'
                          : 'zepp-glass-subtle text-[#142443] dark:text-[#F0F5FF] rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#98A6BA] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div className="p-3.5 border-t border-[#DCEAFF]/70 dark:border-blue-400/15 space-y-2">
              {emojiOpen && (
                <div className="flex items-center gap-1.5 px-2">
                  {QUICK_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setDraft((d) => `${d}${em}`)}
                      className="w-8 h-8 rounded-lg hover:bg-[#DCEAFF]/70 dark:hover:bg-white/10 text-base"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEmojiOpen((v) => !v)}
                  aria-label="Insert emoji"
                  className="min-h-[40px] min-w-[40px] rounded-xl zepp-btn-secondary flex items-center justify-center shrink-0"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${activeParticipant.name.split(' ')[0]}...`}
                  className="flex-1 zepp-neu-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="min-h-[40px] px-4 rounded-xl zepp-btn-primary text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-2">
            <MessageCircle className="w-8 h-8 text-[#1769E8]" />
            <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Select a conversation
            </p>
          </div>
        )}
      </div>

      {/* Start New Chat Modal */}
      <Modal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        title="Start Demonstration Chat"
        subtitle="Select a Kenyan member, creator, or business"
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {users
            .filter((u) => u.id !== currentUser.id)
            .slice(0, 10)
            .map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleStartNewChat(u.id)}
                className="w-full p-2.5 rounded-2xl zepp-glass-subtle hover:border-[#1769E8]/40 flex items-center gap-3 text-left"
              >
                <ZeppMedia
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                    {u.name}
                  </p>
                  <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] truncate">
                    @{u.username} · {u.location}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </Modal>
    </div>
  );
};
