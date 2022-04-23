import React, { useState } from 'react';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import AuthForm from './AuthForm';
import '@css/Auth/Auth.scss';

function Auth() {
  const [mode, setMode] = useState(false);
  const onClickMode = () => {
    setMode((prev) => !prev);
  };
  return (
    <>
      <Header />
      <Navbar />
      <div className="auth--wrapper">
        {mode ? (
          <>
            <p className="auth--hello">관리자의 승인 후 로그인이 가능합니다</p>
            <p className="auth--hello">얼마 걸리지 않을거에요!</p>
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
