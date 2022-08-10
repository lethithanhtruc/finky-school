/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";

import PageHeader from "../../../components/Layout/PageHeader";

import GroupStatisticClass from "../GroupStatisticClass";
import FilterBar from "../FilterBar";

import { TIME_TYPE, INIT_DATA_FILTER, INIT_DATA_CHART } from "../constant";
import { LOAD_ATTENDANCE_OF_TIME } from "../gql";

import "../styles.scss";

const ChartPage = () => {
  const [paramsStatistic, setParamsStatistic] = useState(INIT_DATA_FILTER);
  const lang = localStorage.getItem("language");
  const titleWeek = lang === "vi" ? "Tuần" : "Week";
  const titleMonth = lang === "vi" ? "Tháng" : "Month";

  const getVariablesAttendaceOfTime = () => {
    const variables = paramsStatistic;
    if (variables?.timeType === TIME_TYPE.BY_MONTH) {
      delete variables.dataBySemester;
    } else {
      delete variables.dataByMonth;
    }
    if (!variables.campusId || !variables.schoolYearId) {
      return null;
    }
    if (variables.timeType === TIME_TYPE.BY_MONTH && !variables.dataByMonth) {
      return null;
    }
    return variables;
  };

  const { loading: loadingDataAttendaceOfTime, data: dataAttendaceOfTime } =
    useQuery(LOAD_ATTENDANCE_OF_TIME, {
      variables: { filter: getVariablesAttendaceOfTime() },
    });

  const convertToDataChart = () => {
    const dataLineChart = { ...INIT_DATA_CHART };
    if (!loadingDataAttendaceOfTime && dataAttendaceOfTime) {
      const attendanceOfTimeByStudent =
        dataAttendaceOfTime?.attendanceOfTimeByStudent;

      if (attendanceOfTimeByStudent) {
        dataLineChart.labels = attendanceOfTimeByStudent?.chart?.labels;
        dataLineChart.datasets[0].data = [
          ...attendanceOfTimeByStudent?.chart?.values?.absent,
        ];
        dataLineChart.datasets[1].data = [
          ...attendanceOfTimeByStudent?.chart?.values?.late,
        ];
      }
    }
    return dataLineChart;
  };

  return (
    <div className="attendance-statistics">
      <PageHeader
        title={<FormattedMessage id="sidebar.item.attendanceStatistics" />}
      />
      <div className="group-content">
        <FilterBar
          showTimeTypeForView
          paramsStatistic={paramsStatistic}
          setParamsStatistic={setParamsStatistic}
        />
      </div>

      <div className="group-content">
        <div className="chart-wrapper">
          <div className="top-chart">
            <p className="title">
              <FormattedMessage id="attendanceStatistics.title.chart" />
            </p>
            <div className="legend-chart">
              <div className="legend absent spacing">
                <span></span>
                <FormattedMessage id="attendanceStatistics.chart.absent" />
              </div>
              <div className="legend late">
                <span></span>
                <FormattedMessage id="attendanceStatistics.chart.tardied" />
              </div>
            </div>
          </div>
          <div className="canvas-container">
            {loadingDataAttendaceOfTime && (
              <Spin indicator={<LoadingOutlined />} />
            )}
            <Line
              data={convertToDataChart()}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      title: function (tooltipItem, data) {
                        const title =
                          paramsStatistic?.timeTypeForView === TIME_TYPE.BY_WEEK
                            ? titleWeek
                            : titleMonth;
                        return `${title}: ${tooltipItem[0].label}`;
                      },
                    },
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <GroupStatisticClass paramsStatistic={paramsStatistic} />
    </div>
  );
};

export default ChartPage;
