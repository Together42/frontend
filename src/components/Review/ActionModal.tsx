import React, { useCallback } from 'react';
import Xbtn from '@img/xmark-solid.svg';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ActionModalShow from '@recoil/Review/ActionModalShow';
import '@css/Review/ActionModal.scss';
import axios from 'axios';
import getAddress from '@globalObj/func/getAddress';
import { getToken } from '@cert/TokenStorage';
import errorAlert from '@utils/errorAlert';
import GetBoards from '@globalObj/func/getBoards';
import SelectedEvent from '@recoil/SelectedEvent';
import BoardsObj from '@recoil/Review/BoardsObj';

function ActionModal(props: { mode: string; boardId?: number }) {
  const { mode, boardId } = props;
  const setActionModalShow = useSetRecoilState(ActionModalShow);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const setBoardsObj = useSetRecoilState(BoardsObj);

  const deletePost = useCallback(() => {
    axios
      .delete(`${getAddress()}/api/board/${boardId}`, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
      })
      .then(() => {
        alert('삭제되었습니다');
        GetBoards(selectedEvent['id'], setBoardsObj);
        setActionModalShow(false);
      })
      .catch((err) => errorAlert(err));
  }, [boardId, selectedEvent, setActionModalShow, setBoardsObj]);

  const onClickXbtn = () => {
    setActionModalShow(false);
  };

  return (
    <div
      className="review--actionModal--background"
      onClick={() => {
        setActionModalShow(false);
      }}
    >
      <div className="review--actionModal" onClick={(e) => e.stopPropagation()}>
        <div className="review--actionModal--edit">{mode === 'post' ? '게시글 수정' : '댓글 수정'}</div>
        <hr className="review--actionModal--hr" />
        <div className="review--actionModal--delete">{mode === 'post' ? '게시글 삭제' : '댓글 삭제'}</div>
        <hr className="review--actionModal--hr" />
        <div className="review--actionModal--xbtn">
          <img src={Xbtn} alt={Xbtn} onClick={onClickXbtn} />
        </div>
      </div>
    </div>
  );
}

export default ActionModal;
