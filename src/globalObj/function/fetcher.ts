import axios from 'axios';
import errorAlert from './errorAlert';

const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => errorAlert(err));

export default fetcher;
