import type { TileArt } from "./steam";

export interface CustomAvatar {
  enabled: boolean;
  iconId: string;
  bgColor: string;
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
