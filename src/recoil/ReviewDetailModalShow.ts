import { atom } from 'recoil';

const ReviewDetailModalShow = atom<boolean>({
  key: 'ReviewDetailModalShow',
  default: false,
});

export default ReviewDetailModalShow;
