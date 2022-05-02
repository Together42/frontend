import React, { useEffect, useMemo, useState } from 'react';
import '@css/Main/AttendeeList.scss';
import AttendeeListProfile from '@main/AttendeeListProfile';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/SelectedEvent';
import axios from 'axios';
import { teamMemInfo } from '@usefulObj/types';

function AttendeeList() {
  const selectedEvent = useRecoilValue(SelectedEvent);
  const [teamList, setTeamList] = useState<teamMemInfo[]>([]);
  const [showAttendeeList, setShowAttendeeList] = useState(selectedEvent.title && teamList.length);

  useEffect(() => {
    if (selectedEvent.id) {
      axios
        .get(`${process.env.SERVER_ADR}/api/together/matching/${selectedEvent.id}`)
        .then((res) => {
          if (res.data.teamList && Object.keys(res.data.teamList).length) setTeamList(res.data.teamList['null']);
          else setTeamList([]);
        })
        .catch(() => {
          alert('알 수 없는 오류가..');
        });
    }
  }, [selectedEvent.id]);

  useMemo(() => {
    setShowAttendeeList(selectedEvent.title && teamList.length);
  }, [selectedEvent.title, teamList.length]);

  // console.log(teamList);

  return (
    <div className={`main--attendeeList ${!showAttendeeList && 'data_none_div'}`}>
      <p className={`main--attendeeList--title ${!showAttendeeList && 'data_none_title'}`}>
        {showAttendeeList ? `${selectedEvent.title} 에 신청한 사서는?` : '친바 많이 신청해주세요..'}
      </p>
      {showAttendeeList ? (
        <div className="main--attendeeList--profiles">
          {teamList.map((e) => (
            <AttendeeListProfile intraID={e.loginId} image={e.url} key={e.loginId} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AttendeeList;
