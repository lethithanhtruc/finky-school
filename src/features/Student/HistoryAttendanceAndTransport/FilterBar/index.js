import React, { useState } from "react";
import moment from "moment";
import { DatePicker, Radio, Space, Button } from "antd";
import { useQuery } from "@apollo/client";
import { FormattedMessage } from "react-intl";

import { LOAD_SCHOOLYEARS_CURRENT } from "../gql";
import { ReactComponent as IconExport } from "../../../../svg/icon-export.svg";
import { ReactComponent as IconCalendar } from "../../../../svg/icon-calandar.svg";

import "../styles.scss";

const { RangePicker } = DatePicker;
const { Group } = Radio;
const dateFormat = "DD/MM/YYYY";

const FilterBar = (props) => {
  const { onChange, exportProps } = props;
  const [timeType, setTimeType] = useState({
    range: [moment().add(-1, "days"), moment()],
    dateType: "ALL",
  });
  const [isOpen, setIsOpen] = useState(false);

  const dateSchoolYear = useQuery(LOAD_SCHOOLYEARS_CURRENT).data
    ?.schoolyearCurrent;

  const disabledDate = (current) => {
    let startDate = moment(dateSchoolYear?.startAt);
    let endDate = moment(dateSchoolYear?.endAt).add(1, "days");

    const currentDate = moment();
    if (endDate > currentDate) {
      endDate = currentDate;
    }

    // Can not select days before today and today
    return (current && current < startDate) || (current && current > endDate);
  };

  const handleChangeSchoolYear = (range) => {
    setTimeType((preState) => {
      return {
        ...preState,
        range,
      };
    });
  };

  const handleChangeDateType = (e) => {
    setTimeType((preState) => {
      return {
        ...preState,
        dateType: e.target.value,
      };
    });
  };

  const handleFinishSelectChangeSchoolYear = (open) => {
    onChange(timeType);
    setIsOpen(false);
  };

  const handleOpenCalendar = () => {
    setIsOpen(true);
  };

  const handleRenderPanel = (calandarElm) => {
    return (
      <div className="custom-panel-calendar-wrapper">
        <Group onChange={handleChangeDateType} value={timeType?.dateType}>
          <Space direction="vertical">
            <Radio value={"ALL"}>
              <FormattedMessage id="historyAttendanceAndTransport.option.all" />
            </Radio>
            <Radio value={"DATE_ATTENDANCE"}>
              <FormattedMessage id="historyAttendanceAndTransport.option.inClass" />
            </Radio>
            <Radio value={"DATE_ABSENT"}>
              <FormattedMessage id="historyAttendanceAndTransport.option.absent" />
            </Radio>
            <Radio value={"DATE_LATE"}>
              <FormattedMessage id="historyAttendanceAndTransport.option.late" />
            </Radio>
          </Space>
        </Group>
        <div className="main-calendar">
          {calandarElm}
          <Button onClick={handleFinishSelectChangeSchoolYear}>
            <FormattedMessage id="historyAttendanceAndTransport.button.get" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="filter-bar-wrapper">
      <div className="hidden"></div>
      <div className="actions">
        <div className="label">
          <FormattedMessage id="historyAttendanceAndTransport.label.time" />:
        </div>
        <RangePicker
          defaultValue={timeType?.range}
          format={dateFormat}
          className="time-semester"
          dropdownClassName="time-semester-dropdown"
          suffixIcon={<IconCalendar />}
          allowClear={false}
          disabledDate={disabledDate}
          onChange={handleChangeSchoolYear}
          panelRender={handleRenderPanel}
          open={isOpen}
          onOpenChange={handleOpenCalendar}
        />
        {/* TODO: Update link download */}
        <div
          className={`link-export ${
            exportProps?.loadingExport ? "disable" : ""
          }`}
        >
          <a
            href={exportProps?.dataExport?.studentTrackingHistoriesExport?.url}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <FormattedMessage id="historyAttendanceAndTransport.label.download" />
            </span>
            <IconExport />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
