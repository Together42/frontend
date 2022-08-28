import { atom } from 'recoil';

const SelectModalShow = atom<boolean>({
  key: 'ReviewSelectModalShow',
  default: false,
});

export default SelectModalShow;
