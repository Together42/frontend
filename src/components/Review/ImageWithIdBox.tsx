import React, { useState } from 'react';
import '@css/Review/ImageWithIdBox.scss';

function ImageWithIdBox(props: { mode: string; url: string; intraId: string }) {
  const { mode, url, intraId } = props;
  const [showIntraID, setShowIntraId] = useState<boolean>(false);

  return (
    <div
      className="review--image_id_box"
      onMouseOver={() => setShowIntraId(true)}
      onMouseOut={() => setShowIntraId(false)}
    >
      <img className={mode === 'post' ? 'post' : mode === 'comment' ? 'comment' : null} src={url} alt={url}></img>
      <div className={showIntraID && 'show'}>{intraId}</div>
    </div>
  );
}

export default ImageWithIdBox;
