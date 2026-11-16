import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, Store, User } from 'lucide-react';
import { AccountType } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { ZeppLogo } from '../../components/common/ZeppLogo';

export const OnboardingPage: React.FC = () => {
  const { currentUser, completeOnboarding } = useZepp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AccountType>('personal');

  const options: {
    type: AccountType;
    title: string;
    description: string;
    detail: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      type: 'personal',
      title: 'Personal Account',
      description: 'Connect with friends, share photos, explore events, and message locally.',
      detail: 'Recommended default — you can activate creator or business tools anytime later.',
      icon: User,
    },
    {
      type: 'creator',
      title: 'Creator Account',
      description: 'Publish short videos, photography, and tutorials with audience insights.',
      detail: 'Includes Creator Studio metrics alongside full social features.',
      icon: Sparkles,
    },
    {
      type: 'business',
      title: 'Business Account',
      description: 'Showcase KES products & services, run sponsored posts, and manage enquiries.',
      detail: 'Built for Kenyan SMEs, retailers, cafes, and service brands.',
      icon: Store,
    },
    {
      type: 'organiser',
      title: 'Event Organiser Account',
      description: 'List concerts, summits, and experiences with ticket categories and attendee tracking.',
      detail: 'Includes Organiser Dashboard and booking statistics.',
      icon: Calendar,
    },
  ];

  const handleFinish = () => {
    completeOnboarding(selected);
    navigate('/home');
  };

  return (
    <div className="min-h-screen zepp-ambient-canvas flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl zepp-glass rounded-[34px] p-6 sm:p-9 space-y-6">
        <div className="flex items-center gap-4">
          <ZeppLogo variant="symbol" size="md" />
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
              Karibu Zepp, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-[#71819C] dark:text-[#A6B6D0]">
              Choose how you would like to start. All account types have full social access.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {options.map((opt) => {
            const Icon = opt.icon;
            const active = selected === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelected(opt.type)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  active
                    ? 'bg-[#EDF4FF] dark:bg-[#1769E8]/25 border-[#1769E8] shadow-md'
                    : 'zepp-glass-subtle hover:border-[#287BFA]/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      active
                        ? 'zepp-btn-primary text-white'
                        : 'bg-[#DCEAFF] dark:bg-[#142443] text-[#1769E8] dark:text-[#60A5FA]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-sm text-[#142443] dark:text-[#F0F5FF]">
                    {opt.title}
                  </h2>
                </div>
                <p className="text-xs text-[#1C2B45] dark:text-[#DCEAFF] leading-relaxed">
                  {opt.description}
                </p>
                <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] mt-2">
                  {opt.detail}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0]">
            You can switch or upgrade capabilities in Settings anytime.
          </p>
          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-3 rounded-2xl zepp-btn-primary text-sm font-bold whitespace-nowrap shrink-0"
          >
            Enter Zepp
          </button>
        </div>
      </div>
    </div>
  );
};
