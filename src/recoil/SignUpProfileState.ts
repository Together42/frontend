import { atom } from 'recoil';
import ProfileImgArr from '@usefulObj/ProfileImageArr';

const randomNum = Math.floor(Math.random() * 28);

const SignUpProfileState = atom<{ image: string; imageNum: number }>({
  key: 'SignUpProfileState',
  default: {
    image: ProfileImgArr[randomNum],
    imageNum: randomNum,
  },
});

export default SignUpProfileState;
