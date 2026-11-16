export type AccountType = 'personal' | 'creator' | 'business' | 'organiser';

export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  accountType: AccountType;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location: string;
  country: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  demoRoleLabel: string; // Transparent demonstration role indicator (never claims real-world verification)
  businessId?: string;
  creatorCategory?: string;
  joinedDate: string;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  location: string;
  createdAt: string;
  viewed: boolean;
}

export interface CommentReply {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
}

export interface PostComment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  replies: CommentReply[];
}

export type PostKind =
  | 'text'
  | 'image'
  | 'carousel'
  | 'video'
  | 'short'
  | 'event'
  | 'promotion';

export interface Post {
  id: string;
  authorId: string;
  kind: PostKind;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  location: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  comments: PostComment[];
  sharesCount: number;
  savedByMe: boolean;
  eventId?: string;
  businessId?: string;
  isSponsored?: boolean;
  sponsoredLabel?: string;
  audience: 'public' | 'followers' | 'community';
  isOwnDemoPost?: boolean;
}

export interface ShortVideo {
  id: string;
  creatorId: string;
  title: string;
  caption: string;
  posterUrl: string;
  accentGradient: string;
  category: string;
  location: string;
  durationSec: number;
  viewsCount: number;
  likesCount: number;
  likedByMe: boolean;
  comments: PostComment[];
  sharesCount: number;
  savedByMe: boolean;
}

export type EventCategory =
  | 'Music'
  | 'Concerts'
  | 'Nightlife'
  | 'Festivals'
  | 'Sports'
  | 'Business Conferences'
  | 'Education'
  | 'Food & Dining'
  | 'Travel'
  | 'Beach Activities'
  | 'Cultural Experiences';

export interface TicketCategory {
  id: string;
  name: string;
  priceKes: number;
  available: number;
  description: string;
}

export interface ZeppEvent {
  id: string;
  title: string;
  category: EventCategory;
  dateStr: string;
  timeStr: string;
  venue: string;
  city: string;
  description: string;
  coverUrl: string;
  organiserId: string;
  ticketCategories: TicketCategory[];
  attendeesCount: number;
  savedByMe: boolean;
}

export interface TicketBooking {
  id: string;
  reference: string;
  eventId: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  unitPriceKes: number;
  serviceFeeKes: number;
  totalKes: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  paymentMethod: 'M-Pesa Demo' | 'Card Demo';
  bookedAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  priceKes: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

export interface BusinessEnquiry {
  id: string;
  businessId: string;
  productId?: string;
  senderName: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Replied';
}

export interface BusinessAnalyticsPoint {
  label: string;
  visits: number;
  reach: number;
  enquiries: number;
}

export interface BusinessProfile {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  city: string;
  address: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  website: string;
  phone: string;
  email: string;
  followersCount: number;
  isFollowing: boolean;
  demoStatusNote: string;
  products: Product[];
  analyticsSummary: {
    profileVisits: number;
    postReach: number;
    engagementRate: string;
    followerGrowth: string;
    enquiriesCount: number;
  };
  analyticsSeries: BusinessAnalyticsPoint[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  unreadCount: number;
  lastUpdated: string;
  messages: ChatMessage[];
}

export type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'message'
  | 'event'
  | 'booking'
  | 'business';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  actorId: string;
  title: string;
  description: string;
  targetRoute: string;
  createdAt: string;
  read: boolean;
}

export interface AppSettings {
  theme: ThemeMode;
  language: 'English (Kenya)' | 'Kiswahili';
  privateAccount: boolean;
  showActivityStatus: boolean;
  allowMessageRequests: boolean;
  notifyLikesComments: boolean;
  notifyEvents: boolean;
  notifyBusinessOffers: boolean;
  blockedUserIds: string[];
}

export interface AuthSession {
  isAuthenticated: boolean;
  currentUserId: string;
  rememberMe: boolean;
  needsOnboarding: boolean;
  authModeLabel: string;
}
