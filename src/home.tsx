import { Focusable, GamepadEvent, NavEntryPositionPreferences, Navigation, classMap } from "@decky/ui";
import { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { FaSteam } from "react-icons/fa";
import {
  MdCast,
  MdChatBubble,
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
  App,
  APP_TYPE_SHORTCUT,
  Battery,
  ROUTES,
  isOnline,
  launch,
  onBattery,
  openCommunity,
  openGameMenu,
  openNews,
  openProfile,
  openStore,
  persona,
  recentApps,
  runningAppId,
  sleep,
  tileUrls,
} from "./steam";
import { HOME_CSS, barsCss } from "./styles";

const FOCUSED = "s2d-focused";
/** Room kept between the selected tile and the edge of the screen when the row scrolls, in px. */
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
      decoding="async"
      draggable={false}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

/** Scrolls the row just enough to keep `el` (and a bit of the next tile) on screen; returns how far it scrolls. */
function keepInView(row: HTMLElement, el: HTMLElement): number {
  const c = row.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  let delta = 0;
  if (r.left < c.left + EDGE_PAD) delta = r.left - c.left - EDGE_PAD;
  else if (r.right > c.right - EDGE_PAD) delta = r.right - c.right + EDGE_PAD;
  const max = row.scrollWidth - row.clientWidth;
  const target = Math.min(max, Math.max(0, row.scrollLeft + delta));
  delta = target - row.scrollLeft;
  // Smooth scrolling: scrollLeft only reaches `target` later, so callers get the distance up front.
  if (delta) row.scrollLeft = target;
  return delta;
}

/** Slides a long title left so it ends at the screen's edge instead of running off it, like the console. */
function fitLabel(row: HTMLElement, el: HTMLElement, scrolled: number) {
  const label = el.querySelector<HTMLElement>(":scope > .s2d-label");
  if (!label) return;
  label.style.transform = "";
  const over = label.getBoundingClientRect().right - scrolled - (row.getBoundingClientRect().right - EDGE_PAD);
  if (over > 0) label.style.transform = `translateX(${-over}px)`;
}

function Label({ children }: { children: ReactNode }) {
  return <div className="s2d-label">{children}</div>;
}

function GameTile({ app, art, first }: { app: App; art: Settings["tileArt"]; first: boolean }) {
  const running = runningAppId() === app.appid;
  const playable = app.installed || app.app_type === APP_TYPE_SHORTCUT;
  return (
    <Focusable
      className="s2d-tile"
      focusClassName={FOCUSED}
      noFocusRing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ preferredFocus: first } as any)}
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
        <div className="s2d-running">
          <MdPlayArrow />
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ preferredFocus: first } as any)}
      onActivate={() => Navigation.Navigate(ROUTES.library)}
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
    <Focusable
      className="s2d-icon"
      focusClassName={FOCUSED}
      noFocusRing
      onActivate={s.go}
      onOKActionDescription={t.open}
    >
      <Label>{s.label}</Label>
      <div className="s2d-icon-face">
        {s.icon}
      </div>
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

function Tray({ h24 }: { h24: boolean }) {
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
        <Focusable className="s2d-user" focusClassName={FOCUSED} noFocusRing onActivate={openProfile} onOKActionDescription={t.myPage}>
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

function Footer() {
  return (
    <div className="s2d-footer">
      <Handheld />
      <div className="s2d-hints">
        <div className="s2d-hint">
          <span className="s2d-glyph">☰</span>
          {t.options}
        </div>
        <div className="s2d-hint">
          <span className="s2d-glyph">A</span>
          {t.start}
        </div>
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

/**
 * Steam marks the focused element with `focusClassName`; watching for that class is the one signal that
 * always arrives, whatever moved the focus. Keeps the selected tile on screen as the row scrolls.
 */
function useFollowFocus(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver((records) => {
      for (const rec of records) {
        const target = rec.target as HTMLElement;
        const was = (rec.oldValue ?? "").split(" ").includes(FOCUSED);
        if (!was && target.classList.contains(FOCUSED)) fitLabel(el, target, keepInView(el, target));
      }
    });
    observer.observe(el, { subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true });
    return () => observer.disconnect();
  }, [ref]);
}

/** True while `ref` is actually on screen (Steam keeps some pages mounted, hidden, in its back stack). */
function useVisible(ref: React.RefObject<HTMLElement | null>) {
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

export function SwitchHome({ settings }: { settings: Settings }) {
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const visible = useVisible(root);
  const apps = useMemo(() => recentApps(settings.count), [settings.count]);
  const bars = useMemo(steamBars, []);
  const hideBars = settings.hideBars && visible;
  useFollowFocus(row);

  return (
    <div ref={root} className={`s2d-root s2d-${settings.theme} ${settings.hideBars ? "" : "s2d-bars"}`}>
      <style>{HOME_CSS + (hideBars ? barsCss(bars.header, bars.footer) : "")}</style>
      <Focusable className="s2d-main" flow-children="column">
        <StatusBar h24={settings.clock24} />
        <Focusable ref={row} className="s2d-row" flow-children="row">
          {apps.map((app, i) => (
            <GameTile key={app.appid} app={app} art={settings.tileArt} first={i === 0} />
          ))}
          <AllSoftwareTile first={apps.length === 0} />
          {apps.length === 0 && <div className="s2d-empty">{t.noSoftware}</div>}
        </Focusable>
        <Focusable
          className="s2d-icons"
          flow-children="row"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ navEntryPreferPosition: NavEntryPositionPreferences.MAINTAIN_X } as any)}
        >
          {SHORTCUTS.map((s) => (
            <RoundIcon key={s.id} s={s} />
          ))}
        </Focusable>
      </Focusable>
      {settings.hideBars && <Footer />}
    </div>
  );
}

/** If the HOME Menu ever crashes, show `fallback` (Steam's own home) instead of a blank page. */
export class Fallback extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[switch2-dashboard] HOME Menu crashed, showing Steam's", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
