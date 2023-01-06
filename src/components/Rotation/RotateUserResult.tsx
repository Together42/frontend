import React, { useEffect, useState } from 'react';
import getAddress from '@globalObj/function/getAddress';
import axios from 'axios';
import '@css/Rotation/Rotation.scss';

export const RotateUserResult = () => {
  const [UserList, setUserList] = useState(null);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const getUserList = () => {
    axios
      .get(`${getAddress()}/api/auth/userList`)
      .then((res) => res.data.userList)
      .then((res2) => setUserList(res2))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserList();
  }, []);

  // [week : "1" , list : "ywee, jwoo, ... "] 이런 형식으로 오는 API 필요

  return (
    <>
      <div className="rotation--wrapper">
        <div className="rotation--title">
          📚 {year} {month} 월의 사서 명단 📚
        </div>
        <div className="rotation--resultbox">{UserList ? UserList.map((e) => <div>{e['intraId']}</div>) : null}</div>
        <div className="rotation--result-text">사서 활동에 감사드립니다 👏</div>
      </div>
    </>
  );
};
