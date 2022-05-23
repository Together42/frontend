import React, { useEffect } from 'react';
import '@css/Auth/ProfileModal.scss';
import { useSetRecoilState } from 'recoil';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';
import SignUpProfileState from '@recoil/SignUpProfileState';
import xMark from '@img/xmark-solid.svg';
// 이하의 import는 이미지 불러오기 임시용
import ProfileImgArr from '@globalObj/object/ProfileImageArr';

function ProfileModal() {
  const setOpenProfileModal = useSetRecoilState(ProfileChangeModalShow);
  const setSignUpProfileImage = useSetRecoilState(SignUpProfileState);

  const onClickProfileImg = (e) => {
    setSignUpProfileImage(e.target.id);
    setOpenProfileModal(false);
  };

  const onClickXmark = () => {
    setOpenProfileModal(false);
  };

  useEffect(() => {
    return () => {
      setOpenProfileModal(false);
    };
  }, [setOpenProfileModal]);

  return (
    <div
      className="auth--profileModal--background"
      onClick={() => {
        setOpenProfileModal(false);
      }}
    >
      <div className="auth--profileModal" onClick={(e) => e.stopPropagation()}>
        <p className="auth--profileModal--title">원하시는 프로필을 클릭하세요</p>
        <img src={xMark} alt={xMark} className="auth--profileModal--xmark" onClick={onClickXmark} />
        <div className="auth--profileModal--profileWrapper">
          {ProfileImgArr.map((e, i) => (
            <img
              src={e}
              alt={e}
              key={i}
              id={e}
              className="auth--profileModal--profileImg"
              onClick={onClickProfileImg}
            />
          ))}
        </div>
        <div className="auth--profileModal--cancleWrapper">
          <span className="auth--profileModal--cancle" onClick={() => setOpenProfileModal(false)}>
            변경취소
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
