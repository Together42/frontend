import React from 'react';
import Header from '@utils/Header';
import Navbar from '@utils/Navbar';
import '@css/Main.scss';
import MainSubmit from './MainSubmit';

function Main() {
  return (
    <>
      <Header />
      <Navbar />
      <MainSubmit />
      <div className="main--list">
        <p className="main--list--title">친바 신청 목록</p>
        <div className="main--submit--peoples"></div>
      </div>
      <div className="main--result">
        <p className="main--result--title">친바 결과보기</p>
      </div>
    </>
  );
}

export default Main;
