import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import type { V3 } from './builder';

/** Registry of named anchors: "anchor:<scene-id>:<name>". */
export const anchors = new Map<string, THREE.Object3D>();

export const anchorName = (sceneId: string, name: string) => `anchor:${sceneId}:${name}`;
export const getAnchor = (name: string) => anchors.get(name);
export const listAnchors = () => [...anchors.keys()].sort();

/** Create (and register) an anchor object. Caller adds it to the scene graph. */
export function createAnchor(name: string, pos: V3): THREE.Object3D {
  const o = new THREE.Object3D();
  o.name = name;
  o.position.set(...pos);
  anchors.set(name, o);
  return o;
}

/** <Anchor name="anchor:f3-tep-outputs:transformer" position={[x,y,z]} /> */
export function Anchor({ name, position }: { name: string; position: V3 }) {
  const obj = useMemo(() => createAnchor(name, position), [name, position[0], position[1], position[2]]);
  useEffect(() => {
    anchors.set(name, obj);
    return () => {
      if (anchors.get(name) === obj) anchors.delete(name);
    };
  }, [name, obj]);
  return <primitive object={obj} />;
}

/** Several anchors for one scene: <SceneAnchors scene="f3-tep-outputs" at={{ transformer: [..] }} /> */
export function SceneAnchors({ scene, at }: { scene: string; at: Record<string, V3> }) {
  return (
    <>
      {Object.entries(at).map(([n, p]) => (
        <Anchor key={n} name={anchorName(scene, n)} position={p} />
      ))}
    </>
  );
}
