import React from "react";
import { Spin } from "antd";
import { FormattedMessage } from "react-intl";
import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { STATISTIC_CLASSES } from "../../constant";

import "../../styles.scss";

const StatisticClasses = (props) => {
  const { warning, data, idStatistic, loading } = props;
  const history = useHistory();

  const convertToArrayClass = (data) => {
    const listClass = [];
    data?.forEach((item) => {
      listClass.push(item.classroom.name);
    });
    return listClass.join(" | ");
  };

  const onShowDetail = (value) => {
    history.push(`/attendance-statistics/${value}`);
  };

  return (
    <div className="card-statistic">
      <div className="left">
        <p className="desc">{STATISTIC_CLASSES[idStatistic]}</p>
        <p className={`value ${warning ? "warning" : ""}`}>
          {loading ? (
            <Spin indicator={<LoadingOutlined />} />
          ) : (
            convertToArrayClass(data)
          )}
        </p>
      </div>
      <div className="right" onClick={() => onShowDetail(idStatistic)}>
        <p className="viewmore">
          <FormattedMessage id="attendanceStatistics.title.statistic.viewmore" />
        </p>
        <ArrowRightOutlined />
      </div>
    </div>
  );
};

export default StatisticClasses;
