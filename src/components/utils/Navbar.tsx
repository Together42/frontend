import React from 'react';
import '@css/utils/Navbar.scss';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { clearToken, getToken } from '@cert/TokenStorage';
import { Dropdown } from './Dropdown';
import getAddress from '@globalObj/function/getAddress';
import apiClient from '@service/apiClient';

function Navbar() {
  const setLoginState = useSetRecoilState(GlobalLoginState);
  const navigate = useNavigate();
  const url = `${getAddress()}/auth/google`;

  const onClickLogOut = () => {
    // apiClient
    //   .post('/auth/logout')
    //   .then((res) => {
    //     console.log('logout', res);
    //     clearToken();
    //     setLoginState(() => {
    //       return {
    //         id: '',
    //         isLogin: false,
    //         isAdmin: false,
    //         profileUrl: '',
    //       };
    //     });
    //     alert('로그아웃 되셨습니다!');
    //     navigate('/');
    //   })
    //   .catch((err) => {
    //     console.log('logout error', err);
    //   });
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
    navigate('/');
  };

  const onClickAuthTimeline = () => {
    if (getToken()) {
      navigate('/2022-timeline');
    } else {
      alert('로그인을 먼저 해주세요!');
      navigate('/auth');
    }
  };

  //   const onClickAuthReview = () => {
  //     if (getToken()) {
  //       navigate('/review/');
  //     } else {
  //       alert('로그인을 먼저 해주세요!');
  //       navigate('/auth');
  //     }
  //   };

  const onClickEventCreate = () => {
    navigate('/');
  };

  const onClickShowLog = () => {
    navigate('/event/log');
  };

  const onClickEventMatching = () => {
    navigate('/event/match');
  };

  const onClickRotation = () => {
    if (getToken()) {
      navigate('/rotation/');
    } else {
      alert('로그인을 먼저 해주세요!');
      navigate('/auth');
    }
  };

  const onClickCalendar = () => {
    navigate('/rotation/calendar');
  };

  return (
    <div className="navbar--wrapper">
      <Dropdown
        title={<button>이벤트</button>}
        menu={[
          <button onClick={onClickEventCreate}>생성하기</button>,
          <button onClick={onClickShowLog}>기록보기</button>,
          <button onClick={onClickEventMatching}>매칭하기</button>,
        ]}
      />
      <Dropdown
        title={<button>사서 로테이션</button>}
        menu={[
          <button onClick={onClickRotation}>신청하기</button>,
          <button onClick={onClickCalendar}>달력보기</button>,
        ]}
      />
      {/* <span onClick={onClickAuthReview}>친스타그램</span> */}
      <span onClick={onClickAuthTimeline}>집현전실록</span>
      {getToken() ? <span onClick={onClickLogOut}>로그아웃</span> : <a href={url}>구글 로그인</a>}
    </div>
  );
}

export default Navbar;
