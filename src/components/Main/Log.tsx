import React, { useState } from 'react';
// import useSWR from 'swr';
// import fetcher from '@globalObj/function/fetcher';
// import getAddress from '@globalObj/function/getAddress';
import '@css/Main/Log.scss';

// temp below
import Image1 from '@img/profile-1.jpg';
import Image2 from '@img/profile-2.jpg';
import Image3 from '@img/profile-3.jpg';
import Image4 from '@img/profile-4.jpg';

import GoldMedal from '@img/gold-medal.png';
import SilverMedal from '@img/silver-medal.png';
import BronzeMedal from '@img/bronze-medal.png';

const activity_dummy = [
  { id: 0, userId: 1, userIntra: 'Kyungsle', userUrl: Image1, categoryId: 0, point: 10 },
  { id: 1, userId: 2, userIntra: 'Kyungsle', userUrl: Image2, categoryId: 0, point: 4 },
  { id: 2, userId: 3, userIntra: 'Kyungsle', userUrl: Image4, categoryId: 0, point: 6 },
  { id: 3, userId: 4, userIntra: 'Kyungsle', userUrl: Image1, categoryId: 0, point: 14 },
  { id: 4, userId: 5, userIntra: 'Kyungsle', userUrl: Image2, categoryId: 0, point: 44 },
  { id: 5, userId: 6, userIntra: 'Kyungsle', userUrl: Image4, categoryId: 0, point: 2 },
  { id: 6, userId: 7, userIntra: 'Kyungsle', userUrl: Image3, categoryId: 0, point: 6 },
  { id: 7, userId: 8, userIntra: 'Kyungsle', userUrl: Image1, categoryId: 0, point: 0 },
  { id: 8, userId: 9, userIntra: 'Kyungsle', userUrl: Image3, categoryId: 0, point: 19 },
];

const Log = () => {
  // const { data: userList } = useSWR<any>(`${getAddress()}/api/auth/userList`, fetcher, {
  //   dedupingInterval: 60000,
  // });
  const [userList, setUserList] = useState(activity_dummy.sort((a, b) => b.point - a.point));

  return (
    <div className="eventLog">
      <div>회의 참석 기록</div>
      <div className="medalList">
        <div className="profile">
          <div className="point">{userList[0].point}회</div>
          <div className="medal">
            <img src={GoldMedal} alt="none"></img>
          </div>
          <div>
            <img src={userList[0].userUrl} alt="none"></img>
          </div>
          <div className="intraId">{userList[0].userIntra}</div>
        </div>
        <div className="profile">
          <div className="point">{userList[1].point}회</div>
          <div className="medal">
            <img src={SilverMedal} alt="none"></img>
          </div>
          <div>
            <img src={userList[1].userUrl} alt="none"></img>
          </div>
          <div className="intraId">{userList[1].userIntra}</div>
        </div>
        <div className="profile">
          <div className="point">{userList[2].point}회</div>
          <div className="medal">
            <img src={BronzeMedal} alt="none"></img>
          </div>
          <div>
            <img src={userList[2].userUrl} alt="none"></img>
          </div>
          <div className="intraId">{userList[2].userIntra}</div>
        </div>
        <div className="profile">
          <div className="point">{userList[3].point}회</div>

          <div>
            <img src={userList[3].userUrl} alt="none"></img>
          </div>
          <div className="intraId">{userList[3].userIntra}</div>
        </div>
        <div className="profile">
          <div className="point">{userList[4].point}회</div>

          <div>
            <img src={userList[4].userUrl} alt="none"></img>
          </div>
          <div className="intraId">{userList[4].userIntra}</div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Log;
