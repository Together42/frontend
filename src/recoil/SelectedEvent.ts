import { atom } from 'recoil';
import { EventType } from '@globalObj/object/types';

const SelectedEvent = atom<EventType>({
  key: 'SelectedEvent',
  default: {
    id: null,
    title: null,
    description: null,
    intraId: null,
    createdId: null,
    isMatching: null,
  },
});

export default SelectedEvent;
