import React, { useCallback, useEffect, useState } from 'react';
import '@css/Result/Result.scss';
import Footer from '@result/Footer';
import axios from 'axios';
import { EventType, teamMemInfo } from '@globalObj/object/types';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/function/getAddress';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';
import { useNavigate } from 'react-router';

function Result() {
  const [selectedEvent, setSelectedEvent] = useState<EventType>({
    id: null,
    title: null,
    description: null,
    intraId: null,
    createdId: null,
    isMatching: null,
    categoryId: 1,
  });
  const [teamLen, setTeamLen] = useState('');
  const [category, setCategory] = useState(1);
  const navigate = useNavigate();
  const { data: eventList, mutate: mutateEvent } = useSWR<EventType[]>(`${getAddress()}/meetups`, fetcher, {
    dedupingInterval: 600000,
  });
  const { data: eventDetailData, mutate: mutateTeam } = useSWR<{
    event: EventType;
    teamList: { [x: string]: teamMemInfo[] };
  }>(`${getAddress()}/meetups/${selectedEvent.id ?? 0}`, fetcher, {
    dedupingInterval: 600000,
  });

  const postMatching = () => {
    axios
      .post(
        `${getAddress()}/meetups/${selectedEvent.id}/matching`,
        {
          teamNum: +teamLen,
        },
        {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        },
      )
      .then(() => {
        alert('매칭성공');
        mutateTeam();
      })
      .catch((err) => errorAlert(err));
  };

  const deleteEvent = useCallback(() => {
    axios
      .delete(`${getAddress()}/meetups/${selectedEvent['id']}`, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
      })
      .then(() => {
        alert('삭제되었습니다');
        mutateEvent();
      })
      .catch((err) => errorAlert(err));
  }, [mutateEvent, selectedEvent]);

  const onClickEvent = (e: any) => {
    if (eventList) {
      const clickedEvent = eventList.find((ev) => ev.id === parseInt(e.target.id, 10));
      setSelectedEvent(clickedEvent);
    }
  };

  const onSubmitMatching = (e: any) => {
    e.preventDefault();
    if (!getToken()) {
      alert('로그인 하셔야 사용 가능합니다');
      navigate('/auth');
    } else if (teamLen === '') alert('몇 명으로 매칭하실 건지 적어주세요');
    else if (isNaN(+teamLen)) alert('팀 개수 형식이 잘못되었습니다.');
    else postMatching();
  };

  const onChangeInput = (e: any) => {
    setTeamLen(e.target.value);
  };

  const onClickDeleteEvent = () => {
    if (window.confirm('이벤트를 삭제하시겠습니까?')) deleteEvent();
  };

  // 선택된 이벤트가 없으면 맨 처음 이벤트를 자동 선택
  useEffect(() => {
    if (eventList && eventList.length) setSelectedEvent(eventList[0]);
  }, [eventList]);

  if (!eventList || !eventDetailData) return <></>;
  return (
    <>
      <div className="result">
        <div className="result--tab">
          <div>
            <button
              className="result--tab--btn"
              onClick={() => {
                setCategory(1);
              }}
            >
              정기 회의
            </button>
            <button
              className="result--tab--btn"
              onClick={() => {
                setCategory(2);
              }}
            >
              기타 이벤트
            </button>
          </div>
        </div>
        {/* event list */}
        {eventList.length > 0 && (
          <div className="result--event_list">
            {eventList
              .sort((a, b) => b.id - a.id)
              .map((e, i) => {
                if (e.categoryId === category)
                  return (
                    <div key={`result ${i}`} className={`result--event ${e.id === selectedEvent.id && 'selected'}`}>
                      <span id={e.id.toString()} onClick={onClickEvent}>
                        {e.title}
                      </span>
                    </div>
                  );
                return <React.Fragment key={`result ${i}`}></React.Fragment>;
              })}
          </div>
        )}
        <div
          className={`${
            Object.keys(eventDetailData.teamList).find((e) => e === '1') ? 'result--table' : 'result--submit'
          }`}
        >
          <div className="result--submit--delete_event" onClick={onClickDeleteEvent}>
            삭제하기
          </div>
          {Object.keys(eventDetailData.teamList).find((e) => e === '1') ? (
            Object.entries(eventDetailData.teamList).map((elem, idx) => (
              <div key={elem[0]}>
                <p className="result--team_name">{elem[0]}</p>
                {elem[1].map((e, i) => (
                  <p key={i} className="result--intra">
                    {e.intraId}
                  </p>
                ))}
              </div>
            ))
          ) : Object.keys(eventDetailData.teamList).find((e) => e === 'null') ? (
            <>
              <div className="result--submit--info_wrapper">
                <p className="result--submit--event_title">{selectedEvent['title']}</p>
                <p className="result--submit--event_description">{selectedEvent['description']}</p>
                <hr className="result--submit--event_bot_line"></hr>
                {selectedEvent?.categoryId === 1 ? (
                  <>
                    <p className="result--submit--info">사서 로테이션은 매주 수요일 오전 10시에 모집 마감합니다!</p>
                    <p className="result--submit--info">{`현재 신청 인원은 ${eventDetailData.teamList['null'].length}명입니다.`}</p>
                  </>
                ) : (
                  <>
                    <p className="result--submit--info">아직 팀매칭이 이루어지지 않았습니다.</p>
                    <p className="result--submit--info">원하는 팀원수를 적고 매칭을 눌러주세요!</p>
                    <p className="result--submit--info">{`현재 신청 인원은 ${eventDetailData.teamList['null'].length}명입니다.`}</p>
                  </>
                )}
              </div>
              {selectedEvent?.categoryId === 2 && (
                <div className="result--submit--form_wrapper">
                  <form onSubmit={onSubmitMatching} className="result--submit--form">
                    <input className="result--submit--input" onChange={onChangeInput} value={teamLen}></input>
                    <span className="result--submit--label">팀으로 </span>
                    <button className="result--submit--button">매칭하기</button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="result--submit--info_wrapper">
              <p className="result--submit--event_title">{selectedEvent['title']}</p>
              <p className="result--submit--event_description">{selectedEvent['description']}</p>
              <hr className="result--submit--event_bot_line"></hr>
              {selectedEvent?.categoryId === 2 ? (
                <p className="result--submit--info">신청하신 분이 없습니다..</p>
              ) : (
                <>
                  <p className="result--submit--info">사서 로테이션은 매주 수요일 오전 10시에 모집 마감합니다!</p>
                  <p className="result--submit--info">현재 아무도 신청하지 않았습니다.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Result;
