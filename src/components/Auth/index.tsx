import React from 'react';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import AuthForm from './AuthForm';
import '@css/Auth/Auth.scss';

function Auth() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="auth--wrapper">
        <p className="auth--hello">어서오세요 사서님. 친해질 시간입니다!</p>
        <AuthForm />
        <p className="auth--guide">아직 가입을 안 하신 사서님은 여기로!</p>
        <p className="auth--mode_change">회원가입</p>
      </div>
    </>
  );
}

export default Auth;
