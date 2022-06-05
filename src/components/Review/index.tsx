import React, { useEffect } from 'react';
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
