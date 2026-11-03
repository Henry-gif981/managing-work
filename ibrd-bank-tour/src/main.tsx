import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/playfair-display/vietnamese-700.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-600-italic.css';
import '@fontsource/cormorant-garamond/vietnamese-400-italic.css';
import '@fontsource/cormorant-garamond/vietnamese-600-italic.css';
import '@fontsource/open-sans/latin-400.css';
import '@fontsource/open-sans/latin-600.css';
import '@fontsource/open-sans/latin-700.css';
import '@fontsource/open-sans/vietnamese-400.css';
import '@fontsource/open-sans/vietnamese-600.css';
import '@fontsource/open-sans/vietnamese-700.css';
import './app.css';
import './print/print.css';
import { createRoot } from 'react-dom/client';
import { PARAMS } from './util/params';
import App from './App';
import PrintView from './print/PrintView';
import { initHashSync } from './state/hash';
import { installKeys, openPrintPreview } from './state/keys';
import { startDirector } from './director';
import { useTour } from './state/store';
import { SCENES } from './scenes';
import { beatCount } from './content';
import { perf } from './three/refs';

const root = createRoot(document.getElementById('root')!);
if (PARAMS.print) {
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p' || e.key === 'Escape') openPrintPreview();
  });
  root.render(<PrintView />);
} else {
  if (PARAMS.shot) document.documentElement.classList.add('shot');
  initHashSync();
  // test hook (Playwright shots / debugging)
  Object.assign(window, {
    __tour: useTour,
    __scenes: SCENES.map((s) => ({ id: s.id, beats: beatCount(s.id) })),
    __perf: perf,
  });
  startDirector();
  installKeys();
  root.render(<App />);
}
