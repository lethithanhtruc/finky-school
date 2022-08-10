import React from "react";
import { Space } from "antd";
import { NOTIFICATION_TYPE } from "../../../../constants";
import NotificationButton, {
  AcceptButton,
  RejectButton,
  DetailButton,
  ContactButton,
} from "../NotificationButton";
import { FormattedMessage } from "react-intl";

const NotificationButtonGroup = ({ type, accept, onConfirm, onOpenDetail }) => {
  const getButton = () => {
    switch (type) {
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STUDENT_FROM_PARENTAGE:
        return (
          <>
            <DetailButton />
            <AcceptButton accept={accept} onClick={() => onConfirm(true)} />
          </>
        );
      case NOTIFICATION_TYPE.REQUEST_UPDATE_ACCOUNT_FROM_PARENTAGE:
        return (
          <>
            <DetailButton />
            <AcceptButton accept={accept} onClick={() => onConfirm(true)} />
          </>
        );
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STATION_FROM_PARENTAGE:
        return (
          <>
            <RejectButton accept={accept} onClick={() => onConfirm(false)} />
            <AcceptButton accept={accept} onClick={() => onConfirm(true)} />
          </>
        );
      case NOTIFICATION_TYPE.REQUEST_ADD_RELATIVE_FROM_PARENTAGE:
        return (
          <>
            <DetailButton />
            <AcceptButton accept={accept} onClick={() => onConfirm(true)} />
          </>
        );
      case NOTIFICATION_TYPE.REQUEST_UPDATE_RELATIVE_FROM_PARENTAGE:
        return (
          <>
            <DetailButton />
            <AcceptButton accept={accept} onClick={() => onConfirm(true)} />
          </>
        );
      case NOTIFICATION_TYPE.REQUEST_SUGGEST_STATION_FROM_PARENTAGE:
        return (
          <>
            <NotificationButton
              text={
                <FormattedMessage id="notification.actionButton.suggestPickup" />
              }
            />
            <NotificationButton
              type="primary"
              text={
                <FormattedMessage id="notification.actionButton.createPickup" />
              }
            />
          </>
        );
      case NOTIFICATION_TYPE.REQUEST_REGISTER_FOR_SCHOOL_BUS_FROM_PARENTAGE:
        return (
          <>
            <RejectButton accept={accept} onClick={() => onConfirm(false)} />
            <AcceptButton accept={accept} onClick={() => onConfirm(true)} />
          </>
        );
      case NOTIFICATION_TYPE.CAUTION_PARENTAGE_ACCOUNT_CREATE_ERROR:
        return (
          <>
            <DetailButton />
          </>
        );
      case NOTIFICATION_TYPE.CAUTION_PUSH_NOTIFICATION:
        return (
          <>
            <DetailButton />
            <ContactButton />
          </>
        );
      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_STUDENT:
        return (
          <>
            <DetailButton />
            <ContactButton />
          </>
        );
      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CLASS:
        return (
          <>
            <DetailButton />
            <ContactButton />
          </>
        );
      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CAMPUS:
        return (
          <>
            <DetailButton />
            <NotificationButton
              type="primary"
              text={
                <FormattedMessage id="notification.actionButton.download" />
              }
            />
          </>
        );
      case NOTIFICATION_TYPE.CAUTION_NUMBER_STUDENT_INSUFFICIENT:
        return (
          <>
            <DetailButton onClick={onOpenDetail} />
            <ContactButton />
          </>
        );
      default:
        return null;
    }
  };

  return <Space size={4}>{getButton()}</Space>;
};

export default NotificationButtonGroup;
