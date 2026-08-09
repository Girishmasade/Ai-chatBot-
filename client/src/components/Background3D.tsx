import React, { useEffect, useRef } from "react";

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // 3D Particles array
    const count = 65;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
    }> = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1,
        color: i % 4 === 0 ? "rgba(245, 158, 11, 0.6)" : "rgba(255, 255, 255, 0.25)"
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.05;
      targetMouseY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const focalLength = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const projected: Array<{ sx: number; sy: number; scale: number; p: typeof particles[0] }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap boundaries in 3D
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < 50) p.z = 900;
        if (p.z > 900) p.z = 50;

        const effectiveZ = p.z;
        const scale = focalLength / (focalLength + effectiveZ);
        const sx = width / 2 + (p.x + mouseX) * scale;
        const sy = height / 2 + (p.y + mouseY) * scale;

        projected.push({ sx, sy, scale, p });
      }

      // Draw dynamic subtle connection lines between close 3D points
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const distSq = dx * dx + dy * dy;

          if (distSq < 130 * 130) {
            const alpha = (1 - Math.sqrt(distSq) / 130) * 0.12 * p1.scale;
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();
          }
        }
      }

      // Render projected particle dots
      for (let i = 0; i < projected.length; i++) {
        const { sx, sy, scale, p } = projected[i];
        const radius = p.size * scale;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
