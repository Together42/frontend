import React, { useState } from 'react';
import leftBtn from '@img/slider_btn_left.png';
import RightBtn from '@img/slider_btn_right.png';
import '@css/Review/SliderBtnBox.scss';

function SliderBtnBox(props: { imageArr: string[] }) {
  const { imageArr } = props;
  const [trans, setTrans] = useState(0);
  const [imagePage, setImagePage] = useState(0);
  const imageWidth = 300;

  const onClickLeftBtn = () => {
    if (trans >= 0) {
      return;
    }
    setTrans((prev) => prev + imageWidth);
    setImagePage((prev) => prev - 1);
  };

  const onClickRightBtn = () => {
    if (trans <= -(imageWidth * (imageArr.length - 1))) {
      return;
    }
    setTrans((prev) => prev - imageWidth);
    setImagePage((prev) => prev + 1);
  };

  return (
    <div className="review--btn_box_viewer">
      <div
        className="review--btn_box_slider"
        style={{ width: `${imageWidth * (imagePage + 1)}px`, transform: `translateX${trans}px` }}
      >
        {imageArr && <img src={imageArr[imagePage]} alt={imageArr[imagePage]} />}
      </div>
      <div className="review--btn_box_wrapper">
        <img className="review--image_btn" src={leftBtn} alt={leftBtn} onClick={onClickLeftBtn} />
        <img className="review--image_btn" src={RightBtn} alt={RightBtn} onClick={onClickRightBtn} />
      </div>
    </div>
  );
}

export default SliderBtnBox;
