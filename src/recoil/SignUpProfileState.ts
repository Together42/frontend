import { atom } from 'recoil';
import ProfileImgArr from '@globalObj/object/ProfileImageArr';

const randomNum = Math.floor(Math.random() * 28);

const SignUpProfileState = atom<string>({
  key: 'SignUpProfileState',
  default: ProfileImgArr[randomNum],
});

export default SignUpProfileState;
