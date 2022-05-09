import { EventType, teamMemInfo } from '@usefulObj/types';
import { atom } from 'recoil';

interface EventListType extends EventType {
  teamList: teamMemInfo[];
}

const EventList = atom<EventListType[]>({
  key: 'ReviewEventList',
  default: null,
});

export default EventList;
