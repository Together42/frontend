import { atom } from 'recoil';

const NewPostingModalShow = atom<boolean>({
  key: 'ReviewNewPostingModalShow',
  default: false,
});

export default NewPostingModalShow;
