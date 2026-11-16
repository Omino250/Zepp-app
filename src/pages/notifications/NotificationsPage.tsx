import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AtSign,
  Bell,
  Calendar,
  CheckCheck,
  Heart,
  MessageCircle,
  Store,
  Ticket,
  UserPlus,
} from 'lucide-react';
import { NotificationType } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { ZeppMedia } from '../../components/common/ZeppMedia';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    users,
    markNotificationRead,
    markAllNotificationsRead,
  } = useZepp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'events' | 'business'>('all');

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    if (filter === 'events')
      return notifications.filter((n) => n.type === 'event' || n.type === 'booking');
    if (filter === 'business') return notifications.filter((n) => n.type === 'business');
    return notifications;
  }, [notifications, filter]);

  const iconForType = (type: NotificationType) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="w-4 h-4 text-[#1769E8]" />;
      case 'like':
        return <Heart className="w-4 h-4 text-[#E55353]" />;
      case 'comment':
      case 'message':
        return <MessageCircle className="w-4 h-4 text-[#287BFA]" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-[#1769E8]" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-[#20A574]" />;
      case 'booking':
        return <Ticket className="w-4 h-4 text-[#EBAA43]" />;
      case 'business':
        return <Store className="w-4 h-4 text-[#1769E8]" />;
    }
  };

  return (
    <div className="space-y-5">
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
              Notifications
            </h1>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
              Activity across followers, posts, messages, event bookings, and business enquiries.
            </p>
          </div>
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-[#1769E8]" />
            Mark all as read
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'events', label: 'Events & Tickets' },
            { id: 'business', label: 'Business' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 ${
                filter === tab.id
                  ? 'zepp-btn-primary text-white'
                  : 'zepp-glass-subtle text-[#1C2B45] dark:text-[#DCEAFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="zepp-glass rounded-3xl p-10 text-center space-y-2">
          <Bell className="w-8 h-8 text-[#1769E8] mx-auto" />
          <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
            You are all caught up
          </p>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
            No notifications in this filter right now.
          </p>
        </div>
      ) : (
        <div className="zepp-glass rounded-3xl divide-y divide-[#DCEAFF]/70 dark:divide-blue-400/15 overflow-hidden">
          {filtered.map((notif) => {
            const actor = users.find((u) => u.id === notif.actorId);
            return (
              <button
                key={notif.id}
                type="button"
                onClick={() => {
                  markNotificationRead(notif.id);
                  navigate(notif.targetRoute);
                }}
                className={`w-full p-4 sm:p-5 flex items-start gap-3.5 text-left transition-colors ${
                  notif.read
                    ? 'hover:bg-[#DCEAFF]/35 dark:hover:bg-white/5'
                    : 'bg-[#EDF4FF]/80 dark:bg-[#1769E8]/15 hover:bg-[#DCEAFF]/60'
                }`}
              >
                <div className="relative shrink-0">
                  {actor ? (
                    <ZeppMedia
                      src={actor.avatarUrl}
                      alt={actor.name}
                      className="w-11 h-11 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-[#DCEAFF] flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[#1769E8]" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white dark:bg-[#142443] shadow flex items-center justify-center">
                    {iconForType(notif.type)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                      {notif.title}
                    </p>
                    <span className="text-[11px] text-[#98A6BA] shrink-0">
                      {notif.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5 leading-relaxed">
                    {notif.description}
                  </p>
                  {!notif.read && (
                    <span className="inline-block text-[11px] font-bold text-[#1769E8] dark:text-[#60A5FA] mt-1">
                      Unread
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
