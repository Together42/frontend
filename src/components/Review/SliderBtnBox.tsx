import React, { useState } from 'react';
import leftBtn from '@img/slider_btn_left.png';
import RightBtn from '@img/slider_btn_right.png';
import '@css/Review/SliderBtnBox.scss';
import { imageType } from '@usefulObj/types';
import defaultImg from '@img/defaultImg.png';

function SliderBtnBox(props: { imageArr: imageType[] }) {
  const { imageArr = [defaultImg] } = props;
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

  console.log(trans);

  return (
    <div className="review--btn_box_viewer">
      <div
        className="review--btn_box_slider"
        style={{ width: `${imageWidth * imageArr.length}px`, transform: `translateX(${trans}px)` }}
      >
        {imageArr && imageArr.map((image) => <img src={image['filePath']} alt={image['filePath']} />)}
      </div>
      <div className="review--btn_box_wrapper">
        <img className="review--image_btn" src={leftBtn} alt={leftBtn} onClick={onClickLeftBtn} />
        <img className="review--image_btn" src={RightBtn} alt={RightBtn} onClick={onClickRightBtn} />
      </div>
    </div>
  );
}

export default SliderBtnBox;
