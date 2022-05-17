import React, { useEffect, useRef, useState } from 'react';
import '@css/Main/Apply.scss';
import axios from 'axios';
import GlobalLoginState from '@recoil/GlobalLoginState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/SelectedEvent';
import { EventType } from '@usefulObj/types';
import ApplyTeamMemArr from '@recoil/ApplyTeamMemArr';
import errorAlert from '@utils/errorAlert';

function Apply() {
  const LoginState = useRecoilValue(GlobalLoginState);
  const [EventList, setEventList] = useState<EventType[]>([]);
  const [globalSelectedEvent, setGlobalSelectedEvent] = useRecoilState(SelectedEvent);
  const [teamList, setTeamList] = useRecoilState(ApplyTeamMemArr);
  const [createMode, setCreateMode] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const ListWrapperRef = useRef(null);

  const onClickCreateModal = () => {
    if (getToken()) {
      setCreateMode(true);
    } else {
      alert('로그인을 해주세요!');
    }
  };

  const onSubmitCreate = (e: any) => {
    e.preventDefault();
    if (getToken() && LoginState.isLogin) {
      axios
        .post(
          `${process.env.SERVER_ADR}/api/together`,
          {
            title: createTitle,
            description: createDescription,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then(() => {
          alert('생성되었습니다');
          setCreateMode(false);
        })
        .catch((err) => errorAlert(err));
    } else {
      alert('로그인을 하셔야 생성 가능합니다!');
    }
  };

  const onChange = (e: any) => {
    if (e.target.id === 'title') {
      setCreateTitle(e.target.value);
    } else {
      setCreateDescription(e.target.value);
    }
  };

  const onSubmitApply = (e: any) => {
    e.preventDefault();
    if (getToken() && LoginState.isLogin) {
      axios
        .post(
          `${process.env.SERVER_ADR}/api/together/register`,
          {
            eventId: globalSelectedEvent.id,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then(() => {
          alert('신청되셨습니다');
          axios
            .get(`${process.env.SERVER_ADR}/api/together/${globalSelectedEvent.id}`)
            .then((res) => {
              if (res.data.teamList && Object.keys(res.data.teamList).length) setTeamList(res.data.teamList['null']);
              else setTeamList([]);
            })
            .catch((err) => errorAlert(err));
        })
        .catch((err) => errorAlert(err));
    } else {
      alert('로그인을 하셔야 신청 가능합니다!');
    }
  };

  const onClickEventList = (e: any) => {
    const clickedEvent = EventList.filter((ev) => ev.id === parseInt(e.target.id, 10))[0];
    setCreateMode(false);
    setGlobalSelectedEvent(clickedEvent);
  };

  // Event List update when createMode or selected event changed
  useEffect(() => {
    if (globalSelectedEvent.id) {
      axios
        .get(`${process.env.SERVER_ADR}/api/together/${globalSelectedEvent.id}`)
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
  }, [setGlobalSelectedEvent, createMode, globalSelectedEvent.id]);

  // Event List setter when component start
  useEffect(() => {
    axios
      .get(`${process.env.SERVER_ADR}/api/together`)
      .then((response) => {
        if (response.data.EventList.length > 0) {
          const rtnArr = response.data.EventList.filter((e) => !e['isMatching']);
          setEventList(rtnArr);
        }
      })
      .catch((err) => errorAlert(err));
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
  }, [setGlobalSelectedEvent, createMode]);

  useEffect(() => {
    window.scrollTo(0, ListWrapperRef.current.offsetTop);
  }, [teamList]);

  // Team List setter
  useEffect(() => {
    if (globalSelectedEvent.id) {
      axios
        .get(`${process.env.SERVER_ADR}/api/together/${globalSelectedEvent.id}`)
        .then((res) => {
          if (res.data.teamList && Object.keys(res.data.teamList).length) setTeamList(res.data.teamList['null']);
          else setTeamList([]);
        })
        .catch((err) => errorAlert(err));
    }
  }, [globalSelectedEvent.id, setTeamList]);

  return (
    <div className="main--apply">
      <p className="main--apply--title" ref={ListWrapperRef}>
        {getToken() ? `${LoginState.id}님, 신청하시죠?` : '로그인 후 신청 가능!' }
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
                <div className="main--apply--eventInfo--submit">
                  <span onClick={onSubmitApply}>신청하기</span>
                </div>
              </>
            ) : (
              <p className="main--apply--eventInfo--empty">이벤트를 클릭해주세요</p>
            )}
          </div>
        ) : createMode ? (
          <div className="main--apply--create_wrapper">
            <form className="main--apply--create_form" onSubmit={onSubmitCreate}>
              <div className="main--apply--create_input_wrapper">
                <div className="main--apply--create_input_label">
                  <span>친바제목</span>
                </div>
                <input
                  className="main--apply--create_input"
                  id="title"
                  placeholder="친바제목입력"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '친바제목입력')}
                  maxLength={40}
                  onChange={onChange}
                ></input>
              </div>
              <div className="main--apply--create_textarea_wrapper">
                <div className="main--apply--create_textarea_label">
                  <span>친바설명</span>
                </div>
                <textarea
                  className="main--apply--create_textarea"
                  id="description"
                  placeholder="친바설명입력"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '친바설명입력')}
                  rows={5}
                  maxLength={200}
                  onChange={onChange}
                ></textarea>
              </div>
              <div className="main--apply--create_button_wrapper">
                <button className="main--apply--create_button">
                  <span>친바생성</span>
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Apply;
