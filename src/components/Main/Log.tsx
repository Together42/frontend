import React, { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';
import getAddress from '@globalObj/function/getAddress';
import '@css/Main/Log.scss';
import GoldMedal from '@img/gold-medal.png';
import SilverMedal from '@img/silver-medal.png';
import BronzeMedal from '@img/bronze-medal.png';
import { AttendPointType } from '@usefulObj/types';

const Log = () => {
  const { data: userList } = useSWR<AttendPointType[]>(`${getAddress()}/api/together/point`, fetcher, {
    dedupingInterval: 60000,
  });

  console.log(userList);

  const getMedalComponent = (i: number) => {
    switch (i) {
      case 0:
        return (
          <div className="medal">
            <img src={GoldMedal} alt="none"></img>
          </div>
        );
      case 1:
        return (
          <div className="medal">
            <img src={SilverMedal} alt="none"></img>
          </div>
        );
      case 2:
        return (
          <div className="medal">
            <img src={BronzeMedal} alt="none"></img>
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    userList && (
      <div className="eventLog">
        <div className="title">
          <span>🎉 회의에 참여해주신 모든 분들께 감사드립니다 🎉</span>
        </div>
        <div className="medalList">
          {(() => {
            const renderer = [];
            for (let i = 0; i <= 4; i++) {
              renderer.push(
                <div className="profile">
                  <div className="point">{userList[i].point}회</div>
                  {getMedalComponent(i)}
                  <div>
                    <img src={userList[i].profile} alt="none"></img>
                  </div>
                  <div className="intraId">{userList[i].intraId}</div>
                </div>,
              );
            }
            return renderer;
          })()}
        </div>
        <div></div>
      </div>
    )
  );
};

export default Log;
