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

  const getMedalComponent = (i: number) => {
    const images = [GoldMedal, SilverMedal, BronzeMedal];
    if (i < 0 || i >= images.length) return <></>;
    return (
      <div className="medal">
        <img src={images[i]} alt="none" />
      </div>
    );
  };

  return (
    userList && (
      <div className="eventLog">
        <div className="title">
          <span>🎉 집현전 활동에 참여해주셔서 감사합니다 🎉</span>
        </div>
        <div className="medalList">
          {userList.map((person, i) => {
            if (i <= 4)
              return (
                <div key={`medal ${person.intraId}`} className="profileBox">
                  <div className="point">{person.totalPoint}회</div>
                  {getMedalComponent(i)}
                  <div className="profile">
                    <img src={person.profile} alt="none"></img>
                  </div>
                  <div>
                    <div className="intraId">{person.intraId}</div>
                    <div className="detailPoint">
                      <span>{`회의${person.meetingPoint}/`}</span>
                      <span>{`이벤트${person.eventPoint}`}</span>
                    </div>
                  </div>
                </div>
              );
            return <React.Fragment key={`medal ${person.intraId}`}></React.Fragment>;
          })}
        </div>
        <div className="list">
          {userList.map((person, i) => {
            if (i <= 4) return <React.Fragment key={`list ${person.intraId}`}></React.Fragment>;
            return (
              <div key={`list ${person.intraId}`} className="box">
                <div className="profile">
                  <img src={person.profile} alt="none"></img>
                </div>
                <div className="infoBox">
                  <div className="intraId">{person.intraId}</div>
                  <div className="totalPoint">
                    <span>{`${person.totalPoint}회 참여`}</span>
                  </div>
                  <div className="detailPoint">
                    <span>{`${person.meetingPoint}/`}</span>
                    <span>{`${person.eventPoint}`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Log;
