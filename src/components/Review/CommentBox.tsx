import React, { useCallback, useState } from 'react';
import '@css/Review/CommentBox.scss';
import ellipsisImg from '@img/ellipsis-solid.svg';
import checkImg from '@img/check-solid.svg';
import ActionModal from './ActionModal';
import { getToken } from '@cert/TokenStorage';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';
import errorAlert from '@globalObj/function/errorAlert';
import { useSWRConfig } from 'swr';

function CommentBox(props: { intraId: string; comments: string; commentId: number; boardId: number }) {
  const { intraId, comments, commentId, boardId } = props;
  const [actionModalVisible, setActionModalVisible] = useState<boolean>(false);
  const [actionModalShow, setActionModalShow] = useState(false);
  const [myComment, setMyComment] = useState<string>(comments);
  const [commentMode, setCommentMode] = useState<string>('default');
  const { mutate } = useSWRConfig();

  const editComment = useCallback(() => {
    if (getToken()) {
      axios
        .put(
          `${getAddress()}/api/board/comment/${commentId}`,
          {
            comment: myComment,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then(() => {
          alert('수정 완료');
          mutate(`${getAddress()}/api/board/${boardId}`);
          setMyComment(comments);
        })
        .catch((err) => errorAlert(err));
    } else alert('로그인을 하셔야 댓글 수정이 가능합니다');
  }, [boardId, commentId, comments, mutate, myComment]);

  const onKeydownComment = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          editComment();
          setCommentMode('default');
        }
      }
    },
    [editComment],
  );

  const onClickEllipsis = () => {
    setActionModalShow(true);
  };

  const onSubmitEdit = () => {
    editComment();
    setCommentMode('default');
  };

  const onChangeComment = (e: any) => {
    setMyComment(e.target.value);
  };

  return (
    <div
      className="review--commentbox"
      onMouseOver={() => setActionModalVisible(true)}
      onMouseOut={() => setActionModalVisible(false)}
    >
      {actionModalShow && (
        <ActionModal
          mode="comment"
          commentId={commentId}
          boardId={boardId}
          setCommentMode={setCommentMode}
          setCommentActionModalShow={setActionModalShow}
        />
      )}
      <span className="review--commentbox--visitor">{intraId}</span>
      {commentMode === 'default' ? (
        <span className="review--commentbox--comment">{comments}</span>
      ) : (
        <input
          className="review--commentbox--edit_comment"
          value={myComment}
          onChange={onChangeComment}
          onKeyDown={onKeydownComment}
        ></input>
      )}
      <span>
        <img
          onClick={commentMode === 'default' ? onClickEllipsis : onSubmitEdit}
          className={`review--commentbox--ellipsis ${actionModalVisible && 'show'}`}
          src={commentMode === 'default' ? ellipsisImg : checkImg}
          alt={commentMode === 'default' ? ellipsisImg : checkImg}
        ></img>
      </span>
    </div>
  );
}

export default CommentBox;
