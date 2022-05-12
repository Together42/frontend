const TOKEN = 'token';
const expireHour = 2;

export function clearToken() {
  localStorage.clear();
}

export function saveToken(token: string) {
  const tokenObj = {
    value: token,
    expire: Date.now() + expireHour * 60 * 60 * 1000,
  };
  const tokenObjString = JSON.stringify(tokenObj);
  localStorage.setItem(TOKEN, tokenObjString);
}

export function getToken() {
  const tokenObjString = localStorage.getItem(TOKEN);
  if (!tokenObjString) {
    return null;
  }
  const tokenObj = JSON.parse(tokenObjString);
  if (Date.now() > tokenObj.expire) {
    clearToken();
    return null;
  }
  return tokenObj.value;
}
