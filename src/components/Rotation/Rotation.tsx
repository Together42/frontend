import React, { useState } from 'react';
import { getAuth } from '@cert/AuthStorage';
import Calendar from 'react-calendar';
import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import { useSWRConfig } from 'swr';
import 'react-calendar/dist/Calendar.css';
import '@css/Rotation/New_Rotation.scss';

export const getWeekNumber = (dateFrom = new Date()) => {
  // 해당 날짜 (일)
  const currentDate = dateFrom.getDate();

  // 이번 달 1일로 지정
  const startOfMonth = new Date(dateFrom.setDate(1));

  // 이번 달 1일이 무슨 요일인지 확인
  const weekDay = startOfMonth.getDay(); // 0: Sun ~ 6: Sat

  // ((요일 - 1) + 해당 날짜) / 7일로 나누기 = N 주차
  return Math.floor((weekDay - 1 + currentDate) / 7) + 1;
};

export const Rotate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ((currentDate.getMonth() + 1) % 12) + 1;
  const intraId = getAuth() ? getAuth().id : null;
  const [value, onChange] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [openSelectModal, setOpenSelectModal] = useState(false);
  const { mutate } = useSWRConfig();

  const onClickDay = (value) => {
    const date = value.getDate();
    if (unavailableDates.indexOf(date) > -1) {
      setUnavailableDates(unavailableDates.filter((e) => e != date));
    } else {
      setUnavailableDates([...unavailableDates, date]);
    }
  };

  const onClickSetDateModal = () => {
    setOpenSelectModal(!openSelectModal);
  };

  const resetDates = () => {
    setUnavailableDates([]);
  };

  const onClickPostEvent = () => {
    if (getWeekNumber(currentDate) < 4 || currentDate > new Date(year, month, -2)) {
      alert('신청기간이 아닙니다!');
      return;
    }
    if (getToken()) {
      axios
        .post(
          `${getAddress()}/api/rotation/attend`,
          {
            intraId: intraId,
            attendLimit: unavailableDates,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then((res) => {
          alert('신청되었습니다');
          mutate(`${getAddress()}/api/rotation/attend`);
        })
        .catch((err) => errorAlert(err));
    }
  };

  const onClickCancel = () => {
    axios
      .delete(`${getAddress()}/api/rotation/attend`, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
        data: {
          intraId: intraId,
        },
      })
      .then(() => {
        alert('신청 취소되었습니다');
      })
      .catch((err) => errorAlert(err));
  };

  return (
    <>
      <div className="rotation--wrapper">
        <div className="rotation--title">
          {intraId} 님, {year} {month}월 사서 로테이션에 참여하시나요 ?
        </div>
        <div className="rotation--button">
          <div>
            <button onClick={onClickSetDateModal}>Yes!</button>
          </div>
          <div>
            <button onClick={onClickCancel}>신청 취소</button>
          </div>
        </div>
        {openSelectModal ? (
          <div className="rotation--selectDates">
            <div className="rotation-selectDates-title">
              <p>참여가 어려운 날짜를 선택해주세요 !</p>
              <p>해당 날짜를 고려해서 랜덤 매칭이 이루어집니다</p>
              <p>(필수 사항은 아닙니다)</p>
            </div>
            <div>
              <Calendar
                activeStartDate={new Date(year, month - 1, 1)}
                onClickDay={(value) => onClickDay(value)}
                value={value}
              ></Calendar>
            </div>
            <div className="rotation--viewSelectDates">
              <div className="rotation-viewSelectDates-title">선택한 날짜</div>
              <div className="rotation--selectDates-box">
                {unavailableDates.map((e) => (
                  <span key={e}>{e} </span>
                ))}
              </div>
              <button onClick={resetDates}>reset</button>
            </div>
            <button className="select-button" onClick={onClickPostEvent}>
              신청
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};
