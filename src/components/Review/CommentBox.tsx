import React, { useState } from 'react';
import '@css/Review/CommentBox.scss';
import ellipsisImg from '@img/ellipsis-solid.svg';
import { useRecoilState } from 'recoil';
import ActionModalShow from '@recoil/Review/ActionModalShow';
import ActionModal from './ActionModal';
import { ReviewBoardType } from '@usefulObj/types';

function CommentBox(props: {
  intraId: string;
  comments: string;
  commentId: number;
  boardId: number;
  setBoardObj: React.Dispatch<React.SetStateAction<ReviewBoardType>>;
}) {
  const { intraId, comments, commentId, boardId, setBoardObj } = props;
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
      {actionModalShow && (
        <ActionModal mode="comment" commentId={commentId} boardId={boardId} setBoardObj={setBoardObj} />
      )}
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
