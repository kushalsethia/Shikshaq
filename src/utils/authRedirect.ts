const REDIRECT_KEY = 'auth_redirect_path';
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function isValid(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}

export function saveAuthRedirect(path: string) {
  if (!isValid(path)) return;
  try {
    localStorage.setItem(REDIRECT_KEY, JSON.stringify({ path, ts: Date.now() }));
  } catch { /* storage full or blocked */ }
}

export function getAuthRedirect(): string | null {
  try {
    const raw = localStorage.getItem(REDIRECT_KEY);
    if (!raw) return null;
    const { path, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL_MS) {
      localStorage.removeItem(REDIRECT_KEY);
      return null;
    }
    return isValid(path) ? path : null;
  } catch {
    return null;
  }
}

export function clearAuthRedirect() {
  try { localStorage.removeItem(REDIRECT_KEY); } catch { /* ok */ }
}
