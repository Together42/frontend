import React, { useState, useEffect } from 'react';
import LoadingSpinner from './Loading';
import { RotateUserResult } from './RotateUserResult';
import { getRotationMonthArr } from './event_utils';
import { getAuth } from '@cert/AuthStorage';
import '@css/Rotation/Rotation.scss';

export const RotateResult = () => {
  const date = new Date();
  const year = date.getFullYear();
  const nextmonth = ((date.getMonth() + 1) % 12) + 1;
  var month;
  date < new Date(year, nextmonth, -1) ? (month = nextmonth - 1) : nextmonth;
  const [Loading, setLoading] = useState(true);
  const [arr, setArr] = useState([]);
  const intraId = getAuth() ? getAuth().id : null;

  const mainApi = async () => {
    setLoading(true); // api 호출 전에 true로 변경하여 로딩화면 띄우기
    try {
      const response = await getRotationMonthArr(month, year);
      setArr(prev => [
        ...prev,
        ...response.filter(el => el.title == intraId && el.start != '')
                  .map(el => el.start)
      ].sort());
      setLoading(false); // api 호출 완료 됐을 때 false로 변경하려 로딩화면 숨김처리
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    mainApi();
  }, []);

  return (
    <div>
      {Loading ? <LoadingSpinner /> : <RotateUserResult month={month} year={year} arr={arr} intraId={intraId} />}
    </div>
  );
};
