import React, { useCallback, useEffect } from 'react';
import Posting from '@review/Posting';
import Guide from '@review/Guide';
import errorAlert from '@globalObj/function/errorAlert';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import BoardsObj from '@recoil/Review/BoardsObj';
import EventList from '@recoil/Review/EventList';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import NewPostingModal from './NewPostingModal';
import getAddress from '@globalObj/function/getAddress';
import defaultImg from '@img/defaultImg.png';
import getBoards from '@globalObj/function/getBoards';

function Review() {
  const [boardsObj, setBoardsObj] = useRecoilState(BoardsObj);
  const newPostingModalShow = useRecoilValue(NewPostingModalShow);
  const setEventList = useSetRecoilState(EventList);
  const selectedEvent = useRecoilValue(SelectedEvent);

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
    getBoards(selectedEvent ? selectedEvent['id'] : null, setBoardsObj);
    return () => setBoardsObj(null);
  }, [selectedEvent, setBoardsObj]);

  // when component created
  useEffect(() => {
    getEventList();
  }, [getEventList]);

  // 임시용!
  useEffect(() => {
    alert('아직 개발 전입니다...');
  }, []);

  return (
    <>
      <Guide isElemExist={!boardsObj || !Object.values(boardsObj)[0].length ? false : true} />
      {newPostingModalShow && <NewPostingModal />}
      {boardsObj && Object.values(boardsObj)[0].length && (
        <div style={{ minHeight: '600px', paddingBottom: '200px' }}>
          {Object.values(boardsObj)[0].map((board, i) => (
            <Posting
              boardId={board['boardId']}
              title={board['title']}
              intraId={board['intraId']}
              contents={board['contents']}
              createdAt={board['createdAt']}
              filePath={board['filePath'] ? board['filePath'] : defaultImg}
              commentNum={board['commentNum']}
              url={board['url']}
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
