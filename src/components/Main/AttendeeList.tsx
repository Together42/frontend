import React, { useMemo, useState } from 'react';
import '@css/Main/AttendeeList.scss';
import AttendeeListProfile from '@main/AttendeeListProfile';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/SelectedEvent';
import useSWR from 'swr';
import { EventType, teamMemInfo } from '@usefulObj/types';
import fetcher from '@globalObj/function/fetcher';
import getAddress from '@globalObj/function/getAddress';

function AttendeeList() {
  const selectedEvent = useRecoilValue(SelectedEvent);
  const { data: teamList } = useSWR<{
    event: EventType;
    teamList: { [x: string]: teamMemInfo[] };
  }>(`${getAddress()}/api/together/${selectedEvent.id}`, fetcher, {
    dedupingInterval: 600000,
  });
  const [showAttendeeList, setShowAttendeeList] = useState<boolean>(
    selectedEvent.title && teamList && teamList.teamList && Object.keys(teamList.teamList).length ? true : false,
  );

  useMemo(() => {
    setShowAttendeeList(
      selectedEvent.title && teamList && teamList.teamList && Object.keys(teamList.teamList).length ? true : false,
    );
  }, [selectedEvent.title, teamList]);

  console.log(teamList);

  return (
    <div className={`main--attendeeList ${!showAttendeeList && 'data_none_div'}`}>
      <p className={`main--attendeeList--title ${!showAttendeeList && 'data_none_title'}`}>
        {showAttendeeList ? `${selectedEvent.title} 에 신청한 사서는?` : '친바 많이 신청해주세요..'}
      </p>
      {showAttendeeList && selectedEvent.id ? (
        <div className="main--attendeeList--profiles">
          {teamList.teamList.null.map((e) => (
            <AttendeeListProfile intraID={e.intraId} image={e.url} key={e.intraId} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AttendeeList;
