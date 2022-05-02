import React, { useEffect, useState } from 'react';
import '@css/Result/Result.scss';
import Footer from '@result/Footer';
import axios from 'axios';
import { EventType } from '@types';

function Result() {
  const [EventList, setEventList] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType>({
    id: null,
    title: null,
    description: null,
    createdBy: null,
  });
  const [selectedTeamObj, setSelectedTeamObj] = useState({});
  const [teamLen, setTeamLen] = useState('');

  const onClickEvent = (e: any) => {
    const clickedEvent = EventList.find((ev) => ev.id === parseInt(e.target.id, 10));
    setSelectedEvent(clickedEvent);
  };

  const onClickSubmit = () => {
    if (teamLen !== '')
      axios
        .post(`${process.env.SERVER_ADR}/api/together/matching`, {
          eventId: selectedEvent.id,
          teamNum: teamLen,
        })
        .then((res) => {
          alert('매칭성공');
          setSelectedTeamObj(res.data['teamList']);
        })
        .catch(() => {
          alert('알 수 없는 오류 발생..');
        });
  };

  const onChangeInput = (e: any) => {
    setTeamLen(e.target.value);
  };

  useEffect(() => {
    axios.get(`${process.env.SERVER_ADR}/api/together`).then((res) => {
      setEventList(res.data.EventList);
      if (res.data.EventList.length > 0) setSelectedEvent(res.data.EventList[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedEvent.id && EventList.length) {
      axios
        .get(`${process.env.SERVER_ADR}/api/together/matching/${selectedEvent.id}`)
        .then((res) => {
          setSelectedTeamObj(res.data['teamList']);
        })
        .catch(() => {
          alert('알 수 없는 오류가..');
        });
    }
  }, [EventList.length, selectedEvent]);

  return (
    <>
      <div className="result">
        {EventList.length > 0 && (
          <div className="result--event_list">
            {EventList.map((e, i) => (
              <div className={`result--event ${e.id === selectedEvent.id && 'selected'}`} key={i}>
                <span id={e.id} onClick={onClickEvent}>
                  {e.title}
                </span>
              </div>
            ))}
          </div>
        )}
        <div
          className={`${!Object.keys(selectedTeamObj).find((e) => e === 'null') ? 'result--table' : 'result--submit'}`}
        >
          {!Object.keys(selectedTeamObj).find((e) => e === 'null') &&
          Object.keys(selectedTeamObj).length &&
          EventList.length ? (
            Object.entries(selectedTeamObj).map((elem, idx) => (
              <>
                <div key={elem[0]}>
                  <p className="result--team_name">{elem[0]}</p>
                  {elem[1].map((e, i) => (
                    <p key={i} className="result--intra">
                      {e.loginId}
                    </p>
                  ))}
                </div>
                {!idx && <hr className="result--hr"></hr>}
              </>
            ))
          ) : Object.keys(selectedTeamObj).find((e) => e === 'null') ? (
            <>
              <div className="result--submit--info_wrapper">
                <p className="result--submit--info">아직 팀매칭이 이루어지지 않았습니다.</p>
                <p className="result--submit--info">원하는 팀원수를 적고 매칭을 눌러주세요!</p>
                <p className="result--submit--info">{`현재 신청 인원은 ${selectedTeamObj['null'].length}명입니다.`}</p>
              </div>
              <div className="result--submit--form_wrapper">
                <form onSubmit={onClickSubmit} className="result--submit--form">
                  <input className="result--submit--input" onChange={onChangeInput} value={teamLen}></input>
                  <span className="result--submit--label">팀으로 </span>
                  <button className="result--submit--button">매칭하기</button>
                </form>
              </div>
            </>
          ) : (
            <span className="result--no_attend">신청하신 분이 없습니다..</span>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Result;
