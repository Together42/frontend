import React from 'react';
import '@css/Review/Guide.scss';

function Guide() {
  return (
    <div className="review--posting--guide">
      <p className="review--posting--guide--title">친바 4회차</p>
      <div className="review--posting--guide--letters">
        <p>친바는 식사 이외에도 사서분들 </p>
        <p>서로와 다양한 활동이 가능합니다.</p>
        <p>앞으로도 친하게 지내기를 바랍니다ㅎ</p>
      </div>
      <div className="review--posting--guide--buttonWrapper">
        <div>
          <span>게시글 쓰기</span>
        </div>
        <div className="review--posting--guide--diffRound">
          <span>다른 회차 보기</span>
        </div>
      </div>
    </div>
  );
}

export default Guide;
