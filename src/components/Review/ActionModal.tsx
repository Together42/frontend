import React, { useCallback } from 'react';
import Xbtn from '@img/xmark-solid-white.svg';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import '@css/Review/ActionModal.scss';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import GetBoards from '@globalObj/function/getBoards';
import BoardsObj from '@recoil/Review/BoardsObj';
import { ReviewBoardType } from '@globalObj/object/types';
import getDetailBoard from '@globalObj/function/getDetailBoard';
import SelectedEvent from '@recoil/Review/SelectedEvent';

function ActionModal(props: {
  mode: string;
  boardId?: number;
  commentId?: number;
  setBoardObj?: React.Dispatch<React.SetStateAction<ReviewBoardType>>;
  setCommentMode?: React.Dispatch<React.SetStateAction<string>>;
  setCommentActionModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
  setPostActionModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPostingModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    mode,
    boardId,
    commentId,
    setBoardObj,
    setCommentMode,
    setCommentActionModalShow,
    setEditPostingModalShow,
    setPostActionModalShow,
  } = props;
  const selectedEvent = useRecoilValue(SelectedEvent);
  const setBoardsObj = useSetRecoilState(BoardsObj);

  const closeModal = () => {
    if (mode === 'post') setPostActionModalShow(false);
    else if (mode === 'comment') setCommentActionModalShow(false);
  };

  const deletePost = useCallback(() => {
    if (getToken()) {
      axios
        .delete(`${getAddress()}/api/board/${boardId}`, {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        })
        .then(() => {
          alert('삭제되었습니다');
          GetBoards(selectedEvent['id'], setBoardsObj);
        })
        .catch((err) => errorAlert(err));
    } else alert('로그인을 하셔야 삭제 가능합니다');
  }, [boardId, selectedEvent, setBoardsObj]);

  const deleteComment = useCallback(() => {
    if (getToken()) {
      axios
        .delete(`${getAddress()}/api/board/comment/${commentId}`, {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        })
        .then(() => {
          alert('삭제되었습니다');
          getDetailBoard(boardId, setBoardObj);
        })
        .catch((err) => errorAlert(err));
    } else alert('로그인을 하셔야 삭제 가능합니다');
  }, [boardId, commentId, setBoardObj]);

  const onClickUpdate = () => {
    if (mode === 'post') setEditPostingModalShow(true);
    else if (mode === 'comment') setCommentMode('edit');
    closeModal();
  };

  const onClickDelete = () => {
    if (mode === 'post') deletePost();
    else if (mode === 'comment') deleteComment();
    closeModal();
  };

  return (
    <div
      className="review--actionModal--background"
      onClick={() => {
        setPostActionModalShow(false);
      }}
    >
      <div className="review--actionModal" onClick={(e) => e.stopPropagation()}>
        <div className="review--actionModal--edit" onClick={onClickUpdate}>
          {mode === 'post' ? '게시글 수정' : '댓글 수정'}
        </div>
        <hr className="review--actionModal--hr" />
        <div className="review--actionModal--delete" onClick={onClickDelete}>
          {mode === 'post' ? '게시글 삭제' : '댓글 삭제'}
        </div>
        <hr className="review--actionModal--hr" />
        <div className="review--actionModal--xbtn">
          <img src={Xbtn} alt={Xbtn} onClick={() => closeModal()} />
        </div>
      </div>
    </div>
  );
}

export default ActionModal;
