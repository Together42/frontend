import React, { useState } from 'react';
import '@css/Main/Apply.scss';

function Apply() {
  const [intraID, setIntraID] = useState('');
  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  const onChange = (e: any) => {
    setIntraID(e.target.value);
  };

  return (
    <div className="main--apply">
      <p className="main--apply--title">친바 신청하기</p>
      <div className="main--apply--formbox">
        <form onSubmit={onSubmit} className="main--apply--formbox--form">
          <input
            className="main--apply--formbox--input"
            placeholder="인트라 id를 입력해주세용"
            onChange={onChange}
            value={intraID}
          ></input>
          <button className="main--apply--formbox--button">신청</button>
        </form>
      </div>
    </div>
  );
}

export default Apply;
