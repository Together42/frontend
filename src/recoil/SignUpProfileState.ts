import { atom } from 'recoil';

const SignUpProfileState = atom<string>({
  key: 'SignUpProfileState',
  default: '',
});

export default SignUpProfileState;
