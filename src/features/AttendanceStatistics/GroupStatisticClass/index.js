/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { FormattedMessage } from "react-intl";
import { useQuery } from "@apollo/client";
import { TIME_TYPE } from "../constant";
import { LOAD_ATTENDANCE_OF_CLASSROOM } from "../gql";
import StatisticClasses from "./StatisticClasses";

import "../styles.scss";

const GroupStatisticClass = ({ paramsStatistic }) => {
  const getVariablesAttendanceOfTimeByStudent = () => {
    const variables = { ...paramsStatistic };
    if (variables?.timeType === TIME_TYPE.BY_MONTH) {
      delete variables.dataBySemester;
    } else {
      delete variables.dataByMonth;
    }
    delete variables.timeTypeForView;
    if (!variables.campusId || !variables.schoolYearId) {
      return null;
    }
    if (variables.timeType === TIME_TYPE.BY_MONTH && !variables.dataByMonth) {
      return null;
    }

    return variables;
  };

  const { loading: loadingMaxAbsent, data: attendaceOfClassroomMaxAbsent } =
    useQuery(LOAD_ATTENDANCE_OF_CLASSROOM, {
      variables: {
        filter: getVariablesAttendanceOfTimeByStudent(),
        orderBy: [
          {
            field: "TOTAL_ABSENT",
            order: "DESC",
          },
        ],
        first: 3,
      },
    });

  const { loading: loadingMinAbsent, data: attendaceOfClassroomMinAbsent } =
    useQuery(LOAD_ATTENDANCE_OF_CLASSROOM, {
      variables: {
        filter: getVariablesAttendanceOfTimeByStudent(),
        orderBy: [
          {
            field: "TOTAL_ABSENT",
            order: "ASC",
          },
        ],
        first: 3,
      },
    });

  const { loading: loadingMaxLate, data: attendaceOfClassroomMaxLate } =
    useQuery(LOAD_ATTENDANCE_OF_CLASSROOM, {
      variables: {
        filter: getVariablesAttendanceOfTimeByStudent(),
        orderBy: [
          {
            field: "TOTAL_LATE",
            order: "DESC",
          },
        ],
        first: 3,
      },
    });

  const { loading: loadingMinLate, data: attendaceOfClassroomMinLate } =
    useQuery(LOAD_ATTENDANCE_OF_CLASSROOM, {
      variables: {
        filter: getVariablesAttendanceOfTimeByStudent(),
        orderBy: [
          {
            field: "TOTAL_LATE",
            order: "ASC",
          },
        ],
        first: 3,
      },
    });

  return (
    <div className="group-content">
      <div className="statistic-class-wrapper">
        <p className="title">
          <FormattedMessage id="attendanceStatistics.title.statistic" />
        </p>
        <div className="flex-wrap">
          <div className="parting">
            <StatisticClasses
              warning
              idStatistic="maxAbsent"
              loading={loadingMaxAbsent}
              data={attendaceOfClassroomMaxAbsent?.attendanceOfClassroom}
            />
            <StatisticClasses
              warning
              idStatistic="maxLate"
              loading={loadingMaxLate}
              data={attendaceOfClassroomMaxLate?.attendanceOfClassroom}
            />
          </div>
          <div className="parting">
            <StatisticClasses
              idStatistic="minAbsent"
              loading={loadingMinAbsent}
              data={attendaceOfClassroomMinAbsent?.attendanceOfClassroom}
            />
            <StatisticClasses
              idStatistic="minLate"
              loading={loadingMinLate}
              data={attendaceOfClassroomMinLate?.attendanceOfClassroom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupStatisticClass;
