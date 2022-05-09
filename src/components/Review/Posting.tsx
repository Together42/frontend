import React from 'react';
import '@css/Review/Posting.scss';
import caret_right from '@img/caret-right-solid.svg';
import CommentModal from './CommentModal';
import { useRecoilState, useSetRecoilState } from 'recoil';
import PostingDetail from '@recoil/PostingDetail';
import { PostingType } from '@usefulObj/types';
import ReviewModalShow from '@recoil/ReviewModalShow';

interface Props extends PostingType {
  elemNum: number;
}

function Posting(props: Props) {
  const { boardId, eventId, title, writer, contents, createAt, updateAt, image, attendMembers, comments, elemNum } =
    props;
  const [modalShow, setModalShow] = useRecoilState(ReviewModalShow);
  const setPostingDetail = useSetRecoilState(PostingDetail);

  const onClickMoreButton = () => {
    setPostingDetail({
      boardId,
      eventId,
      title,
      writer,
      contents,
      createAt,
      updateAt,
      image,
      attendMembers,
      comments,
    });
    setModalShow({ mode: 'detailComment', show: true });
  };

  return !modalShow['show'] ? (
    <div
      className={`review--posting--forFlex ${elemNum % 2 === 0 ? 'justify-right' : 'justify-left'} ${
        elemNum === 4 && 'footer--empty'
      }`}
    >
      <div className="review--posting--shownWrapper">
        <div className="review--posting--title">
          <div>
            <span className="review--posting--title--team">{title}</span>
            <span className="review--posting--title--location">temp</span>
          </div>
          <div className="review--posting--members">
            {attendMembers.map((e, i) => (
              <img src={e['url']} key={i} alt={e['url']} />
            ))}
          </div>
        </div>
        <div className="review--posting--image">
          <img src={image[0]} alt={image[0]} />
        </div>
        <div className="review--posting--comments">
          <p className="review--posting--maincomment">{contents}</p>
          <div className="review--posting--subcomment">
            <p>
              <span>{comments.length > 0 ? `댓글 ${comments.length}개 모두 보기` : '댓글이 없습니다..'}</span>
            </p>
            <p>
              <span>{createAt}</span>
            </p>
          </div>
        </div>
        <div
          className={`review--posting--open_modal ${elemNum % 2 === 0 ? 'position-right' : 'position-left'}`}
          onClick={onClickMoreButton}
        >
          <span>더보기</span>
          <img src={caret_right} alt={caret_right} />
        </div>
      </div>
    </div>
  ) : (
    <CommentModal />
  );
}

export default Posting;
