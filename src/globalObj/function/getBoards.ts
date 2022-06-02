import { PostingType } from '@globalObj/object/types';
import errorAlert from '@globalObj/function/errorAlert';
import axios from 'axios';
import { SetterOrUpdater } from 'recoil';
import getAddress from './getAddress';

function GetBoards(
  eventId: number | null,
  setBoardsObj: SetterOrUpdater<{
    [x: string]: PostingType[];
  }>,
) {
  if (eventId) {
    axios
      .get(`${getAddress()}/api/board/?eventId=${eventId}`)
      .then((res) => {
        setBoardsObj(res.data);
      })
      .catch((err) => errorAlert(err));
  } else {
    axios
      .get(`${getAddress()}/api/board`)
      .then((res) => {
        setBoardsObj(res.data);
      })
      .catch((err) => errorAlert(err));
  }
}

export default GetBoards;
