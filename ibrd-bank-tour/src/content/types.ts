import type { ComponentType } from 'react';

export interface CalloutSpec {
  /** CSS selector of a DOM element, e.g. "#tep-out-r1-actual" */
  from: string;
  /** anchor name, e.g. "anchor:f3-tep-outputs:transformer" */
  to: string;
  label?: string;
}

export interface Beat {
  /** short label for notes / scene grid / print */
  label?: string;
  /** element ids that glow; every other focusable element dims to 35% */
  focus?: string[];
  /** leader lines from DOM elements to 3D anchors, active during this beat */
  callouts?: CalloutSpec[];
  /** optional camera waypoint override for this beat */
  camera?: string;
  /** where this beat's content comes from in the paper, e.g. "Section 1.3.2 · p. 14" */
  source?: string;
}

export interface SceneViewProps {
  sceneId: string;
  /** 0-based beat index */
  beat: number;
  /** true when rendered as a static print page */
  print?: boolean;
}

export interface SceneContent {
  beats: Beat[];
  View: ComponentType<SceneViewProps>;
}
