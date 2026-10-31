import asyncio
import base64
import json
import os
import re
import ssl
import urllib.request

import decky

SETTINGS_FILE = os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "settings.json")
# The icon you build from Nintendo Switch Online parts, saved as one PNG so it shows up offline too.
AVATAR_FILE = os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "avatar.png")

# The Nintendo Switch Online icon parts collected by henry-debruin/nso-icons (the same cache nso-icon-tool uses).
# Only the file list is cached here; the frontend loads each picture straight from GitHub when it's shown.
NSO_TREE_URL = "https://api.github.com/repos/henry-debruin/nso-icons/git/trees/main?recursive=1"
NSO_INDEX_FILE = os.path.join(decky.DECKY_PLUGIN_RUNTIME_DIR, "nso-index.json")
# Folder in the repository -> the part it holds. Miis are whole faces, so they count as characters.
NSO_PARTS = {"characters": "characters", "mii": "characters", "frames": "frames", "backgrounds": "backgrounds"}
NSO_SKIP = {"outdated-parts"}
NSO_FIRST = ["default", "nintendo-switch-2"]


def _ssl_context() -> ssl.SSLContext:
    # Decky's bundled Python doesn't always find SteamOS's CA store on its own.
    ctx = ssl.create_default_context()
    for ca in ("/etc/ssl/certs/ca-certificates.crt", "/etc/ssl/cert.pem"):
        if os.path.exists(ca):
            ctx.load_verify_locations(ca)
            break
    return ctx


def _natural(name: str):
    return [int(p) if p.isdigit() else p.lower() for p in re.split(r"(\d+)", name)]


def _build_nso_index() -> dict:
    req = urllib.request.Request(
        NSO_TREE_URL,
        headers={"User-Agent": "switch2-dashboard", "Accept": "application/vnd.github+json"},
    )
    with urllib.request.urlopen(req, timeout=30, context=_ssl_context()) as res:
        tree = json.load(res)

    collections: dict = {}
    for item in tree.get("tree", []):
        parts = item.get("path", "").split("/")
        if item.get("type") != "blob" or len(parts) != 3 or not parts[2].lower().endswith(".png"):
            continue
        collection, folder, _ = parts
        part = NSO_PARTS.get(folder)
        if collection in NSO_SKIP or not part:
            continue
        entry = collections.setdefault(collection, {"id": collection, "characters": [], "frames": [], "backgrounds": []})
        # Kept relative to the collection; the frontend joins them back into repository paths.
        entry[part].append(f"{folder}/{parts[2]}")

    for entry in collections.values():
        for part in ("characters", "frames", "backgrounds"):
            entry[part].sort(key=_natural)
    order = sorted(collections, key=lambda c: (NSO_FIRST.index(c) if c in NSO_FIRST else len(NSO_FIRST), c))
    return {"collections": [collections[c] for c in order]}


class Plugin:
    async def get_settings(self) -> dict:
        try:
            with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
        except Exception as e:
            decky.logger.error(f"Could not read settings: {e}")
            return {}

    async def set_settings(self, settings: dict) -> bool:
        try:
            os.makedirs(decky.DECKY_PLUGIN_SETTINGS_DIR, exist_ok=True)
            tmp = SETTINGS_FILE + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(settings, f, indent=2)
            os.replace(tmp, SETTINGS_FILE)
            return True
        except Exception as e:
            decky.logger.error(f"Could not save settings: {e}")
            return False

    async def get_nso_index(self, refresh: bool = False) -> dict:
        """The list of Nintendo Switch Online icon parts, from the cache unless asked to refresh it."""
        if not refresh:
            try:
                with open(NSO_INDEX_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except FileNotFoundError:
                pass
            except Exception as e:
                decky.logger.error(f"Could not read the icon list cache: {e}")
        try:
            index = await asyncio.to_thread(_build_nso_index)
        except Exception as e:
            decky.logger.error(f"Could not download the icon list: {e}")
            # An old list beats no list.
            try:
                with open(NSO_INDEX_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {"collections": [], "error": str(e)}
        try:
            os.makedirs(decky.DECKY_PLUGIN_RUNTIME_DIR, exist_ok=True)
            tmp = NSO_INDEX_FILE + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(index, f)
            os.replace(tmp, NSO_INDEX_FILE)
        except Exception as e:
            decky.logger.error(f"Could not cache the icon list: {e}")
        return index

    async def get_avatar(self) -> str:
        """The saved icon as a data URL, or an empty string if there's none."""
        try:
            with open(AVATAR_FILE, "rb") as f:
                return "data:image/png;base64," + base64.b64encode(f.read()).decode("ascii")
        except FileNotFoundError:
            return ""
        except Exception as e:
            decky.logger.error(f"Could not read the icon: {e}")
            return ""

    async def save_avatar(self, data_url: str) -> bool:
        try:
            header, _, data = data_url.partition(",")
            if header != "data:image/png;base64" or not data:
                raise ValueError("expected a PNG data URL")
            os.makedirs(decky.DECKY_PLUGIN_SETTINGS_DIR, exist_ok=True)
            tmp = AVATAR_FILE + ".tmp"
            with open(tmp, "wb") as f:
                f.write(base64.b64decode(data, validate=True))
            os.replace(tmp, AVATAR_FILE)
            return True
        except Exception as e:
            decky.logger.error(f"Could not save the icon: {e}")
            return False

    async def _main(self):
        decky.logger.info("Switch 2 Dashboard loaded")

    async def _unload(self):
        decky.logger.info("Switch 2 Dashboard unloaded")
