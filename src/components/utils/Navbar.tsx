import React from 'react';
import '@css/utils/Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { clearToken, getToken } from '@cert/TokenStorage';

function Navbar() {
  const setLoginState = useSetRecoilState(GlobalLoginState);
  const navigate = useNavigate();

  const onClickLogOut = () => {
    clearToken();
    setLoginState(() => {
      return {
        id: '',
        isLogin: false,
        isAdmin: false,
        profileUrl: '',
      };
    });
    alert('로그아웃 되셨습니다!');
    navigate('/auth');
  };

  const onClickAuthTimeline = () => {
    if (getToken()) {
      navigate('/2022-timeline');
    } else {
      alert('로그인을 먼저 해주세요!');
      navigate('/auth');
    }
  };

  const onClickAuthReview = () => {
    if (getToken()) {
      navigate('/review/*');
    } else {
      alert('로그인을 먼저 해주세요!');
      navigate('/auth');
    }
  };
  return (
    <div className="navbar--wrapper">
      <Link to={`/`}>이벤트생성</Link>
      <Link to={`/Result`}>이벤트매칭</Link>
      <span onClick={onClickAuthReview}>친스타그램</span>
      <span onClick={onClickAuthTimeline}>집현전실록</span>
      {getToken() ? <span onClick={onClickLogOut}>로그아웃</span> : <Link to={`/auth`}>로그인하기</Link>}
    </div>
  );
}

export default Navbar;
