import React, { useCallback } from 'react';
import XmarkRd from '@img/xmark-solid-red.svg';
import '@css/Review/PreviewBox.scss';

function PreviewBox(props: {
  boardImgArr?: string[];
  postUrlArr?: string[];
  mode: string;
  setDeleteImgArr: React.Dispatch<React.SetStateAction<string[]>>;
  setDeleteIdxArr: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const { setDeleteImgArr, setDeleteIdxArr, boardImgArr, postUrlArr } = props;

  const deleteImg = useCallback(
    (img: string, idx?: number) => {
      setDeleteImgArr((prev) => [...prev, img]);
      if (idx !== undefined) setDeleteIdxArr((prev) => [...prev, idx]);
    },
    [setDeleteIdxArr, setDeleteImgArr],
  );

  return (
    <div className="review--preview_box--for_grid">
      {boardImgArr && boardImgArr.length
        ? boardImgArr.map((img) => (
            <div key={img} className="review--preview_box--preview_wrapper">
              <img className="review--preview_box--preview" src={img} alt={img}></img>
              <img
                className="review--preview_box--Xmark"
                src={XmarkRd}
                alt={XmarkRd}
                onClick={() => deleteImg(img)}
              ></img>
            </div>
          ))
        : null}
      {postUrlArr && postUrlArr.length
        ? postUrlArr.map((img, idx) => (
            <div key={img} className="review--preview_box--preview_wrapper">
              <img className="review--preview_box--preview" src={img} alt={img}></img>
              <img
                className="review--preview_box--Xmark"
                src={XmarkRd}
                alt={XmarkRd}
                onClick={() => deleteImg(img, idx)}
              ></img>
            </div>
          ))
        : null}
    </div>
  );
}

export default PreviewBox;
