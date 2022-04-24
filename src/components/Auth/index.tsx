import React, { useState } from 'react';
import AuthForm from './AuthForm';
import '@css/Auth/Auth.scss';
import profile1 from '@img/profile 1.png';
import { useSetRecoilState } from 'recoil';
import ProfileChangeModalShow from '@recoil/ProfileChangeModalShow';

function Auth() {
  const [mode, setMode] = useState(false);
  const setOpenProfileModal = useSetRecoilState(ProfileChangeModalShow);
  const onClickMode = () => {
    setMode((prev) => !prev);
  };
  const onClickOpenProfile = () => {
    setOpenProfileModal((prev) => !prev);
  };
  return (
    <>
      <div className={`auth--wrapper ${mode ? 'signup' : 'login'}`}>
        {mode ? (
          <>
            <p className="auth--hello">회원가입 후 관리자 승인이 필요합니다</p>
            <p className="auth--hello">얼마 걸리지 않을거에요!</p>
            <div className="auth--profile">
              <img src={profile1} alt="profile" />
              <p onClick={onClickOpenProfile}>프로필 변경</p>
            </div>
          </>
        ) : (
          <p className="auth--hello">어서오세요 사서님, 친해질 시간입니다!</p>
        )}
        <AuthForm mode={mode} />
        <p className="auth--guide">
          {mode ? '알고 보니 회원가입을 하셨다면?' : '아직 가입을 안 하신 사서님은 여기로!'}
        </p>
        <p className="auth--mode_change" onClick={onClickMode}>
          {mode ? '로그인' : '회원가입'}
        </p>
      </div>
    </>
  );
}

export default Auth;
