import { ReviewSelectedEventType } from '@globalObj/object/types';
import { atom } from 'recoil';

const EventList = atom<ReviewSelectedEventType[]>({
  key: 'ReviewEventList',
  default: null,
});

export default EventList;
