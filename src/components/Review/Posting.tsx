import React from 'react';
import '@css/Review/Posting.scss';

interface Props {
  image: string;
  teamName: string;
  comment: string;
  memberArr: string[];
}

function Posting(props: Props) {
  const { image, teamName, comment, memberArr } = props;
  return (
    <div className="review--posting--forFlex">
      <div className="review--posting--shownWrapper">
        <div className="review--posting--title">
          <span>{teamName}</span>
          <div className="review--posting--members">
            {memberArr.map((e, i) => (
              <img src={e} key={i} alt={e} />
            ))}
          </div>
        </div>
        <img className="review--posting--image" src={image} alt={image} />
        <div className="review--posting--comment">
          <span>{comment}</span>
        </div>
      </div>
    </div>
  );
}

export default Posting;
