import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Bookmark,
  Calendar,
  ChevronDown,
  Compass,
  Film,
  Home,
  Menu,
  MessageCircle,
  Moon,
  PlusSquare,
  Search,
  Settings,
  Store,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useZepp } from '../../context/ZeppContext';
import { ZeppLogo } from '../common/ZeppLogo';
import { ZeppMedia } from '../common/ZeppMedia';
import { RightContextRail } from './RightContextRail';
import { ToastStack } from '../common/ToastStack';

export const AppShell: React.FC = () => {
  const {
    currentUser,
    users,
    notifications,
    conversations,
    settings,
    setTheme,
    switchActiveAccount,
  } = useZepp();

  const location = useLocation();
  const navigate = useNavigate();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const demoSwitchAccounts = [
    users.find((u) => u.id === 'u_personal_1'),
    users.find((u) => u.id === 'u_creator_1'),
    users.find((u) => u.id === 'u_biz_1'),
    users.find((u) => u.id === 'u_org_1'),
  ].filter(Boolean);

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/videos', label: 'Videos', icon: Film },
    { to: '/create', label: 'Create', icon: PlusSquare },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/businesses', label: 'Businesses', icon: Store },
    { to: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs },
    { to: '/saved', label: 'Saved', icon: Bookmark },
    { to: '/dashboard', label: 'Studio Hub', icon: BarChart3 },
    { to: `/profile/${currentUser.id}`, label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) {
      navigate('/explore');
      return;
    }
    navigate(`/explore?q=${encodeURIComponent(quickSearch.trim())}`);
    setQuickSearch('');
  };

  const isWideRoute =
    location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/videos');

  return (
    <div className="min-h-screen zepp-ambient-canvas relative text-[#1C2B45] dark:text-[#F0F5FF]">
      {/* Subtle decorative icy-blue shapes inspired by login reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-28 -left-28 w-96 h-96 rounded-full bg-[#DCEAFF]/70 dark:bg-[#1769E8]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/3 -right-24 w-80 h-80 rounded-full bg-[#287BFA]/12 dark:bg-[#287BFA]/10 blur-3xl"
      />

      {/* Mobile Top Bar (compact <=56px) */}
      <header className="lg:hidden sticky top-0 z-30 h-14 px-3.5 zepp-glass border-b border-white/70 dark:border-blue-400/15 flex items-center justify-between gap-3">
        <Link to="/home" className="flex items-center gap-2.5 min-w-0 shrink-0">
          <ZeppLogo variant="symbol" size="sm" />
          <span className="font-display font-extrabold text-base tracking-tight text-[#142443] dark:text-[#F0F5FF]">
            Zepp
          </span>
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            to="/explore"
            aria-label="Search Zepp"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#142443] dark:text-[#DCEAFF] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10"
          >
            <Search className="w-5 h-5" />
          </Link>
          <Link
            to="/messages"
            aria-label="Messages"
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#142443] dark:text-[#DCEAFF] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#1769E8] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadMessages}
              </span>
            )}
          </Link>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#142443] dark:text-[#DCEAFF] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E55353] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadNotifs}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#142443] dark:text-[#DCEAFF] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Desktop + Tablet Three-Column Container */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-4 lg:py-6 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[252px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_320px] gap-6 items-start">
          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:flex flex-col zepp-glass rounded-3xl p-4 sticky top-6 max-h-[calc(100vh-3rem)]">
            <div className="flex items-center justify-between gap-2 px-2 pb-4 border-b border-[#DCEAFF]/80 dark:border-blue-400/15">
              <Link to="/home" className="flex items-center gap-3 min-w-0">
                <ZeppLogo variant="symbol" size="md" />
                <div>
                  <span className="font-display font-extrabold text-xl tracking-tight text-[#142443] dark:text-[#F0F5FF] block leading-none">
                    Zepp
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#71819C] dark:text-[#A6B6D0] mt-1 block">
                    KENYA ECOSYSTEM
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setTheme(settings.theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle appearance"
                className="w-9 h-9 rounded-xl zepp-btn-secondary flex items-center justify-center shrink-0"
              >
                {settings.theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            </div>

            <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'zepp-btn-primary text-white shadow-md'
                          : 'text-[#1C2B45] dark:text-[#DCEAFF] hover:bg-[#DCEAFF]/65 dark:hover:bg-white/10'
                      }`
                    }
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-[#1769E8] tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Account Switcher */}
            <div className="pt-3 border-t border-[#DCEAFF]/80 dark:border-blue-400/15 relative">
              <button
                type="button"
                onClick={() => setSwitcherOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2.5 p-2 rounded-2xl hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ZeppMedia
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] capitalize truncate">
                      {currentUser.accountType} mode
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#71819C] shrink-0" />
              </button>

              {switcherOpen && (
                <div className="absolute bottom-14 left-0 right-0 z-30 zepp-glass rounded-2xl p-2 shadow-2xl space-y-1">
                  <p className="px-2.5 py-1 text-[11px] font-semibold text-[#71819C] dark:text-[#A6B6D0]">
                    Switch Demo Account View
                  </p>
                  {demoSwitchAccounts.map((acc) => {
                    if (!acc) return null;
                    const active = acc.id === currentUser.id;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          switchActiveAccount(acc.id);
                          setSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                          active
                            ? 'bg-[#DCEAFF] dark:bg-[#1769E8]/30 text-[#142443] dark:text-white'
                            : 'hover:bg-[#DCEAFF]/50 dark:hover:bg-white/10'
                        }`}
                      >
                        <ZeppMedia
                          src={acc.avatarUrl}
                          alt={acc.name}
                          className="w-7 h-7 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{acc.name}</p>
                          <p className="text-[10px] text-[#71819C] dark:text-[#A6B6D0] capitalize">
                            {acc.accountType}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* CENTRAL CONTENT AREA */}
          <main
            className={`min-w-0 space-y-5 ${
              isWideRoute ? 'xl:col-span-2' : ''
            }`}
          >
            {/* Desktop Top Search & Shortcuts Bar */}
            <div className="hidden lg:flex items-center justify-between gap-4 zepp-glass rounded-2xl px-4 py-2.5">
              <form onSubmit={handleHeaderSearch} className="flex-1 max-w-md relative">
                <Search className="w-4 h-4 text-[#71819C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Search people, Kenyan businesses, events, or #tags..."
                  className="w-full zepp-neu-input rounded-xl pl-10 pr-4 py-2 text-xs text-[#1C2B45] dark:text-white placeholder:text-[#98A6BA] focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                />
              </form>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  to="/create"
                  className="px-3.5 py-2 rounded-xl zepp-btn-primary text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <PlusSquare className="w-4 h-4" />
                  Create Post
                </Link>
                <Link
                  to="/messages"
                  aria-label="Messages"
                  className="relative w-10 h-10 rounded-xl zepp-btn-secondary flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1769E8] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  aria-label="Notifications"
                  className="relative w-10 h-10 rounded-xl zepp-btn-secondary flex items-center justify-center"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E55353] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {unreadNotifs}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${currentUser.id}`}
                  aria-label="Your profile"
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl zepp-btn-secondary"
                >
                  <ZeppMedia
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="text-xs font-semibold whitespace-nowrap max-w-[110px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </Link>
              </div>
            </div>

            <Outlet />
          </main>

          {/* RIGHT SIDEBAR (Desktop xl+) */}
          {!isWideRoute && (
            <div className="hidden xl:block">
              <RightContextRail />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation (5 primary tabs, <=58px height) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-[58px] zepp-glass border-t border-white/75 dark:border-blue-400/15 grid grid-cols-5 items-center px-1"
      >
        {[
          { to: '/home', label: 'Home', icon: Home },
          { to: '/explore', label: 'Explore', icon: Compass },
          { to: '/create', label: 'Create', icon: PlusSquare },
          { to: '/events', label: 'Events', icon: Calendar },
          { to: `/profile/${currentUser.id}`, label: 'Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
                  isActive
                    ? 'text-[#1769E8] dark:text-[#60A5FA] font-bold'
                    : 'text-[#71819C] dark:text-[#A6B6D0] font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Mobile Secondary Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#142443]/50 backdrop-blur-sm flex justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-80 max-w-[85vw] h-full zepp-glass p-5 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCEAFF] dark:border-blue-400/15">
                <div className="flex items-center gap-2.5">
                  <ZeppLogo variant="symbol" size="sm" />
                  <span className="font-display font-bold text-base text-[#142443] dark:text-[#F0F5FF]">
                    Zepp Menu
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {[
                  { to: '/videos', label: 'Short Videos', icon: Film },
                  { to: '/businesses', label: 'Businesses Directory', icon: Store },
                  { to: '/saved', label: 'Saved & Demo Tickets', icon: Bookmark },
                  { to: '/dashboard', label: 'Creator & Business Hub', icon: BarChart3 },
                  { to: '/settings', label: 'Settings & Privacy', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold text-[#142443] dark:text-[#F0F5FF] hover:bg-[#DCEAFF]/60 dark:hover:bg-white/10"
                    >
                      <Icon className="w-5 h-5 text-[#1769E8]" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#DCEAFF] dark:border-blue-400/15 space-y-2">
                <p className="text-xs font-semibold text-[#71819C] dark:text-[#A6B6D0]">
                  Switch Demo Account
                </p>
                {demoSwitchAccounts.map((acc) => {
                  if (!acc) return null;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        switchActiveAccount(acc.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-2xl text-left ${
                        acc.id === currentUser.id
                          ? 'bg-[#DCEAFF] dark:bg-[#1769E8]/30'
                          : 'hover:bg-[#DCEAFF]/50 dark:hover:bg-white/10'
                      }`}
                    >
                      <ZeppMedia
                        src={acc.avatarUrl}
                        alt={acc.name}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{acc.name}</p>
                        <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] capitalize">
                          {acc.accountType}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTheme(settings.theme === 'light' ? 'dark' : 'light')}
              className="mt-4 w-full py-2.5 px-4 rounded-xl zepp-btn-secondary text-xs font-semibold flex items-center justify-center gap-2"
            >
              {settings.theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" /> Switch to Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" /> Switch to Light Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <ToastStack />
    </div>
  );
};
