import React, { useCallback, useEffect, useState } from 'react';
import Xmark from '@img/xmark-solid.svg';
import '@css/Main/Event.scss';
import { EventType } from '@usefulObj/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/MainSelectedEvent';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';
import { getToken } from '@cert/TokenStorage';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';
import errorAlert from '@globalObj/function/errorAlert';
import DeviceMode from '@recoil/DeviceMode';

function Event(props: {
  eventList: EventType[];
  elem: EventType;
  setCreateMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { eventList, elem, setCreateMode } = props;
  const [selectedEvent, setSelectedEvent] = useRecoilState(SelectedEvent);
  const deviceMode = useRecoilValue(DeviceMode);
  const [xmarkVisible, setXmarkVisible] = useState(false);
  const { mutate: mutateEvent } = useSWR<EventType[]>(`${getAddress()}/meetups`, fetcher, {
    dedupingInterval: 600000,
  });

  const onClickEventList = (e: any) => {
    setCreateMode(false);
    setSelectedEvent(eventList.filter((event) => event.id === parseInt((e.target as Element).id, 10))[0]);
  };

  const deleteEvent = useCallback(() => {
    axios
      .delete(`${getAddress()}/meetups/${elem['id']}`, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
      })
      .then(() => {
        alert('삭제되었습니다');
        mutateEvent();
        setSelectedEvent(null);
      })
      .catch((err) => errorAlert(err));
  }, [elem, mutateEvent, setSelectedEvent]);

  const onClickDeleteEvent = () => {
    if (window.confirm('이벤트를 삭제하시겠습니까?')) deleteEvent();
  };

  useEffect(() => {
    if (deviceMode === 'mobile') {
      if (selectedEvent && selectedEvent.id === elem.id) setXmarkVisible(true);
      else setXmarkVisible(false);
    }
  }, [deviceMode, elem.id, selectedEvent]);

  return (
    <div
      className="main--apply--list--event_wrapper"
      onMouseOver={deviceMode === 'desktop' ? () => setXmarkVisible(true) : null}
      onMouseOut={deviceMode === 'desktop' ? () => setXmarkVisible(false) : null}
    >
      <span
        className={`main--apply--list--event ${selectedEvent && selectedEvent.id === elem.id && 'selected'}`}
        id={`${elem.id}`}
        onClick={onClickEventList}
      >
        - {elem.title}
      </span>
      <span>
        <img
          className={`main--apply--deleteXmark ${xmarkVisible && 'visible'}`}
          src={Xmark}
          alt={Xmark}
          onClick={onClickDeleteEvent}
        ></img>
      </span>
    </div>
  );
}

export default Event;
