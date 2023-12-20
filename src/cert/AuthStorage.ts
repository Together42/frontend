const AUTH = 'auth';

export function saveAuth(token: string) {
  const decoded = decodeToken(token);
  let userData: { id: string; url: string };
  userData = { id: decoded.username, url: decoded.imageUrl };
  localStorage.setItem(AUTH, JSON.stringify(userData));
}
export function getAuth(): { id: string; url: string } {
  return JSON.parse(localStorage.getItem(AUTH));
}

export function removeAuth() {
  localStorage.removeItem(AUTH);
}

export const decodeToken = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );

  return JSON.parse(jsonPayload);
};
