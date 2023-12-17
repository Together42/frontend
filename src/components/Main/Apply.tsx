import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import '@css/Main/Apply.scss';
import axios from 'axios';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/MainSelectedEvent';
import { EventType, teamMemInfo } from '@globalObj/object/types';
import errorAlert from '@globalObj/function/errorAlert';
import getAddress from '@globalObj/function/getAddress';
import CreateEventBox from './CreateEventBox';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';
import Event from './Event';

function Apply() {
  const LoginState = useRecoilValue(GlobalLoginState);
  const navigate = useNavigate();
  const [globalSelectedEvent, setGlobalSelectedEvent] = useRecoilState(SelectedEvent);
  const [createMode, setCreateMode] = useState(false);
  const ListWrapperRef = useRef(null);
  const [eventList, setEventList] = useState<EventType[]>(null);
  const { data: teamList, mutate: mutateTeamList } = useSWR<{
    event: EventType;
    teamList: { [x: string]: teamMemInfo[] };
  }>(globalSelectedEvent ? `${getAddress()}/meetups/${globalSelectedEvent.id}` : null, fetcher, {
    dedupingInterval: 600000,
  });
  const { data: allEventList } = useSWR<EventType[]>(`${getAddress()}/meetups`, fetcher, {
    dedupingInterval: 600000,
  });
  const isTeamListExist = teamList && teamList.teamList && teamList.teamList.null && Object.keys(teamList.teamList);

  const registerEvent = useCallback(
    (eventId: number) => {
      if (getToken()) {
        axios
          .post(`${getAddress()}/meetups/${eventId}/attendance`, {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          })
          .then(() => {
            alert('신청되셨습니다');
            mutateTeamList();
          })
          .catch((err) => errorAlert(err));
      } else {
        alert('로그인을 하셔야 신청 가능합니다!');
        navigate('/auth');
      }
    },
    [mutateTeamList, navigate],
  );

  const onSubmitApply = (e: any) => {
    e.preventDefault();
    registerEvent(globalSelectedEvent['id']);
  };

  const onClickCreateModal = () => {
    if (getToken()) {
      setCreateMode(true);
      setGlobalSelectedEvent(null);
    } else {
      alert('로그인을 하셔야 생성 가능합니다!');
      navigate('/auth');
    }
  };

  useEffect(() => {
    if (allEventList && allEventList.length > 0) {
      setEventList(allEventList.filter((e) => !e['isMatching']));
    }
  }, [allEventList]);

  useEffect(() => {
    window.scrollTo(0, ListWrapperRef.current.offsetTop);
  }, [teamList]);

  useEffect(() => {
    return () => setGlobalSelectedEvent(null);
  }, [setGlobalSelectedEvent]);

  return (
    <div className="main--apply">
      <p className="main--apply--title" ref={ListWrapperRef}>
        {getToken() ? `${LoginState.id}님, 신청하시죠?` : '로그인 후 신청 가능!'}
      </p>
      <div className="main--apply--wrapper">
        <div className="main--apply--create_modal_button">
          <span onClick={onClickCreateModal}>이벤트 생성</span>
        </div>
        <div className="main--apply--list">
          <p className="main--apply--list--title">신청 가능 목록</p>
          {eventList && eventList.length > 0 ? (
            eventList.map((elem, i) => (
              <Event key={`event list ${i}`} eventList={eventList} elem={elem} setCreateMode={setCreateMode} />
            ))
          ) : !createMode ? (
            <div className="main--apply--list--guide">
              <p>이벤트를 생성하고 신청할 수 있는 페이지입니다.</p>
              <p>이벤트를 생성해주세요! 대각선 오른쪽 위에 보이시죠?</p>
            </div>
          ) : null}
        </div>
        {eventList && eventList.length > 0 && !createMode ? (
          <div className="main--apply--eventInfo">
            {globalSelectedEvent ? (
              <>
                <p className="main--apply--eventInfo--title_wrapper">
                  <span className="main--apply--eventInfo--title"> {globalSelectedEvent.title}</span>
                  {globalSelectedEvent['intraId'] && (
                    <span className="main--apply--eventInfo--maker">{`생성자 : ${globalSelectedEvent['intraId']}`}</span>
                  )}
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
              <div className="main--apply--eventInfo--guide">
                <p>이벤트를 생성하고 신청할 수 있는 페이지입니다.</p>
                <p>‼️이벤트를 클릭해주세요‼️</p>
                <p>이벤트 생성도 가능하답니다~</p>
              </div>
            )}
          </div>
        ) : createMode ? (
          <CreateEventBox setCreateMode={setCreateMode} />
        ) : null}
      </div>
    </div>
  );
}

export default Apply;
