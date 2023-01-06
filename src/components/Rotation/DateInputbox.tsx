import React, { useEffect, useState } from 'react';
import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';
import '@css/Rotation/Rotation.scss';

export const GetDateOnBusiness = () => {
  const [DateArr, SetDateArr] = useState({
    first: '',
    second: '',
    third: '',
    fourth: '',
    fifth: '',
  });

  const onChangeAccount = (e) => {
    SetDateArr({
      ...DateArr,
      [e.target.name]: e.target.value,
    });
  };

  console.log(DateArr);
  return (
    <>
      <div className="rotation--dateBox">
        <div className="rotation--input">
          <label>1주차 </label>
          <input className="rotation--eachInput" id="first" name="first" onChange={onChangeAccount} />
        </div>
        <div className="rotation--input">
          <label>2주차 </label>
          <input className="rotation--eachInput" id="second" name="second" onChange={onChangeAccount} />
        </div>
        <div className="rotation--input">
          <label>3주차 </label>
          <input className="rotation--eachInput" id="third" name="third" onChange={onChangeAccount} />
        </div>
        <div className="rotation--input">
          <label>4주차 </label>
          <input className="rotation--eachInput" id="fourth" name="fourth" onChange={onChangeAccount} />
        </div>
        <div className="rotation--input">
          <label>5주차 </label>
          <input className="rotation--eachInput" id="fifth" name="fifth" onChange={onChangeAccount} />
        </div>
      </div>
    </>
  );
};
