import React, { useEffect, useState } from 'react';
import '@css/Main/Apply.scss';
import axios from 'axios';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/SelectedEvent';
import { EventType } from '@usefulObj/types';

function Apply() {
  const LoginState = useRecoilValue(GlobalLoginState);
  const [EventList, setEventList] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType>({
    id: null,
    title: null,
    description: null,
    createdBy: null,
  });
  const setGlobalSelectedEvent = useSetRecoilState(SelectedEvent);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (LoginState.isLogin) {
      axios
        .post(
          `${process.env.SERVER_ADR}/api/together/register`,
          {
            eventId: selectedEvent.id,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .catch((error) => {
          alert(error.response.data);
        });
    } else {
      alert('로그인을 하셔야 신청 가능합니다!');
    }
  };

  const onClickEventList = (e) => {
    const clickedEvent = EventList.find((ev) => ev.id === parseInt(e.target.id, 10));
    setSelectedEvent(clickedEvent);
    setGlobalSelectedEvent(clickedEvent);
  };

  useEffect(() => {
    axios.get(`${process.env.SERVER_ADR}/api/together`).then((res) => {
      res.data.EventList.forEach((e: EventType) => {
        axios.get(`${process.env.SERVER_ADR}/api/together/matching/${e.id}`).then((res) => {
          if (res.data.teamList && res.data.teamList['null']) setEventList((prev) => [...prev, e]);
        });
      });
    });
    return () => {
      setGlobalSelectedEvent({
        id: null,
        title: null,
        description: null,
        createdBy: null,
      });
    };
  }, [setGlobalSelectedEvent]);

  return (
    <div className="main--apply">
      <p className="main--apply--title">
        {LoginState.id === '' ? '로그인 후 신청 가능!' : `${LoginState.id}님, 신청하시죠?`}
      </p>
      <div className="main--apply--wrapper">
        <div className={`main--apply--list ${EventList.length >= 6 && 'scroll'}`}>
          <p className="main--apply--list--title">신청 가능 목록</p>
          {EventList.length > 0 ? (
            EventList.map((e, i) => (
              <p className="main--apply--list--event" key={i}>
                <span id={`${e.id}`} onClick={onClickEventList}>
                  - {e.title}
                </span>
              </p>
            ))
          ) : (
            <p className="main--apply--list--empty">이벤트가 없습니다</p>
          )}
        </div>
        {EventList.length > 0 && (
          <div className={`main--apply--eventInfo ${!EventList.length && 'empty'}`}>
            {selectedEvent.id ? (
              <>
                <p className="main--apply--eventInfo--title">{selectedEvent.title}</p>
                <span className="main--apply--eventInfo--description">{selectedEvent.description}</span>
                <div className="main--apply--eventInfo--submit">
                  <span onClick={onSubmit}>신청하기</span>
                </div>
              </>
            ) : (
              <p className="main--apply--eventInfo--empty">이벤트를 클릭해주세요</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Apply;
