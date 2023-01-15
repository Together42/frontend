import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from '@cert/AuthStorage';
import '@css/Rotation/Rotation.scss';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { SelectedDates } from './new_calendar';

export const NewRotate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const intraId = getAuth() ? getAuth().id : null;
  const [value, onChange] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState([]);

  return (
    <>
      <div className="rotation--wrapper">
        <div>
          {intraId} 님, {year} {month}월 사서 로테이션에 참여하시나용 ?
        </div>
        <button>yes!</button>
        <div>참여가 어려운 날짜를 선택해주세요 ! 해당 날짜를 고려해서 랜덤 매칭이 이루어집니다 </div>
        <div>
          <Calendar onChange={onChange} value={value}></Calendar>
        </div>
        <div>
          <SelectedDates value={value} unavailableDates={unavailableDates} setUnavailableDates={setUnavailableDates} />
        </div>
      </div>
    </>
  );
};
