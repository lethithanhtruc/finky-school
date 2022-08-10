import React from "react";
import moment from "moment";
import AvataReview from "./AvataReview";
import { FormattedMessage } from "react-intl";

import {
  CONDITION_DAY_OFF,
  CONDITION_SHOW_BACKGROUND,
  EMPTY_VALUE,
  FORMAT_TIME_API,
  FORMAT_TIME_FE,
} from "./constant";
import avatarDefault from "../../../svg/user-default.png";

// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
const renderContent = (value, row, index) => {
  const avatarSrc = value?.avatar || avatarDefault;
  let avatar = <AvataReview src={avatarSrc} />;

  if (value?.time === CONDITION_DAY_OFF) {
    avatar = (
      <div className="icon-play-day">
        <FormattedMessage id="historyAttendanceAndTransport.legend.play" />
      </div>
    );
  }

  let newValue = value?.time
    ? moment(value?.time, FORMAT_TIME_API).format(FORMAT_TIME_FE)
    : EMPTY_VALUE;
  if (value?.time === CONDITION_SHOW_BACKGROUND) {
    newValue = EMPTY_VALUE;
  }
  if (value?.time === CONDITION_DAY_OFF) {
    newValue = (
      <FormattedMessage id="historyAttendanceAndTransport.value.play" />
    );
  }

  let customValue = (
    <div className="wrapper-time-transport">
      {avatar} <span className="time">{newValue}</span>
    </div>
  );

  if (value?.isNotStartedYet) {
    customValue = "";
  }

  let classCol = value?.time === CONDITION_SHOW_BACKGROUND ? "noRegist" : "";
  if (value?.time === CONDITION_DAY_OFF) {
    classCol += " play-day";
  }
  if (value?.isLate) {
    classCol += " lated";
  }

  const obj = {
    children: customValue,
    props: {
      className: classCol,
    },
  };
  return obj;
};

export const columns = [
  {
    title: "",
    className: "empty",
    children: [
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.date" />
        ),
        width: 80,
        dataIndex: "date",
        key: "date",
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (
            index === 0 ||
            index === 2 ||
            index === 4 ||
            index === 6 ||
            index === 8 ||
            index === 10 ||
            index === 12
          ) {
            obj.props.rowSpan = 2;
          }
          if (
            index === 1 ||
            index === 3 ||
            index === 5 ||
            index === 7 ||
            index === 9 ||
            index === 11 ||
            index === 13
          ) {
            obj.props.rowSpan = 0;
          }

          return obj;
        },
      },
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.session" />
        ),
        dataIndex: "shift",
        key: "shift",
        width: 100,
      },
    ],
  },
  {
    title: <FormattedMessage id="historyAttendanceAndTransport.column.go" />,
    className: "goToShool",
    children: [
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getInCar" />
        ),
        dataIndex: "getInCarGo",
        key: "getInCarGo",
        render: renderContent,
        className: "goToShool child",
      },
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getOffCar" />
        ),
        dataIndex: "getOffCarGo",
        key: "getOffCarGo",
        render: renderContent,
        className: "goToShool child",
      },
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getInSchool" />
        ),
        dataIndex: "getInSchoolGo",
        key: "getInSchoolGo",
        render: renderContent,
        className: "goToShool child",
      },
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getInClass" />
        ),
        dataIndex: "getInClassGo",
        key: "getInClassGo",
        render: renderContent,
        className: "goToShool child",
      },
    ],
  },
  {
    title: <FormattedMessage id="historyAttendanceAndTransport.column.back" />,
    className: "backHome",
    children: [
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getOffClass" />
        ),
        dataIndex: "getOffClassBack",
        key: "getOffClassBack",
        render: renderContent,
        className: "backHome child",
      },
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getOffSchool" />
        ),
        dataIndex: "getOffSchoolBack",
        key: "getOffSchoolBack",
        render: renderContent,
        className: "backHome child",
      },
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getInCar" />
        ),
        dataIndex: "getInCarBack",
        key: "getInCarBack",
        render: renderContent,
        className: "backHome child",
      },
      {
        title: (
          <FormattedMessage id="historyAttendanceAndTransport.column.getOffCar" />
        ),
        dataIndex: "getOffCarBack",
        key: "getOffCarBack",
        render: renderContent,
        className: "backHome child",
      },
    ],
  },
];
