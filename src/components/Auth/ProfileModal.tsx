import React from 'react';
import '@css/Auth/ProfileModal.scss';
// 이하의 import는 이미지 불러오기 임시용
import profile1 from '@img/profile 1.png';
import profile2 from '@img/profile 2.png';
import profile3 from '@img/profile 3.png';
import profile4 from '@img/profile 4.png';
import profile5 from '@img/profile 5.png';
import profile6 from '@img/profile 6.png';
import profile7 from '@img/profile 7.png';
import profile8 from '@img/profile 8.png';
import profile9 from '@img/profile 9.png';
import { useSetRecoilState } from 'recoil';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';

function ProfileModal() {
  const tempProfileArr = [
    profile1,
    profile2,
    profile3,
    profile4,
    profile5,
    profile6,
    profile7,
    profile8,
    profile9,
    profile1,
    profile2,
    profile3,
    profile4,
    profile5,
    profile6,
    profile7,
    profile8,
    profile9,
    profile1,
    profile2,
    profile3,
    profile4,
    profile5,
    profile6,
    profile7,
    profile8,
    profile9,
  ];
  const setOpenProfileModal = useSetRecoilState(ProfileChangeModalShow);
  return (
    <div className="profileModal">
      <p className="profileModal--title">원하시는 프로필을 클릭하세요</p>
      <div className="profileModal--profileWrapper">
        {tempProfileArr.map((e, i) => (
          <img src={e} alt={e} key={i} className="profileModal--profileImg" />
        ))}
      </div>
      <div className="profileModal--cancleWrapper">
        <span className="profileModal--cancle" onClick={() => setOpenProfileModal(false)}>
          변경취소
        </span>
      </div>
    </div>
  );
}

export default ProfileModal;
