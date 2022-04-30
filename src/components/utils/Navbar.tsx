import React from 'react';
import '@css/utils/Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { clearToken } from '@cert/TokenStorage';

function Navbar() {
  const [LoginState, setLoginState] = useRecoilState(GlobalLoginState);
  const navigate = useNavigate();

  const onClickLogOut = () => {
    clearToken();
    setLoginState(() => {
      return {
        id: '',
        email: '',
        isLogin: false,
        isAdmin: false,
        profileUrl: '',
      };
    });
    alert('로그아웃 되셨습니다!');
    navigate('/auth');
  };

  return (
    <div className="navbar--wrapper">
      <Link to={`/`}>생성/신청</Link>
      <Link to={`/Result`}>매칭/결과</Link>
      <Link to={`/review`}>친스타그램</Link>
      {LoginState.isLogin ? <span onClick={onClickLogOut}>로그아웃</span> : <Link to={`/auth`}>로그인하기</Link>}
    </div>
  );
}

export default Navbar;
