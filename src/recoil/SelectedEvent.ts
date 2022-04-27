import { atom } from 'recoil';
import { EventType } from '@types';

const SelectedEvent = atom<EventType>({
  key: 'SelectedEvent',
  default: {
    id: null,
    title: null,
    description: null,
    createdBy: null,
  },
});

export default SelectedEvent;

// {
//   "id": 22,
//   "title": "친바 ㄲㄲㄲ111!",
//   "description": "한잔 꼬",
//   "createdBy": 17
// }
