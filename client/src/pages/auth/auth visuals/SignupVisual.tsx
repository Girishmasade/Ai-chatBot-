import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { animate, stagger } from 'animejs';

// A set of blocks that fly in from scattered positions and snap together
// into a "+" — building a new workspace, piece by piece. Then it gently
// falls back apart and reassembles, on a loop. Used on the SIGN UP side —
// distinct from login's already-connected network, this one is about
// something new coming together.
const SIZE = 56;
const GAP = 10;
const STEP = SIZE + GAP;

// (col, row) in a 3x3 grid, 1,1 is center — these five cells form a plus.
const CELLS = [
  { id: 'top', col: 1, row: 0 },
  { id: 'left', col: 0, row: 1 },
  { id: 'center', col: 1, row: 1, hub: true },
  { id: 'right', col: 2, row: 1 },
  { id: 'bottom', col: 1, row: 2 },
];

// Scattered starting offsets + rotation for each tile, roughly outward
// from center in different directions so the assembly reads as "converging".
const START_OFFSETS: Record<string, { x: number; y: number; rotate: number }> = {
  top: { x: -70, y: -90, rotate: -35 },
  left: { x: -110, y: 40, rotate: 25 },
  center: { x: 0, y: -10, rotate: 0 },
  right: { x: 100, y: -50, rotate: 30 },
  bottom: { x: 60, y: 100, rotate: -20 },
};

export const SignupVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const tiles = containerRef.current.querySelectorAll<HTMLDivElement>('.gc-tile');
    const sparks = sparkRef.current?.querySelectorAll<HTMLDivElement>('.gc-spark') ?? [];

    const animations = [
      animate(tiles, {
        translateX: (el: HTMLElement) => {
          const id = el.dataset.id!;
          return [START_OFFSETS[id].x, 0];
        },
        translateY: (el: HTMLElement) => {
          const id = el.dataset.id!;
          return [START_OFFSETS[id].y, 0];
        },
        rotate: (el: HTMLElement) => {
          const id = el.dataset.id!;
          return [START_OFFSETS[id].rotate, 0];
        },
        opacity: [0.15, 1],
        scale: [0.6, 1],
        ease: 'outElastic(1, .6)',
        duration: 1400,
        delay: stagger(120, { from: 'center' }),
        alternate: true,
        loop: true,
      }),
      // a soft burst of "sparks" once the pieces meet in the middle
      animate(sparks, {
        scale: [0, 1.4],
        opacity: [0.9, 0],
        duration: 900,
        delay: stagger(70, { start: 1300 }),
        ease: 'outQuad',
        loop: true,
      }),
    ];

    return () => animations.forEach((a) => a.pause());
  }, []);

  return (
    <Box sx={{ position: 'relative', width: STEP * 3, height: STEP * 3 }} ref={containerRef}>
      {/* sparks radiating from center on assembly */}
      <Box ref={sparkRef} sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const dist = 60;
          return (
            <Box
              key={i}
              className="gc-spark"
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#fbbf24',
                opacity: 0,
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
              }}
            />
          );
        })}
      </Box>

      {CELLS.map((cell) => (
        <Box
          key={cell.id}
          className="gc-tile"
          data-id={cell.id}
          sx={{
            position: 'absolute',
            left: cell.col * STEP,
            top: cell.row * STEP,
            width: SIZE,
            height: SIZE,
            borderRadius: '14px',
            background: cell.hub
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : 'linear-gradient(135deg, rgba(245,158,11,0.35), rgba(217,119,6,0.2))',
            border: cell.hub ? 'none' : '1px solid rgba(245,158,11,0.35)',
            boxShadow: cell.hub ? '0 8px 24px rgba(245,158,11,0.35)' : 'none',
          }}
        />
      ))}
    </Box>
  );
};