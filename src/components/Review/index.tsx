import React, { useCallback, useEffect } from 'react';
import Posting from '@review/Posting';
import Guide from '@review/Guide';
import errorAlert from '@utils/errorAlert';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import BoardsObj from '@recoil/Review/BoardsObj';
import CommentModal from './CommentModal';
import ModalShow from '@recoil/Review/CommentModalShow';
import EventList from '@recoil/Review/EventList';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import NewPostingModal from './NewPostingModal';
import getAddress from '@globalObj/func/getAddress';
import defaultImg from '@img/defaultImg.png';
import ActionModalShow from '@recoil/Review/ActionModalShow';

function Review() {
  const [boardsObj, setBoardsObj] = useRecoilState(BoardsObj);
  const commentModalShow = useRecoilValue(ModalShow);
  const newPostingModalShow = useRecoilValue(NewPostingModalShow);
  const setEventList = useSetRecoilState(EventList);
  const selectedEvent = useRecoilValue(SelectedEvent);

  const getBoards = useCallback(() => {
    axios
      .get(`${getAddress()}/api/board/?event-id=${selectedEvent['id']}`)
      .then((res) => {
        setBoardsObj(res.data);
      })
      .catch((err) => errorAlert(err));
  }, [selectedEvent, setBoardsObj]);

  const getEventList = useCallback(() => {
    axios
      .get(`${getAddress()}/api/together/matching`)
      .then((res) => {
        setEventList(res.data);
      })
      .catch((err) => errorAlert(err));
  }, [setEventList]);

  // when component created or selected event changed
  useEffect(() => {
    if (selectedEvent) {
      getBoards();
    }
    return () => {
      setBoardsObj(null);
    };
  }, [getBoards, selectedEvent, setBoardsObj]);

  // when component created
  useEffect(() => {
    getEventList();
  }, [getEventList]);

  // 임시용!
  // useEffect(() => {
  //   alert('아직 개발 전입니다..!');
  // }, []);

  return (
    <>
      <Guide isElemExist={boardsObj ? true : false} />
      {newPostingModalShow ? <NewPostingModal /> : commentModalShow ? <CommentModal /> : null}
      {boardsObj && (
        <div style={{ 'min-height': '600px', 'padding-bottom': '200px' }}>
          {Object.values(boardsObj).map((board, i) => (
            <Posting
              boardId={board['boardId']}
              eventId={board['eventId']}
              title={board['title']}
              teamId={board['teamId']}
              writer={board['writer']}
              contents={board['contents']}
              createAt={board['createAt']}
              updateAt={board['updateAt']}
              image={board['image'] ? board['image'] : [defaultImg]}
              attendMembers={board['attendMembers']}
              comments={board['comments']}
              elemNum={i + 1}
              key={i}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Review;
