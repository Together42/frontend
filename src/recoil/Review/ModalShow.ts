import { atom } from 'recoil';
import { ReviewModalShowType } from '@usefulObj/types';

const ModalShow = atom<ReviewModalShowType>({
  key: 'ReviewModalShow',
  default: {
    mode: null,
    show: null,
  },
});

export default ModalShow;
