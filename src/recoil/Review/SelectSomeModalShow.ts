import { atom } from 'recoil';

const SelectSomeModalShow = atom<boolean>({
  key: 'ReviewSelectSomeModalShow',
  default: false,
});

export default SelectSomeModalShow;
