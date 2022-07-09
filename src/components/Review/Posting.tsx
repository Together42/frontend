import React, { useState } from 'react';
import '@css/Review/Posting.scss';
import caret_right from '@img/caret-right-solid.svg';
import { PostingType } from '@globalObj/object/types';
import elipsisImg from '@img/ellipsis-solid.svg';
import ActionModal from './ActionModal';
import EditPostingModal from './EditPostingModal';
import CommentModal from './CommentModal';
import ImageWithIdBox from './ImageWithIdBox';
import FullImageSlider from '@utils/FullImageSlider';
import { useRecoilState, useRecoilValue } from 'recoil';
import DeviceMode from '@recoil/DeviceMode';
import { useNavigate } from 'react-router';
import SliderBtnBox from './SliderBtnBox';
import EditPostingModalShow from '@recoil/Review/EditPostingModalShow';
import CommentModalShow from '@recoil/Review/CommentModalShow';

interface Props extends PostingType {
  elemNum: number;
  totalNum: number;
}

function Posting(props: Props) {
  const { boardId, intraId, title, contents, createdAt, images, commentNum, elemNum, profile, totalNum } = props;
  const navigate = useNavigate();
  const deviceMode = useRecoilValue(DeviceMode);
  const editPostingModalShow = useRecoilValue(EditPostingModalShow);
  const [commentModalShow, setCommentModalShow] = useRecoilState(CommentModalShow);
  const [actionModalShow, setActionModalShow] = useState(false);
  const [openFullImageSlider, setOpenFullImageSlider] = useState(false);

  const onClickMoreButton = () => {
    if (deviceMode === 'desktop') setCommentModalShow({ [boardId]: true });
    else if (deviceMode === 'mobile') navigate(`mobile/comment/${boardId}`);
  };

  const onClickElipsis = () => {
    setActionModalShow(true);
  };

  return (
    <div
      className={`review--posting--forFlex ${elemNum % 2 === 0 ? 'justify-right' : 'justify-left'} ${
        elemNum === totalNum && 'footer--empty'
      }`}
    >
      {editPostingModalShow[boardId] && <EditPostingModal boardId={boardId} />}
      {actionModalShow && <ActionModal mode="post" boardId={boardId} setPostActionModalShow={setActionModalShow} />}
      {openFullImageSlider && <FullImageSlider imageArr={images} setOpenFullImageSlider={setOpenFullImageSlider} />}
      {commentModalShow[boardId] && <CommentModal boardId={boardId} />}
      <div className="review--posting--shownWrapper">
        <div className="review--posting--title">
          <div className="review--posting--title--title_wrapper">
            <ImageWithIdBox profile={profile} intraId={intraId} mode="post" />
            <div className="review--posting--title--title">{title}</div>
          </div>
          <img className="review--posting--actions" src={elipsisImg} alt={elipsisImg} onClick={onClickElipsis}></img>
        </div>
        <SliderBtnBox imageArr={images} />
        <div className="review--posting--comments">
          <p className="review--posting--content">{contents}</p>
          <p className="review--posting--commentLength" onClick={onClickMoreButton}>
            {commentNum ? `댓글 ${commentNum}개 모두 보기` : '댓글이 없습니다..'}
          </p>
          <p className="review--posting--createdAt">{createdAt.slice(5, 10).replace('-', '.')}</p>
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
    </div>
  );
}

export default Posting;
