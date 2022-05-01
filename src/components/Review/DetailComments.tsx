import React, { useRef, useState } from 'react';
import '@css/Review/DetailComments.scss';
import Xmark from '@img/xmark-solid-white.svg';
import { useRecoilState } from 'recoil';
import PostingDetail from '@recoil/PostingDetail';

interface Props {
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function DetailComments(props: Props) {
  const { setModalShow } = props;
  const [postingDetail, setPostingDetail] = useRecoilState(PostingDetail);
  const scrollRef = useRef(null);

  const [myComment, setMyComment] = useState('');

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    setPostingDetail((prev) => {
      let newObj = {
        ...prev,
        commentList: [...prev['commentList'], { intraId: 'tkim', content: myComment, time: null }],
      };
      return newObj;
    });
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    setMyComment('');
  };

  return (
    <div className="review--posting--background" onClick={() => setModalShow(false)}>
      <img className="review--posting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--posting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--posting--left_division">
          <div className="review--posting--image--background"></div>
          <div className="review--posting--modal_image">
            <img src={postingDetail['picture']} alt={postingDetail['picture']} />
          </div>
        </div>
        <div className="review--posting--right_division">
          <div className={`review--posting--title`}>
            <div>
              <span className="review--posting--title--team">{postingDetail['teamName']}</span>
              <span className="review--posting--title--location">{postingDetail['location']}</span>
            </div>
            <div className="review--posting--members">
              {postingDetail['memList'].map((e, i) => (
                <img src={e['url']} key={i} alt={e['url']} />
              ))}
            </div>
          </div>
          <div className="review--posting--detail_comments" ref={scrollRef}>
            <span className="review--posting--full_comment">{postingDetail['posting']}</span>
            {postingDetail['commentList'].map((e, i) => (
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
  );
}

export default DetailComments;
