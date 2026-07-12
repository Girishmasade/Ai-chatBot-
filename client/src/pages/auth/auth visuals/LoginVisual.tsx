import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

// A small "message network": one hub (GoChat) with nodes (participants)
// connected by lines that pulse like data/messages flowing between them.
// Used on the LOGIN side — returning to an existing, already-connected space.
const NODES = [
  { id: 'hub', cx: 200, cy: 200, r: 24, hub: true },
  { id: 'n1', cx: 92, cy: 108, r: 10 },
  { id: 'n2', cx: 322, cy: 88, r: 8 },
  { id: 'n3', cx: 344, cy: 232, r: 12 },
  { id: 'n4', cx: 258, cy: 332, r: 9 },
  { id: 'n5', cx: 108, cy: 302, r: 11 },
  { id: 'n6', cx: 58, cy: 216, r: 7 },
];

const EDGES: [string, string][] = [
  ['hub', 'n1'], ['hub', 'n2'], ['hub', 'n3'],
  ['hub', 'n4'], ['hub', 'n5'], ['hub', 'n6'],
];

export const LoginVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const edges = svgRef.current.querySelectorAll<SVGLineElement>('.gc-edge');
    const nodes = svgRef.current.querySelectorAll<SVGCircleElement>('.gc-node');
    const hub = svgRef.current.querySelector<SVGCircleElement>('.gc-hub');

    const animations = [
      // flowing "message" dashes along each connection line
      animate(edges, {
        strokeDashoffset: [24, 0],
        ease: 'linear',
        duration: 900,
        delay: stagger(140),
        loop: true,
      }),
      // nodes gently breathing, staggered so the network feels alive
      animate(nodes, {
        scale: [0.85, 1.15],
        opacity: [0.55, 1],
        ease: 'inOutSine',
        duration: 2200,
        delay: stagger(180),
        alternate: true,
        loop: true,
      }),
      // hub pulses slightly stronger, like the "server" at the center
      hub
        ? animate(hub, {
            scale: [1, 1.1],
            ease: 'inOutQuad',
            duration: 1500,
            alternate: true,
            loop: true,
          })
        : null,
    ].filter(Boolean) as { pause: () => void }[];

    return () => animations.forEach((a) => a.pause());
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 400 400" width="100%" style={{ maxWidth: 360 }}>
      <defs>
        <linearGradient id="gcEdgeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {EDGES.map(([a, b], i) => {
        const from = NODES.find((n) => n.id === a)!;
        const to = NODES.find((n) => n.id === b)!;
        return (
          <line
            key={i}
            className="gc-edge"
            x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
            stroke="url(#gcEdgeGrad)"
            strokeWidth={1.5}
            strokeDasharray="6 6"
          />
        );
      })}
      {NODES.map((n) => (
        <circle
          key={n.id}
          className={`gc-node ${n.hub ? 'gc-hub' : ''}`}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          fill={n.hub ? '#f59e0b' : '#d97706'}
          opacity={n.hub ? 1 : 0.8}
          style={{ transformOrigin: `${n.cx}px ${n.cy}px`, transformBox: 'fill-box' }}
        />
      ))}
    </svg>
  );
};