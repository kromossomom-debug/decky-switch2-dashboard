import { callable, definePlugin, routerHook } from "@decky/api";
import {
  ButtonItem,
  DropdownItem,
  Navigation,
  PanelSection,
  PanelSectionRow,
  SliderField,
  ToggleField,
  staticClasses,
} from "@decky/ui";
import { useState } from "react";
import { FaCoffee } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { Fallback, SwitchHome } from "./home";
import { AllSoftware } from "./library";
import { MyPage } from "./mypage";
import { t } from "./i18n";
import { DEFAULT_SETTINGS, Settings, withDefaults } from "./settings";
import { ALL_SOFTWARE_ROUTE, MY_PAGE_ROUTE } from "./steam";

const getSettings = callable<[], Partial<Settings>>("get_settings");
const setSettings = callable<[Settings], boolean>("set_settings");

/** Shown in the panel so you can tell which build Steam has loaded. Kept in sync with package.json by scripts/package.sh. */
const VERSION = "1.2.0";
const DONATE_URL = "https://buymeacoffee.com/kromossomoc";
const HOME_ROUTE = "/library/home";
let settings: Settings = DEFAULT_SETTINGS;
let unloaded = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let homePatch: any;

/** The plugin's screens read the settings when it opens, so they always match the HOME Menu's theme. */
const AllSoftwareRoute = () => <AllSoftware settings={settings} />;
const MyPageRoute = () => <MyPage settings={settings} />;

/** Swaps Steam's home for the HOME Menu, or puts Steam's back, to match the settings. */
function syncHomePatch() {
  if (homePatch) {
    routerHook.removePatch(HOME_ROUTE, homePatch);
    homePatch = undefined;
  }
  if (unloaded || !settings.enabled) return;
  const current = settings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  homePatch = routerHook.addPatch(HOME_ROUTE, (props: any) => ({
    ...props,
    children: (
      <Fallback fallback={props.children}>
        <SwitchHome settings={current} />
      </Fallback>
    ),
    component: undefined,
    render: undefined,
  }));
}

function update(patch: Partial<Settings>) {
  settings = { ...settings, ...patch };
  syncHomePatch();
  setSettings(settings).catch((e) => console.error("[switch2-dashboard] save failed", e));
}

/** Opens the author's Buy Me a Coffee page in Steam's browser (closing the Quick Access menu first). */
function openDonate() {
  Navigation.CloseSideMenus();
  Navigation.NavigateToExternalWeb(DONATE_URL);
}

function Content() {
  const [st, setSt] = useState(settings);
  const change = (patch: Partial<Settings>) => {
    update(patch);
    setSt(settings);
  };
  return (
    <>
      <PanelSection>
        <PanelSectionRow>
          <ToggleField label={t.enableLabel} description={t.enableDesc} checked={st.enabled} onChange={(enabled) => change({ enabled })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label={t.themeLabel}
            rgOptions={[
              { data: "black", label: t.themeBlack },
              { data: "white", label: t.themeWhite },
            ]}
            selectedOption={st.theme}
            onChange={(o) => change({ theme: o.data })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <DropdownItem
            label={t.artLabel}
            rgOptions={[
              { data: "portrait", label: t.artPortrait },
              { data: "landscape", label: t.artLandscape },
              { data: "hero", label: t.artHero },
            ]}
            selectedOption={st.tileArt}
            onChange={(o) => change({ tileArt: o.data })}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField label={t.countLabel} value={st.count} min={4} max={20} step={1} showValue onChange={(count) => change({ count })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label={t.hideBarsLabel} description={t.hideBarsDesc} checked={st.hideBars} onChange={(hideBars) => change({ hideBars })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label={t.clock24Label} checked={st.clock24} onChange={(clock24) => change({ clock24 })} />
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title={t.supportSection}>
        <PanelSectionRow>
          <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "6px" }}>{t.supportText}</div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={openDonate}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <FaCoffee /> Buy Me a Coffee
            </span>
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{ fontSize: "11px", opacity: 0.55, textAlign: "center", width: "100%" }}>Switch 2 Dashboard v{VERSION}</div>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
}

export default definePlugin(() => {
  unloaded = false;
  routerHook.addRoute(ALL_SOFTWARE_ROUTE, AllSoftwareRoute, { exact: true });
  routerHook.addRoute(MY_PAGE_ROUTE, MyPageRoute, { exact: true });
  // Patch only once stored settings are in, so a disabled HOME Menu never flashes on at boot.
  getSettings()
    .then((stored) => {
      settings = withDefaults(stored);
    })
    .catch((e) => console.error("[switch2-dashboard] load failed", e))
    .finally(syncHomePatch);
  return {
    name: "Switch 2 Dashboard",
    titleView: <div className={staticClasses.Title}>Switch 2 Dashboard</div>,
    content: <Content />,
    icon: <MdHome />,
    onDismount() {
      unloaded = true;
      syncHomePatch();
      routerHook.removeRoute(ALL_SOFTWARE_ROUTE);
      routerHook.removeRoute(MY_PAGE_ROUTE);
    },
  };
});
