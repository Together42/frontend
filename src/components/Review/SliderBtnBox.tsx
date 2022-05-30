import React, { useState } from 'react';
import leftBtn from '@img/slider_btn_left.png';
import RightBtn from '@img/slider_btn_right.png';
import '@css/Review/SliderBtnBox.scss';
import { imageType } from '@usefulObj/types';
import defaultImg from '@img/defaultImg.png';
import Xmark from '@img/xmark-solid.svg';

function SliderBtnBox(props: { imageArr: imageType[]; mode?: string }) {
  const { imageArr = [defaultImg], mode } = props;
  const [trans, setTrans] = useState(0);
  const imageWidth = 300;

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
    <div className="review--btn_box_viewer">
      {mode === 'edit' ? <img className="review--btn_box_xbtn" src={Xmark} alt={Xmark} /> : null}
      <div
        className="review--btn_box_slider"
        style={{ width: `${imageWidth * imageArr.length}px`, transform: `translateX(${trans}px)` }}
      >
        {imageArr.map((image) => (
          <img src={image['filePath']} alt={image['filePath']} />
        ))}
      </div>
      <div className="review--btn_box_wrapper">
        {trans && imageArr.length > 1 ? (
          <img className="review--image_btn__left" src={leftBtn} alt={leftBtn} onClick={onClickLeftBtn} />
        ) : null}
        {trans > -(imageWidth * (imageArr.length - 1)) && imageArr.length > 1 ? (
          <img className="review--image_btn__right" src={RightBtn} alt={RightBtn} onClick={onClickRightBtn} />
        ) : null}
      </div>
    </div>
  );
}

export default SliderBtnBox;
