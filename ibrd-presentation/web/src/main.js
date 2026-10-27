// Entry: one data file (deck.json), three views — stage (default), reading mode (#read), print/PDF (?print).
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/templates.css';
import './styles/ui.css';
import deck from './data/deck.json';

const params = new URLSearchParams(location.search);

async function boot() {
  // Wait for the webfonts before showing anything, so the stage never reflows on swap.
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]); } catch { /* fonts API missing */ }
  if (params.has('print')) {
    const { startPrint } = await import('./deck/print.js');
    await startPrint(deck);
  } else if (location.hash.startsWith('#read')) {
    const { startReading } = await import('./deck/read.js');
    startReading(deck);
  } else {
    const { startDeck } = await import('./deck/app.js');
    startDeck(deck);
  }
  requestAnimationFrame(() => document.body.classList.add('ready'));
}
addEventListener('hashchange', () => {
  const reading = document.body.classList.contains('reading');
  if (location.hash.startsWith('#read') !== reading && (reading || location.hash === '#read')) location.reload();
});
boot();
