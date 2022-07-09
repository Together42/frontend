import { atom } from 'recoil';

const EditPostingModalShow = atom<{ [x: string]: boolean }>({
  key: 'ReviewEditPostingModalShow',
  default: {},
});

export default EditPostingModalShow;
