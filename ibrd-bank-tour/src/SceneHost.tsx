import { useMemo } from 'react';
import { CONTENT } from './content';
import { SCENES } from './scenes';
import { useTour } from './state/store';
import { FocusContext } from './primitives/focus';
import { Callout } from './primitives/Callout';

/** Renders the current scene's content View for the current beat, with focus and callouts. */
export function SceneHost() {
  const index = useTour((s) => s.index);
  const beat = useTour((s) => s.beat);
  const s = SCENES[index];
  const c = CONTENT[s.id];
  const b = c?.beats[beat];
  const focus = useMemo(() => new Set(b?.focus ?? []), [b]);
  if (!c) return null;
  const View = c.View;
  return (
    <FocusContext.Provider value={focus}>
      <div className="scene-layer" key={s.id}>
        <View sceneId={s.id} beat={beat} />
      </div>
      {b?.callouts?.map((co, i) => (
        <Callout key={`${s.id}-${beat}-${i}`} {...co} />
      ))}
    </FocusContext.Provider>
  );
}
