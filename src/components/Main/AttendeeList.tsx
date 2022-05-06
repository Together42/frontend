import React, { useMemo, useState } from 'react';
import '@css/Main/AttendeeList.scss';
import AttendeeListProfile from '@main/AttendeeListProfile';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/SelectedEvent';
import ApplyTeamMemArr from '@recoil/ApplyTeamMemArr';

function AttendeeList() {
  const selectedEvent = useRecoilValue(SelectedEvent);
  const teamList = useRecoilValue(ApplyTeamMemArr);
  const [showAttendeeList, setShowAttendeeList] = useState(selectedEvent.title && teamList.length);

  useMemo(() => {
    setShowAttendeeList(selectedEvent.title && teamList.length);
  }, [selectedEvent.title, teamList.length]);

  return (
    <div className={`main--attendeeList ${!showAttendeeList && 'data_none_div'}`}>
      <p className={`main--attendeeList--title ${!showAttendeeList && 'data_none_title'}`}>
        {showAttendeeList ? `${selectedEvent.title} 에 신청한 사서는?` : '친바 많이 신청해주세요..'}
      </p>
      {showAttendeeList ? (
        <div className="main--attendeeList--profiles">
          {teamList.map((e) => (
            <AttendeeListProfile intraID={e.intraId} image={e.url} key={e.intraId} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AttendeeList;
