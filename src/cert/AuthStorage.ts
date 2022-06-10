const AUTH = 'auth';

export function saveAuth(token: { id: string; url: string }) {
  localStorage.setItem(AUTH, JSON.stringify(token));
}
export function getAuth(): { id: string; url: string } {
  return JSON.parse(localStorage.getItem(AUTH));
}
