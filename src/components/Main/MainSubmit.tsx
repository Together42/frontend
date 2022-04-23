import React from 'react';
import '@css/MainSubmit.scss';

function MainSubmit() {
  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="main--submit">
      <p className="main--submit--title">친바 신청하기</p>
      <div className="main--submit--formbox">
        <form onSubmit={onSubmit} className="main--submit--formbox--form">
          <input className="main--submit--formbox--input"></input>
          <button className="main--submit--formbox--button">신청</button>
        </form>
      </div>
    </div>
  );
}

export default MainSubmit;
