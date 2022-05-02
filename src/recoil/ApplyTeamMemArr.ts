import { atom } from 'recoil';
import { teamMemInfo } from '@types';

const ApplyTeamMemArr = atom<teamMemInfo[]>({
  key: 'ApplyTeamMemArr',
  default: [],
});

export default ApplyTeamMemArr;
