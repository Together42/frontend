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

  const onClickEvent = (e: any) => {
    const clickedEvent = EventList.find((ev) => ev.id === parseInt(e.target.id, 10));
    setSelectedEvent(clickedEvent);
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

  console.log(selectedTeamObj);

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
        <div className="result--table">
          {!Object.keys(selectedTeamObj).find((e) => e === 'null') &&
          Object.keys(selectedTeamObj).length &&
          EventList.length
            ? Object.entries(selectedTeamObj).map((elem, idx) => (
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
            : null}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Result;
