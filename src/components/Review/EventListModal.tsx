import EventList from '@recoil/Review/EventList';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Xmark from '@img/xmark-solid.svg';
import { ReviewSelectedEventType } from '@usefulObj/types';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import '@css/Review/eventModal.scss';
import EventListModalShow from '@recoil/Review/EventListModalShow';
import glassImg from '@img/magnifying-glass-solid.svg';

function EventListModal() {
  const eventList = useRecoilValue(EventList);
  const setSelectedEvent = useSetRecoilState(SelectedEvent);
  const setEventListModalShow = useSetRecoilState(EventListModalShow);
  const [modalEventList, setModalEventList] = useState<ReviewSelectedEventType[]>(null);
  const [inputText, setInputText] = useState('');

  const onClickEvent = (event: ReviewSelectedEventType) => {
    setSelectedEvent(event);
  };

  const onClickXbtn = () => {
    setEventListModalShow(false);
  };

  const onChangeInput = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    setModalEventList(eventList);
  }, [eventList]);

  return (
    <div className="review--eventModal--wrapper">
      <div className="review--eventModal--header--xbtn_wrapper">
        <img className="review--eventModal--header--xbtn" src={Xmark} alt={Xmark} onClick={onClickXbtn} />
      </div>
      <div className="review--eventModal--header">
        <input
          className="review--eventModal--header--title"
          placeholder="이벤트 검색"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = '이벤트 검색')}
          value={inputText}
          onChange={onChangeInput}
        />
        <img className="review--eventModal--header--glass" src={glassImg} alt={glassImg}></img>
      </div>
      {modalEventList &&
        modalEventList
          .filter((event1) => event1['title'].includes(inputText))
          .map((event2) => (
            <p className="review--eventModal--event" key={event2['id']} onClick={() => onClickEvent(event2)}>
              {event2['title']}
            </p>
          ))}
    </div>
  );
}

export default EventListModal;
