import { atom } from 'recoil';
import { EventType, teamMemInfo } from '@types';

interface SelectedEventType extends EventType {
  teamList: teamMemInfo[];
}

const SelectedEvent = atom<SelectedEventType>({
  key: 'ReviewSelectedEvent',
  default: null,
});

export default SelectedEvent;
