import React from 'react';
import XmarkRd from '@img/xmark-solid-red.svg';
import '@css/Review/PreviewBox.scss';

function PreviewBox(props: { imgArr: string[] }) {
  const { imgArr } = props;

  return (
    <div className="review--preview_box">
      <div className="review--preview_box--submitted_wrapper">
        <div className="review--preview_box--submitted_title">Uploads</div>
        <div className="review--preview_box--for_grid">
          {imgArr.map((img) => (
            <div key={img} className="review--preview_box--preview_wrapper">
              <img className="review--preview_box--preview" src={img} alt={img}></img>
              <img className="review--preview_box--Xmark" src={XmarkRd} alt={XmarkRd}></img>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreviewBox;
