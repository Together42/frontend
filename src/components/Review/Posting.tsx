import React, { useState } from 'react';
import '@css/Review/Posting.scss';
import caret_right from '@img/caret-right-solid.svg';
import { useRecoilState } from 'recoil';
import ReviewDetailModalShow from '@recoil/ReviewDetailModalShow';

interface Props {
  image: string;
  teamName: string;
  comment: string;
  memberArr: string[];
  elemNum: number;
}

function Posting(props: Props) {
  const { image, teamName, comment, memberArr, elemNum } = props;
  const [modalShow, setModalShow] = useState(false);

  const onClickMoreButton = (e) => {
    setModalShow(true);
  };

  return (
    <div
      className={`review--posting--forFlex ${elemNum % 2 === 0 ? 'justify-right' : 'justify-left'} ${
        elemNum === 4 && 'footer--empty'
      }`}
    >
      <div className={`review--posting--shownWrapper ${modalShow && 'wrapper-modal_show-in_web'}`}>
        <div className={`review--posting--title ${modalShow && 'title-modal_show-in_web'}`}>
          <span>{teamName}</span>
          <div className="review--posting--members">
            {memberArr.map((e, i) => (
              <img src={e} key={i} alt={e} />
            ))}
          </div>
        </div>
        <div className={`review--posting--image ${modalShow && 'image-modal_show-in_web'}`}>
          <img src={image} alt={image} />
        </div>
        <div className="review--posting--comments">
          <p className="review--posting--maincomment">{comment}</p>
          <div className="review--posting--subcomment">
            <p>
              <span>댓글 3개 모두 보기</span>
            </p>
            <p>
              <span>04.12</span>
            </p>
          </div>
        </div>
        <div
          className={`review--posting--open_modal ${elemNum % 2 === 0 ? 'position-right' : 'position-left'}`}
          onClick={onClickMoreButton}
        >
          <span>더보기</span>
          <img src={caret_right} alt={caret_right} />
        </div>
      </div>
    </div>
  );
}

export default Posting;
