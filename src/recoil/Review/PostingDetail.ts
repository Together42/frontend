import { atom } from 'recoil';
import { PostingType } from '@types';

const PostingDetail = atom<PostingType>({
  key: 'PostingDetail',
  default: {
    boardId: null,
    eventId: null,
    title: null,
    intraId: null, // createBy
    contents: null,
    createAt: null,
    updateAt: null,
    image: null,
    commentNum: null,
    url: null,
  },
});

export default PostingDetail;
