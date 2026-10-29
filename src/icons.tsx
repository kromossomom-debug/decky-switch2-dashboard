import { ReactNode } from "react";
import { FaSteam } from "react-icons/fa";

/**
 * Authentic Nintendo Switch 2 Shortcuts and Profile Icons.
 * Pure vector SVG geometry for crisp, 1:1 rendering at any resolution.
 */

/* =========================================================================
   SHORTCUTS (BOTTOM DOCK) ICONS
   ========================================================================= */

/** Nintendo Switch Online: Official Switch Joy-Cons emblem */
export function NsoIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      {/* Left Joy-Con */}
      <rect x="18" y="16" width="28" height="68" rx="14" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="32" cy="36" r="6" fill="currentColor" />
      {/* Right Joy-Con */}
      <path
        d="M54,16 L68,16 C75.7,16 82,22.3 82,30 L82,70 C82,77.7 75.7,84 68,84 L54,84 Z"
        fill="currentColor"
      />
      <circle cx="68" cy="58" r="6" fill="#E60012" />
    </svg>
  );
}

/** GameChat: Switch 2 Voice/Party Chat bubble with gamer headset */
export function GameChatIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      {/* Chat bubble body */}
      <path
        d="M20,24 C20,17.4 25.4,12 32,12 L68,12 C74.6,12 80,17.4 80,24 L80,56 C80,62.6 74.6,68 68,68 L42,68 L26,80 L26,68 L20,68 C13.4,68 8,62.6 8,56 Z"
        transform="translate(6, 4)"
        fill="currentColor"
      />
      {/* Headset arc */}
      <path
        d="M36,40 C36,30 64,30 64,40"
        fill="none"
        stroke="#0072CE"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Ear cups */}
      <rect x="33" y="38" width="6" height="12" rx="3" fill="#0072CE" />
      <rect x="61" y="38" width="6" height="12" rx="3" fill="#0072CE" />
      {/* Microphone */}
      <path d="M36,46 Q40,54 48,54" fill="none" stroke="#0072CE" strokeWidth="4" strokeLinecap="round" />
      <circle cx="49" cy="54" r="2.5" fill="#0072CE" />
    </svg>
  );
}

/** News: Nintendo Switch News Megaphone with sound waves */
export function NewsIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      {/* Megaphone body */}
      <polygon points="26,38 52,24 52,76 26,62" fill="currentColor" />
      <rect x="18" y="42" width="9" height="16" rx="3" fill="currentColor" />
      <rect x="30" y="60" width="8" height="16" rx="3" fill="currentColor" transform="rotate(-15 34 68)" />
      {/* Sound waves */}
      <path
        d="M62,36 A18,18 0 0,1 62,64"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M74,26 A34,34 0 0,1 74,74"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Nintendo eShop: Official eShop shopping bag with cut-out smile */
export function EshopIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      {/* Handle */}
      <path
        d="M36,36 C36,18 64,18 64,36"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Bag Body */}
      <path
        d="M23,36 L77,36 L71,83 C70.5,86 67.5,88 64,88 L36,88 C32.5,88 29.5,86 29,83 Z"
        fill="currentColor"
      />
      {/* Smile Cutout */}
      <path
        d="M38,55 Q50,70 62,55"
        fill="none"
        stroke="#F58426"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Album: Switch Photo / Screenshot frame */
export function AlbumIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      {/* Outer picture frame */}
      <rect x="16" y="20" width="68" height="60" rx="9" fill="none" stroke="currentColor" strokeWidth="6" />
      {/* Sun */}
      <circle cx="66" cy="38" r="6" fill="currentColor" />
      {/* Mountains */}
      <polygon points="23,73 44,46 58,62" fill="currentColor" />
      <polygon points="48,73 65,51 77,73" fill="currentColor" />
    </svg>
  );
}

/** GameShare: Two Joy-Cons wirelessly transmitting */
export function GameShareIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      {/* Left controller */}
      <g transform="translate(18, 22) rotate(-10)">
        <rect x="0" y="0" width="20" height="48" rx="10" fill="currentColor" />
        <circle cx="10" cy="12" r="3.5" fill="#8E24AA" />
        <circle cx="10" cy="34" r="2.5" fill="#8E24AA" />
      </g>
      {/* Right controller */}
      <g transform="translate(62, 20) rotate(10)">
        <rect x="0" y="0" width="20" height="48" rx="10" fill="currentColor" />
        <circle cx="10" cy="14" r="2.5" fill="#8E24AA" />
        <circle cx="10" cy="36" r="3.5" fill="#8E24AA" />
      </g>
      {/* Wireless signal waves between them */}
      <path d="M43,38 A9,9 0 0,1 57,38" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M40,30 A15,15 0 0,1 60,30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M37,22 A21,21 0 0,1 63,22" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Controllers: Authentic Joy-Con Pair in Neon Blue and Neon Red */
export function ControllersIcon() {
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em">
      {/* Left Joy-Con: Neon Cyan */}
      <rect x="22" y="18" width="24" height="64" rx="12" fill="#00C3E3" />
      <circle cx="34" cy="35" r="5.5" fill="#FFFFFF" />
      {/* Directional buttons */}
      <circle cx="34" cy="51" r="2" fill="#FFFFFF" />
      <circle cx="30" cy="55" r="2" fill="#FFFFFF" />
      <circle cx="38" cy="55" r="2" fill="#FFFFFF" />
      <circle cx="34" cy="59" r="2" fill="#FFFFFF" />
      {/* Minus button */}
      <rect x="36" y="24" width="6" height="2" rx="1" fill="#FFFFFF" />

      {/* Right Joy-Con: Neon Red */}
      <rect x="54" y="18" width="24" height="64" rx="12" fill="#FF3853" />
      {/* ABXY buttons */}
      <circle cx="66" cy="31" r="2" fill="#FFFFFF" />
      <circle cx="62" cy="35" r="2" fill="#FFFFFF" />
      <circle cx="70" cy="35" r="2" fill="#FFFFFF" />
      <circle cx="66" cy="39" r="2" fill="#FFFFFF" />
      <circle cx="66" cy="55" r="5.5" fill="#FFFFFF" />
      {/* Plus button */}
      <path d="M60,25 L64,25 M62,23 L62,27" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Virtual Game Cards: Switch Game Card Cartridge */
export function CardsIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      {/* Cartridge Outer Body */}
      <path
        d="M26,18 L74,18 C77.3,18 80,20.7 80,24 L80,78 C80,81.3 77.3,84 74,84 L26,84 C22.7,84 20,81.3 20,78 L20,24 C20,20.7 22.7,18 26,18 Z"
        fill="currentColor"
      />
      {/* Cartridge bevel / notch */}
      <rect x="26" y="26" width="48" height="44" rx="4" fill="#00897B" />
      {/* Artwork label banner */}
      <rect x="30" y="30" width="40" height="24" rx="2" fill="#FFFFFF" />
      {/* Grip lines */}
      <line x1="34" y1="22" x2="66" y2="22" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Gold pin indicator */}
      <rect x="34" y="74" width="32" height="4" rx="2" fill="#FFD700" />
    </svg>
  );
}

/** System Settings: Authentic 8-tooth Switch Gear */
export function SettingsIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" width="1em" height="1em">
      <path
        d="M50,18 C47.8,18 46,19.8 46,22 L46,25.5 C42.8,26.4 39.8,27.8 37.1,29.7 L34.5,27.1 C33,25.6 30.5,25.6 28.9,27.1 L23.3,32.7 C21.8,34.2 21.8,36.7 23.3,38.3 L25.9,40.9 C24.1,43.6 22.7,46.5 21.8,49.8 L18.3,49.8 C16.1,49.8 14.3,51.6 14.3,53.8 L14.3,61.7 C14.3,63.9 16.1,65.7 18.3,65.7 L21.8,65.7 C22.7,68.9 24.1,71.9 25.9,74.6 L23.3,77.2 C21.8,78.7 21.8,81.2 23.3,82.8 L28.9,88.4 C30.5,89.9 33,89.9 34.5,88.4 L37.1,85.8 C39.8,87.6 42.8,89.1 46,90 L46,93.5 C46,95.7 47.8,97.5 50,97.5 L57.9,97.5 C60.1,97.5 61.9,95.7 61.9,93.5 L61.9,90 C65.1,89.1 68.1,87.6 70.8,85.8 L73.4,88.4 C74.9,89.9 77.4,89.9 79,88.4 L84.6,82.8 C86.1,81.2 86.1,78.7 84.6,77.2 L82,74.6 C83.8,71.9 85.2,68.9 86.1,65.7 L89.6,65.7 C91.8,65.7 93.6,63.9 93.6,61.7 L93.6,53.8 C93.6,51.6 91.8,49.8 89.6,49.8 L86.1,49.8 C85.2,46.5 83.8,43.6 82,40.9 L84.6,38.3 C86.1,36.7 86.1,34.2 84.6,32.7 L79,27.1 C77.4,25.6 74.9,25.6 73.4,27.1 L70.8,29.7 C68.1,27.8 65.1,26.4 61.9,25.5 L61.9,22 C61.9,19.8 60.1,18 57.9,18 Z M53.9,40 C63.9,40 71.9,48.1 71.9,58 C71.9,67.9 63.9,76 53.9,76 C44,76 35.9,67.9 35.9,58 C35.9,48.1 44,40 53.9,40 Z"
        transform="translate(-4, -8) scale(1.08)"
      />
    </svg>
  );
}

/** Sleep Mode: Power Standby symbol */
export function SleepIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" width="1em" height="1em">
      {/* Arc */}
      <path d="M34,26 A30,30 0 1,0 66,26" strokeWidth="8" strokeLinecap="round" />
      {/* Center line */}
      <line x1="50" y1="14" x2="50" y2="44" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================================
   AUTHENTIC SHORTCUT CONFIGURATION & COLORS
   ========================================================================= */

export interface ShortcutDefinition {
  id: string;
  labelKey: string;
  color: string;
  textColor: string;
  renderIcon: () => ReactNode;
}

export const SWITCH2_SHORTCUTS: ShortcutDefinition[] = [
  { id: "online", labelKey: "online", color: "#E60012", textColor: "#FFFFFF", renderIcon: () => <NsoIcon /> },
  { id: "chat", labelKey: "chat", color: "#0072CE", textColor: "#FFFFFF", renderIcon: () => <GameChatIcon /> },
  { id: "news", labelKey: "news", color: "#E63900", textColor: "#FFFFFF", renderIcon: () => <NewsIcon /> },
  { id: "store", labelKey: "store", color: "#F58426", textColor: "#FFFFFF", renderIcon: () => <EshopIcon /> },
  { id: "album", labelKey: "album", color: "#00A0E9", textColor: "#FFFFFF", renderIcon: () => <AlbumIcon /> },
  { id: "share", labelKey: "remotePlay", color: "#8E24AA", textColor: "#FFFFFF", renderIcon: () => <GameShareIcon /> },
  { id: "controllers", labelKey: "controllers", color: "#2B2F33", textColor: "#FFFFFF", renderIcon: () => <ControllersIcon /> },
  { id: "cards", labelKey: "library", color: "#00897B", textColor: "#FFFFFF", renderIcon: () => <CardsIcon /> },
  { id: "settings", labelKey: "settings", color: "#546E7A", textColor: "#FFFFFF", renderIcon: () => <SettingsIcon /> },
  { id: "sleep", labelKey: "sleep", color: "#37474F", textColor: "#FFFFFF", renderIcon: () => <SleepIcon /> },
];

/* =========================================================================
   NINTENDO SWITCH 2 PROFILE AVATAR ICONS & BACKGROUNDS
   ========================================================================= */

export interface SwitchAvatarOption {
  id: string;
  name: string;
  category: "mario" | "zelda" | "pokemon" | "nintendo" | "special";
  render: () => ReactNode;
}

export const SWITCH_BG_COLORS = [
  { id: "mario_red", hex: "#E60012", name: "Mario Red" },
  { id: "joycon_red", hex: "#FF3853", name: "Neon Red" },
  { id: "eshop_orange", hex: "#FF7300", name: "eShop Orange" },
  { id: "pikachu_yellow", hex: "#FFD700", name: "Pikachu Yellow" },
  { id: "yoshi_green", hex: "#28B463", name: "Yoshi Green" },
  { id: "luigi_green", hex: "#008A20", name: "Luigi Green" },
  { id: "joycon_cyan", hex: "#00C3E3", name: "Neon Cyan" },
  { id: "zelda_blue", hex: "#00A0E9", name: "Sky Blue" },
  { id: "sonic_blue", hex: "#0055D4", name: "Cobalt Blue" },
  { id: "waluigi_purple", hex: "#8E24AA", name: "Waluigi Purple" },
  { id: "peach_pink", hex: "#FF4081", name: "Peach Pink" },
  { id: "slate_gray", hex: "#546E7A", name: "Slate Gray" },
  { id: "charcoal_black", hex: "#263238", name: "Dark Charcoal" },
  { id: "pure_white", hex: "#FFFFFF", name: "Pure White" },
  { id: "gold_amber", hex: "#D4AF37", name: "Golden Star" },
];

export const SWITCH_AVATARS: SwitchAvatarOption[] = [
  // Super Mario
  {
    id: "mario",
    name: "Mario",
    category: "mario",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Mario Cap */}
        <path d="M15,55 Q50,20 85,55 Q95,68 80,72 Q50,70 20,72 Q5,68 15,55 Z" fill="#E60012" />
        <path d="M10,65 Q50,55 90,65 Q85,76 50,76 Q15,76 10,65 Z" fill="#B3000D" />
        {/* White Badge with M */}
        <circle cx="50" cy="46" r="16" fill="#FFFFFF" />
        <path d="M40,54 L40,38 L45,38 L50,46 L55,38 L60,38 L60,54 L55,54 L55,44 L51,51 L49,51 L45,44 L45,54 Z" fill="#E60012" />
      </svg>
    ),
  },
  {
    id: "luigi",
    name: "Luigi",
    category: "mario",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Luigi Cap */}
        <path d="M15,55 Q50,20 85,55 Q95,68 80,72 Q50,70 20,72 Q5,68 15,55 Z" fill="#00A82D" />
        <path d="M10,65 Q50,55 90,65 Q85,76 50,76 Q15,76 10,65 Z" fill="#007A20" />
        {/* White Badge with L */}
        <circle cx="50" cy="46" r="16" fill="#FFFFFF" />
        <path d="M43,38 L49,38 L49,50 L58,50 L58,54 L43,54 Z" fill="#00A82D" />
      </svg>
    ),
  },
  {
    id: "peach",
    name: "Princess Peach",
    category: "mario",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Golden Crown */}
        <polygon points="20,70 22,42 38,58 50,30 62,58 78,42 80,70" fill="#FFD700" stroke="#E6A800" strokeWidth="2" />
        <rect x="20" y="70" width="60" height="8" rx="2" fill="#E6A800" />
        {/* Jewels */}
        <circle cx="50" cy="62" r="5.5" fill="#E60012" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="32" cy="64" r="4" fill="#00A0E9" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="68" cy="64" r="4" fill="#00A0E9" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "bowser",
    name: "Bowser",
    category: "mario",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Spiked Shell */}
        <ellipse cx="50" cy="54" rx="34" ry="28" fill="#2E7D32" stroke="#FF9800" strokeWidth="6" />
        {/* Spikes */}
        <polygon points="50,20 44,38 56,38" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2" />
        <polygon points="28,34 26,50 38,46" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2" />
        <polygon points="72,34 62,46 74,50" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2" />
        <polygon points="34,60 30,74 44,70" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2" />
        <polygon points="66,60 56,70 70,74" fill="#FFFFFF" stroke="#8D6E63" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "yoshi",
    name: "Yoshi",
    category: "mario",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Yoshi Egg */}
        <ellipse cx="50" cy="52" rx="30" ry="38" fill="#FFFFFF" />
        {/* Green spots */}
        <circle cx="44" cy="38" r="12" fill="#00B020" />
        <circle cx="66" cy="62" r="10" fill="#00B020" />
        <circle cx="32" cy="68" r="8" fill="#00B020" />
      </svg>
    ),
  },
  {
    id: "toad",
    name: "Toad",
    category: "mario",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Mushroom Cap */}
        <path d="M18,58 C18,30 82,30 82,58 C82,68 76,74 50,74 C24,74 18,68 18,58 Z" fill="#FFFFFF" />
        {/* Red spots */}
        <circle cx="50" cy="46" r="14" fill="#E60012" />
        <path d="M18,54 C18,44 26,48 28,58 C26,64 18,62 18,54 Z" fill="#E60012" />
        <path d="M82,54 C82,44 74,48 72,58 C74,64 82,62 82,54 Z" fill="#E60012" />
      </svg>
    ),
  },
  {
    id: "dk",
    name: "Donkey Kong",
    category: "mario",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Red Necktie */}
        <polygon points="50,18 64,28 58,74 50,86 42,74 36,28" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2" />
        {/* Yellow DK Logo */}
        <text x="50" y="58" fontSize="24" fontWeight="900" textAnchor="middle" fill="#FFEB3B" fontFamily="sans-serif">
          DK
        </text>
      </svg>
    ),
  },

  // The Legend of Zelda
  {
    id: "triforce",
    name: "Triforce",
    category: "zelda",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Golden Triforce */}
        <polygon points="50,18 20,72 80,72" fill="#FFD700" stroke="#C59B00" strokeWidth="2" />
        {/* Inverted center triangle cut */}
        <polygon points="50,72 35,45 65,45" fill="#1C1C1E" />
      </svg>
    ),
  },
  {
    id: "hylian_crest",
    name: "Hylian Crest",
    category: "zelda",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Triforce Top */}
        <polygon points="50,16 38,36 62,36" fill="#FFD700" />
        <polygon points="38,36 26,56 50,56" fill="#FFD700" />
        <polygon points="62,36 50,56 74,56" fill="#FFD700" />
        {/* Crimson Loftwing wings */}
        <path
          d="M50,52 C35,62 16,56 12,68 C24,68 36,76 50,86 C64,76 76,68 88,68 C84,56 65,62 50,52 Z"
          fill="#FFD700"
        />
      </svg>
    ),
  },
  {
    id: "master_sword",
    name: "Master Sword",
    category: "zelda",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Blade */}
        <polygon points="50,12 54,64 46,64" fill="#E0F7FA" stroke="#0097A7" strokeWidth="1" />
        <line x1="50" y1="12" x2="50" y2="64" stroke="#00BCD4" strokeWidth="1.5" />
        {/* Hilt / Crossguard */}
        <path d="M30,62 Q50,70 70,62 L74,68 Q50,76 26,68 Z" fill="#303F9F" />
        <circle cx="50" cy="69" r="3" fill="#FFD700" />
        {/* Grip and pommel */}
        <rect x="47" y="70" width="6" height="15" fill="#00838F" />
        <circle cx="50" cy="87" r="4" fill="#FFD700" />
      </svg>
    ),
  },

  // Pokémon & Kirby
  {
    id: "pokeball",
    name: "Pokéball",
    category: "pokemon",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="38" fill="#FFFFFF" stroke="#212121" strokeWidth="5" />
        {/* Top Red Half */}
        <path d="M12,50 A38,38 0 0,1 88,50 Z" fill="#E60012" />
        {/* Black dividing line */}
        <line x1="12" y1="50" x2="88" y2="50" stroke="#212121" strokeWidth="6" />
        {/* Center button */}
        <circle cx="50" cy="50" r="12" fill="#212121" />
        <circle cx="50" cy="50" r="7" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "pikachu",
    name: "Pikachu",
    category: "pokemon",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Ears */}
        <polygon points="26,38 10,10 38,24" fill="#FFD700" />
        <polygon points="10,10 18,20 23,15" fill="#212121" />
        <polygon points="74,38 90,10 62,24" fill="#FFD700" />
        <polygon points="90,10 82,20 77,15" fill="#212121" />
        {/* Face */}
        <circle cx="50" cy="58" r="30" fill="#FFD700" />
        {/* Red Cheeks */}
        <circle cx="28" cy="64" r="6" fill="#FF1744" />
        <circle cx="72" cy="64" r="6" fill="#FF1744" />
        {/* Eyes */}
        <circle cx="38" cy="52" r="4" fill="#212121" />
        <circle cx="37" cy="50" r="1.5" fill="#FFFFFF" />
        <circle cx="62" cy="52" r="4" fill="#212121" />
        <circle cx="61" cy="50" r="1.5" fill="#FFFFFF" />
        {/* Mouth */}
        <path d="M44,62 Q50,66 56,62" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "kirby",
    name: "Kirby",
    category: "pokemon",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Body */}
        <circle cx="50" cy="54" r="34" fill="#FF80AB" />
        {/* Blush */}
        <ellipse cx="28" cy="58" rx="6" ry="3" fill="#FF4081" />
        <ellipse cx="72" cy="58" rx="6" ry="3" fill="#FF4081" />
        {/* Big Kirby Eyes */}
        <ellipse cx="40" cy="46" rx="4" ry="9" fill="#212121" />
        <circle cx="40" cy="41" r="2.5" fill="#FFFFFF" />
        <path d="M37,48 A3,3 0 0,0 43,48 Z" fill="#00A0E9" />
        <ellipse cx="60" cy="46" rx="4" ry="9" fill="#212121" />
        <circle cx="60" cy="41" r="2.5" fill="#FFFFFF" />
        <path d="M57,48 A3,3 0 0,0 63,48 Z" fill="#00A0E9" />
        {/* Open Smile */}
        <path d="M45,60 Q50,70 55,60 Z" fill="#D81B60" />
      </svg>
    ),
  },
  {
    id: "star",
    name: "Warp Star",
    category: "pokemon",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* 5-pointed star */}
        <polygon
          points="50,15 61,38 86,40 67,58 73,83 50,69 27,83 33,58 14,40 39,38"
          fill="#FFD700"
          stroke="#FFA000"
          strokeWidth="3"
        />
        {/* Center sparkle */}
        <circle cx="50" cy="50" r="6" fill="#FFFDE7" />
      </svg>
    ),
  },

  // Nintendo Franchises & Hardware
  {
    id: "samus",
    name: "Screw Attack",
    category: "nintendo",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Metroid Screw Attack Lightning S */}
        <circle cx="50" cy="50" r="36" fill="#FF5722" stroke="#FFD54F" strokeWidth="5" />
        <polygon points="58,18 36,46 48,46 38,82 66,48 52,48" fill="#FFEB3B" stroke="#E65100" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "squid",
    name: "Inkling Squid",
    category: "nintendo",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Splatoon Squid */}
        <path
          d="M50,16 C30,30 24,56 26,78 L34,74 L42,86 L50,76 L58,86 L66,74 L74,78 C76,56 70,30 50,16 Z"
          fill="#00E676"
        />
        {/* Eyes mask */}
        <ellipse cx="40" cy="52" rx="7" ry="10" fill="#212121" />
        <circle cx="40" cy="52" r="4" fill="#FFFFFF" />
        <circle cx="40" cy="52" r="2" fill="#212121" />
        <ellipse cx="60" cy="52" rx="7" ry="10" fill="#212121" />
        <circle cx="60" cy="52" r="4" fill="#FFFFFF" />
        <circle cx="60" cy="52" r="2" fill="#212121" />
      </svg>
    ),
  },
  {
    id: "ac_leaf",
    name: "Animal Crossing",
    category: "nintendo",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Tom Nook Leaf with cutout notch */}
        <path
          d="M50,16 C76,24 86,52 74,74 C62,90 32,84 22,66 C14,50 26,24 50,16 Z"
          fill="#4CAF50"
        />
        <circle cx="64" cy="54" r="9" fill="#1C1C1E" />
        <line x1="32" y1="76" x2="68" y2="28" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "switch2",
    name: "Nintendo Switch 2",
    category: "special",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Switch 2 Console Mark */}
        <rect x="18" y="18" width="28" height="64" rx="14" fill="#00C3E3" />
        <circle cx="32" cy="38" r="6" fill="#FFFFFF" />
        <path
          d="M54,18 L68,18 C75.7,18 82,24.3 82,32 L82,68 C82,75.7 75.7,82 68,82 L54,82 Z"
          fill="#FF3853"
        />
        <circle cx="68" cy="62" r="6" fill="#FFFFFF" />
        {/* Center glowing numeral '2' accent */}
        <circle cx="50" cy="50" r="10" fill="#212121" />
        <text x="50" y="55" fontSize="12" fontWeight="900" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">
          2
        </text>
      </svg>
    ),
  },
  {
    id: "joycons",
    name: "Joy-Cons",
    category: "special",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="22" y="18" width="24" height="64" rx="12" fill="#00C3E3" />
        <circle cx="34" cy="35" r="5" fill="#FFFFFF" />
        <circle cx="34" cy="55" r="3" fill="#FFFFFF" />
        <rect x="54" y="18" width="24" height="64" rx="12" fill="#FF3853" />
        <circle cx="66" cy="35" r="3" fill="#FFFFFF" />
        <circle cx="66" cy="55" r="5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: "nes",
    name: "Retro NES",
    category: "special",
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect x="15" y="30" width="70" height="40" rx="4" fill="#9E9E9E" stroke="#424242" strokeWidth="2" />
        <rect x="20" y="34" width="60" height="32" fill="#212121" />
        {/* D-Pad */}
        <polygon points="30,44 34,44 34,40 38,40 38,44 42,44 42,48 38,48 38,52 34,52 34,48 30,48" fill="#757575" />
        {/* Red Buttons */}
        <circle cx="64" cy="52" r="3.5" fill="#E60012" />
        <circle cx="72" cy="52" r="3.5" fill="#E60012" />
      </svg>
    ),
  },
  {
    id: "steam",
    name: "Steam Profile",
    category: "special",
    render: () => (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5em", color: "#FFFFFF" }}>
        <FaSteam />
      </div>
    ),
  },
];

/** Component to render the user's avatar (custom Switch 2 avatar or Steam avatar fallback) */
export function SwitchAvatar({
  avatar,
  steamAvatar,
  className,
  size,
}: {
  avatar?: { enabled: boolean; iconId: string; bgColor: string };
  steamAvatar?: string;
  className?: string;
  size?: string;
}) {
  const isCustom = avatar?.enabled && avatar.iconId && avatar.iconId !== "steam";
  const selectedIcon = isCustom ? SWITCH_AVATARS.find((a) => a.id === avatar.iconId) : null;

  if (isCustom && selectedIcon) {
    return (
      <div
        className={className}
        style={{
          backgroundColor: avatar.bgColor,
          width: size,
          height: size,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "0 0.4vh 1.2vh rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ width: "72%", height: "72%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {selectedIcon.render()}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden" }}>
      {steamAvatar ? (
        <img src={steamAvatar} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FaSteam />
        </div>
      )}
    </div>
  );
}
