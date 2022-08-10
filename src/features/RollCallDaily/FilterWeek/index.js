/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Tabs, Radio } from "antd";
import { FormattedMessage } from "react-intl";
import { convertNameGrade } from "../../../utils/text";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import "../styles.scss";

const { TabPane } = Tabs;
const { Group, Button } = Radio;

const FilterWeek = (props) => {
  const {
    setParamsDefault,
    listButtonGroup,
    onChangeGroupButton,
    isAll,
    gradeIdActive,
  } = props;
  const [isCurrentWeek, setIsCurrentWeek] = useState(true);
  const [activeKeyOfDate, setActiveKeyOfDate] = useState("0");
  const [daysOfWeek, setDaysOfWeek] = useState(null);

  const getMonday = (d) => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const getPeriod = (key, week) => {
    let newParams = {};
    if (key === "0") {
      newParams.from = week[0].YYYYMMDD;
      newParams.to = week[6].YYYYMMDD;
    } else {
      newParams.from = week[key - 1].YYYYMMDD;
      newParams.to = week[key - 1].YYYYMMDD;
    }
    return newParams;
  };

  const onChangeDayOfWeek = (key) => {
    setActiveKeyOfDate(key);
    setParamsDefault((prevValue) => {
      return {
        ...prevValue,
        ...getPeriod(key, daysOfWeek),
      };
    });
  };

  const getDaysOfWeek = (current) => {
    const week = [];
    const today = `${new Date().getDate()}/${new Date().getMonth() + 1}`;

    current.setDate(current.getDate() - current.getDay() + 1); // Starting Monday not Sunday

    for (var i = 0; i < 7; i++) {
      const newDateDDMM = `${current.getDate()}/${current.getMonth() + 1}`;
      const newDateYYYYMMDD = `${current.getFullYear()}-${
        current.getMonth() + 1
      }-${current.getDate()}`;
      week.push({
        key: (i + 1).toString(),
        DDMM: newDateDDMM,
        YYYYMMDD: newDateYYYYMMDD,
        isFuture: current > new Date(),
      });
      current.setDate(current.getDate() + 1);
    }

    const inforToday = week.find((item) => item.DDMM === today);
    const keyOfTab = inforToday ? inforToday.key : "0";
    setActiveKeyOfDate(keyOfTab);
    setParamsDefault((prevValue) => {
      return {
        ...prevValue,
        ...getPeriod(keyOfTab, week),
      };
    });
    return week;
  };

  const goToTheWeek = (isLastweek) => {
    const currentDate = new Date();
    if (isLastweek) currentDate.setDate(new Date().getDate() - 7);
    setDaysOfWeek(getDaysOfWeek(getMonday(currentDate)));
    setIsCurrentWeek(!isLastweek);
    setParamsDefault((prevValue) => {
      return {
        ...prevValue,
      };
    });
  };

  useEffect(() => {
    setDaysOfWeek(getDaysOfWeek(getMonday(new Date())));
  }, []);

  return (
    <div className="filter-week-wrapper">
      <div className="days-of-week-wrapper">
        <div className="select-week">
          <span>
            <FormattedMessage
              id={
                isCurrentWeek
                  ? "rollCallDaily.thisWeek"
                  : "rollCallDaily.lastWeek"
              }
            />
          </span>
          <div className="action-wrapper">
            <LeftOutlined
              className={`${isCurrentWeek && "active"}`}
              onClick={() => goToTheWeek(true)}
            />
            <RightOutlined
              className={`${!isCurrentWeek && "active"}`}
              onClick={() => goToTheWeek(false)}
            />
          </div>
        </div>
        <div className="days-of-week">
          {/* Key of a tab must be a string */}
          <Tabs activeKey={activeKeyOfDate} onChange={onChangeDayOfWeek}>
            <TabPane
              tab={<FormattedMessage id="rollCallDaily.all" />}
              key={"0"}
            />
            {daysOfWeek?.map((item) => {
              return (
                <TabPane
                  tab={item.DDMM}
                  key={item.key}
                  disabled={item.isFuture}
                />
              );
            })}
          </Tabs>
        </div>
      </div>
      <div className="group-of-class-wrapper">
        <Group
          onChange={onChangeGroupButton}
          defaultValue={gradeIdActive}
          value={gradeIdActive}
        >
          {isAll && (
            <Button value={"0"}>
              <FormattedMessage id="rollCallDaily.all" />
            </Button>
          )}
          {listButtonGroup?.map((item) => {
            return (
              <Button value={item.id} key={item.id}>
                {convertNameGrade(item.name) || item.name}
              </Button>
            );
          })}
        </Group>
      </div>
    </div>
  );
};

export default FilterWeek;
