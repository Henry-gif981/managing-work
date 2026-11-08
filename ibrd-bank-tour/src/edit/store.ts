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

type SaveHandle = { createWritable: () => Promise<{ write: (d: Blob) => Promise<void>; close: () => Promise<void> }> };
let handle: SaveHandle | null = null;

/**
 * Save the tour as ONE HTML file with the edits inside. In Chrome/Edge a save dialog lets you overwrite the file you
 * opened (later saves reuse it); elsewhere the file is downloaded.
 */
export async function saveHtml(): Promise<'saved' | 'downloaded' | 'cancelled'> {
  const blob = new Blob([buildHtml(useEdits.getState().edits)], { type: 'text/html' });
  const w = window as unknown as { showSaveFilePicker?: (o: unknown) => Promise<SaveHandle> };
  if (w.showSaveFilePicker) {
    try {
      if (!handle)
        handle = await w.showSaveFilePicker({
          suggestedName: 'ibrd-bank-tour.html',
          types: [{ description: 'HTML page', accept: { 'text/html': ['.html'] } }],
        });
      const out = await handle.createWritable();
      await out.write(blob);
      await out.close();
      afterSave();
      return 'saved';
    } catch (e) {
      if ((e as { name?: string }).name === 'AbortError') return 'cancelled';
      handle = null; // fall back to a download
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ibrd-bank-tour.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  afterSave();
  return 'downloaded';
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
