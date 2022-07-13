import React, { useState } from 'react';
import leftBtn from '@img/slider_btn_left.svg';
import RightBtn from '@img/slider_btn_right.svg';
import '@css/utils/FullImageSlider.scss';
import { imageType } from '@usefulObj/types';
import defaultImg from '@img/defaultImg.png';
import Xmark from '@img/circle-xmark-solid.svg';

function FullImageSlider(props: {
  imageArr: imageType[];
  setOpenFullImageSlider: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { imageArr = [defaultImg], setOpenFullImageSlider } = props;
  const [trans, setTrans] = useState(0);
  const imageWidth = 600;

  const onClickLeftBtn = () => {
    if (trans >= 0) {
      return;
    }
    setTrans((prev) => prev + imageWidth);
  };

  const onClickRightBtn = () => {
    if (trans <= -(imageWidth * (imageArr.length - 1))) {
      return;
    }
    setTrans((prev) => prev - imageWidth);
  };

  return (
    <div className="full_slider--background" onClick={() => setOpenFullImageSlider(false)}>
      <div className="full_slider--viewer" onClick={(e) => e.stopPropagation()}>
        <img className="full_slider--xbtn" src={Xmark} alt={Xmark} onClick={() => setOpenFullImageSlider(false)} />
        <div
          className="full_slider--slider"
          style={{ width: `${imageWidth * imageArr.length}px`, transform: `translateX(${trans}px)` }}
        >
          {imageArr.map((image) =>
            image['fileType'].slice(0, 5) === 'image' ? (
              <img src={image['filePath']} alt={image['filePath']} />
            ) : (
              <video src={image['filePath']} autoPlay loop muted controls></video>
            ),
          )}
        </div>
        <div className="full_slider--wrapper">
          {trans && imageArr.length > 1 ? (
            <img className="full_slider--image_btn__left" src={leftBtn} alt={leftBtn} onClick={onClickLeftBtn} />
          ) : null}
          {trans > -(imageWidth * (imageArr.length - 1)) && imageArr.length > 1 ? (
            <img className="full_slider--image_btn__right" src={RightBtn} alt={RightBtn} onClick={onClickRightBtn} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FullImageSlider;
