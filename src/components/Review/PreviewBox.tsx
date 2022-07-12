import React, { useCallback } from 'react';
import XmarkRd from '@img/xmark-solid-red.svg';
import '@css/Review/PreviewBox.scss';
import { ReviewPostingFileType, ReviewPostingUrlType } from '@usefulObj/types';

function PreviewBox(props: {
  boardImgArr?: ReviewPostingUrlType[];
  postUrlArr?: ReviewPostingUrlType[];
  setPostUrlArr: React.Dispatch<React.SetStateAction<ReviewPostingUrlType[]>>;
  setPostFileArr: React.Dispatch<React.SetStateAction<ReviewPostingFileType[]>>;
  setBoardImgArr?: React.Dispatch<React.SetStateAction<ReviewPostingUrlType[]>>;
}) {
  const { boardImgArr, postUrlArr, setPostUrlArr, setPostFileArr, setBoardImgArr } = props;

  const deleteImg = useCallback(
    (id: number) => {
      setPostUrlArr((prev) => prev.filter((elem) => elem['id'] !== id));
      setPostFileArr((prev) => prev.filter((elem) => elem['id'] !== id));
      if (setBoardImgArr) {
        setBoardImgArr((prev) => prev.filter((elem) => elem['id'] !== id));
      }
    },
    [setBoardImgArr, setPostFileArr, setPostUrlArr],
  );

  return (
    <div className="review--preview_box--for_grid">
      {boardImgArr && boardImgArr.length
        ? boardImgArr.map((obj) => (
            <div key={obj['id']} className="review--preview_box--preview_wrapper">
              {obj['type'].slice(0, 5) === 'image' ? (
                <img className="review--preview_box--preview" src={obj['url']} alt={obj['url']}></img>
              ) : (
                <video className="review--preview_box--preview" src={obj['url']} autoPlay loop muted></video>
              )}
              <img
                className="review--preview_box--Xmark"
                src={XmarkRd}
                alt={XmarkRd}
                onClick={() => deleteImg(obj['id'])}
              ></img>
            </div>
          ))
        : null}
      {postUrlArr && postUrlArr.length
        ? postUrlArr.map((obj) => (
            <div key={obj['id']} className="review--preview_box--preview_wrapper">
              {obj['type'].slice(0, 5) === 'image' ? (
                <img className="review--preview_box--preview" src={obj['url']} alt={obj['url']}></img>
              ) : (
                <video className="review--preview_box--preview" src={obj['url']} autoPlay loop muted></video>
              )}
              <img
                className="review--preview_box--Xmark"
                src={XmarkRd}
                alt={XmarkRd}
                onClick={() => deleteImg(obj['id'])}
              ></img>
            </div>
          ))
        : null}
    </div>
  );
}

export default PreviewBox;
