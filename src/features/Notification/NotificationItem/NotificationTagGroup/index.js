import { Space } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import { EMPTY_TEXT, NOTIFICATION_TYPE } from "../../../../constants";
import NotificationTag from "../NotificationTag";

const StudentTag = ({ studentName, classroom }) => {
  return (
    <NotificationTag
      text={
        <FormattedMessage
          id="notification.detail.tag.student"
          values={{
            studentName: studentName,
            classroom: classroom,
          }}
        />
      }
    />
  );
};

const ClassTag = ({ classroom }) => {
  return (
    <NotificationTag
      text={
        <FormattedMessage
          id="notification.detail.tag.class"
          values={{ classroom: classroom }}
        />
      }
    />
  );
};

const CampusTag = ({ campus }) => {
  return (
    <NotificationTag
      text={
        <FormattedMessage
          id="notification.detail.tag.campus"
          values={{ campus: campus }}
        />
      }
    />
  );
};

const NotificationTagGroup = ({ type, subject }) => {
  const getData = (subject) => {
    switch (subject?.__typename) {
      case "Student":
        return {
          studentName: subject?.name,
          classroom: subject?.classroomInCurrentSchoolYear?.name || (
            <FormattedMessage id="student.index.ungraded" />
          ),
          campus: subject?.campus?.name,
        };
      case "ParentageCensorship":
        return {
          studentName: subject?.student?.name,
          classroom: subject?.student?.classroomInCurrentSchoolYear?.name,
          campus: subject?.student?.classroomInCurrentSchoolYear?.campus?.name,
        };
      case "Classroom":
        return {
          campus: subject?.campus?.name,
        };
      case "Campus":
        return {
          campus: subject?.name,
        };
      case "ScheduleLog":
        return {
          campus: subject?.campus?.name,
        };
      default:
        return {
          studentName: subject?.student?.name,
          classroom: subject?.student?.classroomInCurrentSchoolYear?.name,
          campus: subject?.student?.classroomInCurrentSchoolYear?.campus?.name,
        };
    }
  };

  const {
    studentName = EMPTY_TEXT,
    classroom = EMPTY_TEXT,
    campus = EMPTY_TEXT,
  } = getData(subject);

  const getTag = () => {
    switch (type) {
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STUDENT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_ACCOUNT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_ADD_RELATIVE_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_RELATIVE_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.CAUTION_PARENTAGE_ACCOUNT_CREATE_ERROR:
        return <StudentTag studentName={studentName} classroom={classroom} />;

      case NOTIFICATION_TYPE.REQUEST_UPDATE_STATION_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_SUGGEST_STATION_FROM_PARENTAGE:
        return (
          <>
            <StudentTag studentName={studentName} classroom={classroom} />
            <CampusTag campus={campus} />
          </>
        );

      case NOTIFICATION_TYPE.REQUEST_REGISTER_FOR_SCHOOL_BUS_FROM_PARENTAGE:
        return (
          <>
            <ClassTag classroom={classroom} />
            <CampusTag campus={campus} />
          </>
        );

      case NOTIFICATION_TYPE.CAUTION_PUSH_NOTIFICATION:
      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_STUDENT:
      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CLASS:
      case NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CAMPUS:
      case NOTIFICATION_TYPE.CAUTION_NUMBER_STUDENT_INSUFFICIENT:
        return <CampusTag campus={campus} />;
      default:
        return null;
    }
  };

  return <Space size={8}>{getTag()}</Space>;
};

export default NotificationTagGroup;
