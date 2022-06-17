import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@css/Review/MobileComment.scss';
import { useRecoilValue } from 'recoil';
import GlobalLoginState from '@recoil/GlobalLoginState';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/function/getAddress';
import { ReviewBoardType } from '@globalObj/object/types';
import CommentBox from './CommentBox';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';
import { useNavigate, useParams } from 'react-router';
import leftAngle from '@img/angle-left-solid.svg';

function MobileComment() {
  const navigate = useNavigate();
  const { id: boardId } = useParams();
  const scrollRef = useRef(null);
  const hasPosted = useRef(false);
  const LoginState = useRecoilValue(GlobalLoginState);
  const [myComment, setMyComment] = useState('');
  const { data: boardObj, mutate: mutateBoard } = useSWR<ReviewBoardType>(
    `${getAddress()}/api/board/${Number(boardId)}`,
    fetcher,
    {
      dedupingInterval: 600000,
    },
  );

  const postComment = useCallback(() => {
    if (getToken()) {
      axios
        .post(
          `${getAddress()}/api/board/comment`,
          {
            boardId: boardObj['boardId'],
            comment: myComment,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then(() => {
          mutateBoard();
          hasPosted.current = true;
          setMyComment('');
        })
        .catch((err) => errorAlert(err));
    } else alert('로그인을 해주셔야 댓글 달 수 있습니다');
  }, [boardObj, mutateBoard, myComment]);

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    if (LoginState['id'] !== '') postComment();
    else alert('로그인을 하셔야 이용 가능합니다.');
  };

  const goBackHistory = useCallback(() => {
    navigate('/review');
  }, [navigate]);

  useEffect(() => {
    if (hasPosted.current && scrollRef && scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [boardObj]);

  return boardObj ? (
    <div className="review--comment--mobile--background">
      <div className="review--comment--mobile--upperBox">
        <div className="review--comment--mobile--mobile_header">
          <img
            className="review--comment--mobile--left_angle"
            src={leftAngle}
            alt={leftAngle}
            onClick={() => goBackHistory()}
          ></img>
          <div className="review--comment--mobile--title">{boardObj['title']}</div>
        </div>
        <div className="review--comment--mobile--detail_comments" ref={scrollRef}>
          <div className="review--comment--mobile--comment_wrapper">
            <span className="review--comment--mobile--writter">{boardObj['intraId']}</span>
            <span className="review--comment--mobile--full_comment">{boardObj['contents']}</span>
          </div>
          {boardObj['comments'] &&
            boardObj['comments'].map((e, i) => (
              <CommentBox
                key={i}
                intraId={e['intraId']}
                comments={e['comments']}
                commentId={e['id']}
                boardId={Number(boardId)}
              />
            ))}
        </div>
      </div>
      <div className="review--comment--mobile--lowerBox">
        <form className="review--comment--mobile--form" onSubmit={onSubmitMyComment}>
          <input
            className="review--comment--mobile--input"
            id="myComment"
            placeholder="댓글을 입력해주세요"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = '댓글을 입력해주세요')}
            value={myComment}
            onChange={onChangeMyComment}
          ></input>
          <button className="review--comment--mobile--button">
            <span>게시</span>
          </button>
        </form>
      </div>
    </div>
  ) : null;
}

export default MobileComment;
