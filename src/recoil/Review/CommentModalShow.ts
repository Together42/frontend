import { atom } from 'recoil';

const CommentModalShow = atom<boolean>({
  key: 'ReviewCommentModalShow',
  default: false,
});

export default CommentModalShow;
