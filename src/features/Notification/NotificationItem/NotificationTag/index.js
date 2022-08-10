import { Tag } from "antd";
import React from "react";
import "./index.scss";

const NotificationTag = ({ type = "default", text = "‎‎‏‏‎..." }) => {
  return (
    <Tag className={`notification-tag notification-tag--${type.toLowerCase()}`}>
      {text}
    </Tag>
  );
};

export default NotificationTag;
