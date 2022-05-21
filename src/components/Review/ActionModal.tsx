import React from 'react';
import Xbtn from '@img/xmark-solid.svg';
import { useSetRecoilState } from 'recoil';
import ActionModalShow from '@recoil/Review/ActionModalShow';
import '@css/Review/ActionModal.scss';

function ActionModal(props: { mode: string }) {
  const { mode } = props;
  const setActionModalShow = useSetRecoilState(ActionModalShow);

  const onClickXbtn = () => {
    setActionModalShow(false);
  };

  return (
    <div className="review--actionModal--background">
      <div className="review--actionModal">
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
