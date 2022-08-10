import { useLazyQuery } from "@apollo/client";
import { Col, message, Row, Space } from "antd";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  getDataFromChangeLogs as getData,
  parseDateFromChangeLogs as parseDate,
} from "../../../../utils";
import { GET_DATA_NUM_STUDENT_ABNORMAL_POPUP } from "../../gql";
import ModalComponent, { LeftBlock, RightBlock } from "../ModalComponent";
import { AttendanceTable } from "./AttendanceTable";
import "./index.scss";
import { DETAIL_TYPE } from "../../../../constants";
import {
  TIME_SHIFT_MORNING,
  TIME_SHIFT_AFTERNOON,
  TURN_AWAY,
  TURN_BACK,
} from "../../../StudentTransportationStatistics/constants";

const CautionNumOfStudentModal = ({ data, visible, onClose }) => {
  const intl = useIntl();

  const { activityLog } = data;
  const { changeLogs } = activityLog;

  const licensePlate = getData(changeLogs, DETAIL_TYPE.LICENSE_PLATE);
  const driverName = getData(changeLogs, DETAIL_TYPE.DRIVER);
  const driverPhone = getData(changeLogs, DETAIL_TYPE.DRIVER_PHONE);
  const nannyName = getData(changeLogs, DETAIL_TYPE.NANNY);
  const nannyPhone = getData(changeLogs, DETAIL_TYPE.NANNY_PHONE);
  const totalStudentOn = getData(changeLogs, DETAIL_TYPE.NUM_STUDENT_ON);
  const totalStudentOff = getData(changeLogs, DETAIL_TYPE.NUM_STUDENT_OFF);
  const scheduleLogId = getData(changeLogs, DETAIL_TYPE.SCHEDULE_LOG_ID);
  const turn = getData(changeLogs, DETAIL_TYPE.TURN);
  const shift = getData(changeLogs, DETAIL_TYPE.SHIFT);

  const date = getData(changeLogs, DETAIL_TYPE.DATE);
  const dateToDisplay = parseDate(date, intl);

  const [loadDataPopup, { loading, error, data: dataPopup }] = useLazyQuery(
    GET_DATA_NUM_STUDENT_ABNORMAL_POPUP,
    { notifyOnNetworkStatusChange: true }
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    loadDataPopup({
      variables: {
        filter: { scheduleLogId: scheduleLogId },
      },
    });
  }, [visible]);

  useEffect(() => {
    if (!loading && error) {
      message.error(intl.formatMessage({ id: "notification.message.error" }));
    }
  }, [loading, error, dataPopup, intl]);

  const renderTitle = (carNum, time, turn, shift) => {
    const getTurnShiftMessageId = (turn, shift) => {
      const turnUC = turn.toUpperCase();
      const shiftUC = shift.toUpperCase();

      if (turnUC === TURN_AWAY && shiftUC === TIME_SHIFT_MORNING) {
        return <FormattedMessage id="notification.modal.title.go.morning" />;
      }
      if (turnUC === TURN_BACK && shiftUC === TIME_SHIFT_MORNING) {
        return <FormattedMessage id="notification.modal.title.back.morning" />;
      }
      if (turnUC === TURN_AWAY && shiftUC === TIME_SHIFT_AFTERNOON) {
        return <FormattedMessage id="notification.modal.title.go.afternoon" />;
      }
      if (turnUC === TURN_BACK && shiftUC === TIME_SHIFT_AFTERNOON) {
        return (
          <FormattedMessage id="notification.modal.title.back.afternoon" />
        );
      }
      return "...";
    };

    return (
      <>
        <FormattedMessage id="notification.modal.title.pickup" />
        {carNum} | {time} |{" "}
        <span className="caution-num-of-student-modal__title-trip">
          {getTurnShiftMessageId(turn, shift)}
        </span>
      </>
    );
  };

  const renderAttendance = (type = "on", num = 0) => {
    return (
      <div className="attendance-box">
        <div className="attendance-box__num">{num}</div>
        <div className="attendance-box__student">
          <FormattedMessage id={`notification.modal.attendance.${type}`} />
        </div>
      </div>
    );
  };

  const renderStaffInfo = (type = "", text = "", phone = "") => {
    return (
      <Row justify="space-between" className="attendance__staff-info">
        <Col className="staff-info__type">
          <FormattedMessage id={`notification.modal.attendance.${type}`} />
        </Col>
        <Col>
          <div>{text}</div>
          <div>{phone}</div>
        </Col>
      </Row>
    );
  };

  return (
    <ModalComponent
      className="caution-num-of-student-modal"
      visible={visible}
      onClose={onClose}
      title={renderTitle(licensePlate, dateToDisplay, turn, shift)}
    >
      <LeftBlock className="caution-num-of-student-modal__attendance">
        {renderStaffInfo("car", licensePlate)}
        {renderStaffInfo("driver", driverName, driverPhone)}
        {renderStaffInfo("nanny", nannyName, nannyPhone)}
        <Space className="attendance-box__wrapper" size={13}>
          {renderAttendance("on", totalStudentOn)}
          {renderAttendance("off", totalStudentOff)}
        </Space>
      </LeftBlock>
      <RightBlock className="caution-num-of-student-modal__right-block">
        <AttendanceTable data={dataPopup?.studentsInVehicleHasAbnormal || []} />
      </RightBlock>
    </ModalComponent>
  );
};

export default CautionNumOfStudentModal;
