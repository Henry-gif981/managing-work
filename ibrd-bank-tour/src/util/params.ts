/** URL query flags, read once at startup. */
const q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');

const planRaw = q.get('plan');
export const PARAMS = {
  /** ?plan=<minutes> : planned length of the talk, enables ahead/behind */
  plan: planRaw && !Number.isNaN(Number(planRaw)) ? Number(planRaw) : null,
  /** ?print=1 : static print layout, no WebGL */
  print: q.get('print') === '1',
  /** ?shot=1 : screenshot mode: no auto-advance, no fps watchdog, instant tweens */
  shot: q.get('shot') === '1' || q.get('capture') === '1',
  /** ?capture=1 : 3D only (HUD and content hidden), for npm run capture-bg */
  capture: q.get('capture') === '1',
  /** ?noauto=1 : transit scenes (door, lift-up) do not auto-advance */
  noauto: q.get('noauto') === '1' || q.get('shot') === '1' || q.get('capture') === '1',
  /** ?tags=1 : show the small grey source tags (hidden by default, see src/config.ts) */
  tags: q.get('tags') === '1',
  /** ?edit=1 : start in edit mode (text editing + Save HTML) */
  edit: q.get('edit') === '1',
  /** ?lite=1 : start in lite mode */
  lite: q.get('lite') === '1',
  /** ?dev=1 : start with dev overlay */
  dev: q.get('dev') === '1' || (import.meta.env.DEV && q.get('dev') !== '0'),
};

export const REDUCED_MOTION =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Global multiplier for every tween duration. */
export const MOTION = PARAMS.shot ? 0 : REDUCED_MOTION ? 0.4 : 1;
