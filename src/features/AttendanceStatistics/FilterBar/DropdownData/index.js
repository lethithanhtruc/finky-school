import React, { useState, useEffect } from "react";
import { Tabs, Button, Radio, Card, Popover } from "antd";
import { DownOutlined, CheckOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";

import { MONTH_OPTION, SEMESTER_OPTION, TIME_TYPE } from "../../constant";

import "../../styles.scss";

const { TabPane } = Tabs;
const { Group, Button: RadioButton } = Radio;

const DropdownData = (props) => {
  const {
    paramsStatistic,
    onAfterChageTimeType,
    optionsTime,
    setOptionsTime,
    listMonth,
    defaultSelectMonth,
  } = props;
  const [visible, setVisible] = useState(false);

  const handleChangeTimeType = (value) => {
    setOptionsTime((preState) => {
      return {
        ...preState,
        timeType: value,
      };
    });
  };

  const handleVisibleChange = (value) => {
    setVisible(value);
  };

  const handleChangeMonth = (e) => {
    setOptionsTime((preState) => {
      return {
        ...preState,
        dataByMonth: e.target.value,
      };
    });
  };

  const handleChangeSemester = (e) => {
    setOptionsTime((preState) => {
      return {
        ...preState,
        dataBySemester: e.target.value,
      };
    });
  };

  const handleGetData = () => {
    setVisible(false);
    onAfterChageTimeType && onAfterChageTimeType(optionsTime);
  };

  useEffect(() => {
    setOptionsTime((preState) => {
      return {
        ...preState,
        dataByMonth: defaultSelectMonth,
        dataBySemester: TIME_TYPE.SEMESTER1,
      };
    });
  }, [setOptionsTime, defaultSelectMonth]);

  const MenuGroup = (
    <Card>
      <Tabs activeKey={optionsTime?.timeType} onChange={handleChangeTimeType}>
        <TabPane
          tab={<FormattedMessage id="attendanceStatistics.option.month" />}
          key={TIME_TYPE.BY_MONTH}
        >
          <Group
            onChange={handleChangeMonth}
            value={optionsTime?.dataByMonth}
            className="buttons-month-wrapper"
          >
            {listMonth?.map((item) => {
              return (
                <RadioButton key={item.value} value={item.value}>
                  {item.label}
                </RadioButton>
              );
            })}
          </Group>
        </TabPane>
        <TabPane
          tab={<FormattedMessage id="attendanceStatistics.option.semester" />}
          key={TIME_TYPE.BY_SEMESTER}
        >
          <Group
            onChange={handleChangeSemester}
            value={optionsTime?.dataBySemester}
            className="buttons-semester-wrapper"
          >
            {SEMESTER_OPTION.map((item) => {
              return (
                <RadioButton key={item.value} value={item.value}>
                  {item.label}
                  <CheckOutlined />
                </RadioButton>
              );
            })}
          </Group>
        </TabPane>
      </Tabs>
      <Button className="button-get-data" onClick={handleGetData}>
        <FormattedMessage id="attendanceStatistics.button.getData" />
      </Button>
    </Card>
  );

  const labelMonth = MONTH_OPTION.find(
    (item) => item.value === optionsTime?.dataByMonth
  )?.label;
  const labelSemester = SEMESTER_OPTION.find(
    (item) => item.value === optionsTime?.dataBySemester
  )?.label;

  return (
    <div className="dropdown-data-wrapper">
      <Popover
        overlayClassName="menu-group-wrapper"
        content={MenuGroup}
        trigger="click"
        getPopupContainer={(trigger) => trigger.parentElement}
        onVisibleChange={handleVisibleChange}
        visible={visible}
        placement="bottomLeft"
      >
        <Button>
          {paramsStatistic?.timeType === TIME_TYPE.BY_MONTH
            ? labelMonth
            : labelSemester}
          <DownOutlined />
        </Button>
      </Popover>
    </div>
  );
};

export default DropdownData;
