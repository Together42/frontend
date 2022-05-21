import { atom } from 'recoil';

const EditPostingModalShow = atom<boolean>({
  key: 'ReviewEditPostingModalShow',
  default: false,
});

export default EditPostingModalShow;
