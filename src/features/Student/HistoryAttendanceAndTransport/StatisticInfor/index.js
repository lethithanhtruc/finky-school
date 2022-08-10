import React from "react";
import { FormattedMessage } from "react-intl";

import { ReactComponent as IconStudent } from "../../../../svg/icon-student.svg";
import { ReactComponent as IconTimeTable } from "../../../../svg/icon-time-table.svg";
import { Link } from "react-router-dom";

import "../styles.scss";

const StatisticInfor = ({ infoAttendance }) => {
  return (
    <div className="statistics-info-wrapper">
      <div className="information">
        <IconStudent />
        <div className="main-info">
          <Link to={`/edit-student/${infoAttendance?.id}`}>
            {infoAttendance?.student?.name}
          </Link>
        </div>
      </div>
      <div className="information statistics">
        <IconTimeTable />
        <div className="statistic">
          <FormattedMessage id="historyAttendanceAndTransport.label.total.inClass" />{" "}
          : {infoAttendance?.totalShift}
        </div>
        <div className="statistic">
          <FormattedMessage id="historyAttendanceAndTransport.label.total.absent" />{" "}
          : {infoAttendance?.totalAbsent}
        </div>
        <div className="statistic">
          <FormattedMessage id="historyAttendanceAndTransport.label.total.late" />{" "}
          : {infoAttendance?.totalLate}
        </div>
      </div>
    </div>
  );
};

export default StatisticInfor;
