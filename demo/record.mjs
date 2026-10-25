// Renders demo/stage.html with headless Chrome.
//   node demo/record.mjs shots   -> docs/screenshots/*.jpg (1280x800, the Steam Deck's screen)
//   node demo/record.mjs video   -> demo/out/frames.mp4 (1920x1080, 30 fps, no audio) + demo/out/events.json
// Needs puppeteer (npm install puppeteer, or set PUPPETEER to its path) and ffmpeg.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const puppeteer = (await import(process.env.PUPPETEER ?? "puppeteer")).default;
const mode = process.argv[2] ?? "shots";
const FPS = 30;

const browser = await puppeteer.launch({ headless: true, args: ["--force-color-profile=srgb", "--hide-scrollbars"] });
const page = await browser.newPage();

async function open(query, width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(here, "stage.html")).href + query, { waitUntil: "load" });
  await page.evaluate(() => window.ready);
}

if (mode === "shots") {
  const out = join(root, "docs/screenshots");
  mkdirSync(out, { recursive: true });
  await open("", 1280, 800);
  const shots = {
    home: 7.2, // Ghost Recon Wildlands selected
    "all-software": 14.5,
    library: 17.6, // All Software grid, God of War III selected
    "library-archived": 22.4, // not-installed games, dimmed with a cloud
    icons: 19.0 + 13, // Controllers
    "my-page": 27.0 + 13,
    white: 38.9 + 13, // Forza Horizon 2
    "non-steam": 47.5 + 13, // God of War III (custom art, non-Steam)
  };
  for (const [name, t] of Object.entries(shots)) {
    await page.evaluate((t) => window.frame(t), t);
    await page.screenshot({ path: join(out, `${name}.jpg`), type: "jpeg", quality: 90 });
    console.log(`docs/screenshots/${name}.jpg`);
  }
} else {
  const out = join(here, "out");
  mkdirSync(out, { recursive: true });
  await open("?mode=video", 1920, 1080);
  const events = await page.evaluate(() => window.EVENTS);
  writeFileSync(join(out, "events.json"), JSON.stringify(events));
  const { duration } = events;
  const ffmpeg = spawn("ffmpeg", [
    "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    join(out, "frames.mp4"),
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const total = Math.round(duration * FPS);
  for (let f = 0; f < total; f++) {
    await page.evaluate((t) => window.frame(t), f / FPS);
    const jpg = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ffmpeg.stdin.write(jpg)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
    if (f % 150 === 0) console.log(`frame ${f}/${total}`);
  }
  ffmpeg.stdin.end();
  await new Promise((r) => ffmpeg.on("close", r));
  console.log("demo/out/frames.mp4");
}
await browser.close();
