/**
 * The HOME Menu, laid out in vh so it scales with the screen: the Deck's 1280x800 and docked 1080p
 * both keep the console's proportions (status bar, software row, round icons, footer).
 */
export const HOME_CSS = `
.s2d-root {
  --bg: #242424;
  --text: #ffffff;
  --sub: rgba(255,255,255,0.68);
  --line: rgba(255,255,255,0.28);
  --circle: #383838;
  --glyph: #b4b4b4;
  --card: #343434;
  --panel: #323232;
  --gap: #242424;
  --accent: #00c3e3;
  --accent-hi: #63f2ff;
  --tile: 34vh;
  --radius: 1.8vh;
  position: absolute; top: 0; left: 0; width: 100%; height: 100vh;
  overflow: hidden; z-index: 1;
  background: var(--bg); color: var(--text);
  font-family: "Nunito Sans", "M PLUS 1p", "Motiva Sans", "Noto Sans", sans-serif;
  user-select: none;
}
.s2d-root.s2d-white {
  --bg: #ebebeb;
  --text: #181818;
  --sub: #484848;
  --line: rgba(0, 0, 0, 0.16);
  --circle: #ffffff;
  --glyph: #4e4e4e;
  --card: #dedede;
  --panel: #ffffff;
  --gap: #ebebeb;
  --accent: #0066b2;
  --accent-hi: #0088eb;
  --accent-text: #00508e;
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
  font-size: 4vh; color: var(--sub); cursor: pointer;
  transition: transform 0.16s ease-out;
}
.s2d-user img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.s2d-user::after {
  content: ""; position: absolute; inset: -0.9vh; border-radius: 50%;
  border: 0.55vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-user.s2d-focused { transform: scale(1.08); }
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
  display: flex; gap: 2vh;
  overflow: hidden; scroll-behavior: smooth;
}
.s2d-bars .s2d-row { top: calc(var(--s2d-header, 40px) + 9vh); }
.s2d-row::after { content: ""; flex: 0 0 4vw; }
.s2d-tile {
  position: relative; flex: 0 0 var(--tile); width: var(--tile); height: var(--tile);
  border-radius: var(--radius);
  transition: transform 0.16s ease-out;
}
.s2d-tile-art {
  position: absolute; inset: 0; border-radius: var(--radius); overflow: hidden;
  background: var(--card);
  box-shadow: 0 0.6vh 1.6vh rgba(0,0,0,0.35);
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
.s2d-tile.s2d-focused { transform: scale(1.02); }
.s2d-tile.s2d-focused::after {
  opacity: 1;
  animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out;
  box-shadow: 0 0 2vh rgba(0, 195, 227, 0.45);
}
.s2d-tile .s2d-label {
  bottom: calc(100% + 2vh); left: -0.2vh; font-size: 3.2vh; font-weight: 800;
  color: var(--accent);
  max-width: 80vw; overflow: hidden; text-overflow: ellipsis;
  text-shadow: 0 0.2vh 0.8vh rgba(0,0,0,0.5);
}
.s2d-badge {
  position: absolute; left: 1.2vh; bottom: 1.2vh; width: 4.4vh; height: 4.4vh; border-radius: 50%;
  background: rgba(0,0,0,0.7); color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 2.4vh; box-shadow: 0 0.2vh 0.6vh rgba(0,0,0,0.4);
}
.s2d-all .s2d-tile-art { display: flex; align-items: center; justify-content: center; box-shadow: none; }
.s2d-grid { display: grid; grid-template-columns: repeat(3, 4.2vh); gap: 1.1vh; }
.s2d-grid span { width: 4.2vh; height: 4.2vh; border-radius: 0.9vh; background: var(--sub); }
.s2d-empty { align-self: center; margin-left: 2vh; font-size: 2.4vh; color: var(--sub); }
.s2d-archived .s2d-tile-art img { opacity: 0.42; filter: grayscale(0.5); }

/* ---------- All Software: a grid of square tiles, six to a row ---------- */
.s2d-title { font-size: 3.6vh; font-weight: 800; display: flex; align-items: baseline; gap: 1.6vh; }
.s2d-count { font-size: 2.4vh; font-weight: 700; color: var(--sub); }
.s2d-bars .s2d-library .s2d-title, .s2d-bars.s2d-library .s2d-title { font-size: 3vh; }
.s2d-library-grid {
  position: absolute; top: 13vh; left: 3vw; right: 3vw; bottom: 10.5vh;
  border-top: 0.2vh solid var(--line);
  padding: 7vh 2vw 4vh; overflow: hidden; scroll-behavior: smooth;
  display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); column-gap: 3vh; row-gap: 7.5vh; align-content: start;
}
.s2d-bars .s2d-library-grid { top: calc(var(--s2d-header, 40px) + 10vh); bottom: 6vh; }
.s2d-library-grid .s2d-tile { flex: none; width: auto; height: auto; aspect-ratio: 1; }
.s2d-library-grid .s2d-tile .s2d-label { font-size: 2.5vh; bottom: calc(100% + 1.7vh); }
.s2d-library-empty { position: absolute; top: 45vh; left: 0; right: 0; text-align: center; margin: 0; }

/* ---------- My Page: menu on the left, the selected section on the right ---------- */
.s2d-title-avatar {
  width: 5.6vh; height: 5.6vh; border-radius: 50%; overflow: hidden; align-self: center;
  background: var(--circle); color: var(--sub); display: flex; align-items: center; justify-content: center; font-size: 3.4vh;
}
.s2d-title-avatar img, .s2d-profile-avatar img, .s2d-friend-avatar img { width: 100%; height: 100%; object-fit: cover; }
.s2d-page {
  position: absolute; top: 13vh; left: 3vw; right: 3vw; bottom: 10.5vh;
  border-top: 0.2vh solid var(--line); display: flex;
}
.s2d-bars .s2d-page { top: calc(var(--s2d-header, 40px) + 10vh); bottom: 6vh; }
.s2d-menu {
  flex: 0 0 31%; padding: 3vh 2.4vh 3vh 1vh; border-right: 0.2vh solid var(--line);
  display: flex; flex-direction: column; gap: 1.2vh;
}
.s2d-menu-item {
  position: relative; height: 8.2vh; padding: 0 2.4vh; border-radius: 1.2vh;
  display: flex; align-items: center; gap: 2.2vh; font-size: 2.7vh; font-weight: 700; color: var(--text);
  cursor: pointer;
}
.s2d-menu-item svg { font-size: 3.6vh; color: var(--glyph); flex: none; }
.s2d-menu-item.s2d-active { background: var(--panel); }
.s2d-menu-item.s2d-active::before {
  content: ""; position: absolute; left: 0; top: 1.6vh; bottom: 1.6vh; width: 0.6vh; border-radius: 0.3vh; background: var(--accent);
}
.s2d-pane { flex: 1; min-width: 0; position: relative; overflow: hidden; scroll-behavior: smooth; padding: 3.4vh 3vw 6vh 4vh; }

.s2d-menu-item::after, .s2d-option::after {
  content: ""; position: absolute; inset: -0.9vh; border-radius: 2.1vh;
  border: 0.55vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-menu-item.s2d-focused::after, .s2d-option.s2d-focused::after {
  opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out;
}

.s2d-profile { display: flex; align-items: center; gap: 4vh; margin-bottom: 3.6vh; }
.s2d-profile-avatar {
  flex: none; width: 17vh; height: 17vh; border-radius: 50%; overflow: hidden;
  background: var(--circle); color: var(--sub); display: flex; align-items: center; justify-content: center; font-size: 10vh;
  box-shadow: 0 0 0 0.6vh var(--panel), 0 0.8vh 2vh rgba(0,0,0,0.35);
}
.s2d-profile-name { font-size: 4.6vh; font-weight: 800; line-height: 1.1; }
.s2d-presence { margin-top: 1vh; font-size: 2.3vh; font-weight: 700; color: var(--sub); display: flex; align-items: center; gap: 1vh; }
.s2d-presence.s2d-online { color: #3ccf4e; }
.s2d-presence.s2d-online::before { content: ""; width: 1.2vh; height: 1.2vh; border-radius: 50%; background: currentColor; }
.s2d-profile-code { margin-top: 1.2vh; font-size: 2.3vh; color: var(--sub); }
.s2d-profile-code b { color: var(--text); letter-spacing: 0.06em; }
.s2d-section {
  font-size: 2.5vh; font-weight: 800; color: var(--sub); padding-bottom: 1.4vh; margin-bottom: 1.6vh;
  border-bottom: 0.2vh solid var(--line);
}
.s2d-note { font-size: 2.4vh; color: var(--sub); padding: 2vh 0; }

.s2d-option {
  position: relative; display: flex; align-items: center; gap: 2.4vh; min-height: 8.2vh;
  padding: 1.2vh 2vh; margin-bottom: 1.4vh; border-radius: 1.2vh; background: var(--panel);
  cursor: pointer;
}
.s2d-option-art { flex: none; width: 8.4vh; height: 8.4vh; border-radius: 1vh; overflow: hidden; background: var(--circle); }
.s2d-option-art img { width: 100%; height: 100%; object-fit: cover; object-position: center 22%; }
.s2d-option-text { min-width: 0; }
.s2d-option-title { font-size: 2.6vh; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s2d-option-sub { margin-top: 0.6vh; font-size: 2.1vh; color: var(--sub); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s2d-chevron { margin-left: auto; font-size: 3.4vh; color: var(--glyph); flex: none; }

.s2d-friends { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4vh 2vh; padding-top: 1vh; }
.s2d-friend { display: flex; flex-direction: column; align-items: center; text-align: center; min-width: 0; }
.s2d-friend-avatar {
  position: relative; width: 13vh; height: 13vh; border-radius: 50%;
  background: var(--circle); color: var(--sub); display: flex; align-items: center; justify-content: center; font-size: 8vh;
}
.s2d-friend-avatar img { border-radius: 50%; }
.s2d-friend-avatar::before {
  content: ""; position: absolute; right: 0.6vh; bottom: 0.6vh; width: 2.6vh; height: 2.6vh; border-radius: 50%;
  border: 0.5vh solid var(--bg); background: #8a8a8a; display: none;
}
.s2d-friend.s2d-online .s2d-friend-avatar::before { display: block; background: #3ccf4e; }
.s2d-friend.s2d-playing .s2d-friend-avatar::before { display: block; background: var(--accent); }
.s2d-friend-avatar::after {
  content: ""; position: absolute; inset: -1vh; border-radius: 50%;
  border: 0.55vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-friend.s2d-focused .s2d-friend-avatar::after { opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out; }
.s2d-friend-name { margin-top: 1.6vh; font-size: 2.3vh; font-weight: 700; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s2d-friend-status { margin-top: 0.4vh; font-size: 1.9vh; color: var(--sub); max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s2d-friend.s2d-playing .s2d-friend-status { color: var(--accent); }
.s2d-friend.s2d-online .s2d-friend-status { color: #3ccf4e; }

.s2d-code-box { padding: 3vh 3vh; margin-bottom: 3vh; border-radius: 1.6vh; background: var(--panel); text-align: center; }
.s2d-code-label { font-size: 2.3vh; font-weight: 700; color: var(--sub); }
.s2d-code { margin-top: 1vh; font-size: 5.6vh; font-weight: 800; letter-spacing: 0.12em; }

/* ---------- round shortcut icons: Nintendo Switch 2 dock ---------- */
.s2d-icons {
  position: absolute; left: 0; right: 0; top: 68vh;
  display: flex; justify-content: center; gap: 2.4vh;
}
.s2d-bars .s2d-icons { top: 64vh; }
.s2d-icon {
  position: relative; width: 8.6vh; height: 8.6vh; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.s2d-icon.s2d-focused { transform: scale(1.15); }
.s2d-icon:active { transform: scale(0.96); }

.s2d-icon::before {
  content: ""; position: absolute; inset: -0.95vh; border-radius: 50%; opacity: 0;
  background: conic-gradient(#ff3b3b, #ffb31f, #ffe93b, #3cdc5a, #1fd4ff, #3b6bff, #c23bff, #ff3b3b);
  transition: opacity 0.2s ease, filter 0.2s ease;
}
.s2d-icon.s2d-focused::before {
  opacity: 1;
  animation: s2d-spin 2.2s linear infinite, s2d-pop 160ms ease-out;
  filter: drop-shadow(0 0 1.2vh rgba(0, 195, 227, 0.7));
}

.s2d-icon-face {
  position: relative; width: 100%; height: 100%; border-radius: 50%;
  background: var(--circle); display: flex; align-items: center; justify-content: center;
  font-size: 4.4vh; color: var(--glyph); box-shadow: 0 0 0 0.45vh var(--bg);
  overflow: hidden;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
.s2d-root.s2d-white .s2d-icon-face { box-shadow: 0 0 0 0.45vh var(--bg), 0 0.3vh 0.8vh rgba(0,0,0,0.12); }
.s2d-icon .s2d-label {
  bottom: calc(100% + 1.8vh); left: 50%; transform: translateX(-50%);
  font-size: 2.6vh; font-weight: 800; color: var(--accent);
  text-shadow: 0 0.2vh 0.8vh rgba(0,0,0,0.6);
}

/* Authentic Nintendo Switch 2 colors for shortcuts */
.s2d-icon-colors .s2d-icon-online .s2d-icon-face { background: #E60012; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-chat .s2d-icon-face { background: #0072CE; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-news .s2d-icon-face { background: #E63900; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-store .s2d-icon-face { background: #F58426; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-album .s2d-icon-face { background: #00A0E9; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-share .s2d-icon-face { background: #8E24AA; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-controllers .s2d-icon-face { background: #282C31; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-cards .s2d-icon-face { background: #00897B; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-settings .s2d-icon-face { background: #546E7A; color: #FFFFFF; }
.s2d-icon-colors .s2d-icon-sleep .s2d-icon-face { background: #37474F; color: #FFFFFF; }

.s2d-icon-colors .s2d-icon-face::after {
  content: ""; position: absolute; inset: 0; border-radius: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%);
  pointer-events: none;
}
.s2d-icon-colors .s2d-icon {
  box-shadow: 0 0.5vh 1.4vh rgba(0,0,0,0.3);
}

.s2d-label {
  position: absolute; white-space: nowrap; pointer-events: none;
  font-size: 2.4vh; font-weight: 700; color: var(--accent); opacity: 0;
}
.s2d-focused > .s2d-label { opacity: 1; }

/* Enhanced readability for Basic White theme: high-contrast deep Nintendo blue */
.s2d-root.s2d-white .s2d-label,
.s2d-root.s2d-white .s2d-tile .s2d-label,
.s2d-root.s2d-white .s2d-icon .s2d-label {
  color: var(--accent-text, #00508e);
  text-shadow: none;
  font-weight: 800;
}
.s2d-root.s2d-white .s2d-tile.s2d-focused::after {
  box-shadow: 0 0 1.8vh rgba(0, 102, 178, 0.4);
}
.s2d-root.s2d-white .s2d-icon.s2d-focused::before {
  filter: drop-shadow(0 0 1.2vh rgba(0, 102, 178, 0.6));
}
.s2d-root.s2d-white .s2d-presence.s2d-playing,
.s2d-root.s2d-white .s2d-friend.s2d-playing .s2d-friend-status {
  color: #00508e;
}
.s2d-root.s2d-white .s2d-avatar-preview-badge {
  color: #00508e;
  background: rgba(0, 80, 142, 0.12);
}
.s2d-root.s2d-white .s2d-btn.s2d-primary {
  background: #0066b2;
  color: #ffffff;
}
.s2d-root.s2d-white .s2d-category-tab.s2d-active {
  background: #0066b2;
  color: #ffffff;
}
.s2d-root.s2d-white .s2d-character-tile.s2d-selected {
  box-shadow: 0 0 0 0.45vh #0066b2;
}

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

/* ---------- Switch 2 Quick Settings Menu ---------- */
.s2d-quick-backdrop {
  position: absolute; inset: 0; background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px); z-index: 50; opacity: 1;
  transition: opacity 0.25s ease;
}
.s2d-quick-panel {
  position: absolute; top: 0; right: 0; bottom: 0; width: 44vw; min-width: 380px; max-width: 520px;
  background: rgba(36, 36, 38, 0.95); backdrop-filter: blur(28px);
  border-left: 0.2vh solid var(--line); box-shadow: -1.5vh 0 4vh rgba(0,0,0,0.6);
  z-index: 51; display: flex; flex-direction: column; padding: 4vh 3vw;
  transform: translateX(0); animation: s2d-slide-in 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}
.s2d-root.s2d-white .s2d-quick-panel {
  background: rgba(245, 245, 247, 0.96);
}
@keyframes s2d-slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.s2d-quick-header {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 2.2vh; border-bottom: 0.2vh solid var(--line);
}
.s2d-quick-user { display: flex; align-items: center; gap: 1.6vh; }
.s2d-quick-user-avatar { width: 7vh; height: 7vh; border-radius: 50%; overflow: hidden; }
.s2d-quick-user-name { font-size: 2.8vh; font-weight: 800; }
.s2d-quick-content { flex: 1; overflow-y: auto; padding: 2.5vh 0; display: flex; flex-direction: column; gap: 2.4vh; }
.s2d-quick-section { display: flex; flex-direction: column; gap: 1.2vh; }
.s2d-quick-section-title { font-size: 2vh; font-weight: 800; color: var(--sub); text-transform: uppercase; letter-spacing: 0.05em; }
.s2d-quick-card {
  position: relative; display: flex; align-items: center; justify-content: space-between;
  background: var(--panel); border-radius: 1.4vh; padding: 1.8vh 2.2vh;
  font-size: 2.3vh; font-weight: 700; cursor: pointer;
}
.s2d-quick-card::after {
  content: ""; position: absolute; inset: -0.6vh; border-radius: 2vh;
  border: 0.5vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-quick-card.s2d-focused::after {
  opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out;
}
.s2d-quick-footer {
  padding-top: 2vh; border-top: 0.2vh solid var(--line);
  display: flex; align-items: center; justify-content: flex-end; gap: 3vh;
}

/* ---------- Switch 2 Avatar Customizer ---------- */
.s2d-avatar-editor {
  position: absolute; inset: 0; z-index: 40; background: var(--bg);
  display: flex; flex-direction: column; padding: 3vh 4vw; overflow: hidden;
}
.s2d-avatar-editor-header {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 2vh; border-bottom: 0.2vh solid var(--line);
}
.s2d-avatar-editor-title { font-size: 3.6vh; font-weight: 800; display: flex; align-items: center; gap: 2vh; }
.s2d-avatar-editor-body {
  flex: 1; display: flex; gap: 4vw; padding-top: 2.5vh; overflow: hidden; min-height: 0;
}
.s2d-avatar-preview-col {
  flex: 0 0 25vw; display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 3vh 2vw; background: var(--panel); border-radius: 2vh;
}
.s2d-avatar-preview-frame {
  position: relative; width: 20vh; height: 20vh; border-radius: 50%;
  box-shadow: 0 0 0 0.8vh var(--circle), 0 0 2.5vh rgba(0, 195, 227, 0.45);
  margin-bottom: 2.2vh; display: flex; align-items: center; justify-content: center;
}
.s2d-avatar-preview-name { font-size: 3vh; font-weight: 800; margin-bottom: 0.6vh; }
.s2d-avatar-preview-badge {
  font-size: 1.8vh; font-weight: 700; color: var(--accent); padding: 0.4vh 1.4vh;
  border-radius: 999px; background: rgba(0, 195, 227, 0.15); margin-bottom: 2.5vh;
}
.s2d-avatar-btn-row { display: flex; flex-direction: column; gap: 1.4vh; width: 100%; margin-top: auto; }
.s2d-btn {
  position: relative; height: 6.6vh; border-radius: 1.2vh; font-size: 2.3vh; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 1.5vh;
  background: var(--circle); color: var(--text); border: none; cursor: pointer;
  transition: transform 0.14s ease;
}
.s2d-btn:active { transform: scale(0.96); }
.s2d-btn.s2d-primary { background: var(--accent); color: #000; }
.s2d-btn::after {
  content: ""; position: absolute; inset: -0.6vh; border-radius: 1.8vh;
  border: 0.45vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-btn.s2d-focused::after {
  opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out;
}
.s2d-btn.s2d-primary.s2d-focused::after { border-color: #FFFFFF; }

.s2d-avatar-selector-col {
  flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0;
}
.s2d-avatar-section-title { font-size: 2.3vh; font-weight: 800; color: var(--sub); margin-bottom: 1vh; }
.s2d-color-palette {
  display: flex; gap: 1.4vh; padding: 1.2vh 0.6vh; overflow-x: auto; flex-shrink: 0;
  margin-bottom: 2vh;
}
.s2d-color-swatch {
  position: relative; flex: 0 0 6.2vh; width: 6.2vh; height: 6.2vh; border-radius: 50%;
  box-shadow: 0 0.3vh 0.8vh rgba(0,0,0,0.3); cursor: pointer;
  transition: transform 0.16s ease;
}
.s2d-color-swatch.s2d-focused { transform: scale(1.15); }
.s2d-color-swatch.s2d-selected::after {
  content: ""; position: absolute; inset: -0.6vh; border-radius: 50%;
  border: 0.45vh solid #FFFFFF; box-shadow: 0 0 1vh rgba(0,0,0,0.5);
}
.s2d-color-swatch.s2d-focused::before {
  content: ""; position: absolute; inset: -0.9vh; border-radius: 50%;
  border: 0.4vh solid var(--accent); animation: s2d-pulse 1s infinite;
}

.s2d-category-tabs {
  display: flex; gap: 1.2vh; margin-bottom: 1.6vh; flex-shrink: 0;
}
.s2d-category-tab {
  position: relative; padding: 1vh 2vh; border-radius: 1vh; font-size: 2.1vh; font-weight: 700;
  background: var(--panel); color: var(--sub); cursor: pointer;
}
.s2d-category-tab.s2d-active {
  background: var(--accent); color: #000;
}
.s2d-category-tab::after {
  content: ""; position: absolute; inset: -0.5vh; border-radius: 1.4vh;
  border: 0.4vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-category-tab.s2d-focused::after {
  opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out;
}

.s2d-character-grid {
  flex: 1; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.8vh; overflow-y: auto; padding: 1vh 0.6vh;
}
.s2d-character-tile {
  position: relative; aspect-ratio: 1; border-radius: 1.6vh;
  background: var(--panel); display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 1.2vh; cursor: pointer; transition: transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.s2d-character-tile.s2d-focused {
  transform: scale(1.1); z-index: 2;
}
.s2d-character-tile::after {
  content: ""; position: absolute; inset: -0.6vh; border-radius: 2.2vh;
  border: 0.5vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-character-tile.s2d-focused::after {
  opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite, s2d-pop 160ms ease-out;
}
.s2d-character-tile.s2d-selected {
  box-shadow: 0 0 0 0.45vh var(--accent);
}
.s2d-character-icon-wrapper {
  width: 8.5vh; height: 8.5vh; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  overflow: hidden; box-shadow: 0 0.4vh 1vh rgba(0,0,0,0.3);
}
.s2d-character-name {
  margin-top: 0.9vh; font-size: 1.8vh; font-weight: 700; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
}

/* ---------- Nintendo Switch Online icon maker ---------- */
.s2d-nso-preview { overflow: hidden; background: var(--circle); }
.s2d-nso-preview img { width: 100%; height: 100%; border-radius: 50%; }
.s2d-nso-spinner {
  width: 5vh; height: 5vh; border-radius: 50%;
  border: 0.6vh solid var(--line); border-top-color: var(--accent); animation: s2d-spin 0.9s linear infinite;
}
.s2d-nso-note { font-size: 2vh; color: var(--sub); padding: 1vh 0.6vh; text-align: center; }
.s2d-nso-preview .s2d-nso-note { padding: 2vh; font-size: 1.7vh; }
.s2d-nso-empty { display: flex; flex-direction: column; align-items: center; gap: 2vh; padding-top: 4vh; }
.s2d-nso-collection { display: flex; align-items: center; gap: 2vh; margin-bottom: 1.2vh; flex-shrink: 0; }
.s2d-nso-collection .s2d-avatar-section-title { margin-bottom: 0; }
.s2d-nso-dropdown { flex: 1; min-width: 0; }
.s2d-nso-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1.6vh; align-content: start; }
.s2d-nso-tile { padding: 0; overflow: visible; background: var(--circle); }
.s2d-nso-tile img { width: 100%; height: 100%; border-radius: 1.6vh; object-fit: cover; }
.s2d-nso-none { font-size: 1.9vh; font-weight: 700; color: var(--sub); }
.s2d-nso-credit {
  display: flex; align-items: center; justify-content: space-between; gap: 2vh; flex-shrink: 0;
  padding-top: 1.2vh; font-size: 1.5vh; color: var(--sub);
}
.s2d-nso-refresh {
  position: relative; flex-shrink: 0; padding: 0.6vh 1.6vh; border-radius: 1vh;
  background: var(--panel); color: var(--text); font-weight: 700;
}
.s2d-nso-refresh::after {
  content: ""; position: absolute; inset: -0.5vh; border-radius: 1.4vh;
  border: 0.4vh solid var(--accent); opacity: 0; pointer-events: none;
}
.s2d-nso-refresh.s2d-focused::after { opacity: 1; animation: s2d-pulse 1.1s ease-in-out infinite; }
.s2d-btn.s2d-disabled { opacity: 0.45; }

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
