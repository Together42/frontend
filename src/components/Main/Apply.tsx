import React, { useRef, useState } from 'react';
import '@css/Main/Apply.scss';
import axios from 'axios';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilValue } from 'recoil';
import { getToken } from '@cert/TokenStorage';

function Apply() {
  const [intraID, setIntraID] = useState('');
  const inputRef = useRef(null);
  const LoginState = useRecoilValue(GlobalLoginState);
  const [EventList, setEventList] = useState([
    {
      title: '친바 4회차',
      id: 23,
      description:
        '사서 사람들끼리 친해지기 위해서 제 7회 친해지길 바래 프로젝트를 진행합니다. 많은 참여 부탁드립니다.',
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState({});

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (LoginState.isLogin) {
      axios
        .post(
          `${process.env.SERVER_ADR}/api/together/register`,
          {
            eventId: 23,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .catch((error) => {
          alert(error.response.data);
        });
    }
    setIntraID('');
  };

  const onClickEventList = (e) => {
    setSelectedEvent(EventList.find((ev) => ev.id === parseInt(e.target.id, 10)));
  };

  const onChange = (e: any) => {
    setIntraID(e.target.value);
  };

  return (
    <div className="main--apply">
      <p className="main--apply--title">
        {LoginState.id === '' ? '로그인 후 신청 가능' : `${LoginState.id}님, 신청하시죠?`}
      </p>
      <div className="main--apply--wrapper">
        <div className="main--apply--list">
          <p className="main--apply--list--title">신청 가능 목록</p>
          {EventList.length > 0 ? (
            EventList.map((e, i) => (
              <p className="main--apply--list--event" key={i}>
                <span id={`${e.id}`} onClick={onClickEventList}>
                  {e?.title}
                </span>
              </p>
            ))
          ) : (
            <p className="main--apply--list--empty">이벤트가 없습니다</p>
          )}
        </div>
        {EventList.length > 0 && (
          <div className="main--apply--eventInfo">
            {selectedEvent?.id ? (
              <>
                <p className="main--apply--eventInfo--title">{selectedEvent.title}</p>
                <span className="main--apply--eventInfo--description">{selectedEvent.description}</span>
                <div className="main--apply--eventInfo--submit">
                  <span>신청하기</span>
                </div>
              </>
            ) : (
              <p className="main--apply--eventInfo--empty">이벤트를 클릭해주세요</p>
            )}
          </div>
        )}
        {/* <div className="main--apply--formbox">
          <form onSubmit={onSubmit} className="main--apply--formbox--form">
            <input
              className="main--apply--formbox--input"
              placeholder="인트라 id를 입력해주세용"
              onChange={onChange}
              ref={inputRef}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '인트라 id를 입력해주세용')}
              value={intraID}
            ></input>
            <div className="main--apply--formbox--button">
              <button>신청</button>
            </div>
          </form>
        </div> */}
      </div>
    </div>
  );
}

export default Apply;
