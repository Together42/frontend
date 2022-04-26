import React, { useEffect, useState } from 'react';
import '@css/Result/Result.scss';
import Footer from '@result/Footer';
import axios from 'axios';

function Result() {
  const tempArr = ['tmam', 'jwoo', 'sujikim', 'seongyle'];
  const [EventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});

  useEffect(() => {
    axios.get(`${process.env.SERVER_ADR}/api/together`).then((res) => {
      setEventList(res.data.EventList);
      if (res.data.EventList.length > 0) setSelectedEvent(res.data.EventList[0]);
    });
  }, []);

  const onClickEvent = (e) => {
    const clickedEvent = EventList.find((ev) => ev.id === parseInt(e.target.id, 10));
    setSelectedEvent(clickedEvent);
  };

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
          <div>
            <p className="result--team_name">team one</p>
            {tempArr.map((e, i) => (
              <p key={i} className="result--intra">
                {e}
              </p>
            ))}
          </div>
          <hr className="result--hr"></hr>
          <div>
            <p className="result--team_name">team two</p>
            {tempArr.map((e, i) => (
              <p key={i} className="result--intra">
                {e}
              </p>
            ))}
          </div>
          <div>
            <p className="result--team_name">team three</p>
            {tempArr.map((e, i) => (
              <p key={i} className="result--intra">
                {e}
              </p>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Result;
