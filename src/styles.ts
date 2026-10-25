/**
 * The HOME Menu, laid out in vh so it scales with the screen: the Deck's 1280x800 and docked 1080p
 * both keep the console's proportions (status bar, software row, round icons, footer).
 */
export const HOME_CSS = `
.s2d-root {
  --bg: #2d2d2d;
  --text: #ffffff;
  --sub: rgba(255,255,255,0.62);
  --line: rgba(255,255,255,0.32);
  --circle: #3c3c3c;
  --glyph: #b4b4b4;
  --card: #404040;
  --gap: #2d2d2d;
  --accent: #00c3e3;
  --accent-hi: #63f2ff;
  --tile: 34vh;
  --radius: 1.6vh;
  position: absolute; top: 0; left: 0; width: 100%; height: 100vh;
  overflow: hidden; z-index: 1;
  background: var(--bg); color: var(--text);
  font-family: "Nunito Sans", "M PLUS 1p", "Motiva Sans", "Noto Sans", sans-serif;
  user-select: none;
}
.s2d-root.s2d-white {
  --bg: #ebebeb;
  --text: #2d2d2d;
  --sub: rgba(45,45,45,0.6);
  --line: rgba(45,45,45,0.25);
  --circle: #ffffff;
  --glyph: #6e6e6e;
  --card: #dcdcdc;
  --gap: #ebebeb;
  --accent: #0ab9e6;
  --accent-hi: #45dcff;
}
.s2d-root * { box-sizing: border-box; }
.s2d-root svg { display: block; }
.s2d-main { position: absolute; inset: 0; }

/* ---------- status bar: users on the left, clock / Wi-Fi / battery on the right ---------- */
.s2d-status {
  position: absolute; top: 4.2vh; left: 5vw; right: 5vw; height: 7.4vh;
  display: flex; align-items: center; justify-content: space-between;
}
.s2d-bars .s2d-status { top: calc(var(--s2d-header, 40px) + 1.5vh); }
.s2d-users { display: flex; gap: 1.6vh; }
.s2d-user {
  position: relative; width: 7.4vh; height: 7.4vh; border-radius: 50%;
  background: var(--circle); display: flex; align-items: center; justify-content: center;
  font-size: 4vh; color: var(--sub);
}
.s2d-user img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.s2d-user::after {
  content: ""; position: absolute; inset: -0.9vh; border-radius: 50%;
  border: 0.55vh solid var(--accent); opacity: 0;
}
.s2d-user.s2d-focused::after { opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out; }
.s2d-user .s2d-label { top: calc(100% + 1.4vh); left: 0; }

.s2d-tray { display: flex; align-items: center; gap: 2.2vh; font-size: 3.1vh; font-weight: 600; }
.s2d-bars .s2d-tray { display: none; }
.s2d-clock { letter-spacing: 0.02em; font-variant-numeric: tabular-nums; }
.s2d-ampm { font-size: 2vh; margin-left: 0.5vh; font-weight: 600; }
.s2d-wifi { font-size: 3.4vh; }
.s2d-wifi.s2d-off { opacity: 0.4; }
.s2d-battery { display: flex; align-items: center; gap: 0.9vh; font-size: 2.6vh; }
.s2d-battery-icon { position: relative; width: 4.8vh; height: 2.5vh; border: 0.32vh solid currentColor; border-radius: 0.6vh; padding: 0.3vh; }
.s2d-battery-icon::after {
  content: ""; position: absolute; right: -0.85vh; top: 0.55vh; width: 0.45vh; height: 0.8vh;
  background: currentColor; border-radius: 0 0.3vh 0.3vh 0;
}
.s2d-battery-fill { height: 100%; border-radius: 0.2vh; background: currentColor; }
.s2d-battery.s2d-low .s2d-battery-fill { background: #ff4b4b; }
.s2d-battery.s2d-charging .s2d-battery-fill { background: #3ccf4e; }

/* ---------- software row ---------- */
.s2d-row {
  position: absolute; left: 0; right: 0; top: 13.5vh;
  padding: 7vh 5vw 2.4vh 5vw;
  display: flex; gap: 1.8vh;
  overflow: hidden; scroll-behavior: smooth;
}
.s2d-bars .s2d-row { top: calc(var(--s2d-header, 40px) + 9vh); }
.s2d-row::after { content: ""; flex: 0 0 4vw; }
.s2d-tile {
  position: relative; flex: 0 0 var(--tile); width: var(--tile); height: var(--tile);
  border-radius: var(--radius);
}
.s2d-tile-art {
  position: absolute; inset: 0; border-radius: var(--radius); overflow: hidden;
  background: var(--card);
  box-shadow: 0 0.4vh 1.2vh rgba(0,0,0,0.25);
}
.s2d-tile-art img { width: 100%; height: 100%; object-fit: cover; object-position: center 22%; }
.s2d-tile-text {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  padding: 2vh; text-align: center; font-size: 2.6vh; font-weight: 700; color: var(--text);
}
.s2d-tile::after {
  content: ""; position: absolute; inset: -1.25vh; border-radius: calc(var(--radius) + 1.25vh);
  border: 0.62vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-tile.s2d-focused::after { opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out; }
.s2d-tile .s2d-label {
  bottom: calc(100% + 2vh); left: -0.2vh; font-size: 3vh; font-weight: 700;
  max-width: 80vw; overflow: hidden; text-overflow: ellipsis;
}
.s2d-running {
  position: absolute; left: 1.2vh; bottom: 1.2vh; width: 4.4vh; height: 4.4vh; border-radius: 50%;
  background: rgba(0,0,0,0.65); color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 2.4vh;
}
.s2d-all .s2d-tile-art { display: flex; align-items: center; justify-content: center; box-shadow: none; }
.s2d-grid { display: grid; grid-template-columns: repeat(3, 4.2vh); gap: 1.1vh; }
.s2d-grid span { width: 4.2vh; height: 4.2vh; border-radius: 0.9vh; background: var(--sub); }
.s2d-empty { align-self: center; margin-left: 2vh; font-size: 2.4vh; color: var(--sub); }

/* ---------- round icons ---------- */
.s2d-icons {
  position: absolute; left: 0; right: 0; top: 68vh;
  display: flex; justify-content: center; gap: 2.5vh;
}
.s2d-bars .s2d-icons { top: 64vh; }
.s2d-icon {
  position: relative; width: 8.6vh; height: 8.6vh; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.s2d-icon::before {
  content: ""; position: absolute; inset: -0.95vh; border-radius: 50%; opacity: 0;
  background: conic-gradient(#ff3b3b, #ffb31f, #ffe93b, #3cdc5a, #1fd4ff, #3b6bff, #c23bff, #ff3b3b);
}
.s2d-icon.s2d-focused::before { opacity: 1; animation: s2d-spin 2.4s linear infinite, s2d-pop 160ms ease-out; }
.s2d-icon-face {
  position: relative; width: 100%; height: 100%; border-radius: 50%;
  background: var(--circle); display: flex; align-items: center; justify-content: center;
  font-size: 4.4vh; color: var(--glyph); box-shadow: 0 0 0 0.45vh var(--bg);
}
.s2d-root.s2d-white .s2d-icon-face { box-shadow: 0 0 0 0.45vh var(--bg), 0 0.3vh 0.8vh rgba(0,0,0,0.12); }
.s2d-icon .s2d-label { bottom: calc(100% + 1.8vh); left: 50%; transform: translateX(-50%); }

.s2d-label {
  position: absolute; white-space: nowrap; pointer-events: none;
  font-size: 2.4vh; font-weight: 700; color: var(--accent); opacity: 0;
}
.s2d-focused > .s2d-label { opacity: 1; }

/* ---------- footer: controller on the left, button hints on the right ---------- */
.s2d-footer {
  position: absolute; left: 3vw; right: 3vw; bottom: 0; height: 10.5vh;
  border-top: 0.2vh solid var(--line);
  display: flex; align-items: center; justify-content: space-between; padding: 0 2vw;
}
.s2d-bars .s2d-footer { display: none; }
.s2d-handheld { width: 7vh; height: 3.6vh; color: var(--text); opacity: 0.9; }
.s2d-hints { display: flex; align-items: center; gap: 3.4vh; font-size: 2.4vh; font-weight: 600; }
.s2d-hint { display: flex; align-items: center; gap: 1vh; }
.s2d-glyph {
  width: 3.4vh; height: 3.4vh; border-radius: 50%; background: var(--text); color: var(--bg);
  display: flex; align-items: center; justify-content: center; font-size: 2vh; font-weight: 800;
}

@keyframes s2d-pulse {
  0%, 100% { border-color: var(--accent); }
  50% { border-color: var(--accent-hi); }
}
@keyframes s2d-spin { to { transform: rotate(360deg); } }
@keyframes s2d-pop { from { transform: scale(1.06); } to { transform: scale(1); } }
`;

/** Hides Steam's own header and footer while the HOME Menu is on screen (it draws its own). */
export function barsCss(header: string[], footer: string[]): string {
  const sel = [...header, ...footer].map((c) => `.${CSS.escape(c)}`);
  if (sel.length === 0) return "";
  return `${sel.join(", ")} { opacity: 0 !important; pointer-events: none !important; }`;
}
