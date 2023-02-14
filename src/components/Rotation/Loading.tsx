import React from 'react';
import FadeLoader from 'react-spinners/FadeLoader';
import '@css/Rotation/Rotation.scss';

function LoadingSpinner() {
  return (
    <div className="contentWrap rotation--spinner">
      <div style={{}}>
        <FadeLoader color="#505050" height={10} width={5} radius={1} margin={3} />
      </div>
      <div className="rotation--spinner-info">데이터를 불러오는 중입니다!</div>
    </div>
  );
}

export default LoadingSpinner;
