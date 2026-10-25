import { Focusable, GamepadEvent, NavEntryPositionPreferences, Navigation, classMap } from "@decky/ui";
import { Component, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { FaSteam } from "react-icons/fa";
import {
  MdCast,
  MdChatBubble,
  MdCloudDownload,
  MdNewspaper,
  MdPerson,
  MdPhotoLibrary,
  MdPlayArrow,
  MdPowerSettingsNew,
  MdSdCard,
  MdSettings,
  MdShoppingBag,
  MdSportsEsports,
  MdWifi,
  MdWifiOff,
} from "react-icons/md";
import { t } from "./i18n";
import { Settings } from "./settings";
import {
  ALL_SOFTWARE_ROUTE,
  App,
  MY_PAGE_ROUTE,
  Battery,
  ROUTES,
  isOnline,
  isPlayable,
  launch,
  onBattery,
  openCommunity,
  openGameMenu,
  openNews,
  openStore,
  persona,
  recentApps,
  runningAppId,
  sleep,
  tileUrls,
} from "./steam";
import { HOME_CSS, barsCss } from "./styles";

export const FOCUSED = "s2d-focused";
/** Room kept between the selected tile and the edge of the screen when a row or grid scrolls, in px. */
const EDGE_PAD = 64;

/** An <img> that walks through candidate URLs until one loads, then shows `fallback`. */
function Art({ sources, fallback }: { sources: string[]; fallback: ReactNode }) {
  const key = sources.join("|");
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [key]);
  if (index >= sources.length) return <>{fallback}</>;
  return (
    <img
      src={sources[index]}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

/**
 * Scrolls `box` along one axis just enough to keep `el` (and a bit of what's next) on screen; returns how far it
 * scrolls. Smooth scrolling only reaches the target later, so callers get the distance up front.
 */
function keepInView(box: HTMLElement, el: HTMLElement, axis: "x" | "y"): number {
  const c = box.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const [start, end, cStart, cEnd] = axis === "x" ? [r.left, r.right, c.left, c.right] : [r.top, r.bottom, c.top, c.bottom];
  let delta = 0;
  if (start < cStart + EDGE_PAD) delta = start - cStart - EDGE_PAD;
  else if (end > cEnd - EDGE_PAD) delta = end - cEnd + EDGE_PAD;
  const pos = axis === "x" ? box.scrollLeft : box.scrollTop;
  const max = axis === "x" ? box.scrollWidth - box.clientWidth : box.scrollHeight - box.clientHeight;
  const target = Math.min(max, Math.max(0, pos + delta));
  delta = target - pos;
  if (delta) {
    if (axis === "x") box.scrollLeft = target;
    else box.scrollTop = target;
  }
  return delta;
}

/** Slides a long title left so it ends at the screen's edge instead of running off it, like the console. */
function fitLabel(box: HTMLElement, el: HTMLElement, scrolledX: number) {
  const label = el.querySelector<HTMLElement>(":scope > .s2d-label");
  if (!label) return;
  label.style.transform = "";
  // The row's and the grid's side padding is where their tiles end, so titles end there too.
  const edge = box.getBoundingClientRect().right - parseFloat(getComputedStyle(box).paddingRight);
  const over = label.getBoundingClientRect().right - scrolledX - edge;
  if (over > 0) label.style.transform = `translateX(${-over}px)`;
}

/**
 * Steam marks the focused element with `focusClassName`; watching for that class is the one signal that always
 * arrives, whatever moved the focus. Keeps the selected tile on screen as its row (x) or grid (y) scrolls.
 */
export function useFollowFocus(ref: RefObject<HTMLElement | null>, axis: "x" | "y") {
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const observer = new MutationObserver((records) => {
      for (const rec of records) {
        const target = rec.target as HTMLElement;
        const was = (rec.oldValue ?? "").split(" ").includes(FOCUSED);
        if (was || !target.classList.contains(FOCUSED)) continue;
        const scrolled = keepInView(box, target, axis);
        fitLabel(box, target, axis === "x" ? scrolled : 0);
      }
    });
    observer.observe(box, { subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true });
    return () => observer.disconnect();
  }, [ref, axis]);
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="s2d-label">{children}</div>;
}

/** A square software tile. In All Software, games that aren't installed are dimmed with a cloud, like archived software. */
export function GameTile({ app, art, first, archive }: { app: App; art: Settings["tileArt"]; first?: boolean; archive?: boolean }) {
  const running = runningAppId() === app.appid;
  const playable = isPlayable(app);
  const archived = archive && !playable;
  return (
    <Focusable
      className={`s2d-tile ${archived ? "s2d-archived" : ""}`}
      focusClassName={FOCUSED}
      noFocusRing
      preferredFocus={first}
      onActivate={() => launch(app)}
      onOKActionDescription={running ? t.resume : playable ? t.start : t.open}
      onMenuButton={(e: GamepadEvent) => openGameMenu(app, e.currentTarget)}
      onMenuActionDescription={t.options}
    >
      <Label>{app.display_name}</Label>
      <div className="s2d-tile-art">
        <Art sources={tileUrls(app, art)} fallback={<div className="s2d-tile-text">{app.display_name}</div>} />
      </div>
      {running && (
        <div className="s2d-badge">
          <MdPlayArrow />
        </div>
      )}
      {archived && (
        <div className="s2d-badge" title={t.notInstalled}>
          <MdCloudDownload />
        </div>
      )}
    </Focusable>
  );
}

function AllSoftwareTile({ first }: { first: boolean }) {
  return (
    <Focusable
      className="s2d-tile s2d-all"
      focusClassName={FOCUSED}
      noFocusRing
      preferredFocus={first}
      onActivate={() => Navigation.Navigate(ALL_SOFTWARE_ROUTE)}
      onOKActionDescription={t.open}
    >
      <Label>{t.allSoftware}</Label>
      <div className="s2d-tile-art">
        <div className="s2d-grid">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </Focusable>
  );
}

interface Shortcut {
  id: string;
  label: string;
  icon: ReactNode;
  go: () => void;
}

/** The bottom row, in the console's order, each mapped to its closest Steam feature. */
const SHORTCUTS: Shortcut[] = [
  { id: "online", label: t.online, icon: <FaSteam />, go: openCommunity },
  { id: "chat", label: t.chat, icon: <MdChatBubble />, go: () => Navigation.NavigateToChat() },
  { id: "news", label: t.news, icon: <MdNewspaper />, go: openNews },
  { id: "store", label: t.store, icon: <MdShoppingBag />, go: openStore },
  { id: "album", label: t.album, icon: <MdPhotoLibrary />, go: () => Navigation.Navigate(ROUTES.media) },
  { id: "share", label: t.remotePlay, icon: <MdCast />, go: () => Navigation.Navigate(ROUTES.remotePlay) },
  { id: "controllers", label: t.controllers, icon: <MdSportsEsports />, go: () => Navigation.Navigate(ROUTES.controllers) },
  { id: "cards", label: t.library, icon: <MdSdCard />, go: () => Navigation.Navigate(ROUTES.library) },
  { id: "settings", label: t.settings, icon: <MdSettings />, go: () => Navigation.Navigate(ROUTES.settings) },
  { id: "sleep", label: t.sleep, icon: <MdPowerSettingsNew />, go: sleep },
];

function RoundIcon({ s }: { s: Shortcut }) {
  return (
    <Focusable className="s2d-icon" focusClassName={FOCUSED} noFocusRing onActivate={s.go} onOKActionDescription={t.open}>
      <Label>{s.label}</Label>
      <div className="s2d-icon-face">{s.icon}</div>
    </Focusable>
  );
}

function useClock(h24: boolean) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    // Tick on the minute so the clock flips exactly when the system's does.
    let timer = window.setTimeout(function tick() {
      setNow(new Date());
      timer = window.setTimeout(tick, 60000 - (Date.now() % 60000));
    }, 60000 - (Date.now() % 60000));
    return () => window.clearTimeout(timer);
  }, []);
  const m = String(now.getMinutes()).padStart(2, "0");
  if (h24) return { time: `${now.getHours()}:${m}`, ampm: "" };
  const h = now.getHours() % 12 || 12;
  return { time: `${h}:${m}`, ampm: now.getHours() < 12 ? "AM" : "PM" };
}

export function Tray({ h24 }: { h24: boolean }) {
  const { time, ampm } = useClock(h24);
  const [battery, setBattery] = useState<Battery | null>(null);
  const [online, setOnline] = useState(isOnline);
  useEffect(() => onBattery(setBattery), []);
  useEffect(() => {
    const id = window.setInterval(() => setOnline(isOnline()), 5000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="s2d-tray">
      <div className="s2d-clock">
        {time}
        {ampm && <span className="s2d-ampm">{ampm}</span>}
      </div>
      <div className={`s2d-wifi ${online ? "" : "s2d-off"}`}>{online ? <MdWifi /> : <MdWifiOff />}</div>
      {battery && (
        <div className={`s2d-battery ${battery.charging ? "s2d-charging" : battery.level <= 15 ? "s2d-low" : ""}`}>
          <span>{battery.level}%</span>
          <div className="s2d-battery-icon">
            <div className="s2d-battery-fill" style={{ width: `${Math.max(4, battery.level)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBar({ h24 }: { h24: boolean }) {
  const me = useMemo(persona, []);
  return (
    <div className="s2d-status">
      <Focusable className="s2d-users" flow-children="row">
        <Focusable
          className="s2d-user"
          focusClassName={FOCUSED}
          noFocusRing
          onActivate={() => Navigation.Navigate(MY_PAGE_ROUTE)}
          onOKActionDescription={t.myPage}
        >
          <Label>{me.name || t.myPage}</Label>
          {me.avatar ? <img src={me.avatar} draggable={false} /> : <MdPerson />}
        </Focusable>
      </Focusable>
      <Tray h24={h24} />
    </div>
  );
}

/** A generic handheld outline: the "controllers in use" mark at the bottom left. */
function Handheld() {
  return (
    <svg className="s2d-handheld" viewBox="0 0 70 36" fill="none" stroke="currentColor" strokeWidth="3">
      <rect x="2" y="2" width="66" height="32" rx="10" />
      <rect x="18" y="7" width="34" height="22" rx="2" />
      <circle cx="10" cy="13" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="60" cy="23" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Button hints in the footer, as [glyph, label] pairs. */
export type Hints = [string, ReactNode][];

function Footer({ hints }: { hints: Hints }) {
  return (
    <div className="s2d-footer">
      <Handheld />
      <div className="s2d-hints">
        {hints.map(([glyph, label]) => (
          <div className="s2d-hint" key={glyph}>
            <span className="s2d-glyph">{glyph}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Class names of Steam's Game Mode header and footer, found by their (stable) key names. */
function steamBars(): { header: string[]; footer: string[] } {
  const pick = (keys: string[], key: string) => [
    ...new Set(
      classMap
        .filter((m) => keys.every((k) => typeof m?.[k] === "string"))
        .map((m) => m[key])
        .filter(Boolean),
    ),
  ];
  try {
    return {
      header: pick(["CurrentUserAvatar", "Clock", "HeaderOpaque", "Header"], "Header"),
      footer: pick(["BasicFooter", "FooterLegend"], "BasicFooter"),
    };
  } catch {
    return { header: [], footer: [] };
  }
}

/** True while `ref` is actually on screen (Steam keeps some pages mounted, hidden, in its back stack). */
function useVisible(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setVisible(entries.some((e) => e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

/** The frame both screens share: theme, stylesheet, Steam's bars hidden while on screen, and the footer. */
export function Screen({ settings, className, hints, children }: { settings: Settings; className?: string; hints: Hints; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useVisible(root);
  const bars = useMemo(steamBars, []);
  const hideBars = settings.hideBars && visible;
  return (
    <div ref={root} className={`s2d-root s2d-${settings.theme} ${settings.hideBars ? "" : "s2d-bars"} ${className ?? ""}`}>
      <style>{HOME_CSS + (hideBars ? barsCss(bars.header, bars.footer) : "")}</style>
      {children}
      {settings.hideBars && <Footer hints={hints} />}
    </div>
  );
}

export function SwitchHome({ settings }: { settings: Settings }) {
  const row = useRef<HTMLDivElement>(null);
  const apps = useMemo(() => recentApps(settings.count), [settings.count]);
  useFollowFocus(row, "x");

  return (
    <Screen settings={settings} hints={[["☰", t.options], ["A", t.start]]}>
      <Focusable className="s2d-main" flow-children="column">
        <StatusBar h24={settings.clock24} />
        <Focusable ref={row} className="s2d-row" flow-children="row">
          {apps.map((app, i) => (
            <GameTile key={app.appid} app={app} art={settings.tileArt} first={i === 0} />
          ))}
          <AllSoftwareTile first={apps.length === 0} />
          {apps.length === 0 && <div className="s2d-empty">{t.noSoftware}</div>}
        </Focusable>
        <Focusable className="s2d-icons" flow-children="row" navEntryPreferPosition={NavEntryPositionPreferences.MAINTAIN_X}>
          {SHORTCUTS.map((s) => (
            <RoundIcon key={s.id} s={s} />
          ))}
        </Focusable>
      </Focusable>
    </Screen>
  );
}

/** If a screen ever crashes, show `fallback` (Steam's own) instead of a blank page. */
export class Fallback extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[switch2-dashboard] screen crashed, showing Steam's", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
