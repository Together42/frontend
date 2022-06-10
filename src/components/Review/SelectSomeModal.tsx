import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Xmark from '@img/xmark-solid.svg';
import { ReviewSelectedEventType, ReviewSelectedTeamType, teamMemInfo } from '@globalObj/object/types';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import '@css/Review/SelectSomeModal.scss';
import EventListModalShow from '@recoil/Review/SelectSomeModalShow';
import glassImg from '@img/magnifying-glass-solid.svg';
import plusImg from '@img/plus-solid.svg';
import SelectedTeam from '@recoil/Review/SelectedTeam';
import useSWR from 'swr';
import getAddress from '@globalObj/function/getAddress';
import fetcher from '@globalObj/function/fetcher';
import EmptyEvent from '@globalObj/object/EmptyEvent';

function SelectSomeModal(prop: { mode: string }) {
  const { data: eventList, mutate: mutateAllEvent } = useSWR<ReviewSelectedEventType[]>(
    `${getAddress()}/api/together/matching`,
    fetcher,
    {
      dedupingInterval: 600000,
    },
  );
  const setEventListModalShow = useSetRecoilState(EventListModalShow);
  const [selectedEvent, setSelectedEvent] = useRecoilState(SelectedEvent);
  const setSelectedTeam = useSetRecoilState(SelectedTeam);
  const [modalEventList, setModalEventList] = useState<ReviewSelectedEventType[]>(null);
  const [modalTeamList, setModalTeamList] = useState<ReviewSelectedTeamType>(null);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState(prop['mode']);
  const [addMemArr, setAddMemArr] = useState<string[]>(null);

  const onClickXbtn = () => {
    setEventListModalShow(false);
  };

  const onChangeInput = (e: any) => {
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

  const onClickAllEvent = () => {
    if (mode === 'main_event') {
      mutateAllEvent();
      setSelectedEvent(null);
      setEventListModalShow(false);
    } else if (mode === 'modal_event') {
      setSelectedEvent(EmptyEvent());
      setMode('modal_team');
    }
  };

  const onClickTeam = (event: string) => {
    if (mode === 'modal_team') {
      const memArr: teamMemInfo[] = selectedEvent['teamList'][event];
      setSelectedTeam({ [event]: memArr });
      setEventListModalShow(false);
    }
  };

  const onSubmitModalAddMem = (e: any) => {
    e.preventDefault();
    if (inputText === '') {
      alert('입력값이 없습니다');
      return;
    }
    if (mode === 'modal_addMem') {
      setAddMemArr((prev) => (prev ? [...prev, inputText] : [inputText]));
      setInputText('');
    }
  };

  const onSubmitGlobalAddMem = () => {
    setSelectedTeam((prev) => {
      const ObjtoArr: any = Object.entries(prev);
      const ObjKey: string = ObjtoArr[0][0];
      let memArr: teamMemInfo[] = Array.from(ObjtoArr[0][1]);
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
          {mode === 'modal_addMem' ? (
            <button className="review--eventModal--header--plus">
              <img src={plusImg} alt={plusImg}></img>
            </button>
          ) : (
            <img className="review--eventModal--header--glass" src={glassImg} alt={glassImg}></img>
          )}
        </form>
      </div>
      {modalEventList && (mode === 'main_event' || mode === 'modal_event') ? (
        <>
          <p className="review--eventModal--event" onClick={() => onClickAllEvent()}>
            🍒 전체 게시판 🍒
          </p>
          {modalEventList
            .filter((event1) => event1['title'].includes(inputText))
            ?.map((event2) => (
              <p className="review--eventModal--event" key={event2['id']} onClick={() => onClickEvent(event2)}>
                {event2['title']}
              </p>
            ))}
        </>
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
            <div className="review--eventModal--submit_addMem--btn" onClick={onSubmitGlobalAddMem}>
              <span>모두추가</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SelectSomeModal;
