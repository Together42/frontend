import React, { useEffect, useRef, useState } from 'react';
import '@css/Main/AttendeeList.scss';
import AttendeeListProfile from '@main/AttendeeListProfile';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/SelectedEvent';
import axios from 'axios';

function AttendeeList() {
  const selectedEvent = useRecoilValue(SelectedEvent);
  const [teamList, setTeamList] = useState([]);
  const showAttendeeList = selectedEvent.title && teamList.length;

  useEffect(() => {
    if (selectedEvent.id) {
      axios
        .get(`${process.env.SERVER_ADR}/api/together/matching/${selectedEvent.id}`)
        .then((res) => {
          setTeamList(res.data.teamList['null']);
        })
        .catch(() => {
          alert('알 수 없는 오류가..');
        });
    }
  }, [selectedEvent.id]);

  // console.log(showAttendeeList);

  return (
    <div className={`main--attendeeList ${!showAttendeeList && 'data_none_div'}`}>
      <p className={`main--attendeeList--title ${!showAttendeeList && 'data_none_title'}`}>
        {showAttendeeList ? `${selectedEvent.title} 에 신청한 사서는?` : '친바 많이 신청해주세요..'}
      </p>
      {showAttendeeList && (
        <div className="main--attendeeList--profiles">
          {teamList.map((e) => (
            <AttendeeListProfile intraID={e.loginId} image={e.url} key={e.loginId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AttendeeList;
