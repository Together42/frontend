import { atom } from 'recoil';

const CommentModalShow = atom<{ [x: string]: boolean }>({
  key: 'ReviewCommentModalShow',
  default: {},
});

export default CommentModalShow;
