import EventList from '@recoil/Review/EventList';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Xmark from '@img/xmark-solid.svg';
import { ReviewSelectedEventType } from '@usefulObj/types';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import '@css/Review/eventModal.scss';
import EventListModalShow from '@recoil/Review/EventListModalShow';

function EventListModal() {
  const eventList = useRecoilValue(EventList);
  const setSelectedEvent = useSetRecoilState(SelectedEvent);
  const setEventListModalShow = useSetRecoilState(EventListModalShow);

  const onClickEvent = (event: ReviewSelectedEventType) => {
    setSelectedEvent(event);
  };

  const onClickXbtn = () => {
    setEventListModalShow(false);
  };

  return (
    <div className="review--eventModal--wrapper">
      <div className="review--eventModal--header">
        <span className="review--eventModal--header--title">이벤트 목록</span>
        <img className="review--eventModal--header--xbtn" src={Xmark} alt={Xmark} onClick={onClickXbtn} />
      </div>
      {eventList.map((event) => (
        <p className="review--eventModal--event" key={event['id']} onClick={() => onClickEvent(event)}>
          {event['title']}
        </p>
      ))}
    </div>
  );
}

export default EventListModal;
