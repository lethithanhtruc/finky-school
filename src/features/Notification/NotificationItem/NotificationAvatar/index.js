import { Image } from "antd";
import React from "react";
import { DEFAULT_AVATAR } from "../../../../constants";

const NotificationAvatar = ({ src, readAt }) => {
  return (
    <div className="notification-item__avatar">
      {!Boolean(readAt) && <div className="avatar__unread-mark" />}
      <Image src={src || DEFAULT_AVATAR} />
    </div>
  );
};

export default NotificationAvatar;
