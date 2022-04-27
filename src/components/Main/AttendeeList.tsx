import React, { useEffect, useState } from 'react';
import '@css/Main/AttendeeList.scss';
import AttendeeListProfile from '@main/AttendeeListProfile';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/SelectedEvent';
import axios from 'axios';

function AttendeeList() {
  const selectedEvent = useRecoilValue(SelectedEvent);
  const [teamList, setTeamList] = useState([]);

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

  return (
    <div className="main--attendeeList">
      <p className={`main--attendeeList--title ${!(selectedEvent.title && teamList.length) && 'data_none'}`}>
        {selectedEvent.title && teamList.length
          ? `${selectedEvent.title} 에 신청한 사서는?`
          : '친바 많이 신청해주세요..'}
      </p>
      {selectedEvent.title && teamList.length && (
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
