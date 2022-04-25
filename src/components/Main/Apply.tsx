import React, { useRef, useState } from 'react';
import '@css/Main/Apply.scss';
import axios from 'axios';

function Apply() {
  const [intraID, setIntraID] = useState('');
  const inputRef = useRef(null);
  const onSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post(`${process.env.SERVER_ADR}/register`, {
        togetherId: intraID,
      })
      .catch((error) => {
        alert(error.response.data);
      });
    setIntraID('');
  };

  const onChange = (e: any) => {
    setIntraID(e.target.value);
  };

  return (
    <div className="main--apply">
      <p className="main--apply--title">Kyungsle님, 신청하시죠?</p>
      <div className="main--apply--wrapper">
        <div className="main--apply--formbox">
          <form onSubmit={onSubmit} className="main--apply--formbox--form">
            <input
              className="main--apply--formbox--input"
              placeholder="인트라 id를 입력해주세용"
              onChange={onChange}
              ref={inputRef}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '인트라 id를 입력해주세용')}
              value={intraID}
            ></input>
            <div className="main--apply--formbox--button">
              <button>신청</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Apply;
