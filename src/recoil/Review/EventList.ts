import { ReviewSelectedEventType } from '@usefulObj/types';
import { atom } from 'recoil';

const EventList = atom<ReviewSelectedEventType[]>({
  key: 'ReviewEventList',
  default: null,
});

export default EventList;
