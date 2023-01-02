import React, { useEffect, useState } from 'react';
import { Chrono } from 'react-chrono';
import '@css/Timeline/Home.scss';
import brush from '@img/paint-brush.png';
import items from './items';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';

export const Home = () => {
  const [ImgArr, setImgArr] = useState(null);

  const getImg = () => {
    axios
      .get(`${getAddress()}/api/timeline`)
      .then((res) => res.data.img)
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
                  <img src={elem['url']} alt={elem['url']} width={290} height={245}></img>
                </div>
              ))
            : null}
        </Chrono>
      </div>
    </div>
  );
};

export default Home;
