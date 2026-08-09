export const env = {
  API_URL: import.meta.env.VITE_BACKEND_URI || "http://localhost:5500",
  APP_NAME: import.meta.env.VITE_APP_NAME || "AI ChatBot",
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
} as const;
