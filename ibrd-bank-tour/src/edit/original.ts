/**
 * The page as loaded, captured before React renders anything (this module is imported first by main.tsx).
 * In the single-file build this is the whole app: inline script, styles and fonts, plus an empty #root.
 * Kept as a DOM clone (not text), so "Save HTML" can swap the <script id="tour-edits"> element safely:
 * the bundle's own code contains that tag text, so a text search-and-replace would cut into it.
 */
export const ORIGINAL_DOC: HTMLElement | null =
  typeof document !== 'undefined' ? (document.documentElement.cloneNode(true) as HTMLElement) : null;
