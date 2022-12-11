import React from 'react';
import { Chrono } from 'react-chrono';
import timelineData from './data';
import '@css/Timeline/Home.scss';
import brush from '@img/timeline/paint-brush.png';

export const Home = () => {
  return (
    <div className="timeline--wrapper">
      <div className="timeline--title">
        2022년 집현전 활동 내역을 확인해보세요!
        <img className="timeline--title-img" src={brush} />
      </div>
      <div className="timeline--chrono" style={{}}>
        <Chrono
          items={timelineData}
          scrollable={{ scrollbar: true }}
          slideShow
          slideItemDuration={2000}
          allowDynamicUpdate={true}
          theme={{
            primary: 'black',
            secondary: 'black',
            cardBgColor: 'white',
            cardForeColor: 'black',
            titleColor: 'black',
            titleColorActive: 'white',
          }}
          fontSizes={{ cardSubtitle: '0.85rem', cardText: '0.8rem', cardTitle: '1rem', title: '1.3rem' }}
        ></Chrono>
      </div>
    </div>
  );
};

export default Home;
