import React, { useState } from 'react';
import '@css/Review/CommentBox.scss';
import ellipsisImg from '@img/ellipsis-solid.svg';

function CommentBox(props: { intraId: string; comments: string; key: number }) {
  const { intraId, comments, key } = props;
  const [actionModalVisible, setActionModalVisible] = useState(false);

  const onClickEllipsis = () => {
    alert('go');
  };

  return (
    <div
      className="review--commentbox"
      key={key}
      onMouseOver={() => setActionModalVisible(true)}
      onMouseOut={() => setActionModalVisible(false)}
    >
      <span className="review--commentbox--visitor">{intraId}</span>
      <span className="review--commentbox--comment">{comments}</span>
      <span>
        <img
          onClick={() => onClickEllipsis()}
          className={`review--commentbox--ellipsis ${actionModalVisible && 'show'}`}
          src={ellipsisImg}
          alt={ellipsisImg}
        ></img>
      </span>
    </div>
  );
}

export default CommentBox;
