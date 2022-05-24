import React, { useCallback, useEffect, useState } from 'react';
import '@css/Review/NewEditPostingModal.scss';
import Xmark from '@img/xmark-solid.svg';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import errorAlert from '@utils/errorAlert';
import BoardsObj from '@recoil/Review/BoardsObj';
import { getToken } from '@cert/TokenStorage';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewEditPostingModalShow from '@recoil/Review/NewEditPostingModalShow';
import SelectSomeModal from '@review/SelectSomeModal';
import SelectSomeModalShow from '@recoil/Review/SelectSomeModalShow';
import getAddress from '@globalObj/function/getAddress';
import SelectedTeam from '@recoil/Review/SelectedTeam';
import GetBoards from '@globalObj/function/getBoards';
import { imageType, ReviewBoardType } from '@globalObj/object/types';
import getDetailBoard from '@globalObj/function/getDetailBoard';
import defaultImg from '@img/uploadDefault.png';
import SliderBtnBox from './SliderBtnBox';

// mode : new or edit
function NewEditPostingModal(props: {
  mode: string;
  boardId?: number;
  setEditPostingModalShow?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mode, boardId, setEditPostingModalShow } = props;
  const setNewModalShow = useSetRecoilState(NewEditPostingModalShow);
  const [selectSomeModalShow, setSelectSomeModalShow] = useRecoilState(SelectSomeModalShow);
  const setBoardsObj = useSetRecoilState(BoardsObj);
  const selectedEvent = useRecoilValue(SelectedEvent);
  const [selectedTeam, setSelectedTeam] = useRecoilState(SelectedTeam);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageArr, setImageArr] = useState<imageType[]>(null);
  const [isEventBtnClicked, setIsEventBtnClicked] = useState(false);
  const [isAddMemBtnClicked, setIsAddMemBtnClicked] = useState(false);
  const [boardObj, setBoardObj] = useState<ReviewBoardType>(null);
  const [postFileArr, setPostFileArr] = useState<File[]>(null);

  const closeModal = useCallback(() => {
    if (mode === 'new') setNewModalShow(false);
    if (mode === 'edit') setEditPostingModalShow(false);
    setSelectSomeModalShow(false);
  }, [mode, setEditPostingModalShow, setNewModalShow, setSelectSomeModalShow]);

  const postImage = useCallback(
    (boardId: string) => {
      const formData = new FormData();
      if (postFileArr) {
        postFileArr.forEach((imgUrl) => formData.append('image', imgUrl));
        formData.append('boardId', boardId);
        axios.post(`${getAddress()}/api/board/upload`, formData).then((res) => console.log(res));
      }
    },
    [postFileArr],
  );

  const postNewPosting = useCallback(() => {
    if (selectedEvent && selectedTeam) {
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
        .then((res) => {
          postImage(res.data.boardId.toString());
          GetBoards(selectedEvent['id'], setBoardsObj);
          alert('성공적으로 게시되었습니다');
        })
        .catch((err) => errorAlert(err));
    } else if (!selectedEvent) alert('이벤트를 선택해 주세요');
    else if (!selectedTeam) alert('팀을 선택해 주세요');
  }, [content, imageArr, postImage, selectedEvent, selectedTeam, setBoardsObj, title]);

  const postEditPosting = useCallback(() => {
    if (selectedEvent) {
      axios
        .put(
          `${getAddress()}/api/board/${boardId}`,
          {
            eventId: selectedEvent['eventId'],
            title,
            content,
            image: imageArr,
          },
          {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
          },
        )
        .then(() => alert('성공적으로 수정되었습니다'))
        .catch((err) => errorAlert(err));
    } else if (!selectedEvent) alert('이벤트를 선택해 주세요');
  }, [boardId, content, imageArr, selectedEvent, title]);

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
    setPostFileArr(e.target.files);
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
      setImageArr(boardObj['image']);
    }
  }, [mode, boardObj, setSelectedTeam]);

  // console.log(new FormData());

  return (
    <div className="review--newposting--background" onClick={() => closeModal()}>
      <img className="review--newposting--xmark" src={Xmark} alt={Xmark}></img>
      <div className="review--newposting-devision" onClick={(e) => e.stopPropagation()}>
        <div className="review--newposting--left_division">
          {mode === 'new' ? (
            <div className="review--newposting--add_files">
              {!postFileArr ? (
                <>
                  <img src={defaultImg} alt={defaultImg}></img>
                  <p>이미지를 업로드 해주세용!</p>
                  <div className="review--newposting--add_files--input_wrapper">
                    <label
                      className="review--newposting--add_files--input_btn"
                      htmlFor="review--newposting--add_files--input"
                    >
                      업로드
                    </label>
                    <input
                      type="file"
                      id="review--newposting--add_files--input"
                      accept="image/*"
                      placeholder="업로드"
                      onChange={onClickUpload}
                      multiple
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="review--newposting--add_files--submitted_wrapper">
                  <div className="review--newposting--add_files--submitted_title">Uploads</div>
                  {Object.values(postFileArr).map((file) => (
                    <div className="review--newposting--add_files--submitted">{file['name']}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            boardObj && <SliderBtnBox imageArr={boardObj['image']} />
          )}
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
              {mode === 'new' && (
                <>
                  <div className="review--newposting--header--eventSelector">
                    <span onClick={onClickEventModalOpen}>이벤트 찾기</span>
                    {isEventBtnClicked && selectSomeModalShow && <SelectSomeModal mode="modal_event" />}
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
