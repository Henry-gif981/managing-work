/** Presenter notes per scene: English talk track + Vietnamese cue. Optional per-beat lines. */
export interface SceneNotes {
  presenter?: string;
  en?: string;
  vi?: string;
  beats?: { en?: string; vi?: string }[];
}

export const NOTES: Record<string, SceneNotes> = {
  // 'f1-what': { presenter: 'Hoàng', en: '...', vi: '...' },
};
