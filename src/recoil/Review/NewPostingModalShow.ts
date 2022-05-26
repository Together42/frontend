import { atom } from 'recoil';

const NewEditPostingModalShow = atom<boolean>({
  key: 'ReviewNewEditPostingModalShow',
  default: false,
});

export default NewEditPostingModalShow;
