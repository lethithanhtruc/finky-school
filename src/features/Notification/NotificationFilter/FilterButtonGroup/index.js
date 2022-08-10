import { Col, Checkbox, Row, Space } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IconCaution } from "../../../../svg/icon-caution-color.svg";
import { ReactComponent as IconDriver } from "../../../../svg/icon-driver-color.svg";
import { ReactComponent as IconMoreInfo } from "../../../../svg/icon-more-info-color.svg";
import { ReactComponent as IconParent } from "../../../../svg/icon-parent-color.svg";
import { ReactComponent as IconSchool } from "../../../../svg/icon-school-color.svg";
import "./index.scss";

const FilterButton = ({
  value,
  icon,
  messageId,
  setTypeOfActivity,
  checked,
}) => {
  const handleChange = () => {
    if (checked) {
      setTypeOfActivity("");
      return;
    }

    setTypeOfActivity(value);
  };

  return (
    <Col flex="1">
      <Checkbox
        className="notification-filter__filter-button"
        checked={checked}
        onChange={handleChange}
      >
        <Space direction="vertical">
          {icon}
          <FormattedMessage id={`notification.filterButton.${messageId}`} />
        </Space>
      </Checkbox>
    </Col>
  );
};

const FilterButtonGroup = ({ typeOfActivity, setTypeOfActivity }) => {
  return (
    <Row gutter={"10"} className="filter-button-group">
      <FilterButton
        value={"PARENTSANDSTUDENTS"}
        icon={<IconParent />}
        messageId={"parent"}
        checked={typeOfActivity === "PARENTSANDSTUDENTS"}
        setTypeOfActivity={setTypeOfActivity}
      />
      <FilterButton
        value={"SHUTTLE"}
        icon={<IconDriver />}
        messageId={"driver"}
        checked={typeOfActivity === "SHUTTLE"}
        setTypeOfActivity={setTypeOfActivity}
      />
      <FilterButton
        value={"TEACHERSANDSCHOOLS"}
        icon={<IconSchool />}
        messageId={"school"}
        checked={typeOfActivity === "TEACHERSANDSCHOOLS"}
        setTypeOfActivity={setTypeOfActivity}
      />
      <FilterButton
        value={"SYSTEM"}
        icon={<IconCaution />}
        messageId={"caution"}
        checked={typeOfActivity === "SYSTEM"}
        setTypeOfActivity={setTypeOfActivity}
      />
      <FilterButton
        value={"OTHER"}
        icon={<IconMoreInfo />}
        messageId={"moreinfo"}
        checked={typeOfActivity === "OTHER"}
        setTypeOfActivity={setTypeOfActivity}
      />
    </Row>
  );
};

export default FilterButtonGroup;
