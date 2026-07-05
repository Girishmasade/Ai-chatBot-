// Centralized environment variable export with type safety
const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI as string;

if (!VITE_BACKEND_URI) {
  console.warn('[EnvImport] VITE_BACKEND_URI is not defined. Check your .env file.');
}

export { VITE_BACKEND_URI };
