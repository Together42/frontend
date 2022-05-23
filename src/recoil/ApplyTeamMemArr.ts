import { atom } from 'recoil';
import { teamMemInfo } from '@globalObj/object/types';

const ApplyTeamMemArr = atom<teamMemInfo[]>({
  key: 'ApplyTeamMemArr',
  default: [],
});

export default ApplyTeamMemArr;
