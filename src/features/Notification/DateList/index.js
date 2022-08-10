import React from "react";
import { useIntl } from "react-intl";
import moment from "moment";
import "./index.scss";

import DateItem from "./DateItem";

import { findLastIndex } from "lodash";

const DateList = (props) => {
  const { dataList, currentDateOnScroll, listDateOnScrollRef, listDateRef } =
    props;
  const intl = useIntl();

  const oldestDateInDataListIndex = findLastIndex(
    dataList,
    (data) => data.node.isShowDate
  );

  const oldestDateInDataList =
    dataList[oldestDateInDataListIndex]?.node?.createdAt || "";

  const getDateList = () => {
    const dateList = [];
    const today = moment();
    const oldestDate = moment(oldestDateInDataList);

    const duration = moment.duration(today.diff(oldestDate));
    const daysDiff = Math.round(duration.asDays());
    const displayLimit = daysDiff > 10 ? daysDiff : 10;

    // Plus 5 days as offset for safe scrolling
    for (let i = 0; i < displayLimit + 5; i++) {
      dateList.push(
        moment(today.startOf("day"))
          .subtract(i, "days")
          .format(intl.formatMessage({ id: "notification.date.format" }))
      );
    }
    return dateList;
  };

  return (
    <div className="date-list">
      {getDateList().map((date) => (
        <DateItem
          key={date}
          date={date}
          currentDateOnScroll={currentDateOnScroll}
          listDateRef={listDateRef}
          listDateOnScrollRef={listDateOnScrollRef}
        />
      ))}
    </div>
  );
};

export default DateList;
