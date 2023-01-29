import React from 'react';
import '@css/Rotation/Rotation.scss';

export const RotateUserResult = (props) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return (
    <>
      <div className="rotation--wrapper">
        <div className="rotation--title">
          📚 {props.intraId} 님의 {year} {month} 월의 사서 로테 참여일입니다 📚
        </div>
        <div className="rotation--resultbox">
          {props.arr.empty ? props.arr.map((e) => <div>{e}</div>) : <div>참여일 정보가 없습니다</div>}
        </div>
        <div className="rotation--result-text">
          <p>사서 활동에 감사드립니다 👏</p>
        </div>
      </div>
    </>
  );
};
