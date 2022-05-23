import { atom } from 'recoil';
import { PostingType } from '@globalObj/object/types';

const BoardsObj = atom<{ [x: string]: PostingType[] }>({
  key: 'ReviewBoardsObj',
  default: null,
});

export default BoardsObj;
