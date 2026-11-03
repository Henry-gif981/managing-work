import type { ReactNode } from 'react';

export interface ScenePanelProps {
  left?: ReactNode;
  centre?: ReactNode;
  right?: ReactNode;
  bottom?: ReactNode;
  /** re-trigger the entry animation when this changes (e.g. the beat) */
  animKey?: string | number;
}

/** Paper-card layout zones inside the HUD safe area. The 3D view stays visible around it. */
export function ScenePanel({ left, centre, right, bottom, animKey }: ScenePanelProps) {
  return (
    <div className="scene-panel" key={animKey}>
      {left && <div className="panel-zone zone-left enter">{left}</div>}
      {centre && <div className="panel-zone zone-centre enter enter-delay">{centre}</div>}
      {right && <div className="panel-zone zone-right enter enter-delay">{right}</div>}
      {bottom && <div className="panel-zone zone-bottom enter enter-delay">{bottom}</div>}
    </div>
  );
}

export function Card({ children, tone, className = '', id }: { children: ReactNode; tone?: 'dark' | 'glass'; className?: string; id?: string }) {
  return (
    <div id={id} className={`card ${tone ?? ''} ${className}`}>
      {children}
    </div>
  );
}

export function Title({ kicker, children, level = 2 }: { kicker?: ReactNode; children: ReactNode; level?: 1 | 2 }) {
  return (
    <>
      {kicker && <div className="kicker">{kicker}</div>}
      <div className={level === 1 ? 'h1' : 'h2'}>{children}</div>
    </>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <div className="caption">{children}</div>;
}
