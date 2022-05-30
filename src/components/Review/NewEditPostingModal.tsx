import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/NewEditPostingModal.scss';
import Xmark from '@img/xmark-solid-white.svg';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@globalObj/function/errorAlert';
import BoardsObj from '@recoil/Review/BoardsObj';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import SelectSomeModal from '@review/SelectSomeModal';
import SelectSomeModalShow from '@recoil/Review/SelectSomeModalShow';
import getAddress from '@globalObj/function/getAddress';
import SelectedTeam from '@recoil/Review/SelectedTeam';
import GetBoards from '@globalObj/function/getBoards';
import { ReviewBoardType } from '@globalObj/object/types';
import getDetailBoard from '@globalObj/function/getDetailBoard';
import defaultImg from '@img/uploadDefault.png';
import SliderBtnBox from './SliderBtnBox';
import UplaodBtn from '@utils/uploadBtn';

// mode : new or edit
function NewEditPostingModal(props: {
  mode: string;
  boardId?: number;
  setEditPostingModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mode, boardId, setEditPostingModalShow } = props;
  const setNewEditModalShow = useSetRecoilState(NewPostingModalShow);
  const [selectSomeModalShow, setSelectSomeModalShow] = useRecoilState(SelectSomeModalShow);
  const setBoardsObj = useSetRecoilState(BoardsObj);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const [selectedTeam, setSelectedTeam] = useRecoilState(SelectedTeam);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEventBtnClicked, setIsEventBtnClicked] = useState(false);
  const [isAddMemBtnClicked, setIsAddMemBtnClicked] = useState(false);
  const [boardObj, setBoardObj] = useState<ReviewBoardType>(null);
  const [setPostArr, setPostFileArr] = useState<File[]>(null);
  const isEventMode = (selectedEvent && selectedTeam) || (!selectedEvent && !selectedTeam);

  const closeModal = useCallback(() => {
    if (mode === 'new') setNewEditModalShow(false);
    if (mode === 'edit') setEditPostingModalShow(false);
    setSelectSomeModalShow(false);
  }, [mode, setEditPostingModalShow, setNewEditModalShow, setSelectSomeModalShow]);

  const postImage = useCallback(
    (boardId: string) => {
      const formData = new FormData();
      if (setPostArr) {
        setPostArr.forEach((file) => formData.append('image', file));
        formData.append('boardId', boardId);
        axios
          .post(`${getAddress()}/api/board/upload`, formData)
          .then((res) => console.log(res))
          .catch((err) => errorAlert(err));
      }
    },
    [setPostArr],
  );

  const postNewPosting = useCallback(() => {
    if (selectedEvent && selectedTeam) {
      axios
        .post(
          `${getAddress()}/api/board`,
          {
            eventId: selectedEvent['id'],
            title,
            contents: content,
            attendMembers: Object.values(selectedTeam)[0],
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then((res) => {
          postImage(res.data.post.toString());
          GetBoards(selectedEvent['id'], setBoardsObj);
          alert('성공적으로 게시되었습니다');
          closeModal();
        })
        .catch((err) => errorAlert(err));
    } else if (!selectedEvent) alert('이벤트를 선택해 주세요');
    else if (!selectedTeam) alert('팀을 선택해 주세요');
  }, [closeModal, content, postImage, selectedEvent, selectedTeam, setBoardsObj, title]);

  const postEditPosting = useCallback(() => {
    if (selectedEvent) {
      axios
        .put(
          `${getAddress()}/api/board/${boardId}`,
          {
            eventId: selectedEvent['id'],
            title,
            contents: content,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then(() => {
          alert('성공적으로 수정되었습니다');
          GetBoards(selectedEvent['id'], setBoardsObj);
          setEditPostingModalShow(false);
        })
        .catch((err) => errorAlert(err));
    } else if (!selectedEvent) alert('이벤트를 선택해 주세요');
  }, [boardId, content, selectedEvent, setBoardsObj, setEditPostingModalShow, title]);

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

  const onSubmitPosting = () => {
    if (getToken()) {
      if (mode === 'new') postNewPosting();
      else if (mode === 'edit') postEditPosting();
    } else alert('로그인을 하셔야 포스팅 하실 수 있습니다');
  };

  const onClickUpload = (e: any) => {
    setPostFileArr(Object.values(e.target.files));
    // console.log(Object.values(e.target.files));
  };

  useEffect(() => {
    if (!selectSomeModalShow) {
      setIsAddMemBtnClicked(false);
      setIsEventBtnClicked(false);
    }
  }, [selectSomeModalShow]);

  useEffect(() => {
    if (mode === 'edit') getDetailBoard(boardId, setBoardObj);
    return () => {
      setSelectedTeam(null);
      closeModal();
    };
  }, [boardId, closeModal, mode, setSelectedTeam]);

  useEffect(() => {
    if (mode === 'edit' && boardObj) {
      setTitle(boardObj['title']);
      setContent(boardObj['contents']);
    }
  }, [mode, boardObj, setSelectedTeam]);

  return (
    <div className="review--newposting--background" onClick={() => closeModal()}>
      <img className="review--newposting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--newposting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--newposting--left_division">
          {mode === 'new' ? (
            <div className="review--newposting--add_files">
              {!setPostArr ? (
                <>
                  <img src={defaultImg} alt={defaultImg}></img>
                  <p>이미지를 업로드 해주세용!</p>
                  <UplaodBtn mode={mode} innerText="업로드" onClickFunc={onClickUpload} />
                </>
              ) : (
                <div className="review--newposting--add_files--submitted_wrapper">
                  <div className="review--newposting--add_files--submitted_title">Uploads</div>
                  {setPostArr.map((file) => (
                    <div className="review--newposting--add_files--submitted">{file['name']}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            boardObj && (
              <>
                <UplaodBtn mode={mode} innerText="추가 업로드" onClickFunc={onClickUpload} />
                <SliderBtnBox imageArr={boardObj['images']} mode="edit" />
              </>
            )
          )}
        </div>
        <div className="review--newposting--right_division">
          <div className="review--newposting--header">
            <input
              className={`review--newposting--header--title ${mode === 'new' ? 'new_input' : 'edit_input'}`}
              placeholder="제목 입력"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = '제목 입력')}
              value={title}
              onChange={onChangeTitle}
            />
            <div className="review--newposting--header--selectorWrapper">
              {mode === 'new' && (
                <>
                  <div className="review--newposting--header--eventSelector">
                    <span onClick={onClickEventModalOpen}>{isEventMode ? '이벤트 찾기' : '팀원 찾기'}</span>
                    {isEventBtnClicked &&
                      selectSomeModalShow &&
                      (isEventMode ? <SelectSomeModal mode="modal_event" /> : <SelectSomeModal mode="modal_team" />)}
                  </div>
                  <div className="review--newposting--header--addTeamMem">
                    <span onClick={onClickAddMemModalOpen}>팀원 추가</span>
                    {isAddMemBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_addMem" />}
                  </div>
                </>
              )}
            </div>
          </div>
          {(selectedEvent || selectedTeam) && (
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
          )}
          <div className="review--newposting--newposting_wrapper">
            <TextareaAutosize
              className="review--newposting--newposting"
              minRows={10}
              placeholder="글을 작성해주세요"
              value={content}
              onChange={onChangeContent}
            />
            <div className="review--newposting--button--forFlex">
              <button className="review--newposting--button" onClick={onSubmitPosting}>
                <span>게시</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewEditPostingModal;