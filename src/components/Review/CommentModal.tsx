import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@css/Review/CommentModal.scss';
import Xmark from '@img/xmark-solid.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import commentModalShow from '@recoil/Review/CommentModalShow';
import GlobalLoginState from '@recoil/GlobalLoginState';
import axios from 'axios';
import errorAlert from '@utils/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/func/getAddress';
import { ReviewBoardType } from '@usefulObj/types';
import getDetailBoard from '@globalObj/func/getDetailBoard';
import defaultImg from '@img/defaultImg.png';

function CommentModal(props: { boardId: number }) {
  const { boardId } = props;
  const scrollRef = useRef(null);
  const [modalShow, setModalShow] = useRecoilState(commentModalShow);
  const LoginState = useRecoilValue(GlobalLoginState);
  const [myComment, setMyComment] = useState('');
  const [boardObj, setBoardObj] = useState<ReviewBoardType>(null);

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
        .then((res) => {
          setBoardObj((prev) => {
            const newObj = {
              ...prev,
              comments: [
                ...prev['comments'],
                { id: res.data.commentId, intraId: LoginState['id'], comments: myComment },
              ],
            };
            return newObj;
          });
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          setMyComment('');
        })
        .catch((err) => errorAlert(err));
    } else alert('로그인을 해주셔야 댓글 달 수 있습니다');
  }, [LoginState, myComment, boardObj, setBoardObj]);

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    if (LoginState['id'] !== '') postComment();
    else alert('로그인을 하셔야 이용 가능합니다.');
  };

  useEffect(() => {
    getDetailBoard(boardId, setBoardObj);
    return () => setModalShow(false);
  }, [setModalShow, setBoardObj, boardId]);

  console.log(boardObj);

  return (
    boardObj && (
      <div className="review--detail--background" onClick={() => setModalShow(false)}>
        <img className="review--detail--xmark" src={Xmark} alt={Xmark}></img>
        <div className="review--detail-devision" onClick={(e) => e.stopPropagation()}>
          <div className="review--detail--left_division">
            <div className="review--detail--image--background"></div>
            <div className="review--detail--modal_image">
              <img src={boardObj['image'] || defaultImg} alt={boardObj['image'] || defaultImg} />
            </div>
          </div>
          <div className="review--detail--right_division">
            <div className="review--detail--header">
              <div className="review--detail--title">{boardObj['title']}</div>
              <div className="review--detail--members">
                {boardObj['attendMembers'] &&
                  boardObj['attendMembers'].map((e, i) => <img src={e['url']} key={i} alt={e['url']} />)}
              </div>
            </div>
            <div className="review--detail--detail_comments" ref={scrollRef}>
              <div className="review--detail--comment_wrapper">
                <span className="review--detail--writter">{boardObj['intraId']}</span>
                <span className="review--detail--full_comment">{boardObj['contents']}</span>
              </div>
              {boardObj['comments'] &&
                boardObj['comments'].map((e, i) => (
                  <div className="review--detail--visitor--wrapper" key={i}>
                    <span className="review--detail--visitor">{e['intraId']}</span>
                    <span className="review--detail--visitor_comment">{e['comments']}</span>
                  </div>
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
    )
  );
}

export default CommentModal;
