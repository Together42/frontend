import { atom } from 'recoil';

const ActionModalShow = atom<boolean>({
  key: 'ReviewActionModalShow',
  default: false,
});

export default ActionModalShow;
