import { Focusable, Navigation } from "@decky/ui";
import { ReactNode, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { MdChevronRight, MdPeople, MdPerson, MdPersonAdd, MdSettings } from "react-icons/md";
import { FOCUSED, Screen, Tray, useFollowFocus } from "./home";
import { SWITCH_AVATARS, SWITCH_BG_COLORS, SwitchAvatar } from "./icons";
import { t } from "./i18n";
import { CustomAvatar, Settings } from "./settings";
import {
  App,
  Player,
  friends,
  incomingInvites,
  libraryApps,
  me,
  openAccount,
  openAddFriend,
  openDetails,
  openEditProfile,
  openPrivacy,
  openSentInvites,
  tileUrls,
} from "./steam";

type Tab = "profile" | "friends" | "add" | "settings";

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "profile", label: t.profile, icon: <MdPerson /> },
  { id: "friends", label: t.friendList, icon: <MdPeople /> },
  { id: "add", label: t.addFriend, icon: <MdPersonAdd /> },
  { id: "settings", label: t.userSettings, icon: <MdSettings /> },
];

const ACTIVITY_COUNT = 12;

function lastPlayedText(app: App): string {
  const last = app.rt_last_time_played ?? 0;
  const days = Math.floor((Date.now() / 1000 - last) / 86400);
  if (days <= 0) return t.lastPlayed(t.today);
  if (days === 1) return t.lastPlayed(t.yesterday);
  if (days < 30) return t.lastPlayed(t.daysAgo(days));
  return t.lastPlayed(new Date(last * 1000).toLocaleDateString());
}

/** Runs `onFocus` with the `data-tab` of whichever menu item Steam focuses (see useFollowFocus for why classes). */
function useFocusedTab(ref: RefObject<HTMLElement | null>, onFocus: (tab: Tab) => void) {
  const cb = useRef(onFocus);
  cb.current = onFocus;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver((records) => {
      for (const rec of records) {
        const target = rec.target as HTMLElement;
        if (target.classList.contains(FOCUSED) && target.dataset.tab) cb.current(target.dataset.tab as Tab);
      }
    });
    observer.observe(el, { subtree: true, attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [ref]);
}

/** A selectable row with the pulsing frame: play activity, Add Friend and User Settings options. */
function Row({ children, onActivate, chevron }: { children: ReactNode; onActivate: () => void; chevron?: boolean }) {
  return (
    <Focusable className="s2d-option" focusClassName={FOCUSED} noFocusRing onActivate={onActivate} onOKActionDescription={t.ok}>
      {children}
      {chevron && <MdChevronRight className="s2d-chevron" />}
    </Focusable>
  );
}

function ProfilePane({ settings }: { settings: Settings }) {
  const self = useMemo(me, []);
  const activity = useMemo(() => libraryApps("recent").filter((a) => a.rt_last_time_played).slice(0, ACTIVITY_COUNT), []);
  return (
    <>
      <div className="s2d-profile">
        <SwitchAvatar
          avatar={settings.customAvatar}
          steamAvatar={self.avatar}
          className="s2d-profile-avatar"
          size="17vh"
        />
        <div>
          <div className="s2d-profile-name">{self.name}</div>
          <div className="s2d-presence s2d-online">{self.status}</div>
          {self.friendCode && (
            <div className="s2d-profile-code">
              {t.friendCode}: <b>{self.friendCode}</b>
            </div>
          )}
        </div>
      </div>
      <div className="s2d-section">{t.playActivity}</div>
      {activity.length === 0 && <div className="s2d-note">{t.noActivity}</div>}
      {activity.map((app) => (
        <Row key={app.appid} onActivate={() => openDetails(app)}>
          <div className="s2d-option-art">
            <img src={tileUrls(app, settings.tileArt)[0]} draggable={false} />
          </div>
          <div className="s2d-option-text">
            <div className="s2d-option-title">{app.display_name}</div>
            <div className="s2d-option-sub">
              {t.playedHours(Math.floor((app.minutes_playtime_forever ?? 0) / 60))} · {lastPlayedText(app)}
            </div>
          </div>
        </Row>
      ))}
    </>
  );
}

function FriendCard({ friend }: { friend: Player }) {
  return (
    <Focusable
      className={`s2d-friend ${friend.playing ? "s2d-playing" : friend.online ? "s2d-online" : ""}`}
      focusClassName={FOCUSED}
      noFocusRing
      onActivate={() => Navigation.NavigateToChat()}
      onOKActionDescription={t.chat}
    >
      <div className="s2d-friend-avatar">
        {friend.avatar ? <img src={friend.avatar} draggable={false} /> : <MdPerson />}
      </div>
      <div className="s2d-friend-name">{friend.name}</div>
      <div className="s2d-friend-status">{friend.status}</div>
    </Focusable>
  );
}

function FriendsPane() {
  const list = useMemo(friends, []);
  if (list.length === 0) return <div className="s2d-note">{t.noFriends}</div>;
  return (
    <Focusable className="s2d-friends" flow-children="grid">
      {list.map((f) => (
        <FriendCard key={f.id} friend={f} />
      ))}
    </Focusable>
  );
}

function AddFriendPane() {
  const self = useMemo(me, []);
  const invites = useMemo(incomingInvites, []);
  return (
    <>
      <div className="s2d-code-box">
        <div className="s2d-code-label">{t.friendCode}</div>
        <div className="s2d-code">{self.friendCode}</div>
      </div>
      <Row onActivate={openAddFriend} chevron>
        <div className="s2d-option-title">{t.searchByCode}</div>
      </Row>
      <Row onActivate={() => Navigation.NavigateToInvites()} chevron>
        <div className="s2d-option-title">{t.receivedRequests(invites)}</div>
      </Row>
      <Row onActivate={openSentInvites} chevron>
        <div className="s2d-option-title">{t.sentRequests}</div>
      </Row>
    </>
  );
}

function SettingsPane({ onOpenAvatarEditor }: { onOpenAvatarEditor: () => void }) {
  return (
    <>
      <Row onActivate={onOpenAvatarEditor} chevron>
        <div className="s2d-option-title">{t.changeIcon}</div>
      </Row>
      <Row onActivate={openEditProfile} chevron>
        <div className="s2d-option-title">{t.editProfile}</div>
      </Row>
      <Row onActivate={openPrivacy} chevron>
        <div className="s2d-option-title">{t.privacy}</div>
      </Row>
      <Row onActivate={openAccount} chevron>
        <div className="s2d-option-title">{t.account}</div>
      </Row>
    </>
  );
}

/** Switch 2 Profile Avatar Selector / Customizer */
export function AvatarEditor({
  currentAvatar,
  steamAvatar,
  playerName,
  onSave,
  onClose,
}: {
  currentAvatar?: CustomAvatar;
  steamAvatar?: string;
  playerName: string;
  onSave: (avatar: CustomAvatar) => void;
  onClose: () => void;
}) {
  const [selectedIcon, setSelectedIcon] = useState(currentAvatar?.iconId || "mario");
  const [selectedBg, setSelectedBg] = useState(currentAvatar?.bgColor || "#E60012");
  const [category, setCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t.catAll },
    { id: "mario", label: t.catMario },
    { id: "zelda", label: t.catZelda },
    { id: "pokemon", label: t.catPokemon },
    { id: "nintendo", label: t.catNintendo },
    { id: "special", label: t.catSpecial },
  ];

  const filteredAvatars = category === "all" ? SWITCH_AVATARS : SWITCH_AVATARS.filter((a) => a.category === category);

  const handleSave = () => {
    onSave({
      enabled: selectedIcon !== "steam",
      iconId: selectedIcon,
      bgColor: selectedBg,
    });
    onClose();
  };

  const handleUseSteam = () => {
    onSave({
      enabled: false,
      iconId: "steam",
      bgColor: selectedBg,
    });
    onClose();
  };

  return (
    <div className="s2d-avatar-editor">
      <div className="s2d-avatar-editor-header">
        <div className="s2d-avatar-editor-title">
          <span>{t.iconSelector}</span>
        </div>
        <Focusable
          className="s2d-btn"
          focusClassName={FOCUSED}
          noFocusRing
          onActivate={onClose}
          onOKActionDescription={t.back}
          style={{ padding: "0 2.5vh" }}
        >
          {t.back}
        </Focusable>
      </div>

      <div className="s2d-avatar-editor-body">
        {/* Left Column: Live Preview & Action Buttons */}
        <div className="s2d-avatar-preview-col">
          <div className="s2d-avatar-preview-frame">
            <SwitchAvatar
              avatar={{ enabled: selectedIcon !== "steam", iconId: selectedIcon, bgColor: selectedBg }}
              steamAvatar={steamAvatar}
              size="100%"
            />
          </div>
          <div className="s2d-avatar-preview-name">{playerName}</div>
          <div className="s2d-avatar-preview-badge">Nintendo Switch 2</div>

          <div className="s2d-avatar-btn-row">
            <Focusable
              className="s2d-btn s2d-primary"
              focusClassName={FOCUSED}
              noFocusRing
              onActivate={handleSave}
              onOKActionDescription={t.saveIcon}
            >
              {t.saveIcon}
            </Focusable>

            <Focusable
              className="s2d-btn"
              focusClassName={FOCUSED}
              noFocusRing
              onActivate={handleUseSteam}
              onOKActionDescription={t.useSteamAvatar}
            >
              {t.useSteamAvatar}
            </Focusable>
          </div>
        </div>

        {/* Right Column: Palette & Character Grid */}
        <div className="s2d-avatar-selector-col">
          <div className="s2d-avatar-section-title">{t.colorTab}</div>
          <div className="s2d-color-palette">
            {SWITCH_BG_COLORS.map((c) => (
              <Focusable
                key={c.id}
                className={`s2d-color-swatch ${c.hex === selectedBg ? "s2d-selected" : ""}`}
                focusClassName={FOCUSED}
                noFocusRing
                style={{ backgroundColor: c.hex }}
                onActivate={() => setSelectedBg(c.hex)}
                onOKActionDescription={c.name}
              >
                <div style={{ width: "100%", height: "100%" }} />
              </Focusable>
            ))}
          </div>

          <div className="s2d-avatar-section-title">{t.characterTab}</div>
          <div className="s2d-category-tabs">
            {categories.map((cat) => (
              <Focusable
                key={cat.id}
                className={`s2d-category-tab ${cat.id === category ? "s2d-active" : ""}`}
                focusClassName={FOCUSED}
                noFocusRing
                onActivate={() => setCategory(cat.id)}
                onOKActionDescription={cat.label}
              >
                {cat.label}
              </Focusable>
            ))}
          </div>

          <Focusable className="s2d-character-grid" flow-children="grid">
            {filteredAvatars.map((a) => (
              <Focusable
                key={a.id}
                className={`s2d-character-tile ${a.id === selectedIcon ? "s2d-selected" : ""}`}
                focusClassName={FOCUSED}
                noFocusRing
                onActivate={() => setSelectedIcon(a.id)}
                onOKActionDescription={a.name}
              >
                <div
                  className="s2d-character-icon-wrapper"
                  style={{ backgroundColor: a.id === "steam" ? "#1B2838" : selectedBg }}
                >
                  <div style={{ width: "70%", height: "70%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {a.render()}
                  </div>
                </div>
                <div className="s2d-character-name">{a.name}</div>
              </Focusable>
            ))}
          </Focusable>
        </div>
      </div>
    </div>
  );
}

/**
 * My Page, like the console's user page: a menu on the left (Profile, Friend List, Add Friend, User Settings) whose
 * selection fills the right side as you move through it.
 */
export function MyPage({
  settings,
  onUpdateSettings,
}: {
  settings: Settings;
  onUpdateSettings?: (patch: Partial<Settings>) => void;
}) {
  const self = useMemo(me, []);
  const menu = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [editingAvatar, setEditingAvatar] = useState(false);

  useFocusedTab(menu, setTab);
  useFollowFocus(pane, "y");
  useEffect(() => {
    if (pane.current) pane.current.scrollTop = 0;
  }, [tab]);

  const handleSaveAvatar = (customAvatar: CustomAvatar) => {
    onUpdateSettings?.({ customAvatar });
  };

  return (
    <Screen settings={settings} className="s2d-mypage" hints={[["B", t.back], ["A", t.ok]]}>
      <div className="s2d-status">
        <div className="s2d-title">
          <SwitchAvatar
            avatar={settings.customAvatar}
            steamAvatar={self.avatar}
            className="s2d-title-avatar"
            size="5.6vh"
          />
          {t.pageOf(self.name || t.myPage)}
        </div>
        <Tray h24={settings.clock24} />
      </div>
      <Focusable className="s2d-page" flow-children="row">
        <Focusable ref={menu} className="s2d-menu" flow-children="column">
          {TABS.map((x, i) => (
            <Focusable
              key={x.id}
              data-tab={x.id}
              className={`s2d-menu-item ${x.id === tab ? "s2d-active" : ""}`}
              focusClassName={FOCUSED}
              noFocusRing
              preferredFocus={i === 0}
              onActivate={() => setTab(x.id)}
              onOKActionDescription={t.ok}
            >
              {x.icon}
              {x.label}
            </Focusable>
          ))}
        </Focusable>
        <Focusable ref={pane} className="s2d-pane" flow-children="column">
          {tab === "profile" && <ProfilePane settings={settings} />}
          {tab === "friends" && <FriendsPane />}
          {tab === "add" && <AddFriendPane />}
          {tab === "settings" && <SettingsPane onOpenAvatarEditor={() => setEditingAvatar(true)} />}
        </Focusable>
      </Focusable>

      {editingAvatar && (
        <AvatarEditor
          currentAvatar={settings.customAvatar}
          steamAvatar={self.avatar}
          playerName={self.name || "Player"}
          onSave={handleSaveAvatar}
          onClose={() => setEditingAvatar(false)}
        />
      )}
    </Screen>
  );
}
