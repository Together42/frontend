import { atom } from 'recoil';

const GlobalLoginState = atom({
  key: 'GlobalLoginState',
  default: {
    isLogin: false,
    isAdmin: false,
    id: '',
    email: '',
    profileUrl: '',
  },
});

export default GlobalLoginState;
