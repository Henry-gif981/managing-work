import { useTour, rememberLite } from './store';
import { useEdits } from '../edit/store';

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

export function openPrintPreview() {
  const u = new URL(location.href);
  if (u.searchParams.get('print') === '1') u.searchParams.delete('print');
  else u.searchParams.set('print', '1');
  location.href = u.toString();
}

/** Global keyboard map. The mouse wheel never navigates. */
export function installKeys() {
  const onKey = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const s = useTour.getState();
    const k = e.key;
    let handled = true;
    switch (k) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        s.next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        s.prev();
        break;
      case 'Home':
        s.home();
        break;
      case 'End':
        s.end();
        break;
      case 'Escape':
        s.openPanel(null);
        break;
      default:
        handled = false;
    }
    if (!handled && !e.repeat) {
      handled = true;
      switch (k.toLowerCase()) {
        case 'f':
          toggleFullscreen();
          break;
        case 'r':
          s.togglePanel('refs');
          break;
        case 'n':
          s.togglePanel('notes');
          break;
        case 'g':
          s.togglePanel('grid');
          break;
        case 'd':
          s.toggleDev();
          break;
        case 'l':
          rememberLite(!s.lite);
          s.setLite(!s.lite);
          break;
        case 'p':
          openPrintPreview();
          break;
        case 'e': {
          const ed = useEdits.getState();
          ed.setEditing(!ed.editing);
          s.toast({ text: !ed.editing ? 'Edit mode ON: click any outlined text to change it, then Save HTML' : 'Edit mode OFF', ttl: 2600 });
          break;
        }
        case 'c':
          s.toggleCore();
          s.toast({ text: !s.coreOnly ? 'Core path ON: optional scenes are skipped' : 'Core path OFF: every scene is shown', ttl: 2200 });
          break;
        default:
          handled = false;
      }
    }
    if (handled) e.preventDefault();
  };
  window.addEventListener('keydown', onKey);

  // touch swipe
  let x0 = 0,
    y0 = 0,
    t0 = 0;
  window.addEventListener(
    'touchstart',
    (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      t0 = Date.now();
    },
    { passive: true },
  );
  window.addEventListener(
    'touchend',
    (e) => {
      if (useTour.getState().dev) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - x0,
        dy = t.clientY - y0;
      if (Date.now() - t0 < 600 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) useTour.getState().next();
        else useTour.getState().prev();
      }
    },
    { passive: true },
  );
}
