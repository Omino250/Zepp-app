import nairobiSkylineImg from '../assets/images/nairobi_skyline_sunset_1794750023339.jpg';
import mombasaFestivalImg from '../assets/images/mombasa_festival_stage_1794750024100.jpg';
import kenyanCoffeeImg from '../assets/images/kenyan_coffee_roastery_1794750024237.jpg';
import nairobiFashionImg from '../assets/images/nairobi_fashion_studio_1794750025451.jpg';
import riftValleyImg from '../assets/images/rift_valley_safari_1794750025055.jpg';
import kilimaniTechImg from '../assets/images/kilimani_tech_summit_1794750025397.jpg';

export const ZEPP_OFFICIAL_LOGO_URL = '/assets/aistudio/Zepp_logo_d1609b05.jfif';

export const GENERATED_MEDIA = {
  nairobiSkyline: nairobiSkylineImg,
  mombasaFestival: mombasaFestivalImg,
  kenyanCoffee: kenyanCoffeeImg,
  nairobiFashion: nairobiFashionImg,
  riftValley: riftValleyImg,
  kilimaniTech: kilimaniTechImg,
};

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export function makeAvatarSvg(
  initials: string,
  c1: string,
  c2: string,
  skinTone?: string
): string {
  const safeInitials = initials.slice(0, 2).toUpperCase();
  if (skinTone) {
    return encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${c1}" />
            <stop offset="100%" stop-color="${c2}" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#bg)" />
        <circle cx="96" cy="24" r="24" fill="rgba(255,255,255,0.14)" />
        <circle cx="60" cy="48" r="20" fill="${skinTone}" />
        <path d="M26 112c2-24 18-36 34-36s32 12 34 36" fill="${skinTone}" opacity="0.92" />
        <path d="M40 37c4-11 16-16 26-14 10 2 16 10 15 21-4-7-12-10-21-10-9 0-15 4-20 3z" fill="#142443" opacity="0.88" />
        <text x="93" y="102" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="rgba(255,255,255,0.85)" text-anchor="middle">${safeInitials}</text>
      </svg>
    `);
  }

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="34" fill="url(#bg)" />
      <circle cx="92" cy="24" r="28" fill="rgba(255,255,255,0.16)" />
      <circle cx="24" cy="96" r="22" fill="rgba(255,255,255,0.12)" />
      <text x="60" y="70" font-family="Plus Jakarta Sans, sans-serif" font-size="38" font-weight="800" fill="#FFFFFF" text-anchor="middle">${safeInitials}</text>
    </svg>
  `);
}

export function makeEditorialArt(
  title: string,
  subtitle: string,
  c1: string,
  c2: string,
  accent: string,
  variant: 'waves' | 'arch' | 'grid' | 'sun' | 'prism' = 'waves'
): string {
  let shapes = '';
  if (variant === 'waves') {
    shapes = `
      <path d="M0 320 Q 180 240 360 300 T 800 260 L 800 500 L 0 500 Z" fill="${accent}" opacity="0.22"/>
      <path d="M0 370 Q 220 300 440 350 T 800 330 L 800 500 L 0 500 Z" fill="#FFFFFF" opacity="0.14"/>
      <circle cx="640" cy="110" r="88" fill="#FFFFFF" opacity="0.16"/>
    `;
  } else if (variant === 'arch') {
    shapes = `
      <rect x="470" y="80" width="230" height="340" rx="115" fill="#FFFFFF" opacity="0.16"/>
      <rect x="520" y="130" width="130" height="240" rx="65" fill="${accent}" opacity="0.28"/>
      <circle cx="150" cy="360" r="110" fill="#FFFFFF" opacity="0.1"/>
    `;
  } else if (variant === 'grid') {
    shapes = `
      <rect x="460" y="64" width="120" height="120" rx="28" fill="#FFFFFF" opacity="0.18"/>
      <rect x="600" y="64" width="120" height="120" rx="60" fill="${accent}" opacity="0.26"/>
      <rect x="460" y="204" width="260" height="140" rx="28" fill="#FFFFFF" opacity="0.12"/>
    `;
  } else if (variant === 'sun') {
    shapes = `
      <circle cx="590" cy="180" r="130" fill="${accent}" opacity="0.32"/>
      <circle cx="590" cy="180" r="78" fill="#FFFFFF" opacity="0.24"/>
      <path d="M0 340 L 800 290 L 800 500 L 0 500 Z" fill="rgba(20,36,67,0.22)"/>
    `;
  } else {
    shapes = `
      <polygon points="520,60 740,170 660,380 440,300" fill="#FFFFFF" opacity="0.15"/>
      <polygon points="560,110 700,190 640,330 490,260" fill="${accent}" opacity="0.28"/>
    `;
  }

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#cardGrad)"/>
      ${shapes}
      <text x="56" y="315" font-family="Plus Jakarta Sans, sans-serif" font-size="36" font-weight="800" fill="#FFFFFF">${escapeXml(title)}</text>
      <text x="56" y="362" font-family="DM Sans, sans-serif" font-size="21" font-weight="500" fill="rgba(255,255,255,0.88)">${escapeXml(subtitle)}</text>
    </svg>
  `);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
