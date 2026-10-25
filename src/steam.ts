import { Navigation, Router, findModuleByExport, showContextMenu } from "@decky/ui";
import { createElement } from "react";

/** Steam's own stores and client API. Typed loosely: their shapes change between client updates. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as unknown as Record<string, any>;

export interface App {
  appid: number;
  gameid?: string;
  display_name: string;
  app_type: number;
  installed: boolean;
  rt_last_time_played?: number;
  minutes_playtime_forever?: number;
}

const APP_TYPE_GAME = 1;
const APP_TYPE_SOFTWARE = 2;
export const APP_TYPE_SHORTCUT = 1073741824;
const LISTED_TYPES = new Set([APP_TYPE_GAME, APP_TYPE_SOFTWARE, APP_TYPE_SHORTCUT]);
const CDN = "https://shared.steamstatic.com/store_item_assets/steam/apps";
/** Steam's ELaunchSource for a launch started from the library. */
const LAUNCH_SOURCE = 100;

/** The plugin's own All Software screen. */
export const ALL_SOFTWARE_ROUTE = "/switch2-dashboard/all-software";

export const ROUTES = {
  library: "/library",
  media: "/media/grid",
  settings: "/settings",
  controllers: "/settings/controller",
  remotePlay: "/settings/remoteplay",
};

const byRecent = (a: App, b: App) => (b.rt_last_time_played ?? 0) - (a.rt_last_time_played ?? 0);

function collection(id: string): App[] {
  try {
    return [...(w.collectionStore.GetCollection(id)?.visibleApps ?? [])];
  } catch {
    return [];
  }
}

/** The software row: most recently played first, like the HOME Menu. */
export function recentApps(limit: number): App[] {
  let list: App[] = [];
  try {
    list = [...(w.collectionStore.recentAppsCollection?.visibleApps ?? [])].filter((a: App) =>
      LISTED_TYPES.has(a.app_type),
    );
  } catch {
    // fall through to the library sorted by last played
  }
  if (list.length === 0) list = collection("type-games").sort(byRecent).filter((a) => a.rt_last_time_played);
  return list.slice(0, limit);
}

export type SortOrder = "recent" | "playtime" | "title";

const SORTS: Record<SortOrder, (a: App, b: App) => number> = {
  recent: byRecent,
  playtime: (a, b) => (b.minutes_playtime_forever ?? 0) - (a.minutes_playtime_forever ?? 0) || byRecent(a, b),
  title: (a, b) => a.display_name.localeCompare(b.display_name, undefined, { sensitivity: "base" }),
};

/** All Software: every game and app in the library (Steam's tools, like Proton, are left out). */
export function libraryApps(sort: SortOrder): App[] {
  const seen = new Set<number>();
  return [...collection("type-games"), ...collection("type-software")]
    .filter((a) => LISTED_TYPES.has(a.app_type) && !seen.has(a.appid) && seen.add(a.appid))
    .sort(SORTS[sort]);
}

export const isPlayable = (app: App) => Boolean(app.installed) || app.app_type === APP_TYPE_SHORTCUT;

function custom(fn: string, app: App): string[] {
  try {
    const urls = w.appStore[fn]?.(app);
    return Array.isArray(urls) ? urls : typeof urls === "string" ? [urls] : [];
  } catch {
    return [];
  }
}

function steamAsset(app: App, file: string): string[] {
  if (app.app_type === APP_TYPE_SHORTCUT) return [];
  return [`/assets/${app.appid}/${file}`, `${CDN}/${app.appid}/${file}`];
}

export type TileArt = "portrait" | "landscape" | "hero";

/** Candidate images for a square tile, best first (custom SteamGridDB art wins over Steam's). */
export function tileUrls(app: App, art: TileArt): string[] {
  const portrait = [
    ...custom("GetCustomVerticalCapsuleURLs", app),
    ...custom("GetCachedVerticalCapsuleURL", app),
    ...steamAsset(app, "library_600x900.jpg"),
  ];
  const landscape = [...custom("GetCustomLandcapeImageURLs", app), ...steamAsset(app, "header.jpg")];
  const hero = [...custom("GetCustomHeroImageURLs", app), ...steamAsset(app, "library_hero.jpg")];
  if (art === "hero") return [...hero, ...portrait];
  if (art === "landscape") return [...landscape, ...portrait];
  return [...portrait, ...landscape];
}

export function runningAppId(): number | undefined {
  try {
    return Router.MainRunningAppID;
  } catch {
    return undefined;
  }
}

export function openDetails(app: App) {
  Navigation.Navigate(`/library/app/${app.appid}`);
}

/** A (Start): launch the game, or go back to it / open its page when it can't start right away. */
export function launch(app: App) {
  if (!isPlayable(app) || runningAppId() === app.appid) {
    openDetails(app);
    return;
  }
  try {
    w.SteamClient.Apps.RunGame(app.gameid ?? String(app.appid), "", -1, LAUNCH_SOURCE);
  } catch (e) {
    console.error("[switch2-dashboard] RunGame failed", e);
    openDetails(app);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let gameMenu: { component: any; options: any } | null | undefined;
function findGameMenu() {
  if (gameMenu !== undefined) return gameMenu;
  gameMenu = null;
  try {
    // The module that builds the library's game menu (the one SteamGridDB hooks for "Change artwork").
    const isOptions = (e: unknown) => typeof e === "function" && String(e).includes("().LibraryContextMenu");
    const mod = findModuleByExport(isOptions);
    const exports: unknown[] = mod ? Object.values(mod) : [];
    const component = exports.find((e) => typeof e === "function" && String(e).includes("navigator:"));
    if (component) gameMenu = { component, options: exports.find(isOptions) };
  } catch (e) {
    console.error("[switch2-dashboard] game menu not found", e);
  }
  return gameMenu;
}

/** (+) Options: Steam's own game menu, with whatever other plugins add to it. Falls back to the game page. */
export function openGameMenu(app: App, anchor?: EventTarget | null) {
  const menu = findGameMenu();
  if (menu) {
    try {
      const props = { overview: app, client: "mostavailable", launchSource: LAUNCH_SOURCE, bInGamepadUI: true };
      showContextMenu(createElement(menu.component, props), anchor ?? undefined, menu.options?.());
      return;
    } catch (e) {
      console.error("[switch2-dashboard] game menu failed", e);
    }
  }
  openDetails(app);
}

export function persona(): { name: string; avatar?: string } {
  try {
    const p = w.friendStore.m_FriendsUIFriendStore.self.m_persona;
    return { name: p.m_strPlayerName ?? "", avatar: p.avatar_url_full ?? p.avatar_url_medium };
  } catch {
    return { name: "" };
  }
}

export interface Battery {
  level: number;
  charging: boolean;
}

export function onBattery(cb: (b: Battery) => void): () => void {
  try {
    const h = w.SteamClient.System.RegisterForBatteryStateChanges(
      (s: { bHasBattery: boolean; flLevel: number; eACState: number }) => {
        if (s.bHasBattery) cb({ level: Math.round(s.flLevel * 100), charging: s.eACState === 2 });
      },
    );
    return () => h?.unregister?.();
  } catch {
    return () => {};
  }
}

export function isOnline(): boolean {
  try {
    const n = w.SystemNetworkStore;
    if (n) return Boolean(n.hasInternetConnection ?? n.hasNetworkConnection);
  } catch {
    // use the browser's view below
  }
  return navigator.onLine;
}

/** Sleep Mode: suspend right away like the console does; the Power menu if Steam won't. */
export function sleep() {
  try {
    w.SteamClient.System.SuspendPC();
  } catch {
    Navigation.OpenPowerMenu();
  }
}

export const openStore = () => Navigation.NavigateToSteamWeb("https://store.steampowered.com/");
export const openNews = () => Navigation.NavigateToSteamWeb("https://store.steampowered.com/news/");
export const openCommunity = () => Navigation.NavigateToSteamWeb("https://steamcommunity.com/");
export const openProfile = () => Navigation.NavigateToSteamWeb("https://steamcommunity.com/my/");
