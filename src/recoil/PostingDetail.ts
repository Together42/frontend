import { atom } from 'recoil';
import { PostingType } from '@types';
// import ProfileImgArr from '@usefulObj/ProfileImageArr';

// const tempMemArr = [
//   { IntraId: 'jwoo', url: ProfileImgArr[0] },
//   { IntraId: 'jwoo', url: ProfileImgArr[1] },
//   { IntraId: 'jwoo', url: ProfileImgArr[2] },
//   { IntraId: 'jwoo', url: ProfileImgArr[3] },
// ];

const PostingDetail = atom<PostingType>({
  key: 'PostingDetail',
  default: {
    boardId: null,
    eventId: null,
    title: null,
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
