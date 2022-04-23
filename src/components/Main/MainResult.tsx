import React from 'react';
import '@css/MainResult.scss';

function MainResult() {
  return (
    <div className="main--result">
      <p className="main--result--title">친바 결과보기</p>
      <div className="main--result--table">
        <div>
          <p className="main--result--team_name">team1</p>
          <p>tmam</p>
          <p>tmam</p>
          <p>tmam</p>
          <p>tmam</p>
        </div>
        <div>
          <p className="main--result--team_name">team2</p>
          <p>tmam</p>
          <p>tmam</p>
          <p>tmam</p>
          <p>tmam</p>
        </div>
        <div>
          <p className="main--result--team_name">team3</p>
          <p>tmam</p>
          <p>tmam</p>
          <p>tmam</p>
          <p>tmam</p>
        </div>
      </div>
    </div>
  );
}

export default MainResult;
