// Builds demo/stage.html: the HOME Menu drawn with the plugin's own stylesheet and icons, sample library data and a
// scripted timeline. scripts/demo/record.mjs renders it frame by frame for the screenshots and the demo video.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const require = createRequire(join(root, "package.json"));
const md = require("react-icons/md");
const fa = require("react-icons/fa");

const css = readFileSync(join(root, "src/styles.ts"), "utf8").match(/HOME_CSS = `([\s\S]*?)`;/)[1];

/** Renders a react-icons component to an SVG string without react-dom. */
function svg(Icon) {
  const walk = (el) => {
    if (el == null || el === false) return "";
    if (Array.isArray(el)) return el.map(walk).join("");
    if (typeof el === "string") return el;
    if (typeof el.type === "function") return walk(el.type(el.props));
    if (typeof el.type === "object") return walk(el.props.children?.({}) ?? "");
    const { children, style: _style, className: _className, ...rest } = el.props;
    const attrs = Object.entries(rest)
      .filter(([, v]) => v != null && typeof v !== "object" && typeof v !== "function")
      .map(([k, v]) => `${k === "viewBox" ? k : k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}="${v}"`)
      .join(" ");
    return `<${el.type} ${attrs}>${walk(children)}</${el.type}>`;
  };
  return walk(Icon({}));
}

const icons = {
  online: svg(fa.FaSteam),
  chat: svg(md.MdChatBubble),
  news: svg(md.MdNewspaper),
  store: svg(md.MdShoppingBag),
  album: svg(md.MdPhotoLibrary),
  share: svg(md.MdCast),
  controllers: svg(md.MdSportsEsports),
  cards: svg(md.MdSdCard),
  settings: svg(md.MdSettings),
  sleep: svg(md.MdPowerSettingsNew),
  person: svg(md.MdPerson),
  wifi: svg(md.MdWifi),
  cloud: svg(md.MdCloudDownload),
};

const html = readFileSync(join(here, "stage.template.html"), "utf8")
  .replace("/*HOME_CSS*/", () => css)
  .replace("/*ICONS*/", () => `const ICONS = ${JSON.stringify(icons)};`)
  .replace("/*LIBRARY*/", () => `const LIBRARY = ${readFileSync(join(here, "library.json"), "utf8").trim()};`);
writeFileSync(join(here, "stage.html"), html);
console.log("Wrote demo/stage.html");
