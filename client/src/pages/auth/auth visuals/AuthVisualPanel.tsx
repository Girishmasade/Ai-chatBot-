import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { LoginVisual } from "./LoginVisual";
import { SignupVisual } from "./SignupVisual";

interface AuthVisualPanelProps {
  mode: "login" | "register";
}

export const AuthVisualPanel = ({ mode }: AuthVisualPanelProps) => {
  const bubblesRef = useRef<HTMLDivElement>(null);

  const copy =
    mode === "login"
      ? {
          title: "Pick up right where you left off.",
          body: "Your conversations, agents, and history are exactly where you left them.",
        }
      : {
          title: "Every great conversation starts somewhere.",
          body: "Create an account and get a workspace built for fast, focused conversations with AI.",
        };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 4,
        py: 6,
      }}
    >
      {/* ambient bubbles — shared across both sides for cohesion */}
      <Box
        ref={bubblesRef}
        sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: `${8 + i * 11}%`,
              bottom: "-40px",
              width: 6 + (i % 3) * 4,
              height: 6 + (i % 3) * 4,
              borderRadius: "50%",
              background:
                i % 2 === 0 ? "rgba(245,158,11,0.55)" : "rgba(217,119,6,0.4)",
              animation: `gcFloat 5.2s ${i * 0.55}s ease-out infinite`,
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mode === "login" ? <LoginVisual /> : <SignupVisual />}
      </Box>

      <Typography
        sx={{
          color: "#f59e0b",
          letterSpacing: 3,
          fontSize: "0.72rem",
          fontWeight: 700,
          mt: 2,
          textTransform: "uppercase",
        }}
      >
        GoChat
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          fontWeight: 700,
          textAlign: "center",
          mt: 1,
          maxWidth: 340,
        }}
      >
        {copy.title}
      </Typography>
      <Typography
        sx={{
          color: "#9ca3af",
          textAlign: "center",
          mt: 1.5,
          maxWidth: 320,
          fontSize: "0.92rem",
        }}
      >
        {copy.body}
      </Typography>

      <style>{`
        @keyframes gcFloat {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-220px); opacity: 0; }
        }
      `}</style>
    </Box>
  );
};
