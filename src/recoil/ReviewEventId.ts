import { atom } from 'recoil';

const ReviewEventId = atom<number>({
  key: 'ReviewEventId',
  default: null,
});

export default ReviewEventId;
