import React, { useState } from 'react';
import '@css/Review/Posting.scss';
import caret_right from '@img/caret-right-solid.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PostingType } from '@usefulObj/types';
import CommentModalShow from '@recoil/Review/CommentModalShow';
import elipsisImg from '@img/ellipsis-solid.svg';
import ActionModalShow from '@recoil/Review/ActionModalShow';
import ActionModal from './ActionModal';
import NewPostingModal from './NewPostingModal';
import EditPostingModalShow from '@recoil/Review/EditPostingModalShow';
import CommentModal from './CommentModal';

interface Props extends PostingType {
  elemNum: number;
}

function Posting(props: Props) {
  const { boardId, title, intraId, contents, createdAt, image, commentNum, elemNum, url } = props;
  const [modalShow, setModalShow] = useRecoilState(CommentModalShow);
  const [actionModalShow, setActionModalShow] = useRecoilState(ActionModalShow);
  const [editPostingModalShow, setEditPostingModalShow] = useState(false);

  const onClickMoreButton = () => {
    setModalShow(true);
  };

  const onClickElipsis = () => {
    setActionModalShow(true);
  };

  // console.log(createdAt);

  return (
    <div
      className={`review--posting--forFlex ${elemNum % 2 === 0 ? 'justify-right' : 'justify-left'} ${
        elemNum === 4 && 'footer--empty'
      }`}
    >
      {editPostingModalShow && (
        <NewPostingModal mode="edit" boardId={boardId} setEditPostingModalShow={setEditPostingModalShow} />
      )}
      {actionModalShow && (
        <ActionModal mode="post" boardId={boardId} setEditPostingModalShow={setEditPostingModalShow} />
      )}
      {modalShow && <CommentModal boardId={boardId} />}
      <div className="review--posting--shownWrapper">
        <div className="review--posting--title">
          <span className="review--posting--title--title">{title && title.length ? title : '제목이 없습니다'}</span>
          <img className="review--posting--actions" src={elipsisImg} alt={elipsisImg} onClick={onClickElipsis}></img>
        </div>
        <div className="review--posting--image">{image && <img src={image} alt={image} />}</div>
        <div className="review--posting--comments">
          <p className="review--posting--content">{contents && contents.length ? contents : '글을 안 다셨군요?'}</p>
          <p className="review--posting--commentLength">
            {commentNum ? `댓글 ${commentNum}개 모두 보기` : '댓글이 없습니다..'}
          </p>
          <p className="review--posting--createdAt">
            {createdAt ? createdAt.slice(5, 10).replace('-', '.') : '만든 일시가 없습니다'}{' '}
          </p>
        </div>
        <div
          className={`review--posting--open_modal ${elemNum && elemNum % 2 === 0 ? 'position-right' : 'position-left'}`}
          onClick={onClickMoreButton}
        >
          <span>더보기</span>
          <img src={caret_right} alt={caret_right} />
        </div>
      </div>
    </div>
  );
}

export default Posting;
