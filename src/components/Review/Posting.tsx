import React, { useState } from 'react';
import '@css/Review/Posting.scss';
import caret_right from '@img/caret-right-solid.svg';
import { PostingType } from '@globalObj/object/types';
import elipsisImg from '@img/ellipsis-solid.svg';
import ActionModal from './ActionModal';
import EditPostingModal from './EditPostingModal';
import CommentModal from './CommentModal';
import ImageWithIdBox from './ImageWithIdBox';
import expandImg from '@img/expand-solid.svg';
import FullImageSlider from '@utils/FullImageSlider';
import { useRecoilValue } from 'recoil';
import DeviceMode from '@recoil/DeviceMode';
import { useNavigate } from 'react-router';

interface Props extends PostingType {
  elemNum: number;
  totalNum: number;
}

function Posting(props: Props) {
  const { boardId, intraId, title, contents, createdAt, filePath, commentNum, elemNum, profile, totalNum } = props;
  const navigate = useNavigate();
  const deviceMode = useRecoilValue(DeviceMode);
  const [modalShow, setModalShow] = useState(false);
  const [actionModalShow, setActionModalShow] = useState(false);
  const [editPostingModalShow, setEditPostingModalShow] = useState(false);
  const [openFullImageSlider, setOpenFullImageSlider] = useState(false);

  const onClickMoreButton = () => {
    if (deviceMode === 'desktop') setModalShow(true);
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
      {editPostingModalShow && <EditPostingModal boardId={boardId} setEditPostingModalShow={setEditPostingModalShow} />}
      {actionModalShow && (
        <ActionModal
          mode="post"
          boardId={boardId}
          setEditPostingModalShow={setEditPostingModalShow}
          setPostActionModalShow={setActionModalShow}
        />
      )}
      {openFullImageSlider && (
        <FullImageSlider
          imageArr={[{ imageId: null, boardId: null, filePath }]}
          setOpenFullImageSlider={setOpenFullImageSlider}
        />
      )}
      {modalShow && <CommentModal boardId={boardId} setModalShow={setModalShow} />}
      <div className="review--posting--shownWrapper">
        <div className="review--posting--title">
          <div className="review--posting--title--title_wrapper">
            <ImageWithIdBox profile={profile} intraId={intraId} mode="post" />
            <div className="review--posting--title--title">{title}</div>
          </div>
          <img className="review--posting--actions" src={elipsisImg} alt={elipsisImg} onClick={onClickElipsis}></img>
        </div>
        <div className="review--posting--image_wrapper">
          <img className="review--posting--image" src={filePath} alt={filePath} />
          <div className="review--posting--expand">
            <img src={expandImg} alt={expandImg} onClick={() => setOpenFullImageSlider(true)} />
          </div>
        </div>
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
