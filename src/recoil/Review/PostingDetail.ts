import { atom } from 'recoil';
import { PostingType } from '@types';

const PostingDetail = atom<PostingType>({
  key: 'PostingDetail',
  default: {
    boardId: null,
    eventId: null,
    title: null,
    teamId: null,
    writer: null, // createBy
    contents: null,
    createAt: null,
    updateAt: null,
    image: null,
    attendMembers: null,
    comments: null,
  },
});

export default PostingDetail;
