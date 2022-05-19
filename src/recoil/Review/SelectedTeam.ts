import { ReviewSelectedTeamType } from '@usefulObj/types';
import { atom } from 'recoil';

const SelectedTeam = atom<ReviewSelectedTeamType>({
  key: 'ReviewSelectedTeam',
  default: null,
});

export default SelectedTeam;
