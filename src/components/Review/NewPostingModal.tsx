import React, { useEffect, useState } from 'react';
import '@css/Review/NewPostingModal.scss';
import Xmark from '@img/xmark-solid.svg';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@utils/errorAlert';
import BoardsObj from '@recoil/Review/BoardsObj';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';

function NewPostingModal() {
  const setModalShow = useSetRecoilState(NewPostingModalShow);
  const setBoardsObj = useSetRecoilState(BoardsObj);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageArr, setImageArr] = useState<string[]>([]);

  const onSubmitNewPosting = () => {
    if (getToken()) {
      axios
        .post(
          `${process.env.SERVER_ADR}/api/board`,
          {
            eventId: selectedEvent['eventId'],
            title: title,
            contents: content,
            image: imageArr,
            attendMembers: null,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
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
      setModalShow(false);
    };
  }, [setModalShow]);

  return (
    <div className="review--newposting--background" onClick={() => setModalShow(false)}>
      <img className="review--newposting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--newposting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--newposting--left_division">
          <div className="review--newposting--image--background"></div>
          <div className="review--newposting--modal_image">
            <div>
              <div>
                <span>파일을 업로드 혹은 드래그</span>
                <button>업로드</button>
              </div>
            </div>
          </div>
        </div>
        <div className="review--newposting--right_division">
          <div className="review--newposting--header">
            <input
              className="review--newposting--header--title"
              placeholder="제목 입력"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '제목 입력')}
              value={title}
            />
            <div className="review--newposting--header--selectorWrapper">
              <span className="review--newposting--header--eventSelector">이벤트 찾기</span>
              <span className="review--newposting--header--addTeamMem">팀원 추가</span>
            </div>
          </div>
          <div className="review--newposting--newposting_wrapper">
            <TextareaAutosize
              className="review--newposting--newposting"
              minRows={10}
              placeholder="글을 작성해주세요"
              value={content}
            />
            <div className="review--newposting--button--forFlex">
              <button className="review--newposting--button" onClick={onSubmitNewPosting}>
                <span>게시</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostingModal;
