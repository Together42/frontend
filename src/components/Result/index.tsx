import React, { useCallback, useEffect, useState } from 'react';
import '@css/Result/Result.scss';
import Footer from '@result/Footer';
import axios from 'axios';
import { EventType } from '@types';
import errorAlert from '@utils/errorAlert';
import { getToken } from '@cert/TokenStorage';
import Xmark from '@img/xmark-solid.svg';
import getAddress from '@globalObj/func/getAddress';

function Result() {
  const [EventList, setEventList] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType>({
    id: null,
    title: null,
    description: null,
    intraId: null,
    createdId: null,
    isMatching: null,
  });
  const [selectedTeamObj, setSelectedTeamObj] = useState({});
  const [teamLen, setTeamLen] = useState('');

  const getEventList = useCallback(() => {
    axios
      .get(`${getAddress()}/api/together`)
      .then((res) => {
        setEventList(res.data.EventList);
        if (res.data.EventList.length > 0) setSelectedEvent(res.data.EventList[0]);
      })
      .catch((err) => errorAlert(err));
  }, []);

  const getTeamObj = useCallback(() => {
    axios
      .get(`${getAddress()}/api/together/matching/${selectedEvent.id}`)
      .then((res) => setSelectedTeamObj(res.data['teamList']))
      .catch((err) => errorAlert(err));
  }, [selectedEvent.id]);

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
      .then((res) => {
        alert('매칭성공');
        setSelectedTeamObj(res.data['teamList']);
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
        getEventList();
      })
      .catch((err) => errorAlert(err));
  }, [getEventList, selectedEvent]);

  const onClickEvent = (e: any) => {
    const clickedEvent = EventList.find((ev) => ev.id === parseInt(e.target.id, 10));
    setSelectedEvent(clickedEvent);
  };

  const onSubmitMatching = () => {
    if (teamLen !== '' && getToken()) postMatching();
    else if (!getToken()) alert('로그인 하셔야 사용 가능합니다');
    else if (teamLen === '') alert('몇 명으로 매칭하실 건지 적어주세요');
  };

  const onChangeInput = (e: any) => {
    setTeamLen(e.target.value);
  };

  const onClickDeleteEvent = () => {
    if (window.confirm('이벤트를 삭제하시겠습니까?')) deleteEvent();
  };

  useEffect(() => {
    getEventList();
  }, [getEventList]);

  useEffect(() => {
    if (selectedEvent.id) {
      getTeamObj();
    }
  }, [getTeamObj, selectedEvent]);

  return (
    <>
      <div className="result">
        {EventList.length > 0 && (
          <div className="result--event_list">
            {EventList.map((e, i) => (
              <div className={`result--event ${e.id === selectedEvent.id && 'selected'}`} key={i}>
                <span id={e.id.toString()} onClick={onClickEvent}>
                  {e.title}
                </span>
              </div>
            ))}
          </div>
        )}
        <div
          className={`${
            !Object.keys(selectedTeamObj).find((e) => e === 'null') && Object.keys(selectedTeamObj).length
              ? 'result--table'
              : 'result--submit'
          }`}
        >
          <img className="result--submit--delete_event" src={Xmark} alt={Xmark} onClick={onClickDeleteEvent}></img>
          {!Object.keys(selectedTeamObj).find((e) => e === 'null') &&
          Object.keys(selectedTeamObj).length &&
          EventList.length ? (
            Object.entries(selectedTeamObj).map((elem, idx) => (
              <>
                <div key={elem[0]}>
                  <p className="result--team_name">{elem[0]}</p>
                  {elem[1].map((e, i) => (
                    <p key={i} className="result--intra">
                      {e.intraId}
                    </p>
                  ))}
                </div>
                {!idx && <hr className="result--hr"></hr>}
              </>
            ))
          ) : Object.keys(selectedTeamObj).find((e) => e === 'null') ? (
            <>
              <div className="result--submit--info_wrapper">
                <p className="result--submit--event_title">{selectedEvent['title']}</p>
                <p className="result--submit--event_description">{selectedEvent['description']}</p>
                <hr className="result--submit--event_bot_line"></hr>
                <p className="result--submit--info">아직 팀매칭이 이루어지지 않았습니다.</p>
                <p className="result--submit--info">원하는 팀원수를 적고 매칭을 눌러주세요!</p>
                <p className="result--submit--info">{`현재 신청 인원은 ${selectedTeamObj['null'].length}명입니다.`}</p>
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
