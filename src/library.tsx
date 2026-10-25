import { Focusable } from "@decky/ui";
import { useMemo, useRef, useState } from "react";
import { GameTile, Screen, Tray, useFollowFocus } from "./home";
import { t } from "./i18n";
import { Settings } from "./settings";
import { SortOrder, libraryApps } from "./steam";

const SORT_ORDERS: SortOrder[] = ["recent", "playtime", "title"];
const SORT_LABELS: Record<SortOrder, string> = { recent: t.sortRecent, playtime: t.sortPlaytime, title: t.sortTitle };

/**
 * All Software, like the console's: a grid of square tiles, six to a row, with the selected title above it.
 * Y changes the order (last played, play time, title); B goes back to the HOME Menu.
 */
export function AllSoftware({ settings }: { settings: Settings }) {
  const grid = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<SortOrder>("recent");
  const apps = useMemo(() => libraryApps(sort), [sort]);
  const nextSort = () => setSort((s) => SORT_ORDERS[(SORT_ORDERS.indexOf(s) + 1) % SORT_ORDERS.length]);
  useFollowFocus(grid, "y");

  return (
    <Screen
      settings={settings}
      className="s2d-library"
      hints={[
        ["B", t.back],
        ["Y", `${t.sort}: ${SORT_LABELS[sort]}`],
        ["☰", t.options],
        ["A", t.start],
      ]}
    >
      <div className="s2d-status">
        <div className="s2d-title">
          {t.allSoftware}
          <span className="s2d-count">{apps.length}</span>
        </div>
        <Tray h24={settings.clock24} />
      </div>
      {apps.length === 0 ? (
        <div className="s2d-empty s2d-library-empty">{t.emptyLibrary}</div>
      ) : (
        <Focusable
          key={sort}
          ref={grid}
          className="s2d-library-grid"
          flow-children="grid"
          onOptionsButton={nextSort}
          onOptionsActionDescription={t.sort}
        >
          {apps.map((app, i) => (
            <GameTile key={app.appid} app={app} art={settings.tileArt} first={i === 0} archive />
          ))}
        </Focusable>
      )}
    </Screen>
  );
}
