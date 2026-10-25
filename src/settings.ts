import type { TileArt } from "./steam";

export interface Settings {
  enabled: boolean;
  theme: "black" | "white";
  tileArt: TileArt;
  /** Software tiles before "All Software" (the console shows up to 12). */
  count: number;
  hideBars: boolean;
  clock24: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  theme: "black",
  tileArt: "portrait",
  count: 12,
  hideBars: true,
  clock24: true,
};

export function withDefaults(stored: Partial<Settings> | null | undefined): Settings {
  return { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
}
