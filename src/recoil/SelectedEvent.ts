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
