import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import { capitalizedFirstLetter } from "../../../../utils";

const NotificationDate = ({ createdAt }) => {
  const intl = useIntl();
  const day = moment(createdAt).locale(intl.locale);

  return (
    <div className="notification-item__datetime">
      <span>{capitalizedFirstLetter(day.format("dddd"))}</span>
      <span>
        <FormattedMessage id="notification.date" />
      </span>
      <span>
        {day.format(intl.formatMessage({ id: "notification.date.format" }))}
      </span>
    </div>
  );
};

export default NotificationDate;
