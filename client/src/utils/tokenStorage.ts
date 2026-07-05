/**
 * In-memory access token store.
 * SECURITY: Access tokens MUST NOT be stored in localStorage (XSS risk).
 * We keep them in a module-level variable — lost on page reload, which triggers
 * a silent refresh via the httpOnly refresh token cookie.
 */

let _accessToken: string | null = null;

export const tokenStorage = {
  getToken: (): string | null => _accessToken,
  setToken: (token: string): void => {
    _accessToken = token;
  },
  clearToken: (): void => {
    _accessToken = null;
  },
  hasToken: (): boolean => _accessToken !== null,
};
