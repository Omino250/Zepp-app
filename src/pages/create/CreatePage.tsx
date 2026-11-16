import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Eye,
  Film,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  PenSquare,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { Post } from '../../types';
import { useZepp } from '../../context/ZeppContext';
import { GENERATED_MEDIA } from '../../utils/media';
import { ZeppMedia } from '../../components/common/ZeppMedia';

type CreateMode = 'post' | 'photo' | 'video' | 'story' | 'event' | 'promotion';

const KENYAN_CITIES = [
  'Nairobi, Kenya',
  'Mombasa, Kenya',
  'Kisumu, Kenya',
  'Nakuru, Kenya',
  'Eldoret, Kenya',
  'Kakamega, Kenya',
];

const SAMPLE_STUDIO_MEDIA = [
  { label: 'Nairobi Skyline', url: GENERATED_MEDIA.nairobiSkyline },
  { label: 'Mombasa Stage', url: GENERATED_MEDIA.mombasaFestival },
  { label: 'Kenyan Coffee', url: GENERATED_MEDIA.kenyanCoffee },
  { label: 'Rift Valley', url: GENERATED_MEDIA.riftValley },
];

export const CreatePage: React.FC = () => {
  const {
    currentUser,
    events,
    businesses,
    createDemoPost,
    createDemoStory,
    pushToast,
  } = useZepp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialMode = (searchParams.get('mode') as CreateMode) || 'post';
  const [mode, setMode] = useState<CreateMode>(initialMode);
  const [content, setContent] = useState('');
  const [hashtagsRaw, setHashtagsRaw] = useState('#ZeppKenya #Nairobi');
  const [location, setLocation] = useState(currentUser.location || 'Nairobi, Kenya');
  const [audience, setAudience] = useState<Post['audience']>('public');
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [selectedBusinessId, setSelectedBusinessId] = useState(businesses[0]?.id || '');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'video' | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [error, setError] = useState('');

  const modes: {
    id: CreateMode;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'post', label: 'Create Post', icon: PenSquare },
    { id: 'photo', label: 'Upload Photo', icon: ImageIcon },
    { id: 'video', label: 'Upload Video', icon: Film },
    { id: 'story', label: 'Create Story', icon: Sparkles },
    { id: 'event', label: 'Share Event', icon: Calendar },
    { id: 'promotion', label: 'Business Promo', icon: Megaphone },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setIsProcessingFile(true);

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setError('Please select a valid image or video file.');
      setIsProcessingFile(false);
      return;
    }

    if (isVideo) {
      const objectUrl = URL.createObjectURL(file);
      setUploadedPreviewUrl(objectUrl);
      setUploadedFileName(file.name);
      setUploadedFileType('video');
      setIsProcessingFile(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPreviewUrl(reader.result);
        setUploadedFileName(file.name);
        setUploadedFileType('image');
      }
      setIsProcessingFile(false);
    };
    reader.onerror = () => {
      setError('Unable to read the selected file.');
      setIsProcessingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const parsedHashtags = hashtagsRaw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith('#') ? t : `#${t}`));

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'story') {
      if (!uploadedPreviewUrl) {
        setError('Please upload an image or pick a studio image for your story.');
        return;
      }
      createDemoStory({
        mediaUrl: uploadedPreviewUrl,
        caption: content.trim() || 'Shared from Zepp Studio',
        location,
      });
      navigate('/home');
      return;
    }

    if ((mode === 'photo' || mode === 'video') && !uploadedPreviewUrl) {
      setError(
        `Please select a real ${mode} file or choose a studio sample asset before publishing.`
      );
      return;
    }

    if (!content.trim() && !uploadedPreviewUrl) {
      setError('Write a caption or attach media before publishing.');
      return;
    }

    if (mode === 'video' && uploadedFileType === 'video') {
      pushToast('Local video preview validated for this session.', 'info');
    }

    const postKind: Post['kind'] =
      mode === 'photo'
        ? 'image'
        : mode === 'video'
          ? 'video'
          : mode === 'event'
            ? 'event'
            : mode === 'promotion'
              ? 'promotion'
              : uploadedPreviewUrl
                ? 'image'
                : 'text';

    createDemoPost({
      kind: postKind,
      content: content.trim(),
      mediaUrls: uploadedPreviewUrl ? [uploadedPreviewUrl] : [],
      hashtags: parsedHashtags,
      location,
      audience,
      eventId: mode === 'event' ? selectedEventId : undefined,
      businessId: mode === 'promotion' ? selectedBusinessId : undefined,
      isSponsored: mode === 'promotion',
    });

    navigate('/home');
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Mode Selector */}
      <section className="zepp-glass rounded-3xl p-5 sm:p-6 space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#142443] dark:text-[#F0F5FF]">
            Content Creation Studio
          </h1>
          <p className="text-xs text-[#71819C] dark:text-[#A6B6D0] mt-0.5">
            Publish demonstration posts, stories, event highlights, and business promotions to your profile and feed.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  setError('');
                }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                  active
                    ? 'zepp-btn-primary text-white shadow-md'
                    : 'zepp-glass-subtle text-[#142443] dark:text-[#DCEAFF] hover:border-[#1769E8]/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold whitespace-nowrap">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Composer Form */}
        <form
          onSubmit={handlePublish}
          className="lg:col-span-7 zepp-glass rounded-3xl p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142443] dark:text-[#F0F5FF]">
              Compose {modes.find((m) => m.id === mode)?.label}
            </h2>
            <span className="text-[11px] text-[#71819C] dark:text-[#A6B6D0]">
              Posting as @{currentUser.username}
            </span>
          </div>

          {/* Caption / Text Editor */}
          <div>
            <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
              {mode === 'story' ? 'Story Caption' : 'Post Caption & Message'}
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                mode === 'promotion'
                  ? 'Describe your Kenyan product offer, KES pricing, or special weekend campaign...'
                  : 'What are you discovering or sharing across Kenya today?'
              }
              className="w-full zepp-neu-input rounded-2xl p-3.5 text-sm text-[#142443] dark:text-white placeholder:text-[#98A6BA] focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
            />
          </div>

          {/* Real Media Upload + Studio Sample Picker */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF]">
              Media Attachment ({mode === 'video' ? 'Video or Poster' : 'Image / Media'})
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              <label className="cursor-pointer px-4 py-2.5 rounded-xl zepp-btn-secondary text-xs font-bold inline-flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#1769E8]" />
                {isProcessingFile ? 'Reading file...' : 'Choose Local File'}
                <input
                  type="file"
                  accept={mode === 'video' ? 'video/*,image/*' : 'image/*'}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {uploadedPreviewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedPreviewUrl('');
                    setUploadedFileName('');
                    setUploadedFileType(null);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#E55353] bg-[#E55353]/10 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Remove Media
                </button>
              )}
            </div>

            {uploadedFileName && (
              <p className="text-[11px] font-medium text-[#20A574]">
                Loaded: {uploadedFileName}
              </p>
            )}

            <div className="pt-1">
              <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] mb-2">
                Or select a Kenyan studio media asset:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_STUDIO_MEDIA.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => {
                      setUploadedPreviewUrl(sample.url);
                      setUploadedFileName(sample.label);
                      setUploadedFileType('image');
                      setError('');
                    }}
                    className={`rounded-xl overflow-hidden border text-left transition-all ${
                      uploadedPreviewUrl === sample.url
                        ? 'border-[#1769E8] ring-2 ring-[#287BFA]/40'
                        : 'border-white/60 dark:border-blue-400/15 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <ZeppMedia
                      src={sample.url}
                      alt={sample.label}
                      className="w-full h-14 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conditional Event or Business Picker */}
          {mode === 'event' && (
            <div>
              <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                Attach Zepp Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'promotion' && (
            <div>
              <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                Promote Business Profile
              </label>
              <select
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              >
                {businesses.map((biz) => (
                  <option key={biz.id} value={biz.id}>
                    {biz.name} ({biz.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Hashtags, Location, Audience */}
          {mode !== 'story' && (
            <div>
              <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtagsRaw}
                onChange={(e) => setHashtagsRaw(e.target.value)}
                placeholder="#Nairobi #TembeaKenya"
                className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
              >
                {KENYAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {mode !== 'story' && (
              <div>
                <label className="block text-xs font-semibold text-[#142443] dark:text-[#DCEAFF] mb-1.5">
                  Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as Post['audience'])}
                  className="w-full zepp-neu-input rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#287BFA]"
                >
                  <option value="public">Public (All Zepp Kenya)</option>
                  <option value="followers">Followers Only</option>
                  <option value="community">Local Community</option>
                </select>
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs font-medium text-[#E55353]" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isProcessingFile}
            className="w-full py-3.5 px-6 rounded-2xl zepp-btn-primary text-sm font-bold disabled:opacity-60"
          >
            {mode === 'story' ? 'Publish Demo Story' : 'Publish to Zepp Feed'}
          </button>
        </form>

        {/* Live Preview */}
        <div className="lg:col-span-5 zepp-glass rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#1769E8]" />
              Live Preview
            </h2>
            <span className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] capitalize">
              {audience}
            </span>
          </div>

          <div className="rounded-2xl p-4 zepp-glass-subtle space-y-3">
            <div className="flex items-center gap-2.5">
              <ZeppMedia
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#142443] dark:text-[#F0F5FF] truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#71819C] dark:text-[#A6B6D0] flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {location} · Preview
                </p>
              </div>
            </div>

            {mode === 'promotion' && (
              <p className="text-xs font-semibold text-[#1769E8] dark:text-[#60A5FA]">
                Sponsored · Demo Business Promotion
              </p>
            )}

            <p className="text-sm text-[#1C2B45] dark:text-[#E5EEFF] whitespace-pre-line">
              {content.trim() || 'Your caption preview will appear here as you type...'}
            </p>

            {mode !== 'story' && parsedHashtags.length > 0 && (
              <p className="text-xs font-medium text-[#1769E8] dark:text-[#60A5FA]">
                {parsedHashtags.join(' ')}
              </p>
            )}

            {uploadedPreviewUrl && (
              <div className="rounded-xl overflow-hidden border border-white/60 dark:border-blue-400/15">
                {uploadedFileType === 'video' ? (
                  <video
                    src={uploadedPreviewUrl}
                    controls
                    muted
                    className="w-full max-h-56 object-cover bg-black"
                  />
                ) : (
                  <ZeppMedia
                    src={uploadedPreviewUrl}
                    alt="Upload preview"
                    className="w-full max-h-56 object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
