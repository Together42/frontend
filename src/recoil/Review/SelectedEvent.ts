import { atom } from 'recoil';
import { ReviewSelectedEventType } from '@types';

const SelectedEvent = atom<ReviewSelectedEventType>({
  key: 'ReviewSelectedEvent',
  default: null,
});

export default SelectedEvent;
