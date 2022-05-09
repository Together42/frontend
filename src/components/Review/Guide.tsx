import React from 'react';
import '@css/Review/Guide.scss';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import ModalShow from '@recoil/Review/CommentModalShow';
import GlobalLoginState from '@recoil/GlobalLoginState';
import EventListModalShow from '@recoil/Review/EventListModalShow';
import EventListModal from '@review/EventListModal';

interface Props {
  isElemExist: boolean;
}

function Guide(props: Props) {
  const { isElemExist } = props;
  const setModalShow = useSetRecoilState(ModalShow);
  const loginState = useRecoilValue(GlobalLoginState);
  const [eventListModalShow, setEventListModalShow] = useRecoilState(EventListModalShow);

  const onClickAddPosting = () => {
    if (loginState['id'] !== '') {
      setModalShow({ mode: 'posting', show: true });
    } else alert('로그인 후 이용해주세요');
  };

  const onClickSelectEvent = () => {
    setEventListModalShow(true);
  };

  console.log(eventListModalShow);

  return (
    <div className={`review--forPositioning`}>
      <div className={`review--guide  ${!isElemExist && 'position_unset'}`}>
        <p className="review--guide--title">친바 4회차</p>
        <div className={`review--guide--letters ${isElemExist && 'span_break'}`}>
          <span>친바는 식사 이외에도 사서분들 </span>
          <span>서로와 다양한 활동이 가능합니다. </span>
          <span>앞으로도 친하게 지내기를 바랍니다ㅎ</span>
        </div>
        <div className={`review--guide--buttonWrapper ${!isElemExist && 'position_unset'}`}>
          <div>
            <span onClick={onClickAddPosting}>게시글 쓰기</span>
          </div>
          <div className="review--guide--eventList">
            <span className="review--guide--eventList--button" onClick={onClickSelectEvent}>
              다른 회차 보기
            </span>
            {eventListModalShow && <EventListModal />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
