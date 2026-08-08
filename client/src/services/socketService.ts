import { io, Socket } from "socket.io-client";
import { toast } from "react-hot-toast";
import { store } from "../redux/store";
import { tokenApi } from "../redux/api/tokenApi";

let socket: Socket | null = null;

export const initSocket = (userId?: string, token?: string) => {
  if (socket && socket.connected) return socket;

  const serverUrl = window.location.hostname === "localhost" 
    ? "http://localhost:5500" 
    : window.location.origin;

  socket = io(serverUrl, {
    auth: {
      token: token || localStorage.getItem("accessToken") || "",
      userId: userId || "",
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("⚡ Real-time Socket.IO connected with id:", socket?.id);
  });

  socket.on("wallet:updated", (data: { balance: number; reason?: string }) => {
    console.log("⚡ Real-time wallet update received:", data);
    // Invalidate Redux RTK Query TokenWallet cache to trigger live UI re-render
    store.dispatch(tokenApi.util.invalidateTags(["TokenWallet"]));

    if (data.reason === "PURCHASE") {
      toast.success(`💳 Payment Verified! Wallet updated: ${data.balance} tokens available.`, { duration: 4000 });
    } else if (data.reason === "DEDUCTION") {
      toast(`⚡ Tokens Deducted! Balance: ${data.balance} tokens`, {
        icon: "⚡",
        duration: 3000,
        style: {
          background: "#161616",
          color: "#fff",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          fontSize: "12px",
          borderRadius: "12px",
        },
      });
    }
  });

  socket.on("notification:new", (data: { title: string; message: string; type?: string }) => {
    console.log("⚡ Real-time notification received:", data);
    if (data.type === "success") {
      toast.success(`${data.title}: ${data.message}`);
    } else {
      toast(`${data.title}: ${data.message}`, {
        icon: "ℹ️",
        style: {
          background: "#161616",
          color: "#fff",
          border: "1px solid #242424",
          fontSize: "12px",
        },
      });
    }
  });

  socket.on("connect_error", (err) => {
    console.warn("⚡ Socket connection error:", err.message);
  });

  socket.on("error", (err: any) => {
    const errorMsg = typeof err === "string" ? err : err?.message || "Real-time connection error";
    toast.error(`Socket Error: ${errorMsg}`, { id: "single-app-error-toast" });
  });

  socket.on("disconnect", () => {
    console.log("⚡ Socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;
