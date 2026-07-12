import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { AuthVisualPanel } from "./auth visuals/AuthVisualPanel";

// Rendered once as a parent/layout route for /login and /register, so it does
// NOT unmount when navigating between the two — that's what lets the visual
// panel and form panel glide to their new sides instead of just cutting.
export const AuthLayout = () => {
  const { pathname } = useLocation();
  const mode: "login" | "register" = pathname.startsWith("/register")
    ? "register"
    : "login";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: mode === "login" ? "row" : "row-reverse",
        },
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* background grid */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* visual / signature panel — its position swaps via the flexDirection
          change above, and `layout` lets framer-motion animate that move */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          minHeight: "38vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.12) 0%, #0a0a0a 70%)",
            borderRight: {
              md: mode === "login" ? "none" : "1px solid #2d2d2d",
            },
            borderLeft: { md: mode === "login" ? "1px solid #2d2d2d" : "none" },
            borderBottom: { xs: "1px solid #2d2d2d", md: "none" },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ width: "100%", height: "100%" }}
            >
              <AuthVisualPanel mode={mode} />
            </motion.div>
          </AnimatePresence>
        </Box>
      </motion.div>

      {/* form panel — whichever page (LoginPage/RegisterPage) is active
          renders here through the router Outlet */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Outlet />
      </motion.div>
    </Box>
  );
};
