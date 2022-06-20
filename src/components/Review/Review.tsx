import React from 'react';
import Posting from '@review/Posting';
import Guide from '@review/Guide';
import { useRecoilValue } from 'recoil';
import SelectedEvent from '@recoil/Review/SelectedEvent';
import NewPostingModalShow from '@recoil/Review/NewPostingModalShow';
import NewPostingModal from './NewPostingModal';
import getAddress from '@globalObj/function/getAddress';
import defaultImg from '@img/defaultImg.png';
import useSWR from 'swr';
import fetcher from '@globalObj/function/fetcher';
import { PostingType } from '@usefulObj/types';
import '@css/Review/Review.scss';

function Review() {
  const selectedEvent = useRecoilValue(SelectedEvent);
  const { data: boardsObj } = useSWR<{ [x: string]: PostingType[] }>(
    selectedEvent ? `${getAddress()}/api/board/?eventId=${selectedEvent['id']}` : `${getAddress()}/api/board`,
    fetcher,
    {
      dedupingInterval: 600000,
    },
  );
  const newPostingModalShow = useRecoilValue(NewPostingModalShow);

  return (
    <>
      <Guide isElemExist={!boardsObj || !Object.values(boardsObj)[0].length ? false : true} />
      {newPostingModalShow && <NewPostingModal />}
      {boardsObj && Object.values(boardsObj)[0].length ? (
        <div className="review--wrapper">
          {Object.values(boardsObj)[0]
            .sort((a, b) => {
              if (b['createdAt'] > a['createdAt']) return 1;
              else return -1;
            })
            .map((board, i) => (
              <Posting
                boardId={board['boardId']}
                title={board['title']}
                intraId={board['intraId']}
                contents={board['contents']}
                createdAt={board['createdAt']}
                images={board['images'] ? board['images'] : defaultImg}
                commentNum={board['commentNum']}
                profile={board['profile']}
                elemNum={i + 1}
                totalNum={Object.values(boardsObj)[0].length}
                key={i}
              />
            ))}
        </div>
      ) : null}
    </>
  );
}

export default Review;
