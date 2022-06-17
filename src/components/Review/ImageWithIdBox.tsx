import React, { useState } from 'react';
import '@css/Review/ImageWithIdBox.scss';
import not_url from '@img/not_url.png';
import { useRecoilValue } from 'recoil';
import DeviceMode from '@recoil/DeviceMode';

function ImageWithIdBox(props: { mode: string; url: string; intraId: string }) {
  const { mode, url, intraId } = props;
  const deviceMode = useRecoilValue(DeviceMode);
  const [showIntraID, setShowIntraId] = useState<boolean>(false);

  return (
    <div
      className="review--image_id_box"
      onMouseOver={() => setShowIntraId(true)}
      onMouseOut={() => setShowIntraId(false)}
    >
      <img className={mode} src={url} alt={url} onError={(e: any) => (e.target.src = not_url)}></img>
      <div className={(showIntraID ? 'show' : '').concat(` ${deviceMode}`)}>{intraId}</div>
    </div>
  );
}

export default ImageWithIdBox;
