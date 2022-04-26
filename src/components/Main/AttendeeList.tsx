import React, { useEffect } from 'react';
import '@css/Main/AttendeeList.scss';
import Xmark from '@img/xmark-solid.svg';
// 이하의 import는 이미지 불러오기 임시용
import profile1 from '@img/profile 1.png';
import profile2 from '@img/profile 2.png';
import profile3 from '@img/profile 3.png';
import profile4 from '@img/profile 4.png';
import profile5 from '@img/profile 5.png';
import profile6 from '@img/profile 6.png';
import profile7 from '@img/profile 7.png';
import profile8 from '@img/profile 8.png';
import profile9 from '@img/profile 9.png';
import AttendeeListProfile from './AttendeeListProfile';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/SelectedEvent';

function AttendeeList() {
  const tempNameArr = [
    'kyungsle',
    'kyungsle',
    'kyungsle',
    'kyungsle',
    'kyungsle',
    'kyungsle',
    'kyungsle',
    'kyungsle',
    'Tkim',
  ];
  const tempProfileArr = [profile1, profile2, profile3, profile4, profile5, profile6, profile7, profile8, profile9];
  const selectedEvent = useRecoilValue(SelectedEvent);

  return (
    <div className="main--attendeeList">
      <p className={`main--attendeeList--title ${!selectedEvent?.title && 'data_none'}`}>
        {selectedEvent?.title ? `${selectedEvent.title} 에 신청한 사서는?` : '친바 많이 신청해주세요..'}
      </p>
      <div className="main--attendeeList--profiles">
        {tempNameArr.map((e, i) => (
          <AttendeeListProfile intraID={e} index={i} image={tempProfileArr[i]} key={i} />
        ))}
      </div>
    </div>
  );
}

export default AttendeeList;
