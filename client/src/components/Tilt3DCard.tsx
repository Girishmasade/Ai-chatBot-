import React, { useState, useRef, MouseEvent } from "react";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
  glareOpacity?: number;
  onClick?: () => void;
}

export default function Tilt3DCard({
  children,
  className = "",
  maxTilt = 15,
  glowColor = "rgba(245, 158, 11, 0.15)",
  glareOpacity = 0.2,
  onClick
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = -((y - centerY) / centerY) * maxTilt;
    const rotateYValue = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform(
      `perspective(1000px) rotateX(${rotateXValue.toFixed(2)}deg) rotateY(${rotateYValue.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlarePos({ x: glareX, y: glareY, opacity: glareOpacity });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out cursor-pointer ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
        willChange: "transform"
      }}
    >
      {/* Dynamic ambient radial hover glow */}
      <div
        className="absolute -inset-px rounded-2xl transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 40%)`
        }}
      />

      {/* Surface Gloss / Glare layer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-20"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`
        }}
      />

      {/* Card Content wrapper maintaining preserve-3d */}
      <div className="relative z-10 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
