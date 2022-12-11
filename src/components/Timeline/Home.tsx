import React from 'react';
import { Chrono } from 'react-chrono';
import timelineData from './data';
import '@css/Timeline/Home.scss';

export const Home = () => {
  return (
    <div className="timeline--wrapper">
      <div className="timeline--title">2022 집현전 실록</div>
      <div style={{ width: '750px', height: '800px' }}>
        <Chrono
          items={timelineData}
          scrollable={{ scrollbar: true }}
          theme={{
            primary: 'black',
            secondary: 'black',
            cardBgColor: 'white',
            cardForeColor: 'black',
            titleColor: 'white',
            titleColorActive: 'white',
          }}
        />
      </div>
    </div>
  );
};

export default Home;
