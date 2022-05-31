import React, { useCallback } from 'react';
import XmarkRd from '@img/xmark-solid-red.svg';
import '@css/Review/PreviewBox.scss';

function PreviewBox(props: {
  imgArr: string[];
  mode: string;
  setDeleteImgArr: React.Dispatch<React.SetStateAction<string[]>>;
  setDeleteIdxArr: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const { imgArr, setDeleteImgArr, setDeleteIdxArr } = props;

  const deleteImg = useCallback(
    (img: string, idx: number) => {
      setDeleteImgArr((prev) => [...prev, img]);
      setDeleteIdxArr((prev) => [...prev, idx]);
    },
    [setDeleteIdxArr, setDeleteImgArr],
  );

  return (
    <div className="review--preview_box--for_grid">
      {imgArr.map((img, idx) => (
        <div key={img} className="review--preview_box--preview_wrapper">
          <img className="review--preview_box--preview" src={img} alt={img}></img>
          <img
            className="review--preview_box--Xmark"
            src={XmarkRd}
            alt={XmarkRd}
            onClick={() => deleteImg(img, idx)}
          ></img>
        </div>
      ))}
    </div>
  );
}

export default PreviewBox;
