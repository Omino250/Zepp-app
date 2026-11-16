import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Eye,
  Heart,
  Megaphone,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
  Ticket,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ZeppEvent } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { formatCompactNumber, formatKes } from '../../utils/format';
import { Modal } from '../../components/common/Modal';

type HubTab = 'creator' | 'organiser' | 'business';

const CREATOR_PERF_DATA = [
  { day: 'Mon', views: 4200, engagement: 380 },
  { day: 'Tue', views: 5100, engagement: 460 },
  { day: 'Wed', views: 4850, engagement: 425 },
  { day: 'Thu', views: 6400, engagement: 590 },
  { day: 'Fri', views: 7900, engagement: 740 },
  { day: 'Sat', views: 9200, engagement: 880 },
  { day: 'Sun', views: 8100, engagement: 760 },
];

const AUDIENCE_CITIES = [
  { city: 'Nairobi', share: 48 },
  { city: 'Mombasa', share: 21 },
  { city: 'Kisumu', share: 12 },
  { city: 'Nakuru', share: 10 },
  { city: 'Eldoret', share: 9 },
];

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    posts,
    videos,
    events,
    businesses,
    bookings,
    enquiries,
    createDemoEvent,
    addBusinessProduct,
  } = useZepp();

  const defaultTab: HubTab =
    currentUser.accountType === 'business'
      ? 'business'
      : currentUser.accountType === 'organiser'
        ? 'organiser'
        : 'creator';

  const [activeTab, setActiveTab] = useState<HubTab>(defaultTab);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [newProdOpen, setNewProdOpen] = useState(false);

  // Create Event Form state
  const [evtTitle, setEvtTitle] = useState('');
  const [evtCategory, setEvtCategory] = useState<ZeppEvent['category']>('Music');
  const [evtCity, setEvtCity] = useState('Nairobi');
  const [evtVenue, setEvtVenue] = useState('');
  const [evtDate, setEvtDate] = useState('Sat, 19 Dec 2026');
  const [evtTime, setEvtTime] = useState('5:00 PM – 11:00 PM EAT');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtTicketName, setEvtTicketName] = useState('Regular Pass');
  const [evtPrice, setEvtPrice] = useState(1500);
  const [evtCapacity, setEvtCapacity] = useState(150);

  // Add Product Form state
  const activeBusiness =
    businesses.find((b) => b.id === currentUser.businessId) || businesses[0];
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(1800);
  const [prodCat, setProdCat] = useState('Featured');
  const [prodDesc, setProdDesc] = useState('');

  const myPosts = posts.filter((p) => p.authorId === currentUser.id);
  const myVideos = videos.filter((v) => v.creatorId === currentUser.id);
  const totalLikes =
    myPosts.reduce((a, p) => a + p.likesCount, 0) +
    myVideos.reduce((a, v) => a + v.likesCount, 0);
  const totalViews =
    myVideos.reduce((a, v) => a + v.viewsCount, 0) + myPosts.length * 1450;

  const myEvents = events.filter((e) => e.organiserId === currentUser.id);
  const managedEvents = myEvents.length > 0 ? myEvents : events.slice(0, 4);

  const eventSalesChartData = managedEvents.map((ev) => ({
    name: ev.city,
    attendees: ev.attendeesCount,
    revenueK: Math.round(
      (ev.attendeesCount * (ev.ticketCategories[0]?.priceKes || 1500)) / 1000
    ),
  }));

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtVenue.trim()) return;
    createDemoEvent({
      title: evtTitle.trim(),
      category: evtCategory,
      dateStr: evtDate,
      timeStr: evtTime,
      venue: evtVenue.trim(),
      city: evtCity,
      description:
        evtDesc.trim() ||
        `Published from Zepp Event Organiser Studio for ${evtCity}.`,
      ticketName: evtTicketName,
      priceKes: Number(evtPrice) || 0,
      capacity: Number(evtCapacity) || 100,
    });
    setEvtTitle('');
    setEvtVenue('');
    setEvtDesc('');
    setNewEventOpen(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !activeBusiness) return;
    addBusinessProduct({
      businessId: activeBusiness.id,
      name: prodName.trim(),
      priceKes: Number(prodPrice) || 500,
      category: prodCat,
      description: prodDesc.trim() || 'Added via Zepp Business Hub.',
    });
    setProdName('');
    setProdDesc('');
    setNewProdOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Hub Switcher */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
              Creator, Organiser & Business Hub
            </h1>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
              Demonstration Analytics · All figures represent sample Kenyan prototype metrics.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA] capitalize">
            Active Role: {currentUser.accountType}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 p-1.5 zepp-glass-subtle rounded-2xl overflow-x-auto max-w-full">
          {[
            { id: 'creator', label: 'Creator Dashboard', icon: Sparkles },
            { id: 'organiser', label: 'Event Organiser', icon: Calendar },
            { id: 'business', label: 'Business Hub', icon: Store },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as HubTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? 'zepp-btn-primary text-white'
                    : 'text-[#71819C] dark:text-[#A6B6D0]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* CREATOR DASHBOARD */}
      {activeTab === 'creator' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Published Content',
                value: `${myPosts.length + myVideos.length}`,
                sub: 'Posts & short videos',
                icon: BarChart3,
              },
              {
                label: 'Followers',
                value: formatCompactNumber(currentUser.followersCount),
                sub: '+8.4% demo 30d',
                icon: Users,
              },
              {
                label: 'Content Views',
                value: formatCompactNumber(Math.max(12400, totalViews)),
                sub: 'Demonstration reach',
                icon: Eye,
              },
              {
                label: 'Engagements',
                value: formatCompactNumber(Math.max(1850, totalLikes)),
                sub: 'Likes & shares',
                icon: Heart,
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="zepp-glass rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[#71819C] dark:text-[#A6B6D0]">
                    <span className="text-xs font-semibold">{stat.label}</span>
                    <Icon className="w-4 h-4 text-[#1769E8]" />
                  </div>
                  <p className="font-mono-num text-2xl font-extrabold text-[#142443] dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0]">{stat.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 zepp-glass rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                  Weekly Reach & Engagement (Demonstration Analytics)
                </h2>
                <span className="text-[11px] text-[#71819C]">Last 7 days</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CREATOR_PERF_DATA}>
                    <defs>
                      <linearGradient id="zeppReachGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1769E8" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#1769E8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,129,156,0.18)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#71819C' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#71819C' }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#1769E8"
                      strokeWidth={2.5}
                      fill="url(#zeppReachGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 zepp-glass rounded-3xl p-5 space-y-3.5">
              <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                Kenyan Audience Insights (Demo)
              </h2>
              <div className="space-y-3">
                {AUDIENCE_CITIES.map((item) => (
                  <div key={item.city} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.city}</span>
                      <span className="font-mono-num font-bold">{item.share}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#DCEAFF] dark:bg-blue-400/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#287BFA] to-[#1557D8]"
                        style={{ width: `${item.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/create"
                className="w-full py-2.5 px-4 rounded-xl zepp-btn-primary text-xs font-bold flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" /> Publish New Content
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* EVENT ORGANISER DASHBOARD */}
      {activeTab === 'organiser' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 zepp-glass rounded-3xl p-5">
            <div>
              <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
                Event Management & Ticketing Overview
              </h2>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                Create demonstration events, inspect ticket tiers, and track simulated bookings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewEventOpen(true)}
              className="px-4 py-2.5 rounded-xl zepp-btn-primary text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Active Events',
                value: `${managedEvents.length}`,
                icon: Calendar,
              },
              {
                label: 'Total Attendees',
                value: formatCompactNumber(
                  managedEvents.reduce((acc, e) => acc + e.attendeesCount, 0)
                ),
                icon: Users,
              },
              {
                label: 'Demo Bookings',
                value: `${bookings.length}`,
                icon: Ticket,
              },
              {
                label: 'Demo Ticket Volume',
                value: formatKes(bookings.reduce((acc, b) => acc + b.totalKes, 0)),
                icon: TrendingUp,
              },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="zepp-glass rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-[#71819C]">
                    <span className="text-xs font-semibold">{kpi.label}</span>
                    <Icon className="w-4 h-4 text-[#1769E8]" />
                  </div>
                  <p className="font-mono-num text-xl font-extrabold text-[#142443] dark:text-white">
                    {kpi.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6 zepp-glass rounded-3xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                Attendees by Event City (Demo)
              </h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventSalesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,129,156,0.18)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71819C' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#71819C' }} />
                    <Tooltip />
                    <Bar dataKey="attendees" fill="#1769E8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 zepp-glass rounded-3xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                Managed Events & Ticket Tiers
              </h3>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {managedEvents.map((ev) => (
                  <Link
                    key={ev.id}
                    to={`/events/${ev.id}`}
                    className="block p-3 rounded-2xl zepp-glass-subtle hover:border-[#1769E8]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                        {ev.title}
                      </p>
                      <span className="font-mono-num text-xs font-bold text-[#1769E8] shrink-0">
                        {ev.attendeesCount} going
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
                      {ev.city} · {ev.dateStr} · {ev.ticketCategories.length} ticket tier(s)
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUSINESS DASHBOARD */}
      {activeTab === 'business' && activeBusiness && (
        <div className="space-y-5">
          <div className="zepp-glass rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
                {activeBusiness.name} — Business Analytics (Demo)
              </h2>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                {activeBusiness.category} · {activeBusiness.city}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setNewProdOpen(true)}
                className="px-3.5 py-2 rounded-xl zepp-btn-secondary text-xs font-bold inline-flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-[#1769E8]" /> Add Product
              </button>
              <Link
                to="/create?mode=promotion"
                className="px-3.5 py-2 rounded-xl zepp-btn-primary text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Megaphone className="w-4 h-4" /> Launch Promotion
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            {[
              {
                label: 'Profile Visits',
                val: formatCompactNumber(activeBusiness.analyticsSummary.profileVisits),
              },
              {
                label: 'Post Reach',
                val: formatCompactNumber(activeBusiness.analyticsSummary.postReach),
              },
              {
                label: 'Engagement',
                val: activeBusiness.analyticsSummary.engagementRate,
              },
              {
                label: 'Follower Growth',
                val: activeBusiness.analyticsSummary.followerGrowth,
              },
              {
                label: 'Enquiries',
                val: `${activeBusiness.analyticsSummary.enquiriesCount}`,
              },
            ].map((kpi) => (
              <div key={kpi.label} className="zepp-glass rounded-2xl p-4">
                <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">{kpi.label}</p>
                <p className="font-mono-num text-xl font-extrabold text-[#142443] dark:text-white mt-1">
                  {kpi.val}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 zepp-glass rounded-3xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                Campaign & Visit Performance (Demonstration Analytics)
              </h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeBusiness.analyticsSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,129,156,0.18)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#71819C' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#71819C' }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="reach"
                      stroke="#287BFA"
                      fill="rgba(40,123,250,0.22)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#142443"
                      fill="rgba(20,36,67,0.12)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 zepp-glass rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
                  Recent Customer Enquiries ({enquiries.length})
                </h3>
                <Link
                  to={`/businesses/${activeBusiness.id}`}
                  className="text-xs font-semibold text-[#1769E8] hover:underline"
                >
                  View Store
                </Link>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-3 rounded-2xl zepp-glass-subtle space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#142443] dark:text-[#F0F5FF]">
                        {enq.senderName}
                      </span>
                      <span className="text-[11px] text-[#1769E8] font-semibold">
                        {enq.status} · {enq.createdAt}
                      </span>
                    </div>
                    <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                      {enq.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        open={newEventOpen}
        onClose={() => setNewEventOpen(false)}
        title="Publish Demonstration Event"
        subtitle="Added immediately to Zepp Events & Discovery"
      >
        <form onSubmit={handleCreateEvent} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold mb-1">Event Title</label>
            <input
              type="text"
              required
              value={evtTitle}
              onChange={(e) => setEvtTitle(e.target.value)}
              placeholder="e.g. Nairobi Acoustic Rooftop"
              className="w-full zepp-neu-input rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <select
                value={evtCategory}
                onChange={(e) => setEvtCategory(e.target.value as ZeppEvent['category'])}
                className="w-full zepp-neu-input rounded-xl px-3 py-2 text-sm"
              >
                <option value="Music">Music</option>
                <option value="Concerts">Concerts</option>
                <option value="Festivals">Festivals</option>
                <option value="Business Conferences">Business Conferences</option>
                <option value="Sports">Sports</option>
                <option value="Food & Dining">Food & Dining</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <select
                value={evtCity}
                onChange={(e) => setEvtCity(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3 py-2 text-sm"
              >
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Nakuru">Nakuru</option>
                <option value="Eldoret">Eldoret</option>
                <option value="Kakamega">Kakamega</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Venue</label>
            <input
              type="text"
              required
              value={evtVenue}
              onChange={(e) => setEvtVenue(e.target.value)}
              placeholder="e.g. Alchemist Courtyard, Westlands"
              className="w-full zepp-neu-input rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Date</label>
              <input
                type="text"
                value={evtDate}
                onChange={(e) => setEvtDate(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Time</label>
              <input
                type="text"
                value={evtTime}
                onChange={(e) => setEvtTime(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold mb-1">Ticket Name</label>
              <input
                type="text"
                value={evtTicketName}
                onChange={(e) => setEvtTicketName(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Price (KES)</label>
              <input
                type="number"
                min={0}
                value={evtPrice}
                onChange={(e) => setEvtPrice(Number(e.target.value))}
                className="w-full zepp-neu-input rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Capacity</label>
              <input
                type="number"
                min={1}
                value={evtCapacity}
                onChange={(e) => setEvtCapacity(Number(e.target.value))}
                className="w-full zepp-neu-input rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={evtDesc}
              onChange={(e) => setEvtDesc(e.target.value)}
              placeholder="Event highlights and attendee info..."
              className="w-full zepp-neu-input rounded-xl p-3 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setNewEventOpen(false)}
              className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              Publish Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Business Product Modal */}
      <Modal
        open={newProdOpen}
        onClose={() => setNewProdOpen(false)}
        title="Add Product or Service"
        subtitle={`Listing for ${activeBusiness?.name}`}
      >
        <form onSubmit={handleAddProduct} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold mb-1">Product Name</label>
            <input
              type="text"
              required
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="e.g. Kirinyaga Peaberry 250g"
              className="w-full zepp-neu-input rounded-xl px-3.5 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Price (KES)</label>
              <input
                type="number"
                min={50}
                value={prodPrice}
                onChange={(e) => setProdPrice(Number(e.target.value))}
                className="w-full zepp-neu-input rounded-xl px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <input
                type="text"
                value={prodCat}
                onChange={(e) => setProdCat(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3.5 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              className="w-full zepp-neu-input rounded-xl p-3 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewProdOpen(false)}
              className="px-4 py-2 rounded-xl zepp-btn-secondary text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl zepp-btn-primary text-xs font-semibold"
            >
              Add to Storefront
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
