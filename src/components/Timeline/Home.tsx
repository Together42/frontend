import React, { useEffect, useState } from 'react';
import { Chrono } from 'react-chrono';
import timelineData from './data';
import '@css/Timeline/Home.scss';
import brush from '@img/timeline/paint-brush.png';
import items from './items';
import axios from 'axios';

export const Home = () => {
  const [ImgArr, setImgArr] = useState(null);

  const getImg = () => {
    axios
      .get('https://yts.mx/api/v2/list_movies.json?page=1&sort_by=rating')
      .then((res) => res.data.data.movies)
      .then((res2) => setImgArr(res2))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getImg();
  }, []);

  return (
    <div className="timeline--wrapper">
      <div className="timeline--title">
        2022년 집현전 활동 내역을 확인해보세요!
        <img className="timeline--title-img" src={brush} />
      </div>
      <div className="timeline--chrono" style={{}}>
        <Chrono
          items={items}
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
        >
          {ImgArr
            ? ImgArr.map((elem) => (
                <div>
                  <img src={elem['medium_cover_image']} alt={elem['medium_cover_image']}></img>
                </div>
              ))
            : null}
        </Chrono>
      </div>
    </div>
  );
};

export default Home;
