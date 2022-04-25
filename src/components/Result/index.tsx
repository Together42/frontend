import React from 'react';
import '@css/Result/Result.scss';
import Footer from '@result/Footer';

function Result() {
  const tempArr = ['tmam', 'jwoo', 'sujikim', 'seongyle'];
  return (
    <>
      <div className="result">
        {/* <p className="result--title">친바의 결과는</p> */}
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
