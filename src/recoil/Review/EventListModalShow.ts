import { atom } from 'recoil';

const EventListModalShow = atom<boolean>({
  key: 'ReviewEventListModalShow',
  default: false,
});

export default EventListModalShow;
