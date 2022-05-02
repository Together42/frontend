import React, { useEffect, useRef, useState } from 'react';
import '@css/Review/DetailComments.scss';
import Xmark from '@img/xmark-solid-white.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import PostingDetail from '@recoil/PostingDetail';
import ReviewModalShow from '@recoil/ReviewModalShow';
import TextareaAutosize from 'react-textarea-autosize';
import GlobalLoginState from '@recoil/GlobalLoginState';

function DetailComments() {
  const scrollRef = useRef(null);
  const [postingDetail, setPostingDetail] = useRecoilState(PostingDetail);
  const [modalShow, setModalShow] = useRecoilState(ReviewModalShow);
  const LoginState = useRecoilValue(GlobalLoginState);
  const isDetailCommentMode = modalShow['mode'] === 'detailComment';

  const [myComment, setMyComment] = useState('');

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    if (LoginState['id'] !== '') {
      setPostingDetail((prev) => {
        let newObj = {
          ...prev,
          commentList: [...prev['commentList'], { intraId: LoginState['id'], content: myComment, time: null }],
        };
        return newObj;
      });
      alert('현재 게시판은 댓글이 저장되지는 않습니다..');
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setMyComment('');
    } else {
      alert('로그인을 하셔야 이용 가능합니다.');
    }
  };

  useEffect(() => {
    return () => {
      setPostingDetail({
        eventId: null,
        teamName: null,
        location: null,
        memList: null,
        posting: null,
        commentList: null,
        date: null,
        picture: null,
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
              <img src={postingDetail['picture']} alt={postingDetail['picture']} />
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
                {isDetailCommentMode ? postingDetail['teamName'] : '팀네임 검색'}
              </span>
              <span className="review--posting--title--location">
                {isDetailCommentMode ? postingDetail['location'] : '장소를 입력해주세요'}
              </span>
            </div>
            <div className="review--posting--members">
              {postingDetail['memList'] &&
                postingDetail['memList'].map((e, i) => <img src={e['url']} key={i} alt={e['url']} />)}
            </div>
          </div>
          <div className="review--posting--detail_comments" ref={scrollRef}>
            {isDetailCommentMode ? (
              postingDetail['commentList'] && (
                <>
                  <span className="review--posting--full_comment">{postingDetail['posting']}</span>
                  {postingDetail['commentList'].map((e, i) => (
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
                  <button className="review--posting--button">
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

export default DetailComments;
