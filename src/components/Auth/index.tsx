import React, { useState } from 'react';
import AuthForm from '@auth/AuthForm';
import '@css/Auth/Auth.scss';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';
import SignUpProfileState from '@recoil/SignUpProfileState';

function Auth() {
  const [signUpMode, setSignUpMode] = useState(false);
  const setOpenProfileModal = useSetRecoilState(ProfileChangeModalShow);
  const profileImage = useRecoilValue(SignUpProfileState);

  const onClickMode = () => {
    setSignUpMode((prev) => !prev);
  };
  const onClickOpenProfile = () => {
    setOpenProfileModal((prev) => !prev);
  };
  return (
    <>
      <div className={`auth--wrapper ${signUpMode ? 'signup' : 'login'} `}>
        {signUpMode ? (
          <>
            <p className="auth--hello">회원가입 후 관리자 승인이 필요합니다</p>
            <p className="auth--hello">얼마 걸리지 않을거에요!</p>
            <div className="auth--profile">
              <img src={profileImage['image']} alt="profile" />
              <p onClick={onClickOpenProfile}>프로필 변경</p>
            </div>
          </>
        ) : (
          <p className="auth--hello">어서오세요 사서님, 친해질 시간입니다!</p>
        )}
        <AuthForm signUpMode={signUpMode} setSignUpMode={setSignUpMode} />
        <p className="auth--guide">
          {signUpMode ? '알고 보니 회원가입을 하셨다면?' : '아직 가입을 안 하신 사서님은 여기로!'}
        </p>
        <p className="auth--mode_change" onClick={onClickMode}>
          {signUpMode ? '로그인' : '회원가입'}
        </p>
      </div>
    </>
  );
}

export default Auth;
