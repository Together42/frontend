import EventList from '@recoil/Review/EventList';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Xmark from '@img/xmark-solid.svg';
import { ReviewSelectedEventType, ReviewSelectedTeamType, teamMemInfo } from '@usefulObj/types';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import '@css/Review/SelectSomeModal.scss';
import EventListModalShow from '@recoil/Review/SelectSomeModalShow';
import glassImg from '@img/magnifying-glass-solid.svg';
import SelectedTeam from '@recoil/Review/SelectedTeam';

interface modalTeamListType {
  (key: string): teamMemInfo[];
}

function EventListModal(prop: { mode: string }) {
  const eventList = useRecoilValue(EventList);
  const [selectedEvent, setSelectedEvent] = useRecoilState(SelectedEvent);
  const setEventListModalShow = useSetRecoilState(EventListModalShow);
  const setGlobalSelectedTeam = useSetRecoilState(SelectedTeam);
  const [modalEventList, setModalEventList] = useState<ReviewSelectedEventType[]>(null);
  const [modalTeamList, setModalTeamList] = useState<modalTeamListType>(null);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState(prop['mode']);
  const [addMemArr, setAddMemArr] = useState<string[]>(null);

  const onClickXbtn = () => {
    setEventListModalShow(false);
  };

  const onChangeInput = (e) => {
    setInputText(e.target.value);
  };

  const onClickEvent = (event: ReviewSelectedEventType) => {
    if (mode === 'main_event') {
      setSelectedEvent(event);
      setEventListModalShow(false);
    } else if (mode === 'modal_event') {
      setSelectedEvent(event);
      setMode('modal_team');
    }
  };

  const onClickTeam = (event: string) => {
    if (mode === 'modal_team') {
      const memArr: teamMemInfo[] = selectedEvent['teamList'][event];
      setGlobalSelectedTeam({ [event]: memArr });
      setEventListModalShow(false);
    }
  };

  const onSubmitModalAddMem = (e: any) => {
    e.preventDefault();
    if (mode === 'modal_addMem') {
      setAddMemArr((prev) => (prev ? [...prev, inputText] : [inputText]));
      setInputText('');
    }
  };

  const onClickGlobalAddMem = () => {
    setGlobalSelectedTeam((prev) => {
      const ObjtoArr: any = Object.entries(prev);
      const ObjKey: string = ObjtoArr[0][1];
      const memArr: teamMemInfo[] = ObjtoArr[0][1];
      addMemArr.forEach((memStr) => memArr.push({ intraId: memStr, url: null, teamId: parseInt(ObjKey, 10) }));
      return { [ObjKey]: memArr };
    });
    setAddMemArr(null);
    setInputText('');
    setEventListModalShow(false);
  };

  useEffect(() => {
    if (mode === 'main_event' || mode === 'modal_event') setModalEventList(eventList);
    if (mode === 'modal_team' && selectedEvent) setModalTeamList(selectedEvent['teamList']);
  }, [eventList, mode, selectedEvent]);

  // console.log(selectedEvent);

  return (
    <div className="review--eventModal--wrapper">
      <div className="review--eventModal--header--xbtn_wrapper">
        <img className="review--eventModal--header--xbtn" src={Xmark} alt={Xmark} onClick={onClickXbtn} />
      </div>
      <div className="review--eventModal--header">
        <form className="review--eventModal--form" onSubmit={onSubmitModalAddMem}>
          <input
            className="review--eventModal--header--title"
            placeholder={
              mode === 'main_event' || mode === 'modal_event'
                ? '이벤트 검색'
                : mode === 'modal_team'
                ? '팀 검색'
                : mode === 'modal_addMem'
                ? '팀원 intra ID'
                : 'mode 설정 오류'
            }
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) =>
              (e.target.placeholder =
                mode === 'main_event' || mode === 'modal_event'
                  ? '이벤트 검색'
                  : mode === 'modal_team'
                  ? '팀 검색'
                  : mode === 'modal_addMem'
                  ? '팀원 intra ID'
                  : 'mode 설정 오류')
            }
            value={inputText}
            onChange={onChangeInput}
          />
          <img className="review--eventModal--header--glass" src={glassImg} alt={glassImg}></img>
        </form>
      </div>
      {modalEventList && (mode === 'main_event' || mode === 'modal_event') ? (
        modalEventList
          .filter((event1) => event1['title'].includes(inputText))
          ?.map((event2) => (
            <p className="review--eventModal--event" key={event2['id']} onClick={() => onClickEvent(event2)}>
              {event2['title']}
            </p>
          ))
      ) : mode === 'modal_team' && modalTeamList ? (
        Object.keys(modalTeamList)
          .filter((event1) => event1.includes(inputText))
          ?.map((event2) => (
            <p className="review--eventModal--event" key={event2} onClick={() => onClickTeam(event2)}>
              {event2}
            </p>
          ))
      ) : mode === 'modal_addMem' && addMemArr ? (
        <>
          <div className="review--eventModal--event_wrapper">
            {addMemArr.map((elem, i) => (
              <div key={i} className="review--eventModal--event">
                {elem}
              </div>
            ))}
          </div>
          <div className="review--eventModal--submit_addMem">
            <div className="review--eventModal--submit_addMem--btn" onClick={onClickGlobalAddMem}>
              <span>추가완료</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default EventListModal;
