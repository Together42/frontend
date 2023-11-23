import React from 'react';
import { Chrono } from 'react-chrono';
import '@css/Timeline/Home.scss';
import brush from '@img/paint-brush.png';
import items from './items';
import images from './images';

export const Home = () => {
  return (
    <div className="timeline--wrapper">
      <div className="timeline--title">
        2022년 집현전 활동 내역을 확인해보세요!
        <img className="timeline--title-img" src={brush} alt="none" />
      </div>
      <div className="timeline--chrono">
        <Chrono
          items={items}
          scrollable={{ scrollbar: true }}
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
        >
          {images
            ? images.map((elem) => (
                <div>
                  <img className="timeline--img" src={elem['url']} alt={elem['url']}></img>
                </div>
              ))
            : null}
        </Chrono>
      </div>
    </div>
  );
};

export default Home;
