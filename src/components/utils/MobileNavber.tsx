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
    setModalOpen((prev) => !prev);
    alert('로그아웃 되셨습니다!');
    navigate('/auth');
  };

  const onClickModalShow = () => {
    setModalOpen((prev) => !prev);
  };

  const onClickAuthTimeline = () => {
    setModalOpen((prev) => !prev);
    if (getToken()) {
      navigate('/2022-timeline');
    } else {
      alert('로그인을 먼저 해주세요!');
      navigate('/auth');
    }
  };

  const onClickAuthReview = () => {
    setModalOpen((prev) => !prev);
    if (getToken()) {
      navigate('/review/*');
    } else {
      alert('로그인을 먼저 해주세요!');
      navigate('/auth');
    }
  };

  return (
    <div className="navbar--mobile--wrapper">
      <div className="navbar--mobile--title">
        <Link to={`/`} onClick={() => setModalOpen(false)}>
          Together 42
        </Link>
      </div>
      <img className="navbar--mobile--hamberg" src={hambergImg} alt={hambergImg} onClick={onClickModalShow}></img>
      {modalOpen && (
        <div className="navbar--mobile--modal">
          <Link to={`/`} onClick={onClickModalShow}>
            이벤트생성
          </Link>
          <Link to={`/Result`} onClick={onClickModalShow}>
            이벤트매칭
          </Link>
          <span onClick={onClickAuthReview}>친스타그램</span>
          <span onClick={onClickAuthTimeline}>집현전실록</span>
          {getToken() ? (
            <span onClick={onClickLogOut}>로그아웃</span>
          ) : (
            <Link to={`/auth`} onClick={onClickModalShow}>
              로그인하기
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileNavber;
