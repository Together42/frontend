import React, { useState } from 'react';
import '@css/utils/MobileNavber.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { clearToken, getToken } from '@cert/TokenStorage';
import hambergImg from '@img/bars-solid-white.svg';

function MobileNavber() {
  const navigate = useNavigate();
  const setLoginState = useSetRecoilState(GlobalLoginState);
  const [modalOpen, setModalOpen] = useState(false);

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

  const onClickModalShow = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <div className="navbar--mobile--wrapper">
      <div className="navbar--mobile--title">
        <Link to={`/`}>Together 42</Link>
      </div>
      <img className="navbar--mobile--hamberg" src={hambergImg} alt={hambergImg} onClick={onClickModalShow}></img>
      {modalOpen && (
        <div className="navbar--mobile--modal">
          <Link to={`/`}>이벤트생성</Link>
          <Link to={`/Result`}>랜덤매칭</Link>
          <Link to={`/review`}>친스타그램</Link>
          {getToken() ? <span onClick={onClickLogOut}>로그아웃</span> : <Link to={`/auth`}>로그인하기</Link>}
        </div>
      )}
    </div>
  );
}

export default MobileNavber;
