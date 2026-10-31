import type { TileArt } from "./steam";

/** A Nintendo Switch Online icon: repository paths of its parts in henry-debruin/nso-icons ("" = none). */
export interface NsoParts {
  character: string;
  frame: string;
  background: string;
}

export interface CustomAvatar {
  enabled: boolean;
  /** One of SWITCH_AVATARS, "steam", or "nso" for an icon built from Nintendo Switch Online parts. */
  iconId: string;
  bgColor: string;
  /** The parts the "nso" icon was built from, so its editor reopens on them. */
  nso?: NsoParts;
}

export interface Settings {
  enabled: boolean;
  theme: "black" | "white";
  tileArt: TileArt;
  /** Software tiles before "All Software" (the console shows up to 12). */
  count: number;
  hideBars: boolean;
  clock24: boolean;
  /** Authentic Nintendo Switch 2 dock menu colors */
  iconColors: boolean;
  /** Custom Switch 2 Profile Avatar */
  customAvatar: CustomAvatar;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  theme: "black",
  tileArt: "portrait",
  count: 12,
  hideBars: true,
  clock24: true,
  iconColors: true,
  customAvatar: {
    enabled: false,
    iconId: "mario",
    bgColor: "#E60012",
  },
};

export function withDefaults(stored: Partial<Settings> | null | undefined): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...(stored ?? {}),
    customAvatar: {
      ...DEFAULT_SETTINGS.customAvatar,
      ...(stored?.customAvatar ?? {}),
    },
  };
}
