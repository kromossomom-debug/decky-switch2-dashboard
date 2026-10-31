import { callable, fetchNoCors } from "@decky/api";
import { useEffect, useState } from "react";
import { t } from "./i18n";
import type { NsoParts } from "./settings";

/**
 * Nintendo Switch Online user icons, built like the console builds them (and like nso-icon-tool does): a background,
 * a character on it and a frame on top. The parts come from henry-debruin/nso-icons, the same collection nso-icon-tool
 * downloads. It's ~470 MB, so nothing is shipped with the plugin: the backend caches the file list, the pictures load
 * from GitHub as you browse, and the icon you save is kept on the Deck as one PNG.
 */

export type NsoPart = "characters" | "frames" | "backgrounds";

export interface NsoCollection {
  id: string;
  /** Paths relative to the collection, e.g. "characters/NSc001.png". */
  characters: string[];
  frames: string[];
  backgrounds: string[];
}

export interface NsoIndex {
  collections: NsoCollection[];
  error?: string;
}

export const NSO_SOURCE = "https://github.com/henry-debruin/nso-icons";
const RAW = "https://raw.githubusercontent.com/henry-debruin/nso-icons/main/";
/** The console's own default icon, used when you open the editor for the first time. */
export const NSO_DEFAULT: NsoParts = {
  character: "default/characters/NSc001.png",
  frame: "default/frames/NSf001.png",
  background: "default/backgrounds/NSd001.png",
};
const SIZE = 256;

export const getNsoIndex = callable<[refresh?: boolean], NsoIndex>("get_nso_index");
const getAvatar = callable<[], string>("get_avatar");
const saveAvatar = callable<[dataUrl: string], boolean>("save_avatar");

export function nsoUrl(path: string): string {
  return RAW + path.split("/").map(encodeURIComponent).join("/");
}

/** Repository path of a part listed in a collection. */
export function nsoPath(collection: NsoCollection, rel: string): string {
  return `${collection.id}/${rel}`;
}

const WORDS: Record<string, string> = {
  pokemon: "Pokémon",
  kirbys: "Kirby's",
  bowsers: "Bowser's",
  luigis: "Luigi's",
  fzero: "F-Zero",
  warioware: "WarioWare",
  earthbound: "EarthBound",
  mother3: "Mother 3",
  xenoblade: "Xenoblade",
  hd: "HD",
  nes: "NES",
  rpg: "RPG",
  dk: "DK",
  za: "Z-A",
  "3d": "3D",
  x: "x",
};
const SMALL = new Set(["and", "the", "of", "to", "in"]);

/** "kirbys-return-to-dream-land-deluxe" -> "Kirby's Return to Dream Land Deluxe". */
export function collectionName(id: string): string {
  if (id === "default") return t.nsoDefault;
  return id
    .split("-")
    .map((w, i) => WORDS[w] ?? (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Which collection a part's repository path belongs to. */
export function collectionOf(path: string): string {
  return path.split("/")[0] ?? "";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

/** Loads a part so it can be drawn on a canvas, going through Decky's backend if Steam won't load it directly. */
async function loadPart(path: string, release: string[]): Promise<HTMLImageElement> {
  try {
    return await loadImage(nsoUrl(path));
  } catch {
    const res = await fetchNoCors(nsoUrl(path));
    if (!res.ok) throw new Error(`could not download ${path}: ${res.status}`);
    const url = URL.createObjectURL(await res.blob());
    release.push(url);
    return loadImage(url);
  }
}

/**
 * The console's default frames have no transparency: a flat light circle marks where the background and character
 * show through. Cuts that circle out (with a soft edge) so they stack like the other frames.
 */
function cutFrameWindow(ctx: CanvasRenderingContext2D) {
  const image = ctx.getImageData(0, 0, SIZE, SIZE);
  const d = image.data;
  const c = SIZE / 2;
  const mid = (Math.floor(c) * SIZE + Math.floor(c)) * 4;
  if (d[mid + 3] < 255) return; // already see-through in the middle
  const key = [d[mid], d[mid + 1], d[mid + 2]];
  let radius = 0;
  for (let x = Math.floor(c); x < SIZE; x++) {
    const i = (Math.floor(c) * SIZE + x) * 4;
    if (Math.abs(d[i] - key[0]) + Math.abs(d[i + 1] - key[1]) + Math.abs(d[i + 2] - key[2]) > 24) break;
    radius = x - c;
  }
  // One pixel wider than the flat area, so its anti-aliased rim goes too.
  radius += 1;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dist = Math.hypot(x + 0.5 - c, y + 0.5 - c);
      const keep = Math.min(1, Math.max(0, dist - radius));
      if (keep < 1) d[(y * SIZE + x) * 4 + 3] = Math.round(d[(y * SIZE + x) * 4 + 3] * keep);
    }
  }
  ctx.putImageData(image, 0, 0);
}

/** Draws background, character and frame into one 256x256 PNG data URL. */
export async function composeNso(parts: NsoParts): Promise<string> {
  const release: string[] = [];
  try {
    const [background, character, frame] = await Promise.all(
      [parts.background, parts.character, parts.frame].map((p) => (p ? loadPart(p, release) : Promise.resolve(null))),
    );
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("no 2D canvas");
    ctx.imageSmoothingQuality = "high";
    if (background) ctx.drawImage(background, 0, 0, SIZE, SIZE);
    if (character) ctx.drawImage(character, 0, 0, SIZE, SIZE);
    if (frame) {
      const layer = document.createElement("canvas");
      layer.width = layer.height = SIZE;
      const lctx = layer.getContext("2d", { willReadFrequently: true });
      if (!lctx) throw new Error("no 2D canvas");
      lctx.imageSmoothingQuality = "high";
      lctx.drawImage(frame, 0, 0, SIZE, SIZE);
      cutFrameWindow(lctx);
      ctx.drawImage(layer, 0, 0);
    }
    return canvas.toDataURL("image/png");
  } finally {
    release.forEach((u) => URL.revokeObjectURL(u));
  }
}

/* ---------- the saved icon, shared by every place that shows your avatar ---------- */

let image = "";
const listeners = new Set<(src: string) => void>();

function publish(src: string) {
  image = src;
  listeners.forEach((l) => l(src));
}

/** Reads the saved icon from the backend (once, when the plugin loads). */
export function loadNsoAvatar() {
  getAvatar()
    .then(publish)
    .catch((e) => console.error("[switch2-dashboard] could not load the icon", e));
}

/** Saves the icon to the Deck and shows it everywhere right away. */
export async function storeNsoAvatar(dataUrl: string): Promise<boolean> {
  publish(dataUrl);
  return saveAvatar(dataUrl);
}

export function useNsoAvatar(): string {
  const [src, setSrc] = useState(image);
  useEffect(() => {
    listeners.add(setSrc);
    setSrc(image);
    return () => {
      listeners.delete(setSrc);
    };
  }, []);
  return src;
}
