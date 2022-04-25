import { atom } from 'recoil';

const LoginState = atom({
  key: 'LoginState',
  default: {
    isLogin: false,
    isAdmin: false,
    id: '',
    email: '',
    profileUrl: '',
  },
});

export default LoginState;
