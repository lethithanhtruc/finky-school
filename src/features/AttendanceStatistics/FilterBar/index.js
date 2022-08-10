/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Form, Radio } from "antd";
import { useQuery } from "@apollo/client";
import { FormattedMessage } from "react-intl";
import moment from "moment";

import DropdownData from "./DropdownData";
import SelectSchoolYear from "./DropdownData/SelectSchoolYear";
import { INIT_DATA_FILTER, TIME_TYPE, MONTH_OPTION } from "../constant";
import FacilitiesSelect from "../../../components/Common/FacilitiesSelect";

import { LOAD_SCHOOLYEARS } from "../gql";

import "../styles.scss";

const { Item } = Form;
const { Group, Button } = Radio;

const FilterWeek = (props) => {
  const { showTimeTypeForView, paramsStatistic, setParamsStatistic } = props;
  const [form] = Form.useForm();
  const [optionsTime, setOptionsTime] = useState(INIT_DATA_FILTER);
  const [rangeOfYear, setRangeOfYear] = useState(null);

  const { loading: loadingSchoolYear, data: dataSchoolYear } =
    useQuery(LOAD_SCHOOLYEARS);

  const handlechangeCampus = (value) => {
    if (!paramsStatistic.campusId || paramsStatistic.campusId !== value) {
      setParamsStatistic((preState) => {
        return {
          ...preState,
          campusId: value,
        };
      });
    }
  };

  const handeChangeSchoolYear = (itemShoolYearSelected) => {
    if (itemShoolYearSelected) {
      if (
        !paramsStatistic.schoolYearId ||
        paramsStatistic.schoolYearId !== itemShoolYearSelected[0].id
      ) {
        setParamsStatistic((preState) => {
          return {
            ...preState,
            schoolYearId: itemShoolYearSelected[0].id,
          };
        });
      }

      setRangeOfYear((preState) => {
        return {
          ...preState,
          ...itemShoolYearSelected,
        };
      });
    }
  };

  const getMonthByRange = (startDate, endDate) => {
    var start = startDate.split("-");
    var end = endDate.split("-");
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
      var endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        var month = j + 1;
        var displayMonth = month < 10 ? "0" + month : month;
        const idMonth = moment([i, displayMonth, "01"].join("-")).format("M");
        dates.push(parseInt(idMonth));
      }
    }
    return dates;
  };

  const getMonthByShoolYear = (startDate, endDate) => {
    let listMonth = [];

    let newStartDate = startDate;
    let newEndDate = endDate;
    if (rangeOfYear) {
      if (!startDate) {
        newStartDate = moment(rangeOfYear[0]?.startAt).format("YYYY-MM-DD");
      }
      if (!endDate) {
        newEndDate = moment(rangeOfYear[0]?.endAt).format("YYYY-MM-DD");
      }
      const idsMonth = getMonthByRange(newStartDate, newEndDate);
      const newMonths = [];
      idsMonth.map((id) => {
        MONTH_OPTION.map((itemMonth) => {
          if (itemMonth.value === id) {
            newMonths.push(itemMonth);
          }
        });
      });
      listMonth = newMonths;
    }
    return listMonth;
  };

  const getDefaultSelectMonth = () => {
    if (!loadingSchoolYear && dataSchoolYear) {
      const toDay = moment(new Date()).format("YYYY-MM-DD");
      let defaultSelectMonth = parseInt(moment(toDay).format("M"));
      const schoolyearCurrent = dataSchoolYear.schoolyears.data.filter(
        (schoolyear) =>
          parseInt(schoolyear.endAt.substring(0, 4)) ===
          new Date().getFullYear()
      );

      const startDate = moment(schoolyearCurrent[0]?.startAt).format(
        "YYYY-MM-DD"
      );
      const endDate = moment(schoolyearCurrent[0]?.endAt).format("YYYY-MM-DD");
      const idsMonth = getMonthByRange(startDate, endDate);

      const isIncludeCurrentMonth = idsMonth.includes(defaultSelectMonth);

      if (!isIncludeCurrentMonth) {
        defaultSelectMonth = idsMonth[idsMonth.length - 1];
      }
      return defaultSelectMonth;
    }
  };

  const handleAfterChageTimeType = (optionsTime) => {
    let timeTypeForView =
      optionsTime?.timeType === TIME_TYPE.BY_MONTH
        ? TIME_TYPE.BY_WEEK
        : TIME_TYPE.BY_MONTH;
    optionsTime.timeTypeForView = timeTypeForView;
    form.setFieldsValue({ timeTypeForView });

    setParamsStatistic((preState) => {
      return {
        ...preState,
        ...optionsTime,
      };
    });
  };

  const handeChangeTimeTypeForView = (e) => {
    console.log(45);
    if (paramsStatistic?.timeTypeForView !== e.target.value) {
      setParamsStatistic((preState) => {
        return {
          ...preState,
          timeTypeForView: e.target.value,
        };
      });
    }
  };

  const getSemesterDefault = () => {
    if (dataSchoolYear) {
      const schoolyearCurrent = dataSchoolYear.schoolyears.data.filter(
        (schoolyear) =>
          parseInt(schoolyear.endAt.substring(0, 4)) ===
          new Date().getFullYear()
      );
      setParamsStatistic((preState) => {
        return {
          ...preState,
          dataBySemester: schoolyearCurrent[0].mostRecentSemester,
        };
      });
      setOptionsTime((preState) => {
        return {
          ...preState,
          dataBySemester: schoolyearCurrent[0].mostRecentSemester,
        };
      });
      return schoolyearCurrent[0].mostRecentSemester;
    }
  };

  useEffect(() => {
    setParamsStatistic((preState) => {
      return {
        ...preState,
        dataByMonth: getDefaultSelectMonth(),
      };
    });
  }, [getDefaultSelectMonth()]);

  useEffect(() => {
    getSemesterDefault();
  }, [dataSchoolYear]);

  return (
    <div className="filter-bar-wrapper">
      <Form form={form} name="search-form" layout="inline">
        <div className="left">
          <Item
            label={<FormattedMessage id="attendanceStatistics.label.branch" />}
            name="branch"
          >
            <FacilitiesSelect
              className="select-campus"
              onChange={handlechangeCampus}
              defaultMainCampus
              allLabel={false}
            />
          </Item>
          <Item
            label={<FormattedMessage id="attendanceStatistics.label.year" />}
            name="schoolYear"
          >
            <SelectSchoolYear
              className="school-year"
              onChange={handeChangeSchoolYear}
              loading={loadingSchoolYear}
              data={dataSchoolYear}
            />
          </Item>
          <Item
            label={<FormattedMessage id="attendanceStatistics.label.data" />}
            name="month"
          >
            <DropdownData
              paramsStatistic={paramsStatistic}
              onAfterChageTimeType={handleAfterChageTimeType}
              optionsTime={optionsTime}
              setOptionsTime={setOptionsTime}
              listMonth={getMonthByShoolYear()}
              setParamsStatistic={setParamsStatistic}
              defaultSelectMonth={getDefaultSelectMonth()}
            />
          </Item>
        </div>
        {showTimeTypeForView && (
          <div className="right">
            <Item
              className="filter"
              label={
                <FormattedMessage id="attendanceStatistics.label.filter" />
              }
              name="timeTypeForView"
            >
              <Group
                size="large"
                className="buttons-type-wrapper"
                defaultValue={paramsStatistic?.timeTypeForView}
                onChange={handeChangeTimeTypeForView}
              >
                <Button value={TIME_TYPE.BY_WEEK}>
                  <FormattedMessage id="attendanceStatistics.option.week" />
                </Button>
                <Button value={TIME_TYPE.BY_MONTH}>
                  <FormattedMessage id="attendanceStatistics.option.month" />
                </Button>
              </Group>
            </Item>
          </div>
        )}
      </Form>
    </div>
  );
};

export default FilterWeek;
