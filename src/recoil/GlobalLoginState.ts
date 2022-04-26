import { atom } from 'recoil';

const GlobalLoginState = atom({
  key: 'GlobalLoginState',
  default: {
    isLogin: false,
    isAdmin: false,
    id: '',
    profileUrl: '',
  },
});

export default GlobalLoginState;
