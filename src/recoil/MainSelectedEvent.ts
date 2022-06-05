import { atom } from 'recoil';
import { EventType } from '@globalObj/object/types';

const SelectedEvent = atom<EventType>({
  key: 'SelectedEvent',
  default: null,
});

export default SelectedEvent;
