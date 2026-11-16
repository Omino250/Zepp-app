import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccountType,
  AppSettings,
  AuthSession,
  BusinessEnquiry,
  BusinessProfile,
  Conversation,
  NotificationItem,
  Post,
  PostComment,
  Product,
  ShortVideo,
  Story,
  ThemeMode,
  TicketBooking,
  UserProfile,
  ZeppEvent,
} from '../types';
import { DEMO_USERS } from '../data/users';
import { DEMO_BUSINESSES } from '../data/businesses';
import { DEMO_EVENTS } from '../data/events';
import { DEMO_POSTS } from '../data/posts';
import { DEMO_VIDEOS } from '../data/videos';
import { DEMO_STORIES } from '../data/stories';
import { DEMO_CONVERSATIONS } from '../data/messages';
import { DEMO_NOTIFICATIONS } from '../data/notifications';
import {
  loadPersistedState,
  savePersistedState,
  clearPersistedState,
} from '../services/zeppService';
import { generateDemoRef } from '../utils/format';
import { makeAvatarSvg, makeEditorialArt } from '../utils/media';

interface PersistedState {
  auth: AuthSession;
  users: UserProfile[];
  businesses: BusinessProfile[];
  events: ZeppEvent[];
  posts: Post[];
  videos: ShortVideo[];
  stories: Story[];
  conversations: Conversation[];
  notifications: NotificationItem[];
  bookings: TicketBooking[];
  enquiries: BusinessEnquiry[];
  recentSearches: string[];
  reportedPostIds: string[];
  settings: AppSettings;
}

const DEFAULT_BOOKINGS: TicketBooking[] = [
  {
    id: 'bk_sample_1',
    reference: 'ZEPP-KEN942',
    eventId: 'evt_1',
    categoryId: 'tc_1_eb',
    categoryName: 'Early Bird Beach Pass',
    quantity: 1,
    unitPriceKes: 2000,
    serviceFeeKes: 120,
    totalKes: 2120,
    attendeeName: 'Wanjiku Kamau',
    attendeeEmail: 'wanjiku.demo@zepp.ke',
    attendeePhone: '+254 712 340 101',
    paymentMethod: 'M-Pesa Demo',
    bookedAt: 'Sample Booking',
  },
];

const DEFAULT_ENQUIRIES: BusinessEnquiry[] = [
  {
    id: 'enq_1',
    businessId: 'biz_1',
    productId: 'prod_1',
    senderName: 'Njeri Gitau',
    message: 'Do you offer 1kg bags for weekly office coffee deliveries in Westlands?',
    createdAt: '2h ago',
    status: 'New',
  },
  {
    id: 'enq_2',
    businessId: 'biz_2',
    productId: 'prod_3',
    senderName: 'Amina Hassan',
    message: 'Is the Indigo Coastal Linen Set available in Medium for Mombasa pickup?',
    createdAt: '5h ago',
    status: 'Replied',
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'English (Kenya)',
  privateAccount: false,
  showActivityStatus: true,
  allowMessageRequests: true,
  notifyLikesComments: true,
  notifyEvents: true,
  notifyBusinessOffers: true,
  blockedUserIds: [],
};

const INITIAL_STATE: PersistedState = {
  auth: {
    isAuthenticated: false,
    currentUserId: 'u_personal_1',
    rememberMe: true,
    needsOnboarding: false,
    authModeLabel: 'Simulated Prototype Session',
  },
  users: DEMO_USERS,
  businesses: DEMO_BUSINESSES,
  events: DEMO_EVENTS,
  posts: DEMO_POSTS,
  videos: DEMO_VIDEOS,
  stories: DEMO_STORIES,
  conversations: DEMO_CONVERSATIONS,
  notifications: DEMO_NOTIFICATIONS,
  bookings: DEFAULT_BOOKINGS,
  enquiries: DEFAULT_ENQUIRIES,
  recentSearches: ['Nairobi Tech', 'Mombasa Coastal Waves', 'Kilimani Roast', '#TembeaKenya'],
  reportedPostIds: [],
  settings: DEFAULT_SETTINGS,
};

interface ToastMessage {
  id: string;
  text: string;
  tone: 'info' | 'success' | 'warning';
}

interface ZeppContextValue extends PersistedState {
  currentUser: UserProfile;
  toasts: ToastMessage[];
  pushToast: (text: string, tone?: 'info' | 'success' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Auth & Accounts
  loginDemo: (identifier: string, rememberMe: boolean) => void;
  loginWithGoogleDemo: () => void;
  registerDemoUser: (payload: {
    name: string;
    username: string;
    email: string;
    phone: string;
    country: string;
  }) => void;
  completeOnboarding: (accountType: AccountType) => void;
  switchActiveAccount: (userId: string) => void;
  logoutDemo: () => void;
  resetDemoWorkspace: () => void;

  // Social Interactions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  sharePost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string, parentCommentId?: string) => void;
  toggleFollowUser: (userId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  deleteOwnPost: (postId: string) => void;

  // Content Creation & Stories
  createDemoPost: (payload: {
    kind: Post['kind'];
    content: string;
    mediaUrls: string[];
    hashtags: string[];
    location: string;
    audience: Post['audience'];
    eventId?: string;
    businessId?: string;
    isSponsored?: boolean;
  }) => void;
  createDemoStory: (payload: { mediaUrl: string; caption: string; location: string }) => void;
  markStoryViewed: (storyId: string) => void;

  // Videos
  toggleLikeVideo: (videoId: string) => void;
  toggleSaveVideo: (videoId: string) => void;
  addCommentToVideo: (videoId: string, text: string) => void;
  incrementShareVideo: (videoId: string) => void;

  // Events & Ticketing
  toggleSaveEvent: (eventId: string) => void;
  createDemoBooking: (payload: {
    eventId: string;
    categoryId: string;
    quantity: number;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
    paymentMethod: 'M-Pesa Demo' | 'Card Demo';
  }) => TicketBooking;
  createDemoEvent: (payload: {
    title: string;
    category: ZeppEvent['category'];
    dateStr: string;
    timeStr: string;
    venue: string;
    city: string;
    description: string;
    ticketName: string;
    priceKes: number;
    capacity: number;
  }) => ZeppEvent;

  // Business
  toggleFollowBusiness: (businessId: string) => void;
  sendBusinessEnquiry: (payload: {
    businessId: string;
    productId?: string;
    message: string;
  }) => void;
  addBusinessProduct: (payload: {
    businessId: string;
    name: string;
    priceKes: number;
    category: string;
    description: string;
  }) => void;

  // Messaging & Notifications
  sendChatMessage: (participantId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Profile, Search & Settings
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  setAccountTypeForCurrentUser: (accountType: AccountType) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleBlockUser: (userId: string) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

const ZeppContext = createContext<ZeppContextValue | null>(null);

export const ZeppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(() => loadPersistedState(INITIAL_STATE));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.theme]);

  const currentUser =
    state.users.find((u) => u.id === state.auth.currentUserId) || state.users[0];

  const pushToast = (text: string, tone: 'info' | 'success' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginDemo = (identifier: string, rememberMe: boolean) => {
    const cleaned = identifier.trim().toLowerCase();
    const matched = state.users.find(
      (u) =>
        u.username.toLowerCase() === cleaned ||
        (u.email && u.email.toLowerCase() === cleaned) ||
        u.name.toLowerCase() === cleaned
    );
    const targetId = matched ? matched.id : 'u_personal_1';
    setState((prev) => ({
      ...prev,
      auth: {
        isAuthenticated: true,
        currentUserId: targetId,
        rememberMe,
        needsOnboarding: false,
        authModeLabel: 'Simulated Prototype Sign-In',
      },
    }));
    pushToast(
      `Signed in to Zepp demo as ${matched ? matched.name : 'Wanjiku Kamau'}.`,
      'success'
    );
  };

  const loginWithGoogleDemo = () => {
    setState((prev) => ({
      ...prev,
      auth: {
        isAuthenticated: true,
        currentUserId: 'u_personal_1',
        rememberMe: true,
        needsOnboarding: false,
        authModeLabel: 'Simulated Google Sign-In',
      },
    }));
    pushToast('Google sign-in demonstration active as Wanjiku Kamau.', 'success');
  };

  const registerDemoUser = (payload: {
    name: string;
    username: string;
    email: string;
    phone: string;
    country: string;
  }) => {
    const newId = `u_demo_${Date.now()}`;
    const initials = payload.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
    const newUser: UserProfile = {
      id: newId,
      name: payload.name.trim(),
      username: payload.username.trim().replace(/^@/, '').toLowerCase(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      accountType: 'personal',
      avatarUrl: makeAvatarSvg(initials || 'ZP', '#287BFA', '#1557D8', '#8D5524'),
      coverUrl: makeEditorialArt(
        payload.name.trim(),
        `Zepp Member · ${payload.country}`,
        '#287BFA',
        '#142443',
        '#DCEAFF',
        'waves'
      ),
      bio: `New on Zepp from ${payload.country}. Exploring creators, events, and local businesses.`,
      location: payload.country === 'Kenya' ? 'Nairobi, Kenya' : payload.country,
      country: payload.country,
      followersCount: 12,
      followingCount: 4,
      postsCount: 0,
      isFollowing: false,
      demoRoleLabel: 'Demo Account',
      joinedDate: 'November 2026',
    };

    setState((prev) => ({
      ...prev,
      users: [newUser, ...prev.users],
      auth: {
        isAuthenticated: true,
        currentUserId: newId,
        rememberMe: true,
        needsOnboarding: true,
        authModeLabel: 'Simulated Registration',
      },
    }));
  };

  const completeOnboarding = (accountType: AccountType) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === prev.auth.currentUserId
          ? {
              ...u,
              accountType,
              demoRoleLabel:
                accountType === 'personal'
                  ? 'Demo Personal Account'
                  : accountType === 'creator'
                    ? 'Demo Creator'
                    : accountType === 'business'
                      ? 'Demo Business'
                      : 'Demo Organiser',
            }
          : u
      ),
      auth: { ...prev.auth, needsOnboarding: false },
    }));
    pushToast('Account setup complete. Welcome to Zepp!', 'success');
  };

  const switchActiveAccount = (userId: string) => {
    const target = state.users.find((u) => u.id === userId);
    if (!target) return;
    setState((prev) => ({
      ...prev,
      auth: { ...prev.auth, currentUserId: userId, isAuthenticated: true, needsOnboarding: false },
    }));
    pushToast(`Switched demo view to ${target.name} (${target.accountType}).`, 'info');
  };

  const logoutDemo = () => {
    setState((prev) => ({
      ...prev,
      auth: { ...prev.auth, isAuthenticated: false, needsOnboarding: false },
    }));
    pushToast('Signed out of Zepp demonstration session.', 'info');
  };

  const resetDemoWorkspace = () => {
    clearPersistedState();
    setState(INITIAL_STATE);
    pushToast('Demonstration dataset restored to defaults.', 'info');
  };

  const toggleLikePost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likesCount: p.likedByMe ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
            }
          : p
      ),
    }));
  };

  const toggleSavePost = (postId: string) => {
    setState((prev) => {
      const target = prev.posts.find((p) => p.id === postId);
      const nextSaved = target ? !target.savedByMe : true;
      pushToast(nextSaved ? 'Saved to your collection.' : 'Removed from saved.', 'info');
      return {
        ...prev,
        posts: prev.posts.map((p) => (p.id === postId ? { ...p, savedByMe: !p.savedByMe } : p)),
      };
    });
  };

  const sharePost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId ? { ...p, sharesCount: p.sharesCount + 1 } : p
      ),
    }));
    pushToast('Post share link copied (demo action).', 'success');
  };

  const addCommentToPost = (postId: string, text: string, parentCommentId?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id !== postId) return p;
        if (parentCommentId) {
          return {
            ...p,
            comments: p.comments.map((c) =>
              c.id === parentCommentId
                ? {
                    ...c,
                    replies: [
                      ...c.replies,
                      {
                        id: `rep_${Date.now()}`,
                        userId: prev.auth.currentUserId,
                        text: trimmed,
                        createdAt: 'Just now',
                        likesCount: 0,
                        likedByMe: false,
                      },
                    ],
                  }
                : c
            ),
          };
        }
        const newComment: PostComment = {
          id: `com_${Date.now()}`,
          userId: prev.auth.currentUserId,
          text: trimmed,
          createdAt: 'Just now',
          likesCount: 0,
          likedByMe: false,
          replies: [],
        };
        return { ...p, comments: [...p.comments, newComment] };
      }),
    }));
  };

  const toggleFollowUser = (userId: string) => {
    if (userId === currentUser.id) return;
    setState((prev) => {
      const target = prev.users.find((u) => u.id === userId);
      const nextFollow = target ? !target.isFollowing : true;
      return {
        ...prev,
        users: prev.users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              isFollowing: nextFollow,
              followersCount: nextFollow ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
            };
          }
          if (u.id === prev.auth.currentUserId) {
            return {
              ...u,
              followingCount: nextFollow ? u.followingCount + 1 : Math.max(0, u.followingCount - 1),
            };
          }
          return u;
        }),
      };
    });
  };

  const reportPost = (postId: string, reason: string) => {
    setState((prev) => ({
      ...prev,
      reportedPostIds: prev.reportedPostIds.includes(postId)
        ? prev.reportedPostIds
        : [...prev.reportedPostIds, postId],
    }));
    pushToast(`Report recorded (${reason}). Thank you for keeping Zepp safe.`, 'warning');
  };

  const deleteOwnPost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId),
      users: prev.users.map((u) =>
        u.id === prev.auth.currentUserId
          ? { ...u, postsCount: Math.max(0, u.postsCount - 1) }
          : u
      ),
    }));
    pushToast('Post removed from your feed.', 'info');
  };

  const createDemoPost = (payload: {
    kind: Post['kind'];
    content: string;
    mediaUrls: string[];
    hashtags: string[];
    location: string;
    audience: Post['audience'];
    eventId?: string;
    businessId?: string;
    isSponsored?: boolean;
  }) => {
    const newPost: Post = {
      id: `post_user_${Date.now()}`,
      authorId: currentUser.id,
      kind: payload.kind,
      content: payload.content,
      mediaUrls: payload.mediaUrls,
      hashtags: payload.hashtags,
      location: payload.location || currentUser.location,
      createdAt: 'Just now',
      likesCount: 0,
      likedByMe: false,
      comments: [],
      sharesCount: 0,
      savedByMe: false,
      eventId: payload.eventId,
      businessId: payload.businessId,
      isSponsored: payload.isSponsored,
      sponsoredLabel: payload.isSponsored ? 'Sponsored · Demo Business Promotion' : undefined,
      audience: payload.audience,
      isOwnDemoPost: true,
    };

    setState((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
      users: prev.users.map((u) =>
        u.id === prev.auth.currentUserId ? { ...u, postsCount: u.postsCount + 1 } : u
      ),
    }));
    pushToast('Published to your Zepp demonstration feed!', 'success');
  };

  const createDemoStory = (payload: { mediaUrl: string; caption: string; location: string }) => {
    const newStory: Story = {
      id: `st_user_${Date.now()}`,
      userId: currentUser.id,
      mediaUrl: payload.mediaUrl,
      caption: payload.caption,
      location: payload.location || currentUser.location,
      createdAt: 'Just now',
      viewed: false,
    };
    setState((prev) => ({
      ...prev,
      stories: [newStory, ...prev.stories],
    }));
    pushToast('Story added to the top stories rail!', 'success');
  };

  const markStoryViewed = (storyId: string) => {
    setState((prev) => ({
      ...prev,
      stories: prev.stories.map((s) => (s.id === storyId ? { ...s, viewed: true } : s)),
    }));
  };

  const toggleLikeVideo = (videoId: string) => {
    setState((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.id === videoId
          ? {
              ...v,
              likedByMe: !v.likedByMe,
              likesCount: v.likedByMe ? Math.max(0, v.likesCount - 1) : v.likesCount + 1,
            }
          : v
      ),
    }));
  };

  const toggleSaveVideo = (videoId: string) => {
    setState((prev) => ({
      ...prev,
      videos: prev.videos.map((v) => (v.id === videoId ? { ...v, savedByMe: !v.savedByMe } : v)),
    }));
    pushToast('Updated saved video status.', 'info');
  };

  const addCommentToVideo = (videoId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.id === videoId
          ? {
              ...v,
              comments: [
                ...v.comments,
                {
                  id: `vc_${Date.now()}`,
                  userId: prev.auth.currentUserId,
                  text: trimmed,
                  createdAt: 'Just now',
                  likesCount: 0,
                  likedByMe: false,
                  replies: [],
                },
              ],
            }
          : v
      ),
    }));
  };

  const incrementShareVideo = (videoId: string) => {
    setState((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v.id === videoId ? { ...v, sharesCount: v.sharesCount + 1 } : v
      ),
    }));
    pushToast('Video link copied (demo action).', 'success');
  };

  const toggleSaveEvent = (eventId: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === eventId ? { ...e, savedByMe: !e.savedByMe } : e)),
    }));
  };

  const createDemoBooking = (payload: {
    eventId: string;
    categoryId: string;
    quantity: number;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
    paymentMethod: 'M-Pesa Demo' | 'Card Demo';
  }): TicketBooking => {
    const event = state.events.find((e) => e.id === payload.eventId);
    const cat = event?.ticketCategories.find((c) => c.id === payload.categoryId);
    const unitPriceKes = cat?.priceKes ?? 0;
    const serviceFeeKes = unitPriceKes === 0 ? 0 : Math.round(unitPriceKes * payload.quantity * 0.05);
    const totalKes = unitPriceKes * payload.quantity + serviceFeeKes;

    const booking: TicketBooking = {
      id: `bk_${Date.now()}`,
      reference: generateDemoRef('ZEPP'),
      eventId: payload.eventId,
      categoryId: payload.categoryId,
      categoryName: cat?.name || 'General Admission',
      quantity: payload.quantity,
      unitPriceKes,
      serviceFeeKes,
      totalKes,
      attendeeName: payload.attendeeName,
      attendeeEmail: payload.attendeeEmail,
      attendeePhone: payload.attendeePhone,
      paymentMethod: payload.paymentMethod,
      bookedAt: 'Just now',
    };

    const newNotif: NotificationItem = {
      id: `notif_bk_${Date.now()}`,
      type: 'booking',
      actorId: event?.organiserId || 'u_org_1',
      title: `Demo ticket confirmed: ${event?.title || 'Zepp Event'}`,
      description: `Ref ${booking.reference} · ${booking.quantity}x ${booking.categoryName} (Non-redeemable demo pass).`,
      targetRoute: '/saved',
      createdAt: 'Just now',
      read: false,
    };

    setState((prev) => ({
      ...prev,
      bookings: [booking, ...prev.bookings],
      events: prev.events.map((e) =>
        e.id === payload.eventId
          ? {
              ...e,
              attendeesCount: e.attendeesCount + payload.quantity,
              ticketCategories: e.ticketCategories.map((tc) =>
                tc.id === payload.categoryId
                  ? { ...tc, available: Math.max(0, tc.available - payload.quantity) }
                  : tc
              ),
            }
          : e
      ),
      notifications: [newNotif, ...prev.notifications],
    }));

    pushToast(`Demo booking confirmed (${booking.reference}).`, 'success');
    return booking;
  };

  const createDemoEvent = (payload: {
    title: string;
    category: ZeppEvent['category'];
    dateStr: string;
    timeStr: string;
    venue: string;
    city: string;
    description: string;
    ticketName: string;
    priceKes: number;
    capacity: number;
  }): ZeppEvent => {
    const newEvt: ZeppEvent = {
      id: `evt_user_${Date.now()}`,
      title: payload.title,
      category: payload.category,
      dateStr: payload.dateStr,
      timeStr: payload.timeStr,
      venue: payload.venue,
      city: payload.city,
      description: payload.description,
      coverUrl: makeEditorialArt(
        payload.title,
        `${payload.venue} · ${payload.city}`,
        '#1769E8',
        '#142443',
        '#DCEAFF',
        'waves'
      ),
      organiserId: currentUser.id,
      attendeesCount: 1,
      savedByMe: true,
      ticketCategories: [
        {
          id: `tc_user_${Date.now()}`,
          name: payload.ticketName || 'Standard Pass',
          priceKes: payload.priceKes,
          available: payload.capacity,
          description: 'Created in Zepp Event Organiser Studio.',
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      events: [newEvt, ...prev.events],
    }));
    pushToast(`Event "${payload.title}" published to Zepp Events.`, 'success');
    return newEvt;
  };

  const toggleFollowBusiness = (businessId: string) => {
    setState((prev) => ({
      ...prev,
      businesses: prev.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              isFollowing: !b.isFollowing,
              followersCount: b.isFollowing
                ? Math.max(0, b.followersCount - 1)
                : b.followersCount + 1,
            }
          : b
      ),
    }));
  };

  const sendBusinessEnquiry = (payload: {
    businessId: string;
    productId?: string;
    message: string;
  }) => {
    const enq: BusinessEnquiry = {
      id: `enq_${Date.now()}`,
      businessId: payload.businessId,
      productId: payload.productId,
      senderName: currentUser.name,
      message: payload.message,
      createdAt: 'Just now',
      status: 'New',
    };
    setState((prev) => ({
      ...prev,
      enquiries: [enq, ...prev.enquiries],
      businesses: prev.businesses.map((b) =>
        b.id === payload.businessId
          ? {
              ...b,
              analyticsSummary: {
                ...b.analyticsSummary,
                enquiriesCount: b.analyticsSummary.enquiriesCount + 1,
              },
            }
          : b
      ),
    }));
    pushToast('Enquiry logged in local demonstration inbox.', 'success');
  };

  const addBusinessProduct = (payload: {
    businessId: string;
    name: string;
    priceKes: number;
    category: string;
    description: string;
  }) => {
    const prod: Product = {
      id: `prod_${Date.now()}`,
      businessId: payload.businessId,
      name: payload.name,
      priceKes: payload.priceKes,
      category: payload.category,
      description: payload.description,
      imageUrl: makeEditorialArt(
        payload.name,
        `KES ${payload.priceKes.toLocaleString('en-KE')}`,
        '#287BFA',
        '#142443',
        '#DCEAFF',
        'grid'
      ),
      inStock: true,
    };

    setState((prev) => ({
      ...prev,
      businesses: prev.businesses.map((b) =>
        b.id === payload.businessId ? { ...b, products: [prod, ...b.products] } : b
      ),
    }));
    pushToast(`Added "${payload.name}" to business catalogue.`, 'success');
  };

  const sendChatMessage = (participantId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nowLabel = new Date().toLocaleTimeString('en-KE', {
      hour: 'numeric',
      minute: '2-digit',
    });

    setState((prev) => {
      const existing = prev.conversations.find((c) => c.participantId === participantId);
      if (existing) {
        return {
          ...prev,
          conversations: prev.conversations.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  lastUpdated: nowLabel,
                  unreadCount: 0,
                  messages: [
                    ...c.messages,
                    {
                      id: `msg_${Date.now()}`,
                      senderId: prev.auth.currentUserId,
                      text: trimmed,
                      timestamp: nowLabel,
                    },
                  ],
                }
              : c
          ),
        };
      }

      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participantId,
        unreadCount: 0,
        lastUpdated: nowLabel,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: prev.auth.currentUserId,
            text: trimmed,
            timestamp: nowLabel,
          },
        ],
      };

      return {
        ...prev,
        conversations: [newConv, ...prev.conversations],
      };
    });
  };

  const markConversationRead = (conversationId: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  };

  const markNotificationRead = (notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
    pushToast('All notifications marked as read.', 'info');
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === prev.auth.currentUserId ? { ...u, ...updates } : u
      ),
    }));
    pushToast('Profile details updated.', 'success');
  };

  const setAccountTypeForCurrentUser = (accountType: AccountType) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === prev.auth.currentUserId
          ? {
              ...u,
              accountType,
              demoRoleLabel:
                accountType === 'personal'
                  ? 'Demo Personal Account'
                  : accountType === 'creator'
                    ? 'Demo Creator'
                    : accountType === 'business'
                      ? 'Demo Business'
                      : 'Demo Organiser',
            }
          : u
      ),
    }));
    pushToast(`Account capabilities updated to ${accountType}.`, 'success');
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  };

  const setTheme = (theme: ThemeMode) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }));
  };

  const toggleBlockUser = (userId: string) => {
    setState((prev) => {
      const blocked = prev.settings.blockedUserIds.includes(userId);
      const nextBlocked = blocked
        ? prev.settings.blockedUserIds.filter((id) => id !== userId)
        : [...prev.settings.blockedUserIds, userId];
      pushToast(blocked ? 'Account unblocked.' : 'Account blocked in your feed.', 'info');
      return {
        ...prev,
        settings: { ...prev.settings, blockedUserIds: nextBlocked },
      };
    });
  };

  const addRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setState((prev) => ({
      ...prev,
      recentSearches: [clean, ...prev.recentSearches.filter((s) => s !== clean)].slice(0, 6),
    }));
  };

  const clearRecentSearches = () => {
    setState((prev) => ({ ...prev, recentSearches: [] }));
  };

  return (
    <ZeppContext.Provider
      value={{
        ...state,
        currentUser,
        toasts,
        pushToast,
        dismissToast,
        loginDemo,
        loginWithGoogleDemo,
        registerDemoUser,
        completeOnboarding,
        switchActiveAccount,
        logoutDemo,
        resetDemoWorkspace,
        toggleLikePost,
        toggleSavePost,
        sharePost,
        addCommentToPost,
        toggleFollowUser,
        reportPost,
        deleteOwnPost,
        createDemoPost,
        createDemoStory,
        markStoryViewed,
        toggleLikeVideo,
        toggleSaveVideo,
        addCommentToVideo,
        incrementShareVideo,
        toggleSaveEvent,
        createDemoBooking,
        createDemoEvent,
        toggleFollowBusiness,
        sendBusinessEnquiry,
        addBusinessProduct,
        sendChatMessage,
        markConversationRead,
        markNotificationRead,
        markAllNotificationsRead,
        updateCurrentUserProfile,
        setAccountTypeForCurrentUser,
        updateSettings,
        setTheme,
        toggleBlockUser,
        addRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </ZeppContext.Provider>
  );
};

export function useZepp() {
  const ctx = useContext(ZeppContext);
  if (!ctx) throw new Error('useZepp must be used inside ZeppProvider');
  return ctx;
}
