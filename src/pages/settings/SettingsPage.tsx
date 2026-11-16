import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  FileText,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  RotateCcw,
  Shield,
  Sun,
  User,
  UserX,
} from 'lucide-react';
import { AccountType } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { Modal } from '../../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    users,
    settings,
    updateSettings,
    setTheme,
    setAccountTypeForCurrentUser,
    toggleBlockUser,
    logoutDemo,
    resetDemoWorkspace,
    pushToast,
  } = useZepp();
  const navigate = useNavigate();

  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | 'help' | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const blockedProfiles = users.filter((u) => settings.blockedUserIds.includes(u.id));

  const handleLogout = () => {
    logoutDemo();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <section className="zepp-glass rounded-3xl p-5 sm:p-6">
        <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
          Settings & Account Controls
        </h1>
        <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
          Manage appearance, privacy, notifications, blocked accounts, and demonstration workspace preferences.
        </p>
      </section>

      {/* Appearance & Language */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
          {settings.theme === 'light' ? (
            <Sun className="w-4 h-4 text-[#1769E8]" />
          ) : (
            <Moon className="w-4 h-4 text-[#60A5FA]" />
          )}
          Appearance & Language
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              settings.theme === 'light'
                ? 'bg-[#EDF4FF] border-[#1769E8]'
                : 'zepp-glass-subtle'
            }`}
          >
            <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Light Mode (Default)
            </p>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
              Icy-blue glassmorphism matching the Zepp login aesthetic.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              settings.theme === 'dark'
                ? 'bg-[#1769E8]/25 border-[#287BFA]'
                : 'zepp-glass-subtle'
            }`}
          >
            <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF]">
              Dark Navy Mode
            </p>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
              Deep navy surfaces with adapted blue glass cards.
            </p>
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#1769E8]" />
            <div>
              <p className="text-sm font-semibold text-[#142443] dark:text-[#F0F5FF]">
                Display Language
              </p>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                Regional preference for dates & currency (KES)
              </p>
            </div>
          </div>
          <select
            value={settings.language}
            onChange={(e) =>
              updateSettings({
                language: e.target.value as 'English (Kenya)' | 'Kiswahili',
              })
            }
            className="zepp-neu-input rounded-xl px-3.5 py-2 text-xs font-semibold"
          >
            <option value="English (Kenya)">English (Kenya)</option>
            <option value="Kiswahili">Kiswahili</option>
          </select>
        </div>
      </section>

      {/* Account & Profile Preferences */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
            <User className="w-4 h-4 text-[#1769E8]" />
            Account Preferences
          </h2>
          <Link
            to={`/profile/${currentUser.id}`}
            className="text-xs font-bold text-[#1769E8] dark:text-[#60A5FA] hover:underline"
          >
            Edit Profile
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Account Capability Tier</p>
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
              Switch freely between Personal, Creator, Business, or Event Organiser views.
            </p>
          </div>
          <select
            value={currentUser.accountType}
            onChange={(e) => setAccountTypeForCurrentUser(e.target.value as AccountType)}
            className="zepp-neu-input rounded-xl px-3.5 py-2 text-xs font-semibold capitalize"
          >
            <option value="personal">Personal</option>
            <option value="creator">Creator</option>
            <option value="business">Business</option>
            <option value="organiser">Event Organiser</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DCEAFF]/60 dark:border-blue-400/10">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#1769E8]" />
            <div>
              <p className="text-sm font-semibold">Password & Security</p>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
                Simulated authentication — ready for Firebase Auth rules
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="px-3.5 py-2 rounded-xl zepp-btn-secondary text-xs font-bold"
          >
            Update Demo Password
          </button>
        </div>
      </section>

      {/* Privacy & Blocked Accounts */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1769E8]" />
          Privacy & Safety
        </h2>

        {[
          {
            key: 'privateAccount' as const,
            title: 'Private Account Mode',
            desc: 'Require approval before new followers see your posts.',
          },
          {
            key: 'showActivityStatus' as const,
            title: 'Show Activity Status',
            desc: 'Allow mutual contacts in Messages to see when you were recently active.',
          },
          {
            key: 'allowMessageRequests' as const,
            title: 'Allow Direct Message Requests',
            desc: 'Receive messages from Kenyan businesses and event organisers.',
          },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#142443] dark:text-[#F0F5FF]">
                {item.title}
              </p>
              <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">{item.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings[item.key]}
              onClick={() => updateSettings({ [item.key]: !settings[item.key] })}
              className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
                settings[item.key] ? 'bg-[#1769E8]' : 'bg-[#98A6BA]/45'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}

        {/* Blocked Accounts */}
        <div className="pt-3 border-t border-[#DCEAFF]/60 dark:border-blue-400/10 space-y-2">
          <p className="text-xs font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-1.5">
            <UserX className="w-4 h-4 text-[#E55353]" />
            Blocked Accounts ({blockedProfiles.length})
          </p>
          {blockedProfiles.length === 0 ? (
            <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
              You have not blocked any accounts. You can block accounts from any post menu.
            </p>
          ) : (
            <div className="space-y-2">
              {blockedProfiles.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2.5 rounded-xl zepp-glass-subtle text-xs"
                >
                  <span className="font-semibold">
                    {u.name} (@{u.username})
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleBlockUser(u.id)}
                    className="font-bold text-[#1769E8] hover:underline"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1769E8]" />
          Notification Preferences
        </h2>

        {[
          {
            key: 'notifyLikesComments' as const,
            title: 'Likes, Comments & Mentions',
          },
          {
            key: 'notifyEvents' as const,
            title: 'Event Reminders & Ticket Updates',
          },
          {
            key: 'notifyBusinessOffers' as const,
            title: 'Business Enquiries & Local Offers',
          },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-[#142443] dark:text-[#F0F5FF]">
              {item.title}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings[item.key]}
              onClick={() => updateSettings({ [item.key]: !settings[item.key] })}
              className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
                settings[item.key] ? 'bg-[#1769E8]' : 'bg-[#98A6BA]/45'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </section>

      {/* Support, Legal & Session */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setLegalModal('help')}
            className="py-2.5 px-4 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-[#1769E8]" /> Help & Support
          </button>
          <button
            type="button"
            onClick={() => setLegalModal('terms')}
            className="py-2.5 px-4 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-[#1769E8]" /> Terms & Conditions
          </button>
          <button
            type="button"
            onClick={() => setLegalModal('privacy')}
            className="py-2.5 px-4 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-[#1769E8]" /> Privacy Policy
          </button>
        </div>

        <div className="pt-3 border-t border-[#DCEAFF]/60 dark:border-blue-400/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetDemoWorkspace}
            className="px-4 py-2.5 rounded-xl zepp-btn-secondary text-xs font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Restore Default Demo Data
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-[#E55353] hover:bg-[#d34444] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </section>

      {/* Legal / Help Modal */}
      <Modal
        open={legalModal !== null}
        onClose={() => setLegalModal(null)}
        title={
          legalModal === 'terms'
            ? 'Zepp Terms & Conditions (Prototype Notice)'
            : legalModal === 'privacy'
              ? 'Zepp Privacy Architecture'
              : 'Help & Stakeholder Support'
        }
      >
        <div className="space-y-3 text-xs text-[#1C2B45] dark:text-[#DCEAFF] leading-relaxed">
          {legalModal === 'terms' && (
            <>
              <p>
                Zepp is an interactive product prototype showcasing Kenya-focused social networking, creator media, local business storefronts, and event ticketing in KES.
              </p>
              <p>
                All profiles, analytics, payments, and digital tickets in this build are non-redeemable demonstrations and do not constitute binding commercial transactions.
              </p>
            </>
          )}
          {legalModal === 'privacy' && (
            <>
              <p>
                In this prototype, demonstration interactions are saved strictly in your local browser storage. Real passwords and payment credentials are never stored.
              </p>
              <p>
                Production deployment is architected for Firebase Authentication, Firestore security rules, and server-side M-Pesa Daraja webhook verification.
              </p>
            </>
          )}
          {legalModal === 'help' && (
            <>
              <p>
                Use the Account Switcher in the sidebar to test Personal, Creator, Business, and Event Organiser experiences without signing out.
              </p>
              <p>
                Need to reset the demonstration dataset? Click “Restore Default Demo Data” in Settings at any time.
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* Password Demo Modal */}
      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Password Security Notice"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] leading-relaxed">
            For security and privacy hygiene, this demonstration prototype never stores real passwords locally. Password changes will activate once Firebase Authentication is connected.
          </p>
          <button
            type="button"
            onClick={() => {
              setPasswordModalOpen(false);
              pushToast('Password management simulation acknowledged.', 'info');
            }}
            className="w-full py-2.5 rounded-xl zepp-btn-primary text-xs font-bold"
          >
            Got it
          </button>
        </div>
      </Modal>
    </div>
  );
};
