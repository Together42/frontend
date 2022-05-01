import { atom } from 'recoil';
import { PostingType } from '@types';
import ProfileImgArr from '@usefulObj/ProfileImageArr';

const tempMemArr = [
  { IntraId: 'jwoo', url: ProfileImgArr[0] },
  { IntraId: 'jwoo', url: ProfileImgArr[1] },
  { IntraId: 'jwoo', url: ProfileImgArr[2] },
  { IntraId: 'jwoo', url: ProfileImgArr[3] },
];

const PostingDetail = atom<PostingType>({
  key: 'PostingDetail',
  default: {
    eventId: null,
    teamName: null,
    location: null,
    memList: null,
    posting: null,
    commentList: null,
    date: null,
    picture: null,
  },
});

export default PostingDetail;
