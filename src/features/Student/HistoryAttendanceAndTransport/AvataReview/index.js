import React, { useState } from "react";
import { Avatar, Image } from "antd";
import { ReactComponent as IconClose } from "../../../../svg/icon-close.svg";

import "../styles.scss";

const AvataReview = ({ src }) => {
  const [visible, setVisible] = useState(false);

  const previewImgEle = (
    <div className="image-preview-root">
      <div
        className="image-preview-mask"
        onClick={() => setVisible(false)}
      ></div>
      <div className="image-preview-wrapper">
        <img src={src} alt="" className="image-preview-img" />
        <IconClose className="image-close" onClick={() => setVisible(false)} />
      </div>
    </div>
  );

  return (
    <>
      <Avatar
        onClick={() => setVisible(true)}
        src={<Image src={src} preview={false} />}
      />
      {visible && previewImgEle}
    </>
  );
};

export default AvataReview;
