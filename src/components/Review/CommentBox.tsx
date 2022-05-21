import React, { useState } from 'react';
import '@css/Review/CommentBox.scss';
import ellipsisImg from '@img/ellipsis-solid.svg';
import { useRecoilState } from 'recoil';
import ActionModalShow from '@recoil/Review/ActionModalShow';
import ActionModal from './ActionModal';

function CommentBox(props: { intraId: string; comments: string; commentId: number }) {
  const { intraId, comments, commentId } = props;
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionModalShow, setActionModalShow] = useRecoilState(ActionModalShow);

  const onClickEllipsis = () => {
    setActionModalShow(true);
  };

  return (
    <div
      className="review--commentbox"
      onMouseOver={() => setActionModalVisible(true)}
      onMouseOut={() => setActionModalVisible(false)}
    >
      {actionModalShow && <ActionModal mode="comment" commentId={commentId} />}
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
