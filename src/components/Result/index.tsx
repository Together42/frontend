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
  const { data: eventObj, mutate: mutateEvent } = useSWR<{ EventList: EventType[] }>(
    `${getAddress()}/api/together`,
    fetcher,
    {
      dedupingInterval: 600000,
    },
  );
  const { data: teamObj, mutate: mutateTeam } = useSWR<{ teamList: { [x: string]: teamMemInfo[] } }>(
    `${getAddress()}/api/together/matching/${selectedEvent.id}`,
    fetcher,
    {
      dedupingInterval: 600000,
    },
  );

  const postMatching = () => {
    axios
      .post(
        `${getAddress()}/api/together/matching`,
        {
          eventId: selectedEvent.id,
          teamNum: teamLen,
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
      .delete(`${getAddress()}/api/together/${selectedEvent['id']}`, {
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
    if (eventObj) {
      const clickedEvent = eventObj.EventList.find((ev) => ev.id === parseInt(e.target.id, 10));
      setSelectedEvent(clickedEvent);
    }
  };

  const onSubmitMatching = (e: any) => {
    e.preventDefault();
    if (teamLen !== '' && getToken()) postMatching();
    else if (!getToken()) {
      alert('로그인 하셔야 사용 가능합니다');
      navigate('/auth');
    } else if (teamLen === '') alert('몇 명으로 매칭하실 건지 적어주세요');
  };

  const onChangeInput = (e: any) => {
    setTeamLen(e.target.value);
  };

  const onClickDeleteEvent = () => {
    if (window.confirm('이벤트를 삭제하시겠습니까?')) deleteEvent();
  };

  useEffect(() => {
    if (eventObj && eventObj.EventList.length) setSelectedEvent(eventObj.EventList[0]);
  }, [eventObj]);

  console.log('eventObj', eventObj);

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
        {eventObj?.EventList?.length > 0 && (
          <div className="result--event_list">
            {eventObj.EventList.sort((a, b) => b.id - a.id).map((e, i) => {
              if (e.categoryId === category)
                return (
                  <div className={`result--event ${e.id === selectedEvent.id && 'selected'}`} key={i}>
                    <span id={e.id.toString()} onClick={onClickEvent}>
                      {e.title}
                    </span>
                  </div>
                );
              return <></>;
            })}
          </div>
        )}
        <div
          className={`${
            teamObj && !Object.keys(teamObj.teamList).find((e) => e === 'null') && Object.keys(teamObj.teamList).length
              ? 'result--table'
              : 'result--submit'
          }`}
        >
          <div className="result--submit--delete_event" onClick={onClickDeleteEvent}>
            삭제하기
          </div>
          {teamObj &&
          !Object.keys(teamObj.teamList).find((e) => e === 'null') &&
          Object.keys(teamObj.teamList).length &&
          eventObj?.EventList?.length ? (
            Object.entries(teamObj.teamList).map((elem, idx) => (
              <div key={elem[0]}>
                <p className="result--team_name">{elem[0]}</p>
                {elem[1].map((e, i) => (
                  <p key={i} className="result--intra">
                    {e.intraId}
                  </p>
                ))}
              </div>
            ))
          ) : teamObj && Object.keys(teamObj.teamList).find((e) => e === 'null') ? (
            <>
              <div className="result--submit--info_wrapper">
                <p className="result--submit--event_title">{selectedEvent['title']}</p>
                <p className="result--submit--event_description">{selectedEvent['description']}</p>
                <hr className="result--submit--event_bot_line"></hr>
                <p className="result--submit--info">아직 팀매칭이 이루어지지 않았습니다.</p>
                <p className="result--submit--info">원하는 팀원수를 적고 매칭을 눌러주세요!</p>
                <p className="result--submit--info">{`현재 신청 인원은 ${teamObj.teamList['null'].length}명입니다.`}</p>
              </div>
              <div className="result--submit--form_wrapper">
                <form onSubmit={onSubmitMatching} className="result--submit--form">
                  <input className="result--submit--input" onChange={onChangeInput} value={teamLen}></input>
                  <span className="result--submit--label">팀으로 </span>
                  <button className="result--submit--button">매칭하기</button>
                </form>
              </div>
            </>
          ) : (
            <div className="result--submit--info_wrapper">
              <p className="result--submit--event_title">{selectedEvent['title']}</p>
              <p className="result--submit--event_description">{selectedEvent['description']}</p>
              <hr className="result--submit--event_bot_line"></hr>
              <p className="result--submit--info">신청하신 분이 없습니다..</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Result;
