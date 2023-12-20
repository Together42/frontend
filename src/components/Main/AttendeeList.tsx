import React from 'react';
import '@css/Main/AttendeeList.scss';
import AttendeeListProfile from '@main/AttendeeListProfile';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/MainSelectedEvent';
import useSWR from 'swr';
import { EventType, teamMemInfo } from '@usefulObj/types';
import fetcher from '@globalObj/function/fetcher';
import getAddress from '@globalObj/function/getAddress';

function AttendeeList() {
  const selectedEvent = useRecoilValue(SelectedEvent);
  const { data: teamList } = useSWR<{
    event: EventType;
    teamList: { [x: string]: teamMemInfo[] };
  }>(selectedEvent ? `${getAddress()}/meetups/${selectedEvent.id}` : null, fetcher, {
    dedupingInterval: 600000,
  });
  const showAttendeeList =
    selectedEvent &&
    teamList &&
    teamList.teamList &&
    teamList.teamList.null &&
    Object.keys(teamList.teamList).length > 0;

  return (
    <div className={`main--attendeeList ${!showAttendeeList && 'data_none_div'}`}>
      <p className={`main--attendeeList--title ${!showAttendeeList && 'data_none_title'}`}>
        {showAttendeeList ? `${selectedEvent.title} 에 신청한 사서는?` : '친바 많이 신청해주세요..'}
      </p>
      {showAttendeeList && selectedEvent.id ? (
        <div className="main--attendeeList--profiles">
          {teamList.teamList.null.map((e) => (
            <AttendeeListProfile intraID={e.intraId} image={e.profile} key={e.intraId} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AttendeeList;
