import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@css/Main/Apply.scss';
import axios from 'axios';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/SelectedEvent';
import { EventType, teamMemInfo } from '@globalObj/object/types';
import errorAlert from '@globalObj/function/errorAlert';
import getAddress from '@globalObj/function/getAddress';
import CreateEventBox from './CreateEventBox';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';

function Apply() {
  const LoginState = useRecoilValue(GlobalLoginState);
  const [EventList, setEventList] = useState<EventType[]>([]);
  const [globalSelectedEvent, setGlobalSelectedEvent] = useRecoilState(SelectedEvent);
  const [createMode, setCreateMode] = useState(false);
  const ListWrapperRef = useRef(null);
  const { data: teamList, mutate: mutateTeamList } = useSWR<{
    event: EventType;
    teamList: { [x: string]: teamMemInfo[] };
  }>(`${getAddress()}/api/together/${globalSelectedEvent.id}`, fetcher, {
    dedupingInterval: 600000,
  });
  const isTeamListExist = teamList && teamList.teamList && Object.keys(teamList.teamList);

  const updateSelecetEvent = useCallback(
    (eventId: number) => {
      const clickedEvent = EventList.filter((ev) => ev.id === eventId)[0];
      setGlobalSelectedEvent(clickedEvent);
    },
    [EventList, setGlobalSelectedEvent],
  );

  const registerEvent = useCallback(
    (eventId: number) => {
      if (getToken()) {
        axios
          .post(
            `${getAddress()}/api/together/register`,
            {
              eventId: eventId,
            },
            {
              headers: {
                Authorization: 'Bearer ' + getToken(),
              },
            },
          )
          .then(() => {
            alert('신청되셨습니다');
            mutateTeamList();
          })
          .catch((err) => errorAlert(err));
      } else alert('로그인을 하셔야 신청 가능합니다!');
    },
    [mutateTeamList],
  );

  const updateEventList = useCallback((eventId: number) => {
    if (eventId) {
      axios
        .get(`${getAddress()}/api/together/${eventId}`)
        .then((response) => {
          if (
            (response.data.teamList && response.data.teamList['null']) ||
            (response.data.teamList && Object.keys(response.data.teamList).length === 0)
          )
            setEventList((prev) => {
              let rtnArr = [...prev];
              if (!prev.find((prevElem) => prevElem['id'] === response.data.event['id'])) {
                rtnArr.push(response.data.event);
              }
              return rtnArr;
            });
        })
        .catch((err) => errorAlert(err));
    }
  }, []);

  const getEventList = () => {
    axios
      .get(`${getAddress()}/api/together`)
      .then((response) => {
        if (response.data.EventList.length > 0) {
          const rtnArr = response.data.EventList.filter((e) => !e['isMatching']);
          setEventList(rtnArr);
        }
      })
      .catch((err) => errorAlert(err));
  };

  const onSubmitApply = (e: any) => {
    e.preventDefault();
    registerEvent(globalSelectedEvent['id']);
  };

  const onClickCreateModal = () => {
    if (getToken()) setCreateMode(true);
    else alert('로그인을 해주세요!');
  };

  const onClickEventList = (e: any) => {
    updateSelecetEvent(parseInt(e.target.id, 10));
  };

  // Event List updated when createMode or selected event changed
  useEffect(() => {
    updateEventList(globalSelectedEvent.id);
  }, [createMode, updateEventList, globalSelectedEvent.id]);

  // Event List created when component start & createMode end
  useEffect(() => {
    getEventList();
    return () => {
      setGlobalSelectedEvent({
        id: null,
        title: null,
        description: null,
        intraId: null,
        createdId: null,
        isMatching: null,
      });
      setEventList([]);
    };
  }, [setGlobalSelectedEvent, createMode, mutateTeamList]);

  useEffect(() => {
    window.scrollTo(0, ListWrapperRef.current.offsetTop);
  }, [teamList]);

  return (
    <div className="main--apply">
      <p className="main--apply--title" ref={ListWrapperRef}>
        {getToken() ? `${LoginState.id}님, 신청하시죠?` : '로그인 후 신청 가능!'}
      </p>
      <div className="main--apply--wrapper">
        <div className="main--apply--create_modal_button">
          <span onClick={onClickCreateModal}>친바 생성하기</span>
        </div>
        <div className="main--apply--list">
          <p className="main--apply--list--title">신청 가능 목록</p>
          {EventList.length > 0 ? (
            EventList.map((e, i) => (
              <p className="main--apply--list--event" key={i}>
                <span id={`${e.id}`} onClick={onClickEventList}>
                  - {e.title}
                </span>
              </p>
            ))
          ) : !createMode ? (
            <p className="main--apply--list--empty">이벤트가 없습니다</p>
          ) : null}
        </div>
        {EventList.length > 0 && !createMode ? (
          <div className="main--apply--eventInfo">
            {globalSelectedEvent.id ? (
              <>
                <p className="main--apply--eventInfo--title_wrapper">
                  <span className="main--apply--eventInfo--title"> {globalSelectedEvent.title}</span>
                  <span className="main--apply--eventInfo--maker">{`생성자 : ${globalSelectedEvent['intraId']}`}</span>
                </p>
                <div className="main--apply--eventInfo--description">
                  <span>{globalSelectedEvent.description}</span>
                </div>
                <div
                  className={`main--apply--eventInfo--submit ${
                    isTeamListExist && teamList.teamList.null.find((memInfo) => memInfo['intraId'] === LoginState['id'])
                      ? 'attended'
                      : ''
                  }`}
                >
                  <span onClick={onSubmitApply}>
                    {isTeamListExist &&
                    teamList.teamList.null.find((memInfo) => memInfo['intraId'] === LoginState['id'])
                      ? '신청완료'
                      : '신청하기'}
                  </span>
                </div>
              </>
            ) : (
              <p className="main--apply--eventInfo--empty">이벤트를 클릭해주세요</p>
            )}
          </div>
        ) : createMode ? (
          <CreateEventBox setCreateMode={setCreateMode} registerEvent={registerEvent} />
        ) : null}
      </div>
    </div>
  );
}

export default Apply;
