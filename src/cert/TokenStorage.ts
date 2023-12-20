const TOKEN = 'token';

const JWT_PART_LENGTH = 3;
const MS_PER_SEC = 1000;

enum JWTPart {
  Header,
  Payload,
  Signature,
}
export interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

export function getJWTPart(token: string, part: JWTPart): string {
  const parts = token.split('.');
  if (parts.length !== JWT_PART_LENGTH) {
    throw new Error('Invalid JWT token format.');
  }
  return parts[part];
}

export function isValidJWTPayload(object: any): object is JWTPayload {
  return (
    object !== null &&
    typeof object === 'object' &&
    'id' in object &&
    typeof object.id === 'number' &&
    'iat' in object &&
    typeof object.iat === 'number' &&
    'exp' in object &&
    typeof object.exp === 'number'
  );
}

export function parseJWTPayload(token: string): JWTPayload {
  try {
    const payload = decodeToken(token);
    if (!isValidJWTPayload(payload)) {
      throw new Error('Invalid JWTPayload');
    }
    return payload;
  } catch (error) {
    throw error;
  }
}

export function isJWTExpired(token: string): boolean {
  try {
    const payload = parseJWTPayload(token);
    return payload.exp < Date.now() / MS_PER_SEC;
  } catch (error) {
    console.error(error);
    return true;
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN);
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN, token);
}

export function getToken() {
  let token = localStorage.getItem(TOKEN);
  if (token !== null && isJWTExpired(token)) {
    clearToken();
    token = null;
  }
  return token;
}

export function getDecodedToken(): { id: string; url: string } {
  const token = localStorage.getItem(TOKEN);
  if (!token) {
    return { id: null, url: null };
  }
  const decoded = decodeToken(token);
  return { id: decoded.username, url: decoded.imageUrl };
}

const decodeToken = (token: string) => {
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
