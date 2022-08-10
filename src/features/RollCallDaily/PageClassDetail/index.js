import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";

import PageHeader from "../../../components/Layout/PageHeader";
import FilterWeek from "../FilterWeek";
import FillterClass from "./FillterClass";
import {
  LOAD_INFOR_CLASS_BY_ID,
  SORT_ATTENDANCE_OF_STUDENT_BY_CLASS,
  GET_URL_EXPORT,
} from "../gql";
import { ReactComponent as IconExport } from "../../../svg/icon-export.svg";

import "../styles.scss";

const { Item } = Menu;

const dataSort = [
  {
    key: "TOTAL_LATE_DESC",
    title: <FormattedMessage id="rollCallDaily.label.sort.maxLate" />,
  },
  {
    key: "TOTAL_LATE_ASC",
    title: <FormattedMessage id="rollCallDaily.label.sort.minLate" />,
  },
  {
    key: "TOTAL_ABSENT_DESC",
    title: <FormattedMessage id="rollCallDaily.label.sort.maxAbsent" />,
  },
  {
    key: "TOTAL_ABSENT_ASC",
    title: <FormattedMessage id="rollCallDaily.label.sort.minAbsent" />,
  },
];

const PageClassDetail = () => {
  const paramsURL = useParams();
  const [paramsDefault, setParamsDefault] = useState({
    campusId: 14,
  });
  const [valueSort, setValueSort] = useState("");

  const listClass = [
    {
      id: "1",
      name: "Class 1",
    },
  ];

  const convertDataSort = (value) => {
    if (value) {
      const convertValue = value.split("_");
      const dataSort = {
        field: `${convertValue[0]}_${convertValue[1]}`,
        order: convertValue[2],
      };
      return dataSort;
    }
  };

  const onChangeGroupButton = (e) => {
    // TODO: update later
  };

  const convertVariableLoadStudent = () => {
    const dataSearchStudentOfClass = {
      from: paramsDefault.from,
      to: paramsDefault.to,
      classroomId: paramsURL.classId,
    };
    const variables = {
      filter: dataSearchStudentOfClass,
    };
    if (valueSort) variables.orderBy = [convertDataSort(valueSort)];
    return variables;
  };

  const { loading, data } = useQuery(SORT_ATTENDANCE_OF_STUDENT_BY_CLASS, {
    variables: convertVariableLoadStudent(),
  });

  const { data: dataExport } = useQuery(GET_URL_EXPORT, {
    variables: convertVariableLoadStudent(),
  });

  const classInfo = useQuery(LOAD_INFOR_CLASS_BY_ID, {
    variables: { id: paramsURL.classId },
  }).data?.classroom;

  const newAttendanceOfStudentByClassrooms =
    data?.attendanceOfStudentByClassrooms;
  const dataSource = [];
  newAttendanceOfStudentByClassrooms?.map((student) => {
    dataSource.push({
      key: student?.student?.id,
      studentName: student?.student?.name,
      studentCode: student?.student?.code,
      absentInTheMorning: student?.statistic?.absentInTheMorning,
      absentInTheAfternoon: student?.statistic?.absentInTheAfternoon,
      lateInTheMorning: student?.statistic?.lateInTheMorning,
      lateInTheAfternoon: student?.statistic?.lateInTheAfternoon,
    });
    return student;
  });

  const renderLabelUnitStudent = (total) => {
    return total > 1 ? (
      <FormattedMessage id="rollCallDaily.filterClass.unit.s" />
    ) : (
      <FormattedMessage id="rollCallDaily.filterClass.unit" />
    );
  };

  const handlSortList = (value) => {
    setValueSort(value?.key);
  };

  const menuSort = (
    <Menu onClick={handlSortList}>
      {dataSort.map((item) => {
        return <Item key={item.key}>{item.title}</Item>;
      })}
    </Menu>
  );

  return (
    <div className="roll-call-daily">
      <PageHeader
        title={<FormattedMessage id="sidebar.item.rollCallDaily" />}
      />
      <div className="group-content">
        <FilterWeek
          setParamsDefault={setParamsDefault}
          listButtonGroup={listClass}
          onChangeGroupButton={onChangeGroupButton}
        />
      </div>

      <div className="group-content">
        <div className="filter-class-wrapper">
          <div className="top">
            <p className="title">
              <FormattedMessage id="rollCallDaily.filterClass.title" />{" "}
              {classInfo?.name} |{" "}
              <FormattedMessage id="rollCallDaily.filterClass.total" />:{" "}
              {classInfo?.totalStudents}{" "}
              {renderLabelUnitStudent(classInfo?.totalStudents)}
            </p>
            <div className="action-wrapper">
              <Dropdown overlay={menuSort} trigger="click">
                <Button>
                  {valueSort ? (
                    dataSort.find((item) => item.key === valueSort).title
                  ) : (
                    <FormattedMessage id="rollCallDaily.sort" />
                  )}
                  <DownOutlined />
                </Button>
              </Dropdown>

              <div className="link-export">
                <a
                  href={dataExport?.attendanceOfStudentByClassroomExport?.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <FormattedMessage id="rollCallDaily.export" />
                  </span>
                  <IconExport />
                </a>
              </div>
            </div>
          </div>
          <FillterClass listStudentOfClass={dataSource} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default PageClassDetail;
