import { atom } from 'recoil';
import { ReviewModalShowType } from '@usefulObj/types';

const ReviewModalShow = atom<ReviewModalShowType>({
  key: 'ReviewModalShow',
  default: {
    mode: null,
    show: null,
  },
});

export default ReviewModalShow;
