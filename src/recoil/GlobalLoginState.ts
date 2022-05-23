import { atom } from 'recoil';
import { userData } from '@globalObj/object/types';
import { getAuth } from '@cert/AuthStorage';

const value = getAuth()
  ? {
      isLogin: true,
      isAdmin: getAuth()['id'] === 'tkim',
      id: getAuth()['id'],
      profileUrl: getAuth()['url'],
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
