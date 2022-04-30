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
  location: string;
  elemNum: number;
}

function Posting(props: Props) {
  const { image, teamName, comment, memberArr, elemNum, location } = props;
  const [modalShow, setModalShow] = useState(false);
  const tempVistComment = [
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
  ];
  const tempVisName = ['jwoo', 'jwoo', 'jwoo', 'jwoo', 'jwoo'];

  const onClickMoreButton = (e: any) => {
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
          <div>
            <span className="review--posting--title--team">{teamName}</span>
            <span className="review--posting--title--location">{location}</span>
          </div>
          <div className="review--posting--members">
            {memberArr.map((e, i) => (
              <img src={e} key={i} alt={e} />
            ))}
          </div>
        </div>
        {modalShow && <div className="review--posting--image--background"></div>}
        <div className={`review--posting--image ${modalShow && 'image-modal_show-in_web'}`}>
          <img src={image} alt={image} />
        </div>
        {modalShow ? (
          <div className="review--posting--detail_comments">
            <span className="review--posting--full_comment">{comment}</span>
            {tempVisName.map((e, i) => (
              <div>
                <span className="review--posting--visitor">{e}</span>
                <span className="review--posting--visitor_comment">{tempVistComment[i]}</span>
              </div>
            ))}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Posting;
