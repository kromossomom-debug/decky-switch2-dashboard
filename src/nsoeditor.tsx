import { Dropdown, Focusable } from "@decky/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { FOCUSED, useFollowFocus } from "./home";
import { t } from "./i18n";
import {
  NSO_DEFAULT,
  NsoCollection,
  NsoIndex,
  NsoPart,
  collectionName,
  collectionOf,
  composeNso,
  getNsoIndex,
  nsoPath,
  nsoUrl,
  storeNsoAvatar,
} from "./nso";
import type { CustomAvatar, NsoParts } from "./settings";

const PARTS: { id: NsoPart; key: keyof NsoParts; label: string }[] = [
  { id: "characters", key: "character", label: t.nsoCharacter },
  { id: "frames", key: "frame", label: t.nsoFrame },
  { id: "backgrounds", key: "background", label: t.nsoBackground },
];

function pick<T>(list: T[]): T | undefined {
  return list.length ? list[Math.floor(Math.random() * list.length)] : undefined;
}

/** A random icon: a character, with a frame and background from its own game when it has them. */
function randomParts(collections: NsoCollection[]): NsoParts {
  const home = collections.find((c) => c.id === "default");
  const from = pick(collections.filter((c) => c.characters.length)) ?? home;
  const partOf = (part: NsoPart) => {
    const own = from && from[part].length ? from : home;
    const rel = own && pick(own[part]);
    return own && rel ? nsoPath(own, rel) : "";
  };
  return { character: partOf("characters"), frame: partOf("frames"), background: partOf("backgrounds") };
}

/**
 * The Nintendo Switch Online icon maker, like nso-icon-tool's: pick a character, a frame and a background from any
 * game's collection, see them stacked live, and save the result as your user icon.
 */
export function NsoEditor({
  currentAvatar,
  playerName,
  onSave,
  onClose,
}: {
  currentAvatar?: CustomAvatar;
  playerName: string;
  onSave: (avatar: CustomAvatar) => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState<NsoIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState<NsoParts>(currentAvatar?.nso ?? NSO_DEFAULT);
  const [part, setPart] = useState<NsoPart>("characters");
  const [collectionId, setCollectionId] = useState(collectionOf(parts.character) || "default");
  const [preview, setPreview] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  useFollowFocus(grid, "y");

  const load = (refresh: boolean) => {
    setLoading(true);
    getNsoIndex(refresh)
      .then(setIndex)
      .catch((e) => setIndex({ collections: [], error: String(e) }))
      .finally(() => setLoading(false));
  };
  useEffect(() => load(false), []);

  // Restack the preview whenever a part changes; a slow older one never overwrites a newer one.
  useEffect(() => {
    let current = true;
    setPreviewFailed(false);
    composeNso(parts)
      .then((src) => current && setPreview(src))
      .catch((e) => {
        console.error("[switch2-dashboard] could not build the icon", e);
        if (current) setPreviewFailed(true);
      });
    return () => {
      current = false;
    };
  }, [parts.character, parts.frame, parts.background]);

  const collections = index?.collections ?? [];
  const collection = collections.find((c) => c.id === collectionId) ?? collections[0];
  const active = PARTS.find((p) => p.id === part)!;
  const items = useMemo(() => {
    if (!collection) return [];
    const paths = collection[part].map((rel) => nsoPath(collection, rel));
    // Frames and backgrounds are optional, like on the console's icon maker.
    return part === "characters" ? paths : ["", ...paths];
  }, [collection, part]);

  const save = async () => {
    if (!preview || previewFailed || saving) return;
    setSaving(true);
    const ok = await storeNsoAvatar(preview).catch(() => false);
    setSaving(false);
    if (!ok) console.error("[switch2-dashboard] could not save the icon");
    onSave({ enabled: true, iconId: "nso", bgColor: currentAvatar?.bgColor ?? "#E60012", nso: parts });
    onClose();
  };

  const surprise = () => {
    if (!collections.length) return;
    const next = randomParts(collections);
    setParts(next);
    setCollectionId(collectionOf(next.character));
  };

  return (
    <Focusable
      className="s2d-avatar-editor"
      onCancelButton={onClose}
      onCancelActionDescription={t.back}
      onSecondaryButton={surprise}
      onSecondaryActionDescription={t.nsoRandom}
    >
      <div className="s2d-avatar-editor-header">
        <div className="s2d-avatar-editor-title">
          <span>{t.nsoTitle}</span>
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
        <div className="s2d-avatar-preview-col">
          <div className="s2d-avatar-preview-frame s2d-nso-preview">
            {preview && <img src={preview} draggable={false} />}
            {!preview && !previewFailed && <div className="s2d-nso-spinner" />}
            {previewFailed && <div className="s2d-nso-note">{t.nsoOffline}</div>}
          </div>
          <div className="s2d-avatar-preview-name">{playerName}</div>
          <div className="s2d-avatar-preview-badge">Nintendo Switch Online</div>

          <div className="s2d-avatar-btn-row">
            <Focusable
              className={`s2d-btn s2d-primary ${!preview || previewFailed ? "s2d-disabled" : ""}`}
              focusClassName={FOCUSED}
              noFocusRing
              onActivate={save}
              onOKActionDescription={t.saveIcon}
            >
              {saving ? t.nsoSaving : t.saveIcon}
            </Focusable>
            <Focusable
              className="s2d-btn"
              focusClassName={FOCUSED}
              noFocusRing
              onActivate={surprise}
              onOKActionDescription={t.nsoRandom}
            >
              {t.nsoRandom}
            </Focusable>
          </div>
        </div>

        <div className="s2d-avatar-selector-col">
          <Focusable className="s2d-category-tabs" flow-children="row">
            {PARTS.map((p) => (
              <Focusable
                key={p.id}
                className={`s2d-category-tab ${p.id === part ? "s2d-active" : ""}`}
                focusClassName={FOCUSED}
                noFocusRing
                preferredFocus={p.id === part}
                onActivate={() => setPart(p.id)}
                onOKActionDescription={p.label}
              >
                {p.label}
              </Focusable>
            ))}
          </Focusable>

          {collections.length > 0 && (
            <div className="s2d-nso-collection">
              <div className="s2d-avatar-section-title">{t.nsoCollection}</div>
              <div className="s2d-nso-dropdown">
                <Dropdown
                  rgOptions={collections.map((c) => ({
                    data: c.id,
                    label: `${collectionName(c.id)} (${c[part].length})`,
                  }))}
                  selectedOption={collection?.id}
                  menuLabel={t.nsoCollection}
                  onChange={(o) => setCollectionId(o.data)}
                />
              </div>
            </div>
          )}

          {loading && !index && <div className="s2d-nso-note">{t.nsoLoading}</div>}
          {!loading && collections.length === 0 && (
            <div className="s2d-nso-empty">
              <div className="s2d-nso-note">{t.nsoListFailed}</div>
              <Focusable
                className="s2d-btn"
                focusClassName={FOCUSED}
                noFocusRing
                onActivate={() => load(true)}
                onOKActionDescription={t.nsoRetry}
                style={{ padding: "0 3vh" }}
              >
                {t.nsoRetry}
              </Focusable>
            </div>
          )}
          {collection && items.length === 0 && <div className="s2d-nso-note">{t.nsoNone(active.label)}</div>}

          <Focusable ref={grid} className="s2d-character-grid s2d-nso-grid" flow-children="grid">
            {items.map((path) => (
              <Focusable
                key={path || "none"}
                className={`s2d-character-tile s2d-nso-tile ${path === parts[active.key] ? "s2d-selected" : ""}`}
                focusClassName={FOCUSED}
                noFocusRing
                onActivate={() => setParts((p) => ({ ...p, [active.key]: path }))}
                onOKActionDescription={path ? active.label : t.nsoNoPart}
              >
                {path ? (
                  <img src={nsoUrl(path)} loading="lazy" decoding="async" draggable={false} />
                ) : (
                  <div className="s2d-nso-none">{t.nsoNoPart}</div>
                )}
              </Focusable>
            ))}
          </Focusable>

          {collections.length > 0 && (
            <div className="s2d-nso-credit">
              {t.nsoCredit}
              <Focusable
                className="s2d-nso-refresh"
                focusClassName={FOCUSED}
                noFocusRing
                onActivate={() => load(true)}
                onOKActionDescription={t.nsoRefresh}
              >
                {loading ? t.nsoLoading : t.nsoRefresh}
              </Focusable>
            </div>
          )}
        </div>
      </div>
    </Focusable>
  );
}
