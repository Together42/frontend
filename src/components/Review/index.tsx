import React from 'react';
import Posting from '@review/Posting';
import Guide from '@review/Guide';
// 이하의 import는 이미지 불러오기 임시용
import reviewImage1 from '@img/review1.webp';
import reviewImage2 from '@img/review2.webp';
import reviewImage3 from '@img/review3.webp';
import reviewImage4 from '@img/review4.webp';
import profile1 from '@img/profile-1.webp';
import profile2 from '@img/profile-2.webp';
import profile3 from '@img/profile-3.webp';
import profile4 from '@img/profile-4.webp';
// import { PostingType } from '@usefulObj/types';

function Review() {
  const tempLocaArr = ['개포 순대국집', '개포 고기집', '광수육회', '어딘가에서'];
  const tempCommentArr = [
    '친해지길 바라!',
    '저번에 못올린 친바 3회차!',
    '"사"팀  광수육회 갔습니당',
    '사서의 날은 지났지만.. 친바 진행했습니다!! 장독묵은지 왔어요~',
  ];
  const tempIgmArr = [reviewImage1, reviewImage2, reviewImage3, reviewImage4];
  const tempMemArr = [
    { intraId: 'jwoo', url: profile1 },
    { intraId: 'jwoo', url: profile2 },
    { intraId: 'jwoo', url: profile3 },
    { intraId: 'jwoo', url: profile4 },
  ];
  const tempArr = ['team1', 'team1', 'team1', 'team1'];
  const tempSomeoneComment = [
    { intraId: 'jwoo', content: '자주 가는 순대국집이네요ㅎㅎ', time: null },
    { intraId: 'jwoo', content: '자주 가는 순대국집이네요ㅎㅎ', time: null },
    { intraId: 'jwoo', content: '자주 가는 순대국집이네요ㅎㅎ', time: null },
    { intraId: 'jwoo', content: '자주 가는 순대국집이네요ㅎㅎ', time: null },
  ];

  // 추후에는 이런 식으로 만들어집니다.

  // const tempPostArr: PostingType[] = [
  //   {
  //     eventId: 1,
  //     teamName: 'team1',
  //     location: tempLocaArr[0],
  //     memList: tempMemArr,
  //     posting: tempCommentArr[0],
  //     commentList: null,
  //     date: null,
  //     picture: tempIgmArr[0],
  //   },
  //   {},
  //   {},
  //   {},
  // ];

  return (
    <>
      <Guide isElemExist={tempIgmArr.length > 0 ? true : false} />
      {tempIgmArr.map((img, i) => (
        <Posting
          picture={img}
          eventId={1}
          teamName={tempArr[i]}
          posting={tempCommentArr[i]}
          memList={tempMemArr}
          location={tempLocaArr[i]}
          commentList={tempSomeoneComment}
          elemNum={i + 1}
          date="04.12"
          key={i}
        />
      ))}
    </>
  );
}

export default Review;
