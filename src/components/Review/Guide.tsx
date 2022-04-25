import React from 'react';
import '@css/Review/Guide.scss';

interface Props {
  isElemExist: boolean;
}

function Guide(props: Props) {
  const { isElemExist } = props;
  return (
    <div className={`review--forPositioning`}>
      <div className={`review--guide  ${!isElemExist && 'position_unset'}`}>
        <p className="review--guide--title">친바 4회차</p>
        <div className="review--guide--letters">
          <span>친바는 식사 이외에도 사서분들 </span>
          <span>서로와 다양한 활동이 가능합니다. </span>
          <span>앞으로도 친하게 지내기를 바랍니다ㅎ</span>
        </div>
        <div className={`review--guide--buttonWrapper ${!isElemExist && 'position_unset'}`}>
          <div>
            <span>게시글 쓰기</span>
          </div>
          <div className="review--guide--diffRound">
            <span>다른 회차 보기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
