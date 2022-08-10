import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  DETAIL_TYPE,
  EMPTY_TEXT,
  NOTIFICATION_TYPE,
} from "../../../../constants";
import {
  getAllChangeKey,
  getDataFromChangeLogs as getData,
} from "../../../../utils";

const NotificationDescription = (props) => {
  const intl = useIntl();
  const { type, causer, subject, changeLogs } = props;

  const getClassroom = (subject) => {
    switch (subject?.__typename) {
      case "Classroom":
        return subject?.name;
      default:
        return subject?.classroomInCurrentSchoolYear?.name;
    }
  };

  const parentName = causer?.parentage?.name || EMPTY_TEXT;
  const studentName = subject?.name || EMPTY_TEXT;
  const classroom = getClassroom(subject) || EMPTY_TEXT;

  const getDescription = () => {
    switch (type) {
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STUDENT_FROM_PARENTAGE:
        return (
          <FormattedMessage
            id="notification.desc.update.student"
            values={{
              parentName: <strong>{parentName}</strong>,
              field: <strong>{getAllChangeKey(changeLogs, intl)}</strong>,
              studentName: <strong>{studentName}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.REQUEST_UPDATE_ACCOUNT_FROM_PARENTAGE:
        return (
          <FormattedMessage
            id="notification.desc.update.account"
            values={{
              parentName: <strong>{parentName}</strong>,
              field: <strong>{getAllChangeKey(changeLogs, intl)}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.REQUEST_UPDATE_STATION_FROM_PARENTAGE:
        return (
          <FormattedMessage
            id="notification.desc.update.station"
            values={{
              parentName: <strong>{parentName}</strong>,
              studentName: <strong>{studentName}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.REQUEST_ADD_RELATIVE_FROM_PARENTAGE:
        return (
          <span>
            <FormattedMessage
              id="notification.desc.update.relative"
              values={{ parentName: <strong>{parentName}</strong> }}
            />
            <strong>
              <FormattedMessage id="notification.desc.update.relativeInfo" />
            </strong>
          </span>
        );

      case NOTIFICATION_TYPE.REQUEST_UPDATE_RELATIVE_FROM_PARENTAGE:
        return (
          <FormattedMessage
            id="notification.desc.update.account"
            values={{
              parentName: <strong>{parentName}</strong>,
              field: (
                <strong>
                  <FormattedMessage id="notification.desc.update.relativeInfo" />
                </strong>
              ),
            }}
          />
        );

      case NOTIFICATION_TYPE.REQUEST_SUGGEST_STATION_FROM_PARENTAGE:
        return (
          <FormattedMessage
            id="notification.desc.suggestPickup"
            values={{
              parentName: <strong>{parentName}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.REQUEST_REGISTER_FOR_SCHOOL_BUS_FROM_PARENTAGE:
        return (
          <FormattedMessage
            id="notification.desc.registerPickup"
            values={{
              parentName: <strong>{parentName}</strong>,
              studentName: <strong>{studentName}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.CAUTION_PARENTAGE_ACCOUNT_CREATE_ERROR:
        return (
          <FormattedMessage
            id="notification.desc.create.error"
            values={{
              parentName: <strong>{parentName}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.CAUTION_PUSH_NOTIFICATION:
        return (
          <FormattedMessage
            id="notification.desc.caution.error"
            values={{
              parentName: <strong>{parentName}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_STUDENT:
        const abnormalTemp = getData(
          changeLogs,
          DETAIL_TYPE.ABNORMAL_TEMPERATURE
        );
        const abnormalStudent = getData(changeLogs, DETAIL_TYPE.STUDENT_NAME);
        const abnormalClass = getData(changeLogs, DETAIL_TYPE.CLASSROOM_NAME);

        return (
          <FormattedMessage
            id="notification.desc.caution.single"
            values={{
              studentName: <strong>{abnormalStudent}</strong>,
              class: <strong>{abnormalClass}</strong>,
              degree: <strong className="red">{abnormalTemp + "°C"}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CLASS:
        const numInClass = getData(changeLogs, DETAIL_TYPE.NUM_STUDENT);

        return (
          <FormattedMessage
            id={
              numInClass < 2
                ? "notification.desc.caution.class"
                : "notification.desc.caution.class.multiple"
            }
            values={{
              num: <strong>{numInClass}</strong>,
              student: (
                <strong>
                  {numInClass < 2
                    ? intl.formatMessage({ id: "notification.detail.student" })
                    : intl.formatMessage({
                        id: "notification.detail.students",
                      })}
                </strong>
              ),
              class: <strong>{classroom}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CAMPUS:
        const numInCampus = getData(changeLogs, DETAIL_TYPE.NUM_STUDENT);
        const percent = getData(changeLogs, DETAIL_TYPE.PERCENT);

        return (
          <FormattedMessage
            id={
              numInCampus < 2
                ? "notification.desc.caution.campus"
                : "notification.desc.caution.campus.multiple"
            }
            values={{
              num: <strong>{numInCampus}</strong>,
              student: (
                <strong>
                  {numInCampus < 2
                    ? intl.formatMessage({ id: "notification.detail.student" })
                    : intl.formatMessage({
                        id: "notification.detail.students",
                      })}
                </strong>
              ),
              percent: <strong className="red">{percent + "%"}</strong>,
            }}
          />
        );

      case NOTIFICATION_TYPE.CAUTION_NUMBER_STUDENT_INSUFFICIENT:
        return <FormattedMessage id="notification.desc.caution.pickup" />;

      default:
        return null;
    }
  };

  return <div className="notification-item__desc">{getDescription()}</div>;
};

export default NotificationDescription;
