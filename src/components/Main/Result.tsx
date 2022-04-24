import React from 'react';
import '@css/Main/Result.scss';

function Result() {
  const tempArr = ['tmam', 'jwoo', 'sujikim', 'seongyle'];
  return (
    <div className="main--result">
      <p className="main--result--title">친바 결과보기</p>
      <div className="main--result--table">
        <div>
          <p className="main--result--team_name">team one</p>
          {tempArr.map((e, i) => (
            <p key={i} className="main--result--intra">
              {e}
            </p>
          ))}
        </div>
        <hr className="main--result--hr"></hr>
        <div>
          <p className="main--result--team_name">team two</p>
          {tempArr.map((e, i) => (
            <p key={i} className="main--result--intra">
              {e}
            </p>
          ))}
        </div>
        <div>
          <p className="main--result--team_name">team three</p>
          {tempArr.map((e, i) => (
            <p key={i} className="main--result--intra">
              {e}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Result;
