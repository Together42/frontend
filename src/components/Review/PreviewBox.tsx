import React, { useCallback } from 'react';
import XmarkRd from '@img/xmark-solid-red.svg';
import '@css/Review/PreviewBox.scss';

function PreviewBox(props: {
  imgArr: string[];
  mode: string;
  setDeleteArr: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { imgArr, setDeleteArr } = props;

  const deleteImg = useCallback(
    (img: string) => {
      setDeleteArr((prev) => [...prev, img]);
    },
    [setDeleteArr],
  );

  return (
    <div className="review--preview_box--for_grid">
      {imgArr.map((img) => (
        <div key={img} className="review--preview_box--preview_wrapper">
          <img className="review--preview_box--preview" src={img} alt={img}></img>
          <img className="review--preview_box--Xmark" src={XmarkRd} alt={XmarkRd} onClick={() => deleteImg(img)}></img>
        </div>
      ))}
    </div>
  );
}

export default PreviewBox;
