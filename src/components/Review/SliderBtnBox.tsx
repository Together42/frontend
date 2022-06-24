import React, { useEffect, useRef, useState } from 'react';
import leftBtn from '@img/slider_btn_left.svg';
import RightBtn from '@img/slider_btn_right.svg';
import '@css/Review/SliderBtnBox.scss';
import { imageType } from '@usefulObj/types';
import defaultImg from '@img/defaultImg.png';
import FullImageSlider from '@utils/FullImageSlider';
import expandImg from '@img/expand-solid.svg';
import { useRecoilValue } from 'recoil';
import DeviceMode from '@recoil/DeviceMode';

function SliderBtnBox(props: { imageArr: imageType[] }) {
  const { imageArr = [defaultImg] } = props;
  const deviceMode = useRecoilValue(DeviceMode);
  const imageRef = useRef(null);
  const [trans, setTrans] = useState(0);
  const [openFullImageSlider, setOpenFullImageSlider] = useState(false);
  const [imageWidth, setImageWidth] = useState(deviceMode === 'desktop' ? 300 : window.innerWidth);
  const [isTouchAction, setIsTouchAction] = useState(false);
  const [page, setPage] = useState(1);

  const [posX, setPosX] = useState(0);
  const [moveX, setMoveX] = useState(0);

  const moveImageWidthLeft = () => {
    if (trans >= 0) {
      return;
    }
    setPage((prev) => prev - 1);
    setTrans((prev) => prev + imageWidth);
  };

  const moveImageWidthRight = () => {
    if (trans <= -(imageWidth * (imageArr.length - 1))) {
      return;
    }
    setPage((prev) => prev + 1);
    setTrans((prev) => prev - imageWidth);
  };

  const moveLeft = () => {
    let moveWidht: number;
    let i = 0;
    if (trans >= 0) {
      return;
    }
    while (moveX < -imageWidth * i) {
      moveWidht = imageWidth * (i + 1);
      i++;
    }
    setPage((prev) => prev - i);
    setTrans((prev) => {
      if (prev + moveWidht < 0) return prev + moveWidht;
      else return 0;
    });
  };

  const moveRight = () => {
    let moveWidht: number;
    let i = 0;
    if (trans <= -(imageWidth * (imageArr.length - 1))) {
      return;
    }
    while (moveX > imageWidth * i) {
      moveWidht = imageWidth * (i + 1);
      i++;
    }
    setPage((prev) => prev + i);
    setTrans((prev) => {
      if (prev - moveWidht > -(imageWidth * (imageArr.length - 1))) return prev - moveWidht;
      else return -(imageWidth * (imageArr.length - 1));
    });
  };

  function touchStart(e) {
    setPosX(e.touches[0].pageX);
  }

  function touchMove(e) {
    const move = posX - e.touches[0].pageX;
    if (move) setIsTouchAction(true);
    if (-60 < moveX && moveX < 60) setMoveX(move);
  }

  function touchEnd() {
    if (moveX > 60) moveRight();
    else if (moveX < -60) moveLeft();
    setMoveX(0);
    if (-60 < moveX && moveX < 60) setIsTouchAction(false);
  }

  useEffect(() => {
    setImageWidth(deviceMode === 'desktop' ? 300 : window.innerWidth);
  }, [deviceMode]);

  return (
    <div className="review--btn_box_viewer">
      {openFullImageSlider && <FullImageSlider imageArr={imageArr} setOpenFullImageSlider={setOpenFullImageSlider} />}
      {imageArr && imageArr.length > 1 && (
        <div className="review--btn_box--pagination">{`${page}/${imageArr.length}`}</div>
      )}
      <div
        className="review--btn_box_slider"
        style={{ width: `${imageWidth * imageArr.length}px` }}
        onTouchStart={imageArr && imageArr.length > 1 ? touchStart : null}
        onTouchMove={imageArr && imageArr.length > 1 ? touchMove : null}
        onTouchEnd={imageArr && imageArr.length > 1 ? touchEnd : null}
      >
        {imageArr.map((image) => {
          return (
            <div
              className="review--btn_box_slider--image_wrapper"
              ref={imageRef}
              style={{
                width: `${imageWidth}px`,
                transform: `translateX(${trans - moveX}px)`,
                touchAction: `${isTouchAction ? 'none' : 'auto'}`,
              }}
            >
              <img
                className="review--btn_box_slider--image"
                src={image['filePath']}
                alt={image['filePath']}
                style={{ width: `${imageWidth}px` }}
              />
            </div>
          );
        })}
      </div>
      {deviceMode === 'desktop' && (
        <>
          <div className="review--btn_box_wrapper" style={{ width: `${imageWidth}px` }}>
            {trans && imageArr.length > 1 ? (
              <img className="review--image_btn__left" src={leftBtn} alt={leftBtn} onClick={moveImageWidthLeft} />
            ) : null}
            {trans > -(imageWidth * (imageArr.length - 1)) && imageArr.length > 1 ? (
              <img className="review--image_btn__right" src={RightBtn} alt={RightBtn} onClick={moveImageWidthRight} />
            ) : null}
          </div>
          <div className="review--btn_box_expand">
            <img src={expandImg} alt={expandImg} onClick={() => setOpenFullImageSlider(true)} />
          </div>
        </>
      )}
    </div>
  );
}

export default SliderBtnBox;
