import { Conversation } from '../types';

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participantId: 'u_creator_1',
    unreadCount: 2,
    lastUpdated: '10:42 AM',
    messages: [
      {
        id: 'm_1',
        senderId: 'u_creator_1',
        text: 'Hey Wanjiku! Loved your comment on the Nairobi sunset frame.',
        timestamp: '10:38 AM',
      },
      {
        id: 'm_2',
        senderId: 'u_personal_1',
        text: 'It was stunning! Which rooftop in Upper Hill gives that angle?',
        timestamp: '10:40 AM',
      },
      {
        id: 'm_3',
        senderId: 'u_creator_1',
        text: 'Near Britam Tower terrace! We are doing a golden-hour photowalk next Friday if you want to join.',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: 'conv_2',
    participantId: 'u_biz_1',
    unreadCount: 1,
    lastUpdated: '9:15 AM',
    messages: [
      {
        id: 'm_4',
        senderId: 'u_personal_1',
        text: 'Hi Kilimani Roast team, do you have the Nyeri AA 500g bags ground for Chemex?',
        timestamp: '9:04 AM',
      },
      {
        id: 'm_5',
        senderId: 'u_biz_1',
        text: 'Yes we do! We can grind fresh to medium-coarse right before pickup in Kilimani.',
        timestamp: '9:15 AM',
      },
    ],
  },
  {
    id: 'conv_3',
    participantId: 'u_personal_3',
    unreadCount: 0,
    lastUpdated: 'Yesterday',
    messages: [
      {
        id: 'm_6',
        senderId: 'u_personal_3',
        text: 'Karibu Mombasa for the Coastal Waves Festival next month! Let me know your SGR arrival time.',
        timestamp: 'Yesterday',
      },
      {
        id: 'm_7',
        senderId: 'u_personal_1',
        text: 'Booked the morning Madaraka Express! Cannot wait for Nyali.',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: 'conv_4',
    participantId: 'u_personal_6',
    unreadCount: 0,
    lastUpdated: 'Yesterday',
    messages: [
      {
        id: 'm_8',
        senderId: 'u_personal_6',
        text: 'Are you attending the Nairobi Tech & Design Summit at Sarit Expo Centre?',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: 'conv_5',
    participantId: 'u_creator_2',
    unreadCount: 0,
    lastUpdated: 'Tue',
    messages: [
      {
        id: 'm_9',
        senderId: 'u_creator_2',
        text: 'Thanks for saving the Swahili fish curry recipe! Drop any ingredient questions anytime.',
        timestamp: 'Tue',
      },
    ],
  },
  {
    id: 'conv_6',
    participantId: 'u_personal_2',
    unreadCount: 0,
    lastUpdated: 'Mon',
    messages: [
      {
        id: 'm_10',
        senderId: 'u_personal_2',
        text: 'Sending sunny greetings from Kisumu! Let us know when you visit Dunga Pier.',
        timestamp: 'Mon',
      },
    ],
  },
];
