import React, { useCallback, useState } from "react";
import { Table, Empty } from "antd";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { convertNameGrade } from "../../../utils/text";
import PageHeader from "../../../components/Layout/PageHeader";
import FilterBar from "../FilterBar";
import { columns } from "./columns";
import Export from "./Export";
import { INIT_DATA_FILTER, TIME_TYPE, SORT_OPTION } from "../constant";
import { LOAD_ATTENDANCE_OF_CLASSROOM } from "../gql";

const StatisticClass = () => {
  const params = useParams();
  const [paramsStatistic, setParamsStatistic] = useState(INIT_DATA_FILTER);
  const orderBy = SORT_OPTION[params.type];

  const getVariablesAttendaceOfClassroom = () => {
    const variables = { ...paramsStatistic };
    if (variables?.timeType === TIME_TYPE.BY_MONTH) {
      delete variables.dataBySemester;
    } else {
      delete variables.dataByMonth;
    }
    delete variables.timeTypeForView;
    return variables;
  };

  const { loading, data: attendaceOfClassroom } = useQuery(
    LOAD_ATTENDANCE_OF_CLASSROOM,
    {
      variables: {
        filter: getVariablesAttendaceOfClassroom(),
        orderBy: [orderBy],
      },
    }
  );

  const convertToDataTable = () => {
    const dataSource = [];
    attendaceOfClassroom?.attendanceOfClassroom?.forEach((item) => {
      dataSource.push({
        key: item?.classroom?.id,
        className: item?.classroom?.name,
        group:
          convertNameGrade(item?.classroom?.grade?.name) ||
          item?.classroom?.grade?.name,
        teacherName: item?.classroom?.teacher?.name,
        countLate: item?.statistic?.lateInAllDay,
        countOff: item?.statistic?.absentInAllDay,
      });
    });
    return dataSource;
  };

  const columnsTable = () => {
    return [
      ...columns,
      {
        title: <FormattedMessage id="attendanceStatistics.column.list" />,
        align: "center",
        className: "button-download",
        render: (value) => (
          <Export
            classroomId={value.key}
            filter={getVariablesAttendaceOfClassroom()}
          />
        ),
      },
    ];
  };

  const getTitleByClassType = () => {
    let title = "";
    switch (params.type) {
      case "minAbsent":
        title = (
          <FormattedMessage id="attendanceStatistics.title.statistic.classMinAbsent" />
        );
        break;
      case "maxAbsent":
        title = (
          <FormattedMessage id="attendanceStatistics.title.statistic.classMaxAbsent" />
        );
        break;
      case "minLate":
        title = (
          <FormattedMessage id="attendanceStatistics.title.statistic.classMinLate" />
        );
        break;

      default:
        title = (
          <FormattedMessage id="attendanceStatistics.title.statistic.classMaxLate" />
        );
        break;
    }
    return title;
  };

  return (
    <div className="attendance-statistics">
      <PageHeader
        title={<FormattedMessage id="sidebar.item.attendanceStatistics" />}
      />
      <div className="group-content">
        <FilterBar
          paramsStatistic={paramsStatistic}
          setParamsStatistic={setParamsStatistic}
        />
      </div>
      <div className="group-content">
        <div className="statistic-class-detail-wrapper">
          <div className="top">
            <p className="title">{getTitleByClassType()}</p>
          </div>
          <Table
            scroll={{
              y: "calc(100vh - 292px)",
            }}
            className="table-class"
            columns={columnsTable()}
            dataSource={convertToDataTable()}
            bordered
            pagination={false}
            loading={loading}
            locale={{
              emptyText: loading ? (
                <FormattedMessage id="table.loading-text" />
              ) : (
                <Empty description={<FormattedMessage id="empty.text" />} />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticClass;
