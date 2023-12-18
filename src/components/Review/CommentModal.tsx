import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@css/Review/CommentModal.scss';
import Xmark from '@img/xmark-solid-white.svg';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import GlobalLoginState from '@recoil/GlobalLoginState';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/function/getAddress';
import { ReviewBoardType } from '@globalObj/object/types';
import CommentBox from './CommentBox';
import SliderBtnBox from './SliderBtnBox';
import shuffle from '@globalObj/function/shuffleArr';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';
import CommentModalShow from '@recoil/Review/CommentModalShow';
import { useNavigate } from 'react-router';
import DeviceMode from '@recoil/DeviceMode';

function CommentModal(props: { boardId: number }) {
  const { boardId } = props;
  const scrollRef = useRef(null);
  const hasPosted = useRef(false);
  const navigate = useNavigate();
  const deviceMode = useRecoilValue(DeviceMode);
  const LoginState = useRecoilValue(GlobalLoginState);
  const setModalShow = useSetRecoilState(CommentModalShow);
  const [myComment, setMyComment] = useState('');
  const [attendMems, setAttendMems] = useState<{ intraId: string; profile: string }[]>(null);
  const { data: boardObj, mutate: mutateBoard } = useSWR<ReviewBoardType>(
    `${getAddress()}/api/board/${boardId}`,
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
    } else {
      alert('로그인을 해주셔야 댓글 달 수 있습니다');
      navigate('/');
    }
  }, [boardObj, mutateBoard, myComment, navigate]);

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    if (LoginState['id'] !== '') postComment();
    else {
      alert('로그인을 하셔야 이용 가능합니다.');
      navigate('/');
    }
  };

  const closeModal = useCallback(() => {
    setModalShow((prev) => {
      return { ...prev, [boardId]: false };
    });
  }, [boardId, setModalShow]);

  useEffect(() => {
    if (hasPosted.current && scrollRef && scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [boardObj]);

  useEffect(() => {
    if (boardObj) setAttendMems(shuffle(boardObj['attendMembers']));
  }, [boardObj]);

  useEffect(() => {
    if (deviceMode === 'mobile') {
      setModalShow((prev) => {
        return { ...prev, [boardId]: false };
      });
      navigate(`mobile/comment/${boardId}`);
    }
  }, [boardId, deviceMode, navigate, setModalShow]);

  return boardObj ? (
    <div className="review--detail--background" onClick={closeModal}>
      <img className="review--detail--xmark" src={Xmark} alt={Xmark} onClick={closeModal}></img>
      <div className="review--detail-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--detail--left_division">
          <div className="review--detail--image--background"></div>
          <SliderBtnBox imageArr={boardObj['images']} />
        </div>
        <div className="review--detail--right_division">
          <div className="review--detail--header">
            <div className="review--detail--title">{boardObj['title']}</div>
          </div>
          <div className="review--detail--detail_comments" ref={scrollRef}>
            <div className="review--detail--comment_wrapper">
              <span className="review--detail--writter">{boardObj['intraId']}</span>
              <span className="review--detail--full_comment">{boardObj['contents']}</span>
            </div>
            <div className="review--detail--attendee_wrapper">
              <span className="review--detail--attendee">
                {attendMems &&
                  attendMems.map(
                    (e, i) =>
                      e.intraId !== boardObj['intraId'] && <span key={`attendee ${i}`}>{`#${e.intraId} `}</span>,
                  )}
              </span>
            </div>
            {boardObj['comments'] &&
              boardObj['comments'].map((e, i) => (
                <CommentBox
                  key={i}
                  intraId={e['intraId']}
                  comments={e['comments']}
                  commentId={e['id']}
                  boardId={boardId}
                />
              ))}
          </div>
          <div className="review--detail--post_comment--wrapper">
            <form className="review--detail--form" onSubmit={onSubmitMyComment}>
              <input
                className="review--detail--input"
                id="myComment"
                placeholder="댓글을 입력해주세요"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '댓글을 입력해주세요')}
                value={myComment}
                onChange={onChangeMyComment}
              ></input>
              <button className="review--detail--button">
                <span>게시</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default CommentModal;
