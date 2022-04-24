import React from 'react';
import Posting from '@review/Posting';
// 이하의 import는 이미지 불러오기 임시용
import reviewImage1 from '@img/review1.jpg';
import reviewImage2 from '@img/review2.jpg';
import reviewImage3 from '@img/review3.jpg';
import reviewImage4 from '@img/review4.jpg';
import profile1 from '@img/profile 1.png';
import profile2 from '@img/profile 2.png';
import profile3 from '@img/profile 3.png';
import profile4 from '@img/profile 4.png';

function Review() {
  const tempArr = ['team1', 'team1', 'team1', 'team1'];
  const tempIgmArr = [reviewImage1, reviewImage2, reviewImage3, reviewImage4];
  const tempCommentArr = [
    '친해지기 바라!!!👍',
    '저번에 못올린 친바 3회차!',
    '"사"팀  광수육회 갔습니당',
    '사서의 날은 지났지만.. 친바 진행했습니다!! 장독묵은지 왔어요~',
  ];
  const tempMemberArr = [profile1, profile2, profile3, profile4];
  return (
    <>
      {tempIgmArr.map((img, i) => (
        <Posting image={img} teamName={tempArr[i]} comment={tempCommentArr[i]} memberArr={tempMemberArr} />
      ))}
    </>
  );
}

export default Review;
