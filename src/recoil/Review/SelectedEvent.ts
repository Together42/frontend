import { atom } from 'recoil';
import { ReviewSelectedEventType } from '@globalObj/object/types';

const SelectedEvent = atom<ReviewSelectedEventType>({
  key: 'ReviewSelectedEvent',
  default: null,
});

export default SelectedEvent;
