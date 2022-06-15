import React, { useState } from 'react';
import '@css/Review/Guide.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import EventListModalShow from '@recoil/Review/SelectSomeModalShow';
import SelectSomeModal from '@review/SelectSomeModal';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import DeviceMode from '@recoil/DeviceMode';

interface Props {
  isElemExist: boolean;
}

function Guide(props: Props) {
  const { isElemExist } = props;
  const deviceMode = useRecoilValue(DeviceMode);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const setNewPostingModalShow = useSetRecoilState(NewPostingModalShow);
  const [eventListModalShow, setEventListModalShow] = useRecoilState(EventListModalShow);
  const [isEventBtnClicked, setIsEventBtnClicked] = useState(false);

  const onClickAddPosting = () => {
    setIsEventBtnClicked(false);
    if (getToken()) setNewPostingModalShow(true);
    else alert('로그인 후 이용해주세요');
  };

  const onClickSelectEvent = () => {
    setIsEventBtnClicked(true);
    setEventListModalShow(true);
  };

  return (
    <div className={`review--forPositioning`}>
      <div className={`review--guide  ${!isElemExist && deviceMode === 'desktop' && 'position_unset'}`}>
        <p className="review--guide--title">
          {selectedEvent ? selectedEvent['title'].slice(0, 20) : '친바 게시판입니다!'}
        </p>
        <div className={`review--guide--letters ${isElemExist && deviceMode === 'desktop' && 'span_break'}`}>
          <span>친바는 식사 이외에도 사서분들 </span>
          <span>서로와 다양한 활동이 가능합니다. </span>
          <span>앞으로도 친하게 지내기를 바랍니다ㅎ</span>
        </div>
        <div className={`review--guide--buttonWrapper ${!isElemExist && deviceMode === 'desktop' && 'position_unset'}`}>
          <div>
            <span onClick={onClickAddPosting}>게시글 쓰기</span>
          </div>
          <div className="review--guide--eventList">
            <span className="review--guide--eventList--button" onClick={onClickSelectEvent}>
              다른 회차 보기
            </span>
            {eventListModalShow && isEventBtnClicked && <SelectSomeModal mode="main_event" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
