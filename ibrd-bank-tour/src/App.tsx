import { Suspense, useEffect, useState } from 'react';
import { useTour } from './state/store';
import { PARAMS } from './util/params';
import { SCENES } from './scenes';
import { useDesignScale } from './util/design';
import { Hud } from './hud/Hud';
import { Panels } from './hud/Panels';
import { Toasts } from './hud/Hud';
import { SceneHost } from './SceneHost';
import { CalloutLayer, CalloutPinsTop } from './primitives/Callout';
import { LiteBackdrop, liteSetOf } from './lite/LiteBackdrop';
import { webglAvailable } from './three/Stage';
import Stage from './three/Stage';
import { EditLayer } from './edit/EditLayer';
import { useEdits } from './edit/store';

if (PARAMS.edit && !PARAMS.shot) useEdits.getState().setEditing(true);


export default function App() {
  const box = useDesignScale();
  const lite = useTour((s) => s.lite);
  const fade = useTour((s) => s.fade);
  const index = useTour((s) => s.index);
  const [glOk] = useState(webglAvailable);
  useEffect(() => {
    if (!glOk) {
      useTour.getState().setLite(true);
      useTour.getState().toast({ text: 'WebGL is not available: running in Lite mode.', ttl: 5000 });
    }
  }, [glOk]);
  const show3d = glOk && !lite;
  return (
    <div className="viewport">
      {show3d ? (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      ) : (
        <LiteBackdrop set={liteSetOf(SCENES[index])} />
      )}
      {!PARAMS.capture && <div className="blueprint" />}
      <div className={'fade' + (fade ? ' on' : '')} />
      <div className="design" hidden={PARAMS.capture} style={{ transform: `translate(${box.ox}px, ${box.oy}px) scale(${box.s})` }}>
        {/* leader lines sit below the content cards (update part 5) */}
        <CalloutLayer />
        <SceneHost />
        <CalloutPinsTop />
        <Hud />
        <Panels />
        <Toasts />
        {lite && <div className="lite-badge">LITE MODE · L to switch</div>}
      </div>
      {!PARAMS.shot && <EditLayer />}
    </div>
  );
}
