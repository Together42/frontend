import React, { useEffect, useState } from 'react';
import '@css/Review/DetailComments.scss';

interface Props {
  comment: string;
}

function DetailComments(props: Props) {
  const { comment } = props;
  const [tempVistComment, setTempVistComment] = useState([
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
    '자주 가는 순대국집이네요ㅎㅎ',
  ]);
  const [tempVisName, setTempVisName] = useState(['jwoo', 'jwoo', 'jwoo', 'jwoo', 'jwoo']);
  const [myComment, setMyComment] = useState('');

  const onChangeMyComment = (e: any) => {
    setMyComment(e.target.value);
  };

  const onSubmitMyComment = (e: any) => {
    e.preventDefault();
    setTempVistComment((prev) => [...prev, myComment]);
    setTempVisName((prev) => [...prev, 'tkim']);
    setMyComment('');
  };

  useEffect(() => {
    document.getElementsByClassName('review--posting--detail_comments');
  }, [tempVistComment]);

  return (
    <>
      <div className="review--posting--image--background"></div>
      <div className={`review--posting--detail_comments ${tempVisName.length >= 8 && 'scroll'}`}>
        <span className="review--posting--full_comment">{comment}</span>
        {tempVisName.map((e, i) => (
          <div className="review--posting--visitor--wrapper">
            <span className="review--posting--visitor">{e}</span>
            <span className="review--posting--visitor_comment">{tempVistComment[i]}</span>
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
            onChange={onChangeMyComment}
          ></input>
          <button className="review--posting--button">
            <span>게시</span>
          </button>
        </form>
      </div>
    </>
  );
}

export default DetailComments;
