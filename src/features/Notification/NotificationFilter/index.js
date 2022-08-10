import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Col, Input, Menu, Row } from "antd";
import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Block from "../../../components/Common/Block";
import FilterButtonGroup from "./FilterButtonGroup";
import { GET_FACILITY_DATA } from "./gql.js";
import "./index.scss";
import SelectGroup from "./SelectGroup";

const { Search } = Input;

const NotificationFilter = ({ setFilter }) => {
  const intl = useIntl();
  const { loading, data } = useQuery(GET_FACILITY_DATA);

  const [campusId, setCampusId] = useState();
  const [gradeId, setGradeId] = useState();
  const [classroomId, setClassroomId] = useState();
  const [actionStatus, setActionStatus] = useState();
  const [typeOfActivity, setTypeOfActivity] = useState();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setFilter({
      campusId,
      gradeId,
      classroomId,
      actionStatus,
      typeOfActivity,
      keyword,
    });
  }, [campusId, gradeId, classroomId, actionStatus, typeOfActivity, keyword]);

  const handleClickMenu = (e) => {
    if (e.key === "ALL") {
      setActionStatus();
      return;
    }
    setActionStatus(e.key);
  };

  const hanldeSearchChange = (value) => {
    setKeyword(value);
  };

  return (
    <Block className="notification-filter">
      <Row gutter={48}>
        {/* Select Boxes */}
        <Col span={6}>
          <SelectGroup
            loading={loading}
            data={data}
            setCampusId={setCampusId}
            setGradeId={setGradeId}
            setClassroomId={setClassroomId}
          />
        </Col>

        {/* Menu Filter & Search */}
        <Col span={18}>
          <Row align="middle">
            {/* Menu Filter */}
            <Col span={14}>
              <Menu
                className="notification-filter__menu"
                mode="horizontal"
                defaultSelectedKeys={["ALL"]}
                onClick={handleClickMenu}
              >
                <Menu.Item key="ALL">
                  <FormattedMessage id="notification.filterMenu.all" />
                </Menu.Item>
                <Menu.Item key="UNREAD">
                  <FormattedMessage id="notification.filterMenu.unread" />
                </Menu.Item>
                <Menu.Item key="READ">
                  <FormattedMessage id="notification.filterMenu.read" />
                </Menu.Item>
                <Menu.Item key="REJECT">
                  <FormattedMessage id="notification.filterMenu.unaccepted" />
                </Menu.Item>
                <Menu.Item key="APPROVED">
                  <FormattedMessage id="notification.filterMenu.accepted" />
                </Menu.Item>
              </Menu>
            </Col>

            {/* Search */}
            <Col span={10}>
              <Search
                className="notification-filter__search"
                placeholder={intl.formatMessage({
                  id: "notification.filterSearch.placeholder",
                })}
                prefix={<SearchOutlined />}
                enterButton={
                  <FormattedMessage id="notification.filterSearch.button" />
                }
                onSearch={hanldeSearchChange}
              />
            </Col>
          </Row>

          {/* Group Button */}
          <FilterButtonGroup
            typeOfActivity={typeOfActivity}
            setTypeOfActivity={setTypeOfActivity}
          />
        </Col>
      </Row>
    </Block>
  );
};

export default NotificationFilter;
