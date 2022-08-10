import { Button, Modal } from "antd";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import UpcomingFeature from "../../../../components/Common/UpcomingFeature";

import "./index.scss";

const useOpenModal = () => {
  const intl = useIntl();

  return () => {
    Modal.confirm({
      className: "modal-upcoming-feature",
      maskClosable: true,
      title: null,
      icon: null,
      content: (
        <UpcomingFeature
          title={intl.formatMessage({
            id: "upcoming-feature.title",
          })}
          description={intl.formatMessage({
            id: "upcoming-feature.description",
          })}
        />
      ),
      width: 580,
    });
  };
};

const NotificationButton = ({ type, text, disabled, onClick }) => {
  const openDevelopingModal = useOpenModal();

  const getClassname = (type, disabled) => {
    if (disabled) {
      return "notification-button notification-button--disabled";
    }

    if (type === "primary") {
      return "notification-button";
    }

    return "notification-button notification-button--border";
  };

  return (
    <Button
      className={getClassname(type, disabled)}
      type={type}
      onClick={onClick || openDevelopingModal}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export const AcceptButton = ({ accept, onClick }) => {
  const getText = (accept) => {
    if (accept === true) {
      return <FormattedMessage id={"notification.actionButton.accepted"} />;
    }

    return <FormattedMessage id={"notification.actionButton.accept"} />;
  };

  if (accept === false) {
    return null;
  }

  return (
    <NotificationButton
      type="primary"
      disabled={accept === true || accept === false}
      onClick={onClick}
      text={getText(accept)}
    />
  );
};

export const RejectButton = ({ accept, onClick }) => {
  const getText = (accept) => {
    if (accept === false) {
      return <FormattedMessage id={"notification.actionButton.rejected"} />;
    }

    return <FormattedMessage id={"notification.actionButton.reject"} />;
  };

  if (accept === true) {
    return null;
  }

  return (
    <NotificationButton
      disabled={accept === false}
      onClick={onClick}
      text={getText(accept)}
    />
  );
};

export const DetailButton = ({ onClick }) => {
  return (
    <NotificationButton
      onClick={onClick}
      text={<FormattedMessage id={"notification.actionButton.detail"} />}
    />
  );
};

export const ContactButton = ({ onClick }) => {
  return (
    <NotificationButton
      type="primary"
      onClick={onClick}
      text={<FormattedMessage id={"notification.actionButton.contact"} />}
    />
  );
};

export default NotificationButton;
