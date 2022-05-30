import React from 'react';
import '@css/utils/UploadBtn.scss';

function UploadBtn(props: { mode: string; innerText: string; onClickFunc: (e: any) => void }) {
  const { mode, innerText, onClickFunc } = props;

  return (
    <div className={`upload_btn_wrapper ${mode}`}>
      <div className="upload_btn">
        <label className="upload_btn--button" htmlFor="upload_btn--input">
          {innerText}
        </label>
        <input type="file" id="upload_btn--input" accept="image/*" onChange={onClickFunc} multiple required />
      </div>
    </div>
  );
}

export default UploadBtn;
