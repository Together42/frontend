import React, { useEffect, useRef, useState } from 'react';
import '@css/Review/CommentModal.scss';
import Xmark from '@img/xmark-solid.svg';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import PostingDetail from '@recoil/Review/PostingDetail';
import ReviewModalShow from '@recoil/Review/CommentModalShow';
import TextareaAutosize from 'react-textarea-autosize';
import GlobalLoginState from '@recoil/GlobalLoginState';
import axios from 'axios';
import errorAlert from '@utils/errorAlert';
import BoardsObj from '@recoil/Review/BoardsObj';
import { getToken } from '@cert/TokenStorage';

function CommentModal() {
  const scrollRef = useRef(null);
  const [postingDetail, setPostingDetail] = useRecoilState(PostingDetail);
  const [modalShow, setModalShow] = useRecoilState(ReviewModalShow);
  const LoginState = useRecoilValue(GlobalLoginState);
  const isDetailCommentMode = modalShow['mode'] === 'detailComment';
  const setBoardsObj = useSetRecoilState(BoardsObj);

  const [myComment, setMyComment] = useState('');

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    if (LoginState['id'] !== '') {
      axios
        .post(`${process.env.SERVER_ADR}/api/board/comment`, {
          boardId: postingDetail['boardId'],
          comment: myComment,
        })
        .then(() => {
          setPostingDetail((prev) => {
            let newObj = {
              ...prev,
              comments: [...prev['comments'], { intraId: LoginState['id'], content: myComment, time: new Date() }],
            };
            return newObj;
          });
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          setMyComment('');
        })
        .catch((err) => errorAlert(err));
    } else {
      alert('로그인을 하셔야 이용 가능합니다.');
    }
  };

  const onSubmitNewPosting = () => {
    if (getToken()) {
      axios
        .post(`${process.env.SERVER_ADR}/api/board`, {
          eventId: postingDetail['eventId'],
          title: postingDetail['title'],
          contents: postingDetail['contents'],
          image: postingDetail['image'],
          attendMembers: null,
        })
        .then((res) => {
          setBoardsObj((prev) => {
            const newPostingDetail = Object.assign({}, postingDetail);
            newPostingDetail.boardId = res.data.boardId;
            let newObj = {
              ...prev,
              [res.data.boardId.toString()]: newPostingDetail,
            };
            return newObj;
          });
          alert('성공적으로 게시되었습니다');
        })
        .catch((err) => errorAlert(err));
    } else {
      alert('로그인 토큰 오류');
    }
  };

  useEffect(() => {
    return () => {
      setPostingDetail({
        boardId: null,
        eventId: null,
        title: null,
        writer: null,
        contents: null,
        createAt: null,
        updateAt: null,
        image: null,
        attendMembers: null,
        comments: null,
      });
      setModalShow({ mode: null, show: null });
    };
  }, [setModalShow, setPostingDetail]);

  return (
    <div className="review--posting--background" onClick={() => setModalShow(false)}>
      <img className="review--posting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--posting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--posting--left_division">
          <div className="review--posting--image--background"></div>
          <div className="review--posting--modal_image">
            {isDetailCommentMode ? (
              <img src={postingDetail['image'][0]} alt={postingDetail['image'][0]} />
            ) : (
              <div>
                <div>
                  <span>파일을 업로드 혹은 드래그</span>
                  <button>업로드</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="review--posting--right_division">
          <div className="review--posting--title">
            <div>
              <span className="review--posting--title--team">
                {isDetailCommentMode ? postingDetail['title'] : '팀네임 검색'}
              </span>
              <span className="review--posting--title--location">temp</span>
            </div>
            <div className="review--posting--members">
              {postingDetail['attendMembers'] &&
                postingDetail['attendMembers'].map((e, i) => <img src={e['url']} key={i} alt={e['url']} />)}
            </div>
          </div>
          <div className="review--posting--detail_comments" ref={scrollRef}>
            {isDetailCommentMode ? (
              postingDetail['comments'] && (
                <>
                  <span className="review--posting--full_comment">{postingDetail['posting']}</span>
                  {postingDetail['comments'].map((e, i) => (
                    <div className="review--posting--visitor--wrapper" key={i}>
                      <span className="review--posting--visitor">{e['intraId']}</span>
                      <span className="review--posting--visitor_comment">{e['content']}</span>
                    </div>
                  ))}
                </>
              )
            ) : (
              <>
                <TextareaAutosize className="review--posting--posting" minRows={10} placeholder="글을 작성해주세요" />
                <div className="review--posting--button--forFlex">
                  <button className="review--posting--button" onClick={onSubmitNewPosting}>
                    <span>게시</span>
                  </button>
                </div>
              </>
            )}
          </div>
          {isDetailCommentMode && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
