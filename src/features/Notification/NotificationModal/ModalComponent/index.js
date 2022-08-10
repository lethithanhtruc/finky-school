import { CloseOutlined } from "@ant-design/icons";
import { Col, Modal, Row } from "antd";
import React from "react";
import Block from "../../../../components/Common/Block";
import {
  DEFAULT_MODAL_WIDTH,
  DEFAULT_MODAL_HEIGHT,
} from "../../../../constants/notification";
import "./index.scss";

export const Title = ({ children, className }) => {
  return (
    <div className={`notification-modal__title ${className}`}>{children}</div>
  );
};

export const LeftBlock = ({ children, className }) => {
  return (
    <Block className={`notification-modal__block ${className}`}>
      {children}
    </Block>
  );
};

export const RightBlock = ({ children, className }) => {
  return (
    <Block className={`notification-modal__block ${className}`}>
      {children}
    </Block>
  );
};

const CloseIcon = ({ onClick }) => {
  return (
    <CloseOutlined
      className="notification_modal__close-icon"
      onClick={onClick}
    />
  );
};

const ModalComponent = (props) => {
  const { children, className, visible, onClose, title } = props;

  const width = props.width || DEFAULT_MODAL_WIDTH;
  const height = props.height || DEFAULT_MODAL_HEIGHT;

  return (
    <Modal
      className={`notification-modal ${className}`}
      width={width}
      height={height}
      title={<Title>{title}</Title>}
      footer={null}
      mask={true}
      closeIcon={<CloseIcon onClick={onClose} />}
      visible={visible}
      centered
      closable
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
