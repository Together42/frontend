import React, { useCallback } from 'react';
import Xbtn from '@img/xmark-solid.svg';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import '@css/Review/ActionModal.scss';
import axios from 'axios';
import getAddress from '@globalObj/function/getAddress';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@globalObj/function/errorAlert';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import { useSWRConfig } from 'swr';
import { useNavigate } from 'react-router';
import DeviceMode from '@recoil/DeviceMode';
import EditPostingModalShow from '@recoil/Review/EditPostingModalShow';

function ActionModal(props: {
  mode: string;
  boardId?: number;
  commentId?: number;
  setCommentMode?: React.Dispatch<React.SetStateAction<string>>;
  setCommentActionModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
  setPostActionModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mode, boardId, commentId, setCommentMode, setCommentActionModalShow, setPostActionModalShow } = props;
  const navigate = useNavigate();
  const deviceMode = useRecoilValue(DeviceMode);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const setEditPostingModalShow = useSetRecoilState(EditPostingModalShow);
  const { mutate } = useSWRConfig();

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
          if (selectedEvent) mutate(`${getAddress()}/api/board/?eventId=${selectedEvent['id']}`);
          mutate(`${getAddress()}/api/board`);
        })
        .catch((err) => errorAlert(err));
    } else {
      alert('로그인을 하셔야 삭제 가능합니다');
      navigate('/');
    }
  }, [boardId, mutate, navigate, selectedEvent]);

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
          mutate(`${getAddress()}/api/board/${boardId}`);
        })
        .catch((err) => errorAlert(err));
    } else {
      alert('로그인을 하셔야 삭제 가능합니다');
      navigate('/');
    }
  }, [boardId, commentId, mutate, navigate]);

  const onClickUpdate = () => {
    if (mode === 'post') {
      if (deviceMode === 'desktop')
        setEditPostingModalShow((prev) => {
          return { ...prev, [boardId]: true };
        });
      else if (deviceMode === 'mobile') navigate(`mobile/editpost/${boardId}`);
    } else if (mode === 'comment') setCommentMode('edit');
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
        if (mode === 'post') setPostActionModalShow(false);
        else if (mode === 'comment') setCommentActionModalShow(false);
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
