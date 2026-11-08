import { useEffect, useRef, useState } from 'react';
import { useEdits, saveHtml, hideKey, visibleBeats } from './store';
import { beatCount } from '../content';
import { SCENES } from '../scenes';
import { useTour } from '../state/store';

/**
 * Edit mode (key E, or ?edit=1): every editable text gets a dashed outline; clicking it opens a small editor
 * with the text as a template (**bold**, [n] citations, {fact-id}). Edits show at once, are kept as a draft in
 * the browser, and "Save HTML" writes a new single-file HTML with the edits inside.
 * Editable elements carry data-edit="<key>" and data-edit-raw="<original template>" (set by the content kit,
 * DataTable and the Conclusion panel).
 */
type Open = { key: string; raw: string; value: string; x: number; y: number; w: number; label: string };

export function EditLayer() {
  const editing = useEdits((s) => s.editing);
  const dirty = useEdits((s) => s.dirty);
  const count = useEdits((s) => Object.keys(s.edits).length);
  const [open, setOpen] = useState<Open | null>(null);
  const [busy, setBusy] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const index = useTour((s) => s.index);
  const beat = useTour((s) => s.beat);
  const edits = useEdits((s) => s.edits);
  const scene = SCENES[index];
  const nBeats = beatCount(scene.id);
  const hidden = !!edits[hideKey(scene.id, beat)];
  const shownCount = visibleBeats(scene.id, nBeats, edits, false).length;
  const hiddenTotal = Object.keys(edits).filter((k) => k.startsWith('hide:')).length;

  useEffect(() => {
    document.documentElement.classList.toggle('edit-mode', editing);
    if (!editing) {
      setOpen(null);
      // leaving edit mode on a hidden beat: go to the nearest beat the presentation shows
      const t = useTour.getState();
      if (useEdits.getState().edits[hideKey(SCENES[t.index].id, t.beat)]) t.goto(t.index, t.beat, 'step');
    }
  }, [editing]);
  useEffect(() => {
    document.documentElement.classList.toggle('beat-hidden', editing && hidden);
  }, [editing, hidden]);

  const toggleHide = () => {
    if (!nBeats) return;
    useEdits.getState().set(hideKey(scene.id, beat), hidden ? null : '1');
    useTour.getState().toast({
      text: hidden ? `Beat ${beat + 1} of ${scene.id} is shown again.` : `Beat ${beat + 1} of ${scene.id} is hidden: the presentation and the PDF skip it.`,
      ttl: 3200,
    });
  };

  // click on an editable text -> open the editor (capture phase, so citation buttons do not open the R panel)
  useEffect(() => {
    if (!editing) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || t.closest('.edit-ui')) return;
      const el = t.closest('[data-edit]') as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const key = el.dataset.edit!;
      const raw = el.dataset.editRaw ?? el.textContent?.trim() ?? '';
      const cur = useEdits.getState().edits[key];
      const r = el.getBoundingClientRect();
      const w = Math.min(760, Math.max(420, r.width));
      setOpen({
        key,
        raw,
        value: cur ?? raw,
        x: Math.max(8, Math.min(window.innerWidth - w - 8, r.left)),
        y: Math.min(window.innerHeight - 300, r.bottom + 6),
        w,
        label: el.dataset.editLabel ?? key,
      });
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [editing]);

  useEffect(() => {
    if (open) setTimeout(() => area.current?.focus(), 0);
  }, [open?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // warn before closing the tab with unsaved edits
  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      if (useEdits.getState().dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBefore);
    return () => window.removeEventListener('beforeunload', onBefore);
  }, []);

  const apply = () => {
    if (!open) return;
    const v = open.value.trim();
    useEdits.getState().set(open.key, v === open.raw.trim() ? null : v);
    setOpen(null);
  };
  const reset = () => {
    if (!open) return;
    useEdits.getState().set(open.key, null);
    setOpen(null);
  };
  const save = async () => {
    setBusy(true);
    const r = await saveHtml();
    setBusy(false);
    const toast = useTour.getState().toast;
    if (r === 'saved') toast({ text: 'Saved: the HTML file now contains your edits.', ttl: 3500 });
    else if (r === 'downloaded') toast({ text: 'Downloaded ibrd-bank-tour.html with your edits. Replace the old file with it.', ttl: 6000 });
  };
  const discard = () => {
    if (confirm('Discard all unsaved edits and go back to the text in this HTML file?')) useEdits.getState().discardDraft();
  };

  if (!editing) {
    return dirty ? (
      <button className="edit-ui edit-pill" onClick={() => useEdits.getState().setEditing(true)} title="Unsaved edits: press E to open edit mode and save">
        Unsaved edits · E
      </button>
    ) : null;
  }
  return (
    <>
      <div className="edit-ui edit-bar">
        <b>EDIT MODE</b>
        <span>{hidden ? <b className="edit-hidden-note">This beat is hidden in the presentation.</b> : 'Click any outlined text to change it.'}</span>
        <span className="edit-count">
          {count - hiddenTotal} edited text{count - hiddenTotal === 1 ? '' : 's'} · {hiddenTotal} hidden beat{hiddenTotal === 1 ? '' : 's'}
          {dirty ? ' · not saved yet' : ' · saved'}
        </span>
        {nBeats > 0 && (
          <button
            className={'edit-btn' + (hidden ? ' warn' : '')}
            onClick={toggleHide}
            disabled={!hidden && shownCount <= 1}
            title={!hidden && shownCount <= 1 ? 'The last shown beat of a scene cannot be hidden' : hidden ? 'Show this beat again' : 'Skip this beat in the presentation and the PDF'}
          >
            {hidden ? `Show beat ${beat + 1} again` : `Hide beat ${beat + 1}`}
          </button>
        )}
        <button className="edit-btn primary" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save HTML'}
        </button>
        {dirty && (
          <button className="edit-btn" onClick={discard}>
            Discard unsaved
          </button>
        )}
        <button className="edit-btn" onClick={() => useEdits.getState().setEditing(false)}>
          Done (E)
        </button>
      </div>
      {open && (
        <div className="edit-ui edit-pop" style={{ left: open.x, top: Math.max(8, open.y), width: open.w }} onKeyDown={(e) => e.stopPropagation()}>
          <div className="edit-pop-h">
            <span>{open.label}</span>
            {open.value !== open.raw && <i>edited</i>}
          </div>
          <textarea
            ref={area}
            value={open.value}
            rows={Math.min(12, Math.max(3, Math.ceil(open.value.length / 70) + 1))}
            onChange={(e) => setOpen({ ...open, value: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(null);
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) apply();
            }}
          />
          <div className="edit-pop-hint">**bold** · [12] citation · {'{fact-id}'} number from the paper · blank line = new paragraph · "- " = bullet</div>
          <div className="edit-pop-btns">
            <button className="edit-btn primary" onClick={apply}>
              Apply (Ctrl+Enter)
            </button>
            <button className="edit-btn" onClick={reset} title="Back to the original text of the paper">
              Original text
            </button>
            <button className="edit-btn" onClick={() => setOpen(null)}>
              Cancel (Esc)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
