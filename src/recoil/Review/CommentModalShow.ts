import { atom } from 'recoil';
import { ReviewModalShowType } from '@usefulObj/types';

const CommentModalShow = atom<ReviewModalShowType>({
  key: 'ReviewModalShow',
  default: {
    mode: null,
    show: null,
  },
});

export default CommentModalShow;

// mode : detailComment or newPost
