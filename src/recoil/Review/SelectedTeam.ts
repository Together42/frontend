import { teamMemInfo } from '@usefulObj/types';
import { atom } from 'recoil';

const SelectedTeam = atom<teamMemInfo[]>({
  key: 'ReviewSelectedEvent',
  default: null,
});

export default SelectedTeam;
