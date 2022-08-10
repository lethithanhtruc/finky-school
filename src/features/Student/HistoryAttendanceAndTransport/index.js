import React, { useState } from "react";
import { Table, Empty } from "antd";
import { useQuery } from "@apollo/client";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";

import FilterBar from "./FilterBar";
import StatisticInfor from "./StatisticInfor";
import PageHeader from "../../../components/Layout/PageHeader";
import PaginationTable from "../../../components/Common/PaginationTable";
import { ReactComponent as IconArrowUp } from "../../../svg/icon-caret-up.svg";
import { ReactComponent as IconArrowDown } from "../../../svg/icon-caret-down.svg";

import { columns } from "./columns";
import {
  FORMAT_DATE_API,
  INIT_DATA_FILTER,
  CONDITION_SHOW_BACKGROUND,
  OPTION_ALL,
  CONDITION_DAY_OFF,
  FORMAT_DATE_FE,
  SORT_DESC,
  SORT_ASC,
} from "./constant";
import {
  LOAD_TRACKING_HISTORY,
  LOAD_TOTAL_STATISTIC_STUDENT,
  LOAD_TRACKING_HISTORY_EXPORT,
} from "./gql";
import _uniqueId from "lodash/uniqueId";
import moment from "moment";

const HistoryAttendanceAndTransport = () => {
  const params = useParams();
  const [paramsTracking, setParamsTracking] = useState(INIT_DATA_FILTER);

  const handleChangeSchoolYear = (timeType) => {
    setParamsTracking((preState) => {
      return {
        ...preState,
        filter: {
          from: timeType.range[0].format(FORMAT_DATE_API),
          to: timeType.range[1].format(FORMAT_DATE_API),
          dateType: timeType.dateType,
        },
      };
    });
  };

  const getVariablesTrackingHistory = () => {
    const variables = { ...paramsTracking };
    if (variables?.filter?.dateType === OPTION_ALL) {
      delete variables?.filter?.dateType;
    }
    variables.filter.studentId = params?.studentId;
    return variables;
  };

  const getVariablesTotalAttendance = () => {
    const variables = {
      studentId: params?.studentId,
      from: paramsTracking?.filter?.from,
      to: paramsTracking?.filter?.to,
    };
    return variables;
  };

  const { loading, data } = useQuery(LOAD_TRACKING_HISTORY, {
    variables: getVariablesTrackingHistory("DESC"),
  });

  const { loading: loadingExport, data: dataExport } = useQuery(
    LOAD_TRACKING_HISTORY_EXPORT,
    {
      variables: getVariablesTrackingHistory("DESC"),
    }
  );

  const { data: infoAttendance } = useQuery(LOAD_TOTAL_STATISTIC_STUDENT, {
    variables: { filter: getVariablesTotalAttendance() },
  });

  const convertDataOnOffMorning = (item, key) => {
    let value = "";
    if (!item.statistic) {
      value = {
        ...(item.statistic && item.statistic[key]),
        time: CONDITION_DAY_OFF,
      };
    } else {
      if (
        !item.statistic.getOnOfTurnAwayInTheMorning &&
        !item.statistic.getOffOfTurnAwayInTheMorning &&
        !item.statistic.gateOfTurnAwayInTheMorning &&
        !item.statistic.classroomOfTurnAwayInTheMorning &&
        !item.statistic.classroomOfTurnBackInTheMorning &&
        !item.statistic.gateOfTurnBackInTheMorning &&
        !item.statistic.getOnOfTurnBackInTheMorning &&
        !item.statistic.getOffOfTurnBackInTheMorning
      ) {
        value = {
          ...(item.statistic[key] && item.statistic[key]),
          time: CONDITION_SHOW_BACKGROUND,
        };
      } else {
        if (item.statistic[key]) {
          value = item.statistic[key];
        }
      }
    }

    return value;
  };

  const convertDataOnOffAfternoon = (item, key) => {
    let value = "";
    if (!item.statistic) {
      value = {
        ...(item.statistic && item.statistic[key]),
        time: CONDITION_DAY_OFF,
      };
    } else {
      if (
        !item.statistic.getOnOfTurnAwayInTheAfternoon &&
        !item.statistic.getOffOfTurnAwayInTheAfternoon &&
        !item.statistic.gateOfTurnAwayInTheAfternoon &&
        !item.statistic.classroomOfTurnAwayInTheAfternoon &&
        !item.statistic.classroomOfTurnBackInTheAfternoon &&
        !item.statistic.gateOfTurnBackInTheAfternoon &&
        !item.statistic.getOnOfTurnBackInTheAfternoon &&
        !item.statistic.getOffOfTurnBackInTheAfternoon
      ) {
        value = {
          ...(item.statistic[key] && item.statistic[key]),
          time: CONDITION_SHOW_BACKGROUND,
        };
      } else {
        if (item.statistic[key]) {
          value = item.statistic[key];
        }
      }
    }

    return value;
  };

  const convertToDataTable = () => {
    const dataSource = [];
    data?.attendanceOfDateByStudent?.data?.forEach((item, index) => {
      dataSource.push({
        key: _uniqueId("am"),
        date: moment(item.date).format(FORMAT_DATE_FE),
        shift: (
          <FormattedMessage id="historyAttendanceAndTransport.column.morning" />
        ),
        getInCarGo: convertDataOnOffMorning(
          item,
          "getOnOfTurnAwayInTheMorning"
        ),
        getOffCarGo: convertDataOnOffMorning(
          item,
          "getOffOfTurnAwayInTheMorning"
        ),
        getInSchoolGo: convertDataOnOffMorning(
          item,
          "gateOfTurnAwayInTheMorning"
        ),
        getInClassGo: convertDataOnOffMorning(
          item,
          "classroomOfTurnAwayInTheMorning"
        ),
        getOffClassBack: convertDataOnOffMorning(
          item,
          "classroomOfTurnBackInTheMorning"
        ),
        getOffSchoolBack: convertDataOnOffMorning(
          item,
          "gateOfTurnBackInTheMorning"
        ),
        getInCarBack: convertDataOnOffMorning(
          item,
          "getOnOfTurnBackInTheMorning"
        ),
        getOffCarBack: convertDataOnOffMorning(
          item,
          "getOffOfTurnBackInTheMorning"
        ),
      });
      dataSource.push({
        key: _uniqueId("pm"),
        date: item.date,
        shift: (
          <FormattedMessage id="historyAttendanceAndTransport.column.afternoon" />
        ),
        getInCarGo: convertDataOnOffAfternoon(
          item,
          "getOnOfTurnAwayInTheAfternoon"
        ),
        getOffCarGo: convertDataOnOffAfternoon(
          item,
          "getOffOfTurnAwayInTheAfternoon"
        ),
        getInSchoolGo: convertDataOnOffAfternoon(
          item,
          "gateOfTurnAwayInTheAfternoon"
        ),
        getInClassGo: convertDataOnOffAfternoon(
          item,
          "classroomOfTurnAwayInTheAfternoon"
        ),
        getOffClassBack: convertDataOnOffAfternoon(
          item,
          "classroomOfTurnBackInTheAfternoon"
        ),
        getOffSchoolBack: convertDataOnOffAfternoon(
          item,
          "gateOfTurnBackInTheAfternoon"
        ),
        getInCarBack: convertDataOnOffAfternoon(
          item,
          "getOnOfTurnBackInTheAfternoon"
        ),
        getOffCarBack: convertDataOnOffAfternoon(
          item,
          "getOffOfTurnBackInTheAfternoon"
        ),
      });
    });
    return dataSource;
  };

  const handleSortDataTable = (sortOrder) => {
    const orderBy = !sortOrder ? [] : [{ field: "DATE", order: sortOrder }];
    setParamsTracking((preState) => {
      return {
        ...preState,
        orderBy,
      };
    });
  };

  const convertColumnsTable = () => {
    const newColumns = [...columns];
    newColumns[0]["children"][0].title = (
      <div className="column-sorting">
        <FormattedMessage id="historyAttendanceAndTransport.column.date" />
        <div className="action-sort">
          <IconArrowUp
            className={`arrow-up ${
              paramsTracking?.orderBy[0]?.order === SORT_DESC ? "active" : ""
            }`}
            onClick={() => handleSortDataTable(SORT_DESC)}
          />
          <IconArrowDown
            className={`${
              paramsTracking?.orderBy[0]?.order === SORT_ASC ? "active" : ""
            }`}
            onClick={() => handleSortDataTable(SORT_ASC)}
          />
        </div>
      </div>
    );
    return newColumns;
  };

  const handleChangePaging = (page) => {
    setParamsTracking((preState) => {
      return {
        ...preState,
        page,
      };
    });
  };

  const getInfoStudent = () => {
    const info = { ...infoAttendance?.attendanceOfTotalByStudent };
    info.id = params?.studentId;
    return info;
  };

  return (
    <div className="history-attendance-and-transport">
      <PageHeader
        title={<FormattedMessage id="historyAttendanceAndTransport.title" />}
      />
      <div className="group-content top-bar">
        <StatisticInfor infoAttendance={getInfoStudent()} />
        <FilterBar
          onChange={handleChangeSchoolYear}
          exportProps={{ loadingExport, dataExport }}
        />
      </div>
      <div className="group-content main-content">
        <div className="heading-table">
          <div className="legends">
            <div className="legend absent">
              <div className="block-color"></div>
              <div className="label">
                <FormattedMessage id="historyAttendanceAndTransport.legend.absent" />
              </div>
            </div>
            <div className="legend late">
              <div className="block-color"></div>
              <div className="label">
                <FormattedMessage id="historyAttendanceAndTransport.legend.late" />
              </div>
            </div>
            <div className="legend play">
              <div className="block-color">
                <FormattedMessage id="historyAttendanceAndTransport.legend.play" />
              </div>
              <div className="label">
                <FormattedMessage id="historyAttendanceAndTransport.legend.weekwend" />
              </div>
            </div>
          </div>

          <div className="paging">
            <PaginationTable
              total={data?.attendanceOfDateByStudent?.paginatorInfo?.total}
              onChange={handleChangePaging}
              pageSize={7}
            />
          </div>
        </div>
        <Table
          scroll={{
            y: "calc(100vh - 363px)",
          }}
          className="table-history"
          columns={convertColumnsTable()}
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
  );
};

export default HistoryAttendanceAndTransport;
