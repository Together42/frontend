import { atom } from 'recoil';
import { userData } from '@globalObj/object/types';
import { getDecodedToken } from '@cert/TokenStorage';

const value = getDecodedToken()
  ? {
      isLogin: true,
      isAdmin: getDecodedToken()['id'] === 'tkim',
      id: getDecodedToken()['id'],
      profileUrl: getDecodedToken()['url'],
    }
  : {
      isLogin: false,
      isAdmin: false,
      id: '',
      profileUrl: '',
    };

const GlobalLoginState = atom<userData>({
  key: 'GlobalLoginState',
  default: value,
});

export default GlobalLoginState;
