import React, { useEffect } from 'react';
import Posting from '@review/Posting';
import Guide from '@review/Guide';
import errorAlert from '@utils/errorAlert';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import BoardsObj from '@recoil/Review/BoardsObj';
import CommentModal from './CommentModal';
import ModalShow from '@recoil/Review/CommentModalShow';
import EventList from '@recoil/Review/EventList';
import SelectedEvent from '@recoil/Review/SelectedEvent';

function Review() {
  const [boardsObj, setBoardsObj] = useRecoilState(BoardsObj);
  const commentModalShow = useRecoilValue(ModalShow);
  const [eventList, setEventList] = useRecoilState(EventList);
  const [selectedEvent, setSelectedEvent] = useRecoilState(SelectedEvent);

  // get boards obj / for show posts / when component created
  useEffect(() => {
    axios
      .get(`${process.env.SERVER_ADR}/api/board/?event-id=${18}`)
      .then((res) => {
        setBoardsObj(res.data);
      })
      .catch((err) => errorAlert(err));
    return () => {
      setBoardsObj(null);
    };
  }, [setBoardsObj]);

  // get event list / when component created
  useEffect(() => {
    axios
      .get(`${process.env.SERVER_ADR}/api/together/matching`)
      .then((res) => {
        setEventList(res.data);
      })
      .catch((err) => errorAlert(err));
  }, [setEventList]);

  return (
    <>
      <Guide isElemExist={boardsObj ? true : false} />
      {commentModalShow['show'] && <CommentModal />}
      {boardsObj &&
        Object.values(boardsObj).map((board, i) => (
          <Posting
            boardId={board['boardId']}
            eventId={board['eventId']}
            title={board['title']}
            writer={board['writer']}
            contents={board['contents']}
            createAt={board['createAt']}
            updateAt={board['updateAt']}
            image={board['image']}
            attendMembers={board['attendMembers']}
            comments={board['comments']}
            elemNum={i + 1}
            key={i}
          />
        ))}
    </>
  );
}

export default Review;
