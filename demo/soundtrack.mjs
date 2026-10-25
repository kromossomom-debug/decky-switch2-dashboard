// Synthesizes the demo video's audio from demo/out/events.json (written by record.mjs video):
// a soft ambient pad, a light tick on every focus move, a swell on theme changes and chimes on the title cards.
// Everything is generated here, so the video carries no third-party audio.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "out");
const { duration, focus, theme, screens, outro } = JSON.parse(readFileSync(join(out, "events.json"), "utf8"));
const RATE = 48000;
const N = Math.round(duration * RATE);
const L = new Float32Array(N);
const R = new Float32Array(N);
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

function add(start, len, fn, panL = 1, panR = 1) {
  const s0 = Math.round(start * RATE);
  for (let i = 0; i < len * RATE && s0 + i < N; i++) {
    if (s0 + i < 0) continue;
    const v = fn(i / RATE);
    L[s0 + i] += v * panL;
    R[s0 + i] += v * panR;
  }
}

// Pad: Cmaj9 – Am9 – Fmaj9 – G6/9, four seconds each, slow attack and release, slightly detuned per side.
const CHORDS = [[48, 55, 59, 62, 64], [45, 52, 55, 59, 60], [41, 48, 52, 55, 57], [43, 50, 52, 57, 59]];
for (let k = 0; k * 4 < duration; k++) {
  const notes = CHORDS[k % CHORDS.length];
  const env = (t) => Math.min(1, t / 1.6) * Math.min(1, Math.max(0, (5.2 - t) / 1.6));
  for (const [j, n] of notes.entries()) {
    const f = hz(n + 12);
    const amp = 0.022 / (1 + j * 0.15);
    add(k * 4 - 0.6, 5.2, (t) => env(t) * amp * (Math.sin(2 * Math.PI * f * t) + 0.18 * Math.sin(4 * Math.PI * f * t)), 1, 0);
    add(k * 4 - 0.6, 5.2, (t) => env(t) * amp * (Math.sin(2 * Math.PI * f * 1.003 * t) + 0.18 * Math.sin(4 * Math.PI * f * 1.003 * t)), 0, 1);
  }
}
// Fade the pad in after the title chime and out with the outro.
for (let i = 0; i < N; i++) {
  const t = i / RATE;
  const g = Math.min(1, t / 2.5) * Math.min(1, Math.max(0, (duration - t) / 2.5));
  L[i] *= g;
  R[i] *= g;
}

// Focus tick: a short, soft two-partial click.
const tick = (t) => Math.exp(-t / 0.018) * (0.16 * Math.sin(2 * Math.PI * 1900 * t) + 0.07 * Math.sin(2 * Math.PI * 3100 * t));
for (const t of focus) add(t, 0.12, tick);

// Theme change: a filtered noise swell around the dip, with a low "thump" at the cut.
let seed = 7;
const noise = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x3fffffff) - 1;
for (const t of theme) {
  let lp = 0;
  add(t - 0.3, 0.7, (x) => {
    lp += 0.05 * (noise() - lp);
    return 0.35 * lp * Math.sin((Math.PI * x) / 0.7);
  });
  add(t, 0.25, (x) => 0.12 * Math.exp(-x / 0.08) * Math.sin(2 * Math.PI * 110 * x));
}

// Opening and closing All Software: a short upward (or downward) blip pair.
for (const [n, t] of screens.entries()) {
  const [a, b] = n % 2 === 0 ? [hz(79), hz(86)] : [hz(86), hz(79)];
  add(t, 0.1, (x) => 0.1 * Math.exp(-x / 0.04) * Math.sin(2 * Math.PI * a * x));
  add(t + 0.07, 0.14, (x) => 0.1 * Math.exp(-x / 0.05) * Math.sin(2 * Math.PI * b * x));
}

// Chimes on the title and the outro: a soft bell (fundamental + inharmonic partials).
const bell = (base) => (t) =>
  Math.exp(-t / 1.1) * (0.09 * Math.sin(2 * Math.PI * base * t) + 0.04 * Math.sin(2 * Math.PI * base * 2.76 * t) + 0.02 * Math.sin(2 * Math.PI * base * 5.4 * t));
add(0.25, 3, bell(hz(76)));
add(0.55, 3, bell(hz(83)));
add(outro + 0.1, 3, bell(hz(79)));
add(outro + 0.4, 3, bell(hz(84)));

// 16-bit stereo WAV with a gentle limiter.
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.tanh(L[i] * 1.4) * 32000), i * 4);
  data.writeInt16LE(Math.round(Math.tanh(R[i] * 1.4) * 32000), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(RATE, 24);
header.writeUInt32LE(RATE * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
writeFileSync(join(out, "soundtrack.wav"), Buffer.concat([header, data]));
console.log("demo/out/soundtrack.wav");
