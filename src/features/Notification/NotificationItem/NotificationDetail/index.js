import { Avatar, Col, Row, Space, Typography } from "antd";
import { compact } from "lodash";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  DETAIL_TYPE,
  EMPTY_TEXT,
  NOTIFICATION_TYPE,
  TAG_TYPE,
} from "../../../../constants";
import { ReactComponent as IconArrow } from "../../../../svg/icon-arrow-right.svg";
import { getDataFromChangeLogs as getData } from "../../../../utils";
import NotificationTag from "../NotificationTag";

const DetailRow = ({ label, value }) => {
  return (
    <Row>
      <Col lg={7} xl={6} xxl={5}>
        <div className="notification-detail__change-item">{label}</div>
      </Col>
      <Col lg={17} xl={18} xxl={19}>
        {value}
      </Col>
    </Row>
  );
};

const Message = ({ text }) => {
  const { Paragraph } = Typography;

  let formatText = text.trim();

  const getClassname = (text) => {
    if (Boolean(text)) {
      return "notification-detail__message";
    }

    return "notification-detail__message notification-detail__message--empty";
  };

  return (
    <div className="notification-detail__message-wrapper">
      <Paragraph className={getClassname(formatText)} ellipsis={{ rows: 2 }}>
        {Boolean(formatText) ? (
          `"${formatText}"`
        ) : (
          <FormattedMessage id={`notification.detail.empty`} />
        )}
      </Paragraph>
    </div>
  );
};

const Text = ({ text }) => {
  return <div className="notification_detail__text">{text}</div>;
};

const GenericChange = ({ oldValue, newValue }) => {
  return (
    <Space wrap>
      <NotificationTag type={TAG_TYPE.YELLOW} text={oldValue} />
      <IconArrow />
      <NotificationTag type={TAG_TYPE.BLUE} text={newValue} />
    </Space>
  );
};

const AvatarChange = ({ oldAvatar, newAvatar }) => {
  const addPrefixToSrc = (src = "") => {
    if (src?.includes("http")) {
      return src;
    }

    return process.env.REACT_APP_BACKEND_URL + "/" + src;
  };

  return (
    <DetailRow
      label={<FormattedMessage id={`notification.detail.avatar`} />}
      value={
        <Space>
          <Space direction="vertical" align="center">
            <Avatar size={60} src={addPrefixToSrc(oldAvatar)} />
            <NotificationTag
              type={TAG_TYPE.YELLOW}
              text={<FormattedMessage id={"notification.detail.avatar.old"} />}
            />
          </Space>
          <IconArrow className="change-arrow" />
          <Space direction="vertical" align="center">
            <Avatar size={60} src={addPrefixToSrc(newAvatar)} />
            <NotificationTag
              type={TAG_TYPE.BLUE}
              text={<FormattedMessage id={"notification.detail.avatar.new"} />}
            />
          </Space>
        </Space>
      }
    />
  );
};

const BirthdayChange = ({ oldValue, newValue }) => {
  const intl = useIntl();
  const oldBirthday = oldValue
    ? moment(oldValue).format(
        intl.formatMessage({ id: "notification.date.format" })
      )
    : EMPTY_TEXT;
  const newBirthday = newValue
    ? moment(newValue).format(
        intl.formatMessage({ id: "notification.date.format" })
      )
    : EMPTY_TEXT;

  return (
    <DetailRow
      label={<FormattedMessage id={`notification.detail.birthday`} />}
      value={<GenericChange oldValue={oldBirthday} newValue={newBirthday} />}
    />
  );
};

const EmergencyContactChange = ({ oldValue, newValue }) => {
  const intl = useIntl();
  const oldContact = oldValue
    ? intl.formatMessage({
        id: `student.relationship.${oldValue.toLowerCase()}`,
      })
    : EMPTY_TEXT;
  const newContact = newValue
    ? intl.formatMessage({
        id: `student.relationship.${newValue.toLowerCase()}`,
      })
    : EMPTY_TEXT;

  return (
    <DetailRow
      label={<FormattedMessage id={`notification.detail.emergency_contact`} />}
      value={<GenericChange oldValue={oldContact} newValue={newContact} />}
    />
  );
};

const LiveWithChange = ({ oldValue, newValue }) => {
  const intl = useIntl();
  const oldPerson = oldValue
    ? intl.formatMessage({
        id: `student.live-with.${oldValue.toLowerCase()}`,
      })
    : EMPTY_TEXT;
  const newPerson = newValue
    ? intl.formatMessage({
        id: `student.live-with.${newValue.toLowerCase()}`,
      })
    : EMPTY_TEXT;

  return (
    <DetailRow
      label={<FormattedMessage id={`notification.detail.live_with`} />}
      value={<GenericChange oldValue={oldPerson} newValue={newPerson} />}
    />
  );
};

const ChangeLogDetail = ({ changeLogs }) => {
  return changeLogs.slice(0, 3).map((log, index) => {
    // Case Resquest update station from parentage
    if (index === 2 && log.key === "station_id") {
      return null;
    }

    if (index === 2) {
      return (
        <DetailRow
          key={log.key}
          label={
            <FormattedMessage
              id={`notification.detail.other`}
              values={{ num: changeLogs.length - 2 }}
            />
          }
        />
      );
    }

    const { newValue, oldValue } = log;

    switch (log.key) {
      case DETAIL_TYPE.AVATAR:
        return (
          <AvatarChange
            key={log.key}
            oldAvatar={oldValue}
            newAvatar={newValue}
          />
        );

      case DETAIL_TYPE.BIRTHDAY:
        return (
          <BirthdayChange
            key={log.key}
            oldValue={oldValue}
            newValue={newValue}
          />
        );

      case DETAIL_TYPE.EMERGENCY_CONTACT:
        return (
          <EmergencyContactChange
            key={log.key}
            oldValue={oldValue}
            newValue={newValue}
          />
        );

      case DETAIL_TYPE.LIVE_WITH:
        return (
          <LiveWithChange
            key={log.key}
            oldValue={oldValue}
            newValue={newValue}
          />
        );

      default:
        return (
          <DetailRow
            key={log.key}
            label={<FormattedMessage id={`notification.detail.${log.key}`} />}
            value={
              <GenericChange
                oldValue={oldValue || EMPTY_TEXT}
                newValue={newValue || EMPTY_TEXT}
              />
            }
          />
        );
    }
  });
};

const NotificationDetail = ({ type, subject, changeLogs }) => {
  const intl = useIntl();
  const renderHeading = () => {
    switch (type) {
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STUDENT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_ACCOUNT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STATION_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_RELATIVE_FROM_PARENTAGE:
        return <FormattedMessage id={"notification.detail.change"} />;

      case NOTIFICATION_TYPE.REQUEST_ADD_RELATIVE_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_SUGGEST_STATION_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_REGISTER_FOR_SCHOOL_BUS_FROM_PARENTAGE:
        return <FormattedMessage id={"notification.detail.info"} />;

      default:
        return <FormattedMessage id={"notification.detail.info"} />;
    }
  };

  const renderDetail = () => {
    switch (type) {
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STUDENT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_ACCOUNT_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_STATION_FROM_PARENTAGE:
      case NOTIFICATION_TYPE.REQUEST_UPDATE_RELATIVE_FROM_PARENTAGE:
        return <ChangeLogDetail changeLogs={changeLogs} />;

      case NOTIFICATION_TYPE.REQUEST_ADD_RELATIVE_FROM_PARENTAGE:
        const getRelativeInfo = () => {
          const name = getData(changeLogs, DETAIL_TYPE.NAME);
          const relationship = getData(
            changeLogs,
            DETAIL_TYPE.STUDENT_RELATIONSHIP
          );

          let info = name;
          if (Boolean(relationship) && isNaN(relationship)) {
            const relationshipTxt = intl.formatMessage({
              id: `student.relationship.${relationship.toLowerCase()}`,
            });
            const endTxt = intl.formatMessage({
              id: `notification.detail.relationship`,
            });

            info += ` - ${relationshipTxt}${endTxt}`;
          }

          return info;
        };

        return (
          <DetailRow
            label={<FormattedMessage id="notification.detail.family" />}
            value={
              <NotificationTag
                type={TAG_TYPE.PURPLE}
                text={getRelativeInfo()}
              />
            }
          />
        );

      case NOTIFICATION_TYPE.REQUEST_SUGGEST_STATION_FROM_PARENTAGE:
        const address = getData(changeLogs, DETAIL_TYPE.ADDRESS);
        const district = getData(changeLogs, DETAIL_TYPE.DISTRICT, true);
        const province = getData(changeLogs, DETAIL_TYPE.PROVINCE, true);
        const note = getData(changeLogs, DETAIL_TYPE.NOTE);

        const addressToDisplay = compact([address, district, province]).join(
          ", "
        );

        return (
          <>
            <DetailRow
              label={<FormattedMessage id="notification.detail.address" />}
              value={
                <NotificationTag
                  type={TAG_TYPE.GREEN}
                  text={addressToDisplay}
                />
              }
            />
            <DetailRow
              label={<FormattedMessage id="notification.detail.description" />}
              value={<Message text={note} />}
            />
          </>
        );

      case NOTIFICATION_TYPE.REQUEST_REGISTER_FOR_SCHOOL_BUS_FROM_PARENTAGE:
        const stationName = getData(changeLogs, DETAIL_TYPE.STATION_NAME);
        const stationAddress = getData(changeLogs, DETAIL_TYPE.STATION_ADDRESS);
        return (
          <>
            <DetailRow
              label={<FormattedMessage id="notification.detail.pickupPlace" />}
              value={
                <NotificationTag type={TAG_TYPE.GREY} text={stationName} />
              }
            />
            <DetailRow
              label={
                <FormattedMessage id="notification.detail.pickupAddress" />
              }
              value={
                <NotificationTag type={TAG_TYPE.GREEN} text={stationAddress} />
              }
            />
          </>
        );

      case NOTIFICATION_TYPE.CAUTION_PARENTAGE_ACCOUNT_CREATE_ERROR:
        const description = getData(changeLogs, DETAIL_TYPE.DESCRIPTION, true);

        return (
          <DetailRow
            label={<FormattedMessage id="notification.detail.description" />}
            value={<Message text={description} />}
          />
        );

      case NOTIFICATION_TYPE.CAUTION_PUSH_NOTIFICATION:
        const reasonId = getData(changeLogs, DETAIL_TYPE.REASON, true);
        const reason = reasonId ? (
          <FormattedMessage id={`notification.caution.reason.${reasonId}`} />
        ) : (
          EMPTY_TEXT
        );
        const descriptionCaution = getData(
          changeLogs,
          DETAIL_TYPE.DESCRIPTION,
          true
        );

        return (
          <>
            <DetailRow
              label={<FormattedMessage id="notification.detail.reason" />}
              value={<NotificationTag type={TAG_TYPE.RED} text={reason} />}
            />
            <DetailRow
              label={<FormattedMessage id="notification.detail.description" />}
              value={<Message text={descriptionCaution} />}
            />
          </>
        );

      case NOTIFICATION_TYPE.CAUTION_NUMBER_STUDENT_INSUFFICIENT:
        const licensePlate = getData(changeLogs, DETAIL_TYPE.LICENSE_PLATE);
        const driverName = getData(changeLogs, DETAIL_TYPE.DRIVER);
        const nannyName = getData(changeLogs, DETAIL_TYPE.NANNY);
        const numStudentOn = getData(changeLogs, DETAIL_TYPE.NUM_STUDENT_ON);
        const numStudentOff = getData(changeLogs, DETAIL_TYPE.NUM_STUDENT_OFF);

        return (
          <>
            <DetailRow
              label={
                <FormattedMessage id="notification.detail.license_plate" />
              }
              value={<Text text={licensePlate} />}
            />
            <DetailRow
              label={<FormattedMessage id="notification.detail.driver_name" />}
              value={<Text text={driverName} />}
            />
            <DetailRow
              label={<FormattedMessage id="notification.detail.nanny_name" />}
              value={<Text text={nannyName} />}
            />
            <DetailRow
              label={
                <FormattedMessage id="notification.detail.total_student_get_on" />
              }
              value={<Text text={numStudentOn} />}
            />
            <DetailRow
              label={
                <FormattedMessage id="notification.detail.total_student_get_off" />
              }
              value={<Text text={numStudentOff} />}
            />
          </>
        );

      default:
        return null;
    }
  };

  if (
    type === NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CAMPUS ||
    type === NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_CLASS ||
    type === NOTIFICATION_TYPE.CAUTION_HIGH_TEMPERATURE_OF_STUDENT
  ) {
    return null;
  }

  return (
    <div className="notification-detail">
      <Row>
        <div className="notification-detail__heading">{renderHeading()}</div>
      </Row>
      {renderDetail()}
    </div>
  );
};

export default NotificationDetail;
