import { atom } from 'recoil';

const CommentModalShow = atom<boolean>({
  key: 'ReviewModalShow',
  default: false,
});

export default CommentModalShow;
