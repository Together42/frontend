import { ReviewSelectedTeamType } from '@globalObj/object/types';
import { atom } from 'recoil';

const SelectedTeam = atom<ReviewSelectedTeamType>({
  key: 'ReviewSelectedTeam',
  default: null,
});

export default SelectedTeam;
