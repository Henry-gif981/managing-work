import { create } from 'zustand';
import { ORIGINAL_DOC } from './original';

/**
 * Text edits made in the browser (edit mode, key E).
 * Keys:  s:<scene>:<beat>:<field>  (field = title | body | kicker)   ·   c:<table cell id>   ·   cap:<table id>
 * Values are rich-text templates (**bold**, [n] citations, {fact-id}), the same syntax as the content files.
 *
 * Sources, in order: the edits embedded in the HTML file (<script id="tour-edits">, written by "Save HTML"),
 * then an unsaved draft in localStorage made on top of exactly that embedded set.
 */
export type Edits = Record<string, string>;

const DRAFT_KEY = 'ibrd-tour-edits-draft';

function readEmbedded(): Edits {
  try {
    const el = typeof document !== 'undefined' ? document.getElementById('tour-edits') : null;
    const v = el?.textContent ? JSON.parse(el.textContent) : {};
    return v && typeof v === 'object' ? (v as Edits) : {};
  } catch {
    return {};
  }
}

/** Small stable hash, so a draft is only reused on top of the same embedded edits. */
function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

const EMBEDDED = readEmbedded();
const BASE = hash(JSON.stringify(EMBEDDED));

function readDraft(): Edits | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as { base: string; edits: Edits };
    return d.base === BASE ? d.edits : null;
  } catch {
    return null;
  }
}
function writeDraft(edits: Edits) {
  try {
    if (JSON.stringify(edits) === JSON.stringify(EMBEDDED)) localStorage.removeItem(DRAFT_KEY);
    else localStorage.setItem(DRAFT_KEY, JSON.stringify({ base: BASE, edits }));
  } catch {
    /* private window: the draft is simply not kept */
  }
}

interface EditState {
  edits: Edits;
  editing: boolean;
  /** true when there are changes that are not in the HTML file yet */
  dirty: boolean;
  setEditing: (v: boolean) => void;
  set: (key: string, value: string | null) => void;
  discardDraft: () => void;
  markSaved: () => void;
}

const draft = readDraft();

export const useEdits = create<EditState>((set, get) => ({
  edits: draft ?? EMBEDDED,
  editing: false,
  dirty: !!draft,
  setEditing: (v) => set({ editing: v }),
  set: (key, value) => {
    const edits = { ...get().edits };
    if (value == null) delete edits[key];
    else edits[key] = value;
    writeDraft(edits);
    set({ edits, dirty: true });
  },
  discardDraft: () => {
    writeDraft(EMBEDDED);
    set({ edits: EMBEDDED, dirty: false });
  },
  markSaved: () => set({ dirty: false }),
}));

/** Current override for a key (non-reactive; for the print view, which renders once). */
export const ov = (key: string): string | undefined => useEdits.getState().edits[key];
/** Reactive override for a key. */
export const useOv = (key: string): string | undefined => useEdits((s) => s.edits[key]);

/** The HTML file with the given edits embedded (replaces an earlier edits element). */
export function buildHtml(edits: Edits): string {
  if (!ORIGINAL_DOC) return '';
  const doc = ORIGINAL_DOC.cloneNode(true) as HTMLElement;
  doc.querySelectorAll('#tour-edits').forEach((n) => n.remove());
  const el = document.createElement('script');
  el.id = 'tour-edits';
  el.type = 'application/json';
  // "<" escaped, so the JSON can never close the script element
  el.textContent = JSON.stringify(edits, null, 1).replace(/</g, '\\u003c');
  const head = doc.querySelector('head');
  if (head) head.appendChild(el); // at the end: <meta charset> must stay in the first 1024 bytes
  return '<!DOCTYPE html>\n' + doc.outerHTML;
}

/** File name for a save: always new, with date and time, e.g. ibrd-bank-tour-2026-11-09-1432.html */
export function newFileName(d = new Date()): string {
  const z = (n: number) => String(n).padStart(2, '0');
  return `ibrd-bank-tour-${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}.html`;
}

/**
 * Save the tour as a NEW single HTML file with the edits inside. Every save creates a new file (named with the date
 * and time) in the browser's download folder; the file that is open is never overwritten.
 */
export async function saveHtml(): Promise<{ name: string }> {
  const blob = new Blob([buildHtml(useEdits.getState().edits)], { type: 'text/html' });
  const name = newFileName();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  afterSave();
  return { name };
}

function afterSave() {
  // the saved file now holds these edits; the draft is no longer needed
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
  useEdits.getState().markSaved();
}

/* ---------------- hidden beats (edit mode: "Hide this beat") ---------------- */
export const hideKey = (sceneId: string, beat: number) => `hide:${sceneId}:${beat}`;

/**
 * Beats of a scene that the presentation shows, in order. Hidden beats are skipped, except in edit mode
 * (`withHidden`), so they can be reached and shown again. A scene always keeps at least one beat.
 */
export function visibleBeats(sceneId: string, n: number, edits: Edits = useEdits.getState().edits, withHidden = useEdits.getState().editing): number[] {
  const all = Array.from({ length: n }, (_, i) => i);
  if (withHidden) return all;
  const v = all.filter((b) => !edits[hideKey(sceneId, b)]);
  return v.length || !n ? v : [0];
}
export const isHiddenBeat = (sceneId: string, beat: number, edits: Edits = useEdits.getState().edits) => !!edits[hideKey(sceneId, beat)];
