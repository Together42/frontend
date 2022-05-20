import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/NewPostingModal.scss';
import Xmark from '@img/xmark-solid.svg';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@utils/errorAlert';
import BoardsObj from '@recoil/Review/BoardsObj';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import SelectSomeModal from '@review/SelectSomeModal';
import SelectSomeModalShow from '@recoil/Review/SelectSomeModalShow';
import getAddress from '@globalObj/func/getAddress';
import SelectedTeam from '@recoil/Review/SelectedTeam';

function NewPostingModal() {
  const setModalShow = useSetRecoilState(NewPostingModalShow);
  const setBoardsObj = useSetRecoilState(BoardsObj);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const selectedTeam = useRecoilValue(SelectedTeam);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageArr, setImageArr] = useState<string[]>([]);
  const [isEventBtnClicked, setIsEventBtnClicked] = useState(false);
  const [isAddMemBtnClicked, setIsAddMemBtnClicked] = useState(false);
  const [selectSomeModalShow, setSelectSomeModalShow] = useRecoilState(SelectSomeModalShow);
  const setSelectedTeam = useSetRecoilState(SelectedTeam);

  const getBoards = useCallback(() => {
    axios
      .get(`${getAddress()}/api/board/?event-id=${selectedEvent['id']}`)
      .then((res) => {
        setBoardsObj(res.data);
      })
      .catch((err) => errorAlert(err));
  }, [selectedEvent, setBoardsObj]);

  const postNewPosting = useCallback(() => {
    axios
      .post(
        `${getAddress()}/api/board`,
        {
          eventId: selectedEvent['eventId'],
          title: title,
          contents: content,
          image: imageArr,
          attendMembers: Object.values(selectedTeam)[0][1],
        },
        {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        },
      )
      .then(() => {
        getBoards();
        alert('성공적으로 게시되었습니다');
      })
      .catch((err) => errorAlert(err));
  }, [content, getBoards, imageArr, selectedEvent, selectedTeam, title]);

  const onChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const onClickEventModalOpen = () => {
    setIsAddMemBtnClicked(false);
    setIsEventBtnClicked(true);
    setSelectSomeModalShow(true);
  };

  const onClickAddMemModalOpen = () => {
    if (selectedEvent) {
      setIsEventBtnClicked(false);
      setIsAddMemBtnClicked(true);
      setSelectSomeModalShow(true);
    } else {
      alert('이벤트 선택을 먼저 해주세요');
    }
  };

  const onChangeContent = (e: any) => {
    setContent(e.target.value);
  };

  const onSubmitNewPosting = () => {
    if (getToken()) postNewPosting();
    else alert('로그인 토큰 오류');
  };

  useEffect(() => {
    if (!selectSomeModalShow) {
      setIsAddMemBtnClicked(false);
      setIsEventBtnClicked(false);
    }
  }, [selectSomeModalShow]);

  useEffect(() => {
    return () => {
      setSelectedTeam(null);
      setModalShow(false);
      setSelectSomeModalShow(false);
    };
  }, [setModalShow, setSelectSomeModalShow, setSelectedTeam]);

  return (
    <div className="review--newposting--background" onClick={() => setModalShow(false)}>
      <img className="review--newposting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--newposting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--newposting--left_division">
          <div className="review--newposting--add_files">
            <span>파일을 업로드 혹은 드래그</span>
            <div className="review--newposting--add_files--btn_wrapper">
              <button>업로드</button>
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
              onChange={onChangeTitle}
            />
            <div className="review--newposting--header--selectorWrapper">
              <div className="review--newposting--header--eventSelector">
                <span onClick={onClickEventModalOpen}>이벤트 찾기</span>
                {isEventBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_event" />}
              </div>
              <div className="review--newposting--header--addTeamMem">
                <span onClick={onClickAddMemModalOpen}>팀원 추가</span>
                {isAddMemBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_addMem" />}
              </div>
            </div>
          </div>
          <div className="review--newposting--selectedInfo">
            {selectedEvent && (
              <>
                <span>이벤트 </span>
                <span>{selectedEvent['title']}</span>
              </>
            )}
            {selectedTeam && (
              <>
                <span>팀</span>
                <span>team {Object.keys(selectedTeam)[0]}</span>
                <span>팀원</span>
                <div>
                  {Object.values(selectedTeam)[0].map((member) => (
                    <span>{member['intraId']} </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="review--newposting--newposting_wrapper">
            <TextareaAutosize
              className="review--newposting--newposting"
              minRows={10}
              placeholder="글을 작성해주세요"
              value={content}
              onChange={onChangeContent}
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
