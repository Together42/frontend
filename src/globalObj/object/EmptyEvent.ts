import { getDecodedToken } from '@cert/TokenStorage';
import { ReviewSelectedEventType } from './types';

function EmptyEvent(): ReviewSelectedEventType {
  return {
    id: -1,
    title: '전체 게시판',
    description: '전체 게시판입니다~!',
    createdId: 1,
    intraId: 'tkim',
    isMatching: 1,
    teamList: { 사서: [{ intraId: getDecodedToken().id, profile: getDecodedToken().url, teamId: -1 }] },
  };
}

export default EmptyEvent;
