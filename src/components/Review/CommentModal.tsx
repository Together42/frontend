import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@css/Review/CommentModal.scss';
import Xmark from '@img/xmark-solid.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import PostingDetail from '@recoil/Review/PostingDetail';
import commentModalShow from '@recoil/Review/CommentModalShow';
import GlobalLoginState from '@recoil/GlobalLoginState';
import axios from 'axios';
import errorAlert from '@utils/errorAlert';
import { getToken } from '@cert/TokenStorage';
import getAddress from '@globalObj/func/getAddress';

function CommentModal() {
  const scrollRef = useRef(null);
  const [postingDetail, setPostingDetail] = useRecoilState(PostingDetail);
  const [modalShow, setModalShow] = useRecoilState(commentModalShow);
  const LoginState = useRecoilValue(GlobalLoginState);
  const [myComment, setMyComment] = useState('');

  const postComment = useCallback(() => {
    axios
      .post(
        `${getAddress()}/api/board/comment`,
        {
          boardId: postingDetail['boardId'],
          comment: myComment,
        },
        {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        },
      )
      .then(() => {
        setPostingDetail((prev) => {
          const newObj = {
            ...prev,
            comments: [...prev['comments'], { intraId: LoginState['id'], content: myComment, time: new Date() }],
          };
          return newObj;
        });
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        setMyComment('');
      })
      .catch((err) => errorAlert(err));
  }, [LoginState, myComment, postingDetail, setPostingDetail]);

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    if (LoginState['id'] !== '') postComment();
    else alert('로그인을 하셔야 이용 가능합니다.');
  };

  useEffect(() => {
    return () => {
      setPostingDetail({
        boardId: null,
        eventId: null,
        title: null,
        teamId: null,
        writer: null,
        contents: null,
        createAt: null,
        updateAt: null,
        image: null,
        attendMembers: null,
        comments: null,
      });
      setModalShow(false);
    };
  }, [setModalShow, setPostingDetail]);

  return (
    modalShow && (
      <div className="review--posting--background" onClick={() => setModalShow(false)}>
        <img className="review--posting--xmark" src={Xmark} alt={Xmark}></img>
        <div className="review--posting-devision" onClick={(e) => e.stopPropagation()}>
          <div className="review--posting--left_division">
            <div className="review--posting--image--background"></div>
            <div className="review--posting--modal_image">
              {postingDetail['image'] && <img src={postingDetail['image'][0]} alt={postingDetail['image'][0]} />}
            </div>
          </div>
          <div className="review--posting--right_division">
            <div className="review--posting--title">
              <div>
                <span className="review--posting--title--team">{postingDetail['title']}</span>
                <span className="review--posting--title--location">temp</span>
              </div>
              {/* <div className="review--posting--members">
                {postingDetail['attendMembers'] &&
                  postingDetail['attendMembers'].map((e, i) => <img src={e['url']} key={i} alt={e['url']} />)}
              </div> */}
            </div>
            <div className="review--posting--detail_comments" ref={scrollRef}>
              <span className="review--posting--full_comment">{postingDetail['posting']}</span>
              {postingDetail['comments'] &&
                postingDetail['comments'].map((e, i) => (
                  <div className="review--posting--visitor--wrapper" key={i}>
                    <span className="review--posting--visitor">{e['intraId']}</span>
                    <span className="review--posting--visitor_comment">{e['content']}</span>
                  </div>
                ))}
            </div>
            <div className="review--posting--post_comment--wrapper">
              <form className="review--posting--form" onSubmit={onSubmitMyComment}>
                <input
                  className="review--posting--input"
                  id="myComment"
                  placeholder="댓글을 입력해주세요"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = '댓글을 입력해주세요')}
                  value={myComment}
                  onChange={onChangeMyComment}
                ></input>
                <button className="review--posting--button">
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
