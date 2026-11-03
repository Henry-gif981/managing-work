/**
 * The Director turns navigation events (store.navSeq) into animation:
 * camera moves, the front door, lift rides, the exit door, fade cuts.
 * All animated values live in `world` / `cam` and are applied by 3D components each frame.
 */
import gsap from 'gsap';
import { SCENES, SCENE_INDEX, LIFT_CARDS, type Scene } from './scenes';
import { beatOf } from './content';
import { useTour, isTransit } from './state/store';
import { WAYPOINTS, cabinPose, waypoint, type Waypoint } from './camera/waypoints';
import { cam, camTo, setCam } from './camera/rig';
import { LEVEL_Y, displayFor, world } from './three/world';
import { MOTION, PARAMS, REDUCED_MOTION } from './util/params';

const IDX_DOOR = SCENE_INDEX['ext-door'];
const LIFT_DOWN_LEVELS = [LEVEL_Y[3], LEVEL_Y[2], LEVEL_Y[1], LEVEL_Y.G, LEVEL_Y.G];

/** Height of the level a scene is on (where the lift cabin rests). */
export function levelY(s: Scene, beat = 0): number {
  if (s.id === 'lift-1-2') return LEVEL_Y[2];
  if (s.id === 'lift-2-3') return LEVEL_Y[3];
  if (s.id === 'lift-down') return LIFT_DOWN_LEVELS[Math.min(beat, LIFT_DOWN_LEVELS.length - 1)];
  switch (s.segment) {
    case 'entrance':
    case 'intro':
    case 'ch1':
      return LEVEL_Y[1];
    case 'ch2':
      return LEVEL_Y[2];
    case 'exit':
      return LEVEL_Y.G;
    default:
      return LEVEL_Y[3];
  }
}

/** Camera pose for (scene, beat). */
export function poseOf(i: number, beat: number): Waypoint {
  const s = SCENES[i];
  if (s.id === 'lift-down') return cabinPose(levelY(s, beat));
  const b = beatOf(s.id, beat);
  return waypoint(b?.camera ?? s.camera);
}

/** Instantly put the world in the resting state of (scene, beat). */
function applyRest(i: number, beat: number) {
  const s = SCENES[i];
  world.door.open = i >= IDX_DOOR ? 1 : 0;
  world.door.spill = i === IDX_DOOR ? 0.4 : i > IDX_DOOR && s.segment === 'intro' ? 0.25 : 0;
  world.lift.y = levelY(s, beat);
  world.lift.doors = s.id === 'lift-down' && beat < 4 ? 1 : 0;
  world.lift.display = displayFor(world.lift.y);
  world.lift.streak = 0;
  world.exit.open = s.id === 'ex-thanks' ? 1 : 0;
  world.exit.daylight = world.exit.open;
  setCam(poseOf(i, beat));
}

let tl: gsap.core.Timeline | null = null;
let last = { index: 0, beat: 0 };

function newTimeline(onDone: () => void) {
  tl?.kill();
  const t = gsap.timeline({ paused: true, onComplete: onDone });
  tl = t;
  return t;
}

function run(t: gsap.core.Timeline) {
  if (MOTION === 0) t.progress(1);
  else t.play();
}

/** Lift cabin interior approach: in front of the lift, then turn inside, then face the doors. */
function walkIntoCabin(t: gsap.core.Timeline, y: number, at = 0) {
  const approach: Waypoint = { pos: [0, y + 1.7, -50.5], target: [0, y + 1.5, -70] };
  const inside: Waypoint = { pos: [0.2, y + 1.65, -60.6], target: [-5, y + 1.5, -61.0] };
  camTo(t, approach, at, { duration: 1.5, ease: 'power2.in' });
  camTo(t, inside, '>', { duration: 1.1, ease: 'none' });
  camTo(t, cabinPose(y), '>', { duration: 0.9, ease: 'power2.out' });
  return t;
}

function ride(t: gsap.core.Timeline, toY: number, dur: number) {
  const L = world.lift;
  t.to(
    L,
    {
      y: toY,
      duration: dur * MOTION,
      ease: 'power2.inOut',
      onStart() {
        L.dir = toY >= L.y ? 1 : -1;
      },
      onUpdate() {
        L.display = displayFor(L.y);
        setCam(cabinPose(L.y));
      },
    },
    '>',
  );
}

function onNav(from: { index: number; beat: number }, to: { index: number; beat: number }, mode: 'step' | 'jump') {
  const store = useTour.getState();
  const s = SCENES[to.index];
  const fromScene = SCENES[from.index];
  const forward = to.index > from.index || (to.index === from.index && to.beat >= from.beat);
  const done = () => {
    useTour.getState().settle(to.index);
    (window as unknown as { __tourSettled: number }).__tourSettled = useTour.getState().navSeq;
  };
  store.setLiftCard(null);

  // ---------- transit scenes: door and lift rides up ----------
  if (isTransit(s)) {
    const t = newTimeline(() => {
      done();
      if (!PARAMS.noauto && useTour.getState().index === to.index) useTour.getState().next();
    });
    if (mode === 'jump' || from.index !== to.index - 1) {
      // set the world to the state just before this transit
      const p = Math.max(0, to.index - 1);
      applyRest(p, 0);
      world.door.open = s.kind === 'door' ? 0 : world.door.open;
    }
    if (s.kind === 'door') {
      t.to(world.door, { open: 1, duration: 1.6 * MOTION, ease: 'power2.inOut' }, 0);
      t.to(world.door, { spill: 1, duration: 1.0 * MOTION, ease: 'power1.out' }, 0.25 * MOTION);
      camTo(t, WAYPOINTS['ext-door-mid'], 0.9 * MOTION, { duration: 1.7, ease: 'power1.in' });
      camTo(t, WAYPOINTS['ext-door'], '>', { duration: 1.5, ease: 'power2.out' });
      t.to(world.door, { spill: 0.4, duration: 1.0 * MOTION }, '<');
    } else {
      const y0 = levelY(SCENES[to.index - 1]);
      const y1 = levelY(s);
      const card = LIFT_CARDS[s.id];
      walkIntoCabin(t, y0, 0);
      t.to(world.lift, { doors: 1, duration: 0.8 * MOTION, ease: 'power1.inOut' }, '>');
      t.call(() => {
        if (card) useTour.getState().setLiftCard(`FLOOR ${card.floor} · CHAPTER ${card.chapter} · ${card.title}`);
        if (!REDUCED_MOTION) world.lift.streak = 1;
      });
      ride(t, y1, 4.2);
      t.call(() => {
        world.lift.streak = 0;
      });
      t.to(world.lift, { doors: 0, duration: 0.8 * MOTION, ease: 'power1.inOut' }, '>+=0.2');
      t.call(() => useTour.getState().setLiftCard(null), undefined, '>-0.2');
    }
    run(t);
    return;
  }

  const t = newTimeline(done);

  // ---------- conclusion: ride down, one level per beat ----------
  if (s.id === 'lift-down') {
    const enteringFromOutside = fromScene.id !== 'lift-down';
    if (mode === 'jump' || (enteringFromOutside && !forward)) {
      fadeCut(t, () => applyRest(to.index, to.beat));
    } else {
      const targetY = levelY(s, to.beat);
      if (enteringFromOutside) {
        walkIntoCabin(t, world.lift.y, 0);
        t.to(world.lift, { doors: 1, duration: 0.8 * MOTION }, '>');
      }
      if (Math.abs(world.lift.y - targetY) > 0.01) {
        if (world.lift.doors < 1) t.to(world.lift, { doors: 1, duration: 0.8 * MOTION }, '>');
        t.call(() => {
          if (!REDUCED_MOTION) world.lift.streak = 1;
        });
        ride(t, targetY, 2.6);
        t.call(() => {
          world.lift.streak = 0;
        });
      }
      const doors = to.beat >= 4 ? 0 : 1;
      if (doors !== world.lift.doors || enteringFromOutside) t.to(world.lift, { doors, duration: 0.8 * MOTION }, '>');
    }
    run(t);
    return;
  }

  // ---------- ordinary scenes ----------
  const sameLevel = levelY(fromScene, from.beat) === levelY(s, to.beat) || (fromScene.id === 'lift-down' && s.kind === 'exit');
  if (mode === 'jump' || !sameLevel) {
    fadeCut(t, () => applyRest(to.index, to.beat));
    run(t);
    return;
  }
  const wp = poseOf(to.index, to.beat);
  // world props that differ between scenes on the same level
  const doorOpen = to.index >= IDX_DOOR ? 1 : 0;
  if (world.door.open !== doorOpen) t.to(world.door, { open: doorOpen, spill: 0, duration: 1.2 * MOTION }, doorOpen ? 0 : 1.1 * MOTION);
  if (fromScene.id === 'lift-down' || world.lift.doors > 0) t.to(world.lift, { doors: 0, duration: 0.8 * MOTION }, 0);
  const exitOpen = s.id === 'ex-thanks' ? 1 : 0;
  if (world.exit.open !== exitOpen) {
    t.to(world.exit, { open: exitOpen, duration: 2.2 * MOTION, ease: 'power2.inOut' }, 0.3 * MOTION);
    t.to(world.exit, { daylight: exitOpen, duration: 1.6 * MOTION, ease: 'power1.inOut' }, 0.6 * MOTION);
  }
  const fromInsideCabin = fromScene.id === 'lift-down' || (isTransit(fromScene) && fromScene.kind === 'lift');
  camTo(t, wp, fromScene.id === 'lift-down' ? 0.5 * MOTION : 0, { duration: fromInsideCabin ? 2.0 : undefined });
  run(t);
}

function fadeCut(t: gsap.core.Timeline, mid: () => void) {
  if (MOTION === 0) {
    t.call(mid);
    return;
  }
  t.call(() => useTour.getState().setFade(true));
  t.to({}, { duration: 0.28 });
  t.call(mid);
  t.to({}, { duration: 0.08 });
  t.call(() => useTour.getState().setFade(false));
  t.to({}, { duration: 0.3 });
}

/** After leaving dev free-fly, glide back to the current scene's pose. */
export function returnToScene() {
  const { index, beat } = useTour.getState();
  const t = newTimeline(() => {});
  camTo(t, poseOf(index, beat), 0, { duration: 1.0 });
  run(t);
}

export function startDirector() {
  const s0 = useTour.getState();
  last = { index: s0.index, beat: s0.beat };
  applyRest(s0.index, s0.beat);
  let seq = s0.navSeq;
  if (isTransit(SCENES[s0.index])) onNav({ index: Math.max(0, s0.index - 1), beat: 0 }, last, 'jump');
  else (window as unknown as { __tourSettled: number }).__tourSettled = seq;
  useTour.subscribe((s) => {
    if (s.navSeq === seq) return;
    seq = s.navSeq;
    const to = { index: s.index, beat: s.beat };
    onNav(last, to, s.mode);
    last = to;
  });
  void cam;
}
