import React, { useEffect, useState } from 'react';
import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';
import '@css/Rotation/Rotation.scss';
import { getRotationArr } from './event_utils';
import { getAuth } from '@cert/AuthStorage';

export const RotateUserResult = (props) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return (
    <>
      <div className="rotation--wrapper">
        <div className="rotation--title">
          📚 {props.intraId} 님의 {year} {month} 월의 사서 로테 참여일입니다 📚
        </div>
        <div className="rotation--resultbox">
          {props.arr.empty ? props.arr.map((e) => <div>{e}</div>) : <div>참여일 정보가 없습니다</div>}
        </div>
        <div className="rotation--result-text">사서 활동에 감사드립니다 👏</div>
      </div>
    </>
  );
};
