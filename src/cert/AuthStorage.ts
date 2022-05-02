const AUTH = 'auth';

export function saveAuth(token: { id: string; url: string }) {
  localStorage.setItem(AUTH, JSON.stringify(token));
}
export function getAuth() {
  return JSON.parse(localStorage.getItem(AUTH));
}
