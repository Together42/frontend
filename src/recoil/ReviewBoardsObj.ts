import { atom } from 'recoil';
import { PostingType } from '@types';

const ReviewBoardsObj = atom<{ string: PostingType }>({
  key: 'ReviewBoardsObj',
  default: null,
});

export default ReviewBoardsObj;
