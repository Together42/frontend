import { atom } from 'recoil';

const ProfileChangeModalShow = atom<boolean>({
  key: 'ProfileChangeModalShow',
  default: false,
});

export default ProfileChangeModalShow;
