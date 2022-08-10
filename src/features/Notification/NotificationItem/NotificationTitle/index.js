import React from "react";
import { NOTIFICATION_TYPE } from "../../../../constants";
import { FormattedMessage } from "react-intl";

const NotificationTitle = ({ type, createdAt }) => {
  const getTitle = () => {
    switch (type) {
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STUDENT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_ACCOUNT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_ADD_RELATIVE_FROM_PARENTAGE:
        return <FormattedMessage id="notification.title.update" />;

      case NOTIFICATION_TYPE.REQUEST_UPDATE_RELATIVE_FROM_PARENTAGE:
        return <FormattedMessage id="notification.title.update.relative" />;

      case NOTIFICATION_TYPE.REQUEST_UPDATE_STATION_FROM_PARENTAGE:
        return <FormattedMessage id="notification.title.changePickup" />;

      case NOTIFICATION_TYPE.REQUEST_SUGGEST_STATION_FROM_PARENTAGE:
        return <FormattedMessage id="notification.title.suggestPickup" />;

      case NOTIFICATION_TYPE.REQUEST_REGISTER_FOR_SCHOOL_BUS_FROM_PARENTAGE:
        return <FormattedMessage id="notification.title.registerPickup" />;

      case NOTIFICATION_TYPE.CAUTION_PARENTAGE_ACCOUNT_CREATE_ERROR:
        return <FormattedMessage id="notification.title.create.error" />;

      case NOTIFICATION_TYPE.CAUTION_PUSH_NOTIFICATION:
        return <FormattedMessage id="notification.title.caution" />;

      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_STUDENT:
        return <FormattedMessage id="notification.title.caution.temperature" />;

      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CLASS:
        return <FormattedMessage id="notification.title.caution.temperature" />;

      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CAMPUS:
        return <FormattedMessage id="notification.title.caution.temperature" />;

      case NOTIFICATION_TYPE.CAUTION_NUMBER_STUDENT_INSUFFICIENT:
        return <FormattedMessage id="notification.title.caution.pickup" />;
      default:
        return null;
    }
  };

  return (
    <div className="notification-item__title">
      <div className="title">{getTitle()}</div>
      <div className="time">{createdAt.substring(10)}</div>
    </div>
  );
};

export default NotificationTitle;
