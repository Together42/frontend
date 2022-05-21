import React from 'react';
import '@css/Review/Posting.scss';
import caret_right from '@img/caret-right-solid.svg';
import { useRecoilState, useSetRecoilState } from 'recoil';
import PostingDetail from '@recoil/Review/PostingDetail';
import { PostingType } from '@usefulObj/types';
import CommentModalShow from '@recoil/Review/CommentModalShow';
import elipsisImg from '@img/ellipsis-solid.svg';
import ActionModalShow from '@recoil/Review/ActionModalShow';
import ActionModal from './ActionModal';

interface Props extends PostingType {
  elemNum: number;
}

function Posting(props: Props) {
  const {
    boardId,
    eventId,
    title,
    teamId,
    writer,
    contents,
    createAt,
    updateAt,
    image,
    attendMembers,
    comments,
    elemNum,
  } = props;
  const [modalShow, setModalShow] = useRecoilState(CommentModalShow);
  const setPostingDetail = useSetRecoilState(PostingDetail);
  const [actionModalShow, setActionModalShow] = useRecoilState(ActionModalShow);

  const onClickMoreButton = () => {
    setPostingDetail({
      boardId,
      eventId,
      title,
      teamId,
      writer,
      contents,
      createAt,
      updateAt,
      image,
      attendMembers,
      comments,
    });
    setModalShow(true);
  };

  const onClickElipsis = () => {
    setActionModalShow(true);
  };

  return (
    !modalShow['show'] && (
      <div
        className={`review--posting--forFlex ${elemNum % 2 === 0 ? 'justify-right' : 'justify-left'} ${
          elemNum === 4 && 'footer--empty'
        }`}
      >
        <div className="review--posting--shownWrapper">
          <div className="review--posting--title">
            <span className="review--posting--title--title">{title && title.length ? title : '제목이 없습니다'}</span>
            <img className="review--posting--actions" src={elipsisImg} alt={elipsisImg} onClick={onClickElipsis}></img>
          </div>
          {actionModalShow && <ActionModal mode="post" />}
          <div className="review--posting--image">{image && <img src={image[0]} alt={image[0]} />}</div>
          <div className="review--posting--comments">
            <p className="review--posting--content">{contents && contents.length ? contents : '글을 안 다셨군요?'}</p>
            <p className="review--posting--commentLength">
              {comments && comments.length > 0 ? `댓글 ${comments.length}개 모두 보기` : '댓글이 없습니다..'}
            </p>
            <p className="review--posting--createdAt">{createAt && createAt ? createAt : '만든 일시가 없습니다'} </p>
          </div>
          <div
            className={`review--posting--open_modal ${
              elemNum && elemNum % 2 === 0 ? 'position-right' : 'position-left'
            }`}
            onClick={onClickMoreButton}
          >
            <span>더보기</span>
            <img src={caret_right} alt={caret_right} />
          </div>
        </div>
      </div>
    )
  );
}

export default Posting;
