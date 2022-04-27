import { atom } from 'recoil';
import { userData } from '@types';

const GlobalLoginState = atom<userData>({
  key: 'GlobalLoginState',
  default: {
    isLogin: false,
    isAdmin: false,
    id: '',
    profileUrl: '',
  },
});

export default GlobalLoginState;
