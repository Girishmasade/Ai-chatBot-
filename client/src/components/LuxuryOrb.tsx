import React, { useEffect, useRef } from "react";

interface LuxuryOrbProps {
  size?: number;
  interactive?: boolean;
}

export default function LuxuryOrb({ size = 380, interactive = true }: LuxuryOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const width = size;
    const height = size;

    // 1. Sphere Particles
    const sphereCount = 140;
    const sphereParticles: Array<{
      x: number; y: number; z: number;
      ox: number; oy: number; oz: number;
      size: number; color: string;
    }> = [];

    const radius = size * 0.32;

    for (let i = 0; i < sphereCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (Math.random() - 0.5) * 16;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      sphereParticles.push({
        x, y, z, ox: x, oy: y, oz: z,
        size: Math.random() * 2.4 + 1.0,
        color: i % 4 === 0 ? "rgba(245, 158, 11, 0.95)" : "rgba(245, 158, 11, 0.45)"
      });
    }

    // 2. Concentric 3D Orbital Rings (Gyro Rings)
    const ringCount = 45;
    const ring1: Array<{ angle: number; r: number; size: number }> = [];
    const ring2: Array<{ angle: number; r: number; size: number }> = [];

    for (let i = 0; i < ringCount; i++) {
      ring1.push({
        angle: (i / ringCount) * Math.PI * 2,
        r: radius * 1.35,
        size: Math.random() * 2.0 + 1.0
      });
      ring2.push({
        angle: (i / ringCount) * Math.PI * 2,
        r: radius * 1.6,
        size: Math.random() * 1.8 + 0.8
      });
    }

    let rotX = 0.002;
    let rotY = 0.004;

    let targetRotX = 0.002;
    let targetRotY = 0.004;

    let mouseX = 0;
    let mouseY = 0;
    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
      mouseY = (e.clientY - rect.top - height / 2) / (height / 2);
      targetRotX = mouseY * 0.02;
      targetRotY = mouseX * 0.02;
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => {
      isHovered = false;
      targetRotX = 0.002;
      targetRotY = 0.004;
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseenter", handleMouseEnter);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    let globalTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      globalTime += 0.015;

      // Smooth rotation velocity interpolation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const baseSpinX = 0.003 + rotX;
      const baseSpinY = 0.005 + rotY;

      // Central ambient gold glow pulse
      const pulseSize = (Math.sin(globalTime * 2) * 0.05 + 1) * width * 0.42;
      const glowGrad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, pulseSize
      );
      glowGrad.addColorStop(0, "rgba(245, 158, 11, 0.18)");
      glowGrad.addColorStop(0.4, "rgba(245, 158, 11, 0.05)");
      glowGrad.addColorStop(1, "rgba(9, 9, 9, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Render 3D Ring 1 (Tilted plane)
      ctx.strokeStyle = "rgba(245, 158, 11, 0.15)";
      ctx.lineWidth = 1;
      const cosX = Math.cos(baseSpinX);
      const sinX = Math.sin(baseSpinX);
      const cosY = Math.cos(baseSpinY);
      const sinY = Math.sin(baseSpinY);

      // Render 3D particles sorted by Z
      sphereParticles.sort((a, b) => b.z - a.z);

      for (let i = 0; i < sphereParticles.length; i++) {
        const p = sphereParticles[i];

        // 3D Matrix Rotation
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.z * cosX + p.y * sinX;
        const x2 = p.x * cosY - z1 * sinY;
        const z2 = z1 * cosY + p.x * sinY;

        p.x = x2;
        p.y = y1;
        p.z = z2;

        const cameraDist = size * 1.6;
        const perspective = cameraDist / (cameraDist - p.z);
        const sx = width / 2 + p.x * perspective;
        const sy = height / 2 + p.y * perspective;

        const opacity = Math.max(0.1, Math.min(1, (p.z + size * 0.4) / size));

        // Connect neighboring sphere nodes
        for (let j = i + 1; j < sphereParticles.length; j++) {
          if (j - i > 8) continue;
          const p2 = sphereParticles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dz = p.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < size * 0.15) {
            const lineOpacity = (1 - dist / (size * 0.15)) * 0.18 * opacity;
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineOpacity})`;
            ctx.lineWidth = 0.6;

            const pers2 = cameraDist / (cameraDist - p2.z);
            const sX2 = width / 2 + p2.x * pers2;
            const sY2 = height / 2 + p2.y * pers2;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sX2, sY2);
            ctx.stroke();
          }
        }

        // Draw particle dot
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${opacity})`);
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.8, p.size * perspective), 0, Math.PI * 2);
        ctx.fill();

        // Highlight high Z/Size nodes with glowing halo
        if (p.size > 2.2 && opacity > 0.6) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(245, 158, 11, 0.9)";
          ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
          ctx.beginPath();
          ctx.arc(sx, sy, p.size * perspective * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw 3D orbital rings (gyro dots)
      const ringAngleOffset = globalTime * 0.8;
      for (let i = 0; i < ring1.length; i++) {
        const item = ring1[i];
        const a = item.angle + ringAngleOffset;
        const rx = Math.cos(a) * item.r;
        const ry = Math.sin(a) * item.r * 0.35; // tilted perspective
        const rz = Math.sin(a) * item.r * 0.5;

        const pers = (size * 1.6) / (size * 1.6 - rz);
        const sx = width / 2 + rx * pers;
        const sy = height / 2 + ry * pers;

        ctx.fillStyle = `rgba(245, 158, 11, ${isHovered ? 0.8 : 0.45})`;
        ctx.beginPath();
        ctx.arc(sx, sy, item.size * pers, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseenter", handleMouseEnter);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [size, interactive]);

  return (
    <div className="relative flex items-center justify-center pointer-events-auto select-none" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        className="block cursor-grab active:cursor-grabbing transition-transform duration-500 hover:scale-[1.04]"
        style={{ width: size, height: size }}
      />
      {/* Outer ambient decorative rings */}
      <div className="absolute inset-0 rounded-full border border-amber-500/10 pointer-events-none scale-[0.88] animate-[spin_25s_linear_infinite]" />
      <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/15 pointer-events-none scale-[0.65] animate-[spin_18s_linear_infinite_reverse]" />
      <div className="absolute inset-0 rounded-full border border-amber-500/5 pointer-events-none scale-[0.45] animate-pulse" />
    </div>
  );
}
