import type { Beat, SceneContent, SceneViewProps } from './types';
import type { ComponentType } from 'react';
import { SCENES } from '../scenes';

interface ContentModule {
  beats: Beat[];
  default: ComponentType<SceneViewProps>;
}

// Eager so the single-file build needs no dynamic chunks.
const modules = import.meta.glob<ContentModule>('./*.tsx', { eager: true });

export const CONTENT: Record<string, SceneContent> = {};
for (const [path, mod] of Object.entries(modules)) {
  const id = path.replace('./', '').replace('.tsx', '');
  if (id.startsWith('_')) continue;
  CONTENT[id] = { beats: mod.beats ?? [], View: mod.default };
}

const missing = SCENES.filter((s) => !CONTENT[s.id]).map((s) => s.id);
if (missing.length) console.warn('[content] scenes without a content module:', missing);

/** Number of beats of a scene, computed from its content module. */
export function beatCount(sceneId: string): number {
  return CONTENT[sceneId]?.beats.length ?? 0;
}

export function beatOf(sceneId: string, beat: number): Beat | undefined {
  return CONTENT[sceneId]?.beats[beat];
}
