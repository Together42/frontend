import React, { useState } from 'react';
import '@css/MainSubmit.scss';

function MainSubmit() {
  const [intraID, setIntraID] = useState('');
  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  const onChange = (e: any) => {
    setIntraID(e.target.value);
  };

  return (
    <div className="main--submit">
      <p className="main--submit--title">친바 신청하기</p>
      <div className="main--submit--formbox">
        <form onSubmit={onSubmit} className="main--submit--formbox--form">
          <input
            className="main--submit--formbox--input"
            placeholder="인트라 id를 입력해주세용"
            onChange={onChange}
            value={intraID}
          ></input>
          <button className="main--submit--formbox--button">신청</button>
        </form>
      </div>
    </div>
  );
}

export default MainSubmit;
