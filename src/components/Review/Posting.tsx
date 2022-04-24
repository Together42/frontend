import React from 'react';
import '@css/Review/Posting.scss';
import Guide from './Guide';

interface Props {
  image: string;
  teamName: string;
  comment: string;
  memberArr: string[];
  elemNum: number;
}

function Posting(props: Props) {
  const { image, teamName, comment, memberArr, elemNum } = props;
  return (
    <div
      className={`review--posting--forFlex ${elemNum % 2 === 0 ? 'justify-right' : 'justify-left'} ${
        elemNum === 4 && 'footer--empty'
      }`}
    >
      {elemNum === 1 && <Guide />}
      <div className="review--posting--shownWrapper">
        <div className="review--posting--title">
          <span>{teamName}</span>
          <div className="review--posting--members">
            {memberArr.map((e, i) => (
              <img src={e} key={i} alt={e} />
            ))}
          </div>
        </div>
        <div className="review--posting--image">
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
      </div>
    </div>
  );
}

export default Posting;
