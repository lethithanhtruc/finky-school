import { Select, Space } from "antd";
import React, { useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";

import "./index.scss";

const SelectGroup = ({
  loading,
  data,
  setCampusId,
  setGradeId,
  setClassroomId,
}) => {
  const intl = useIntl();
  const [campus, setCampus] = useState();
  const [grade, setGrade] = useState();
  const [classroom, setClassroom] = useState();

  const getGradesByCampusId = (campusId) => {
    return data?.campuses.data.find((campus) => campus.id === campusId).grades;
  };

  const getClassroomsByGradeId = (campusId, gradeId) => {
    return data?.campuses.data
      .find((campus) => campus.id === campusId)
      .grades.find((campus) => campus.id === gradeId).classroom;
  };

  // ===============================================

  const getCampusOptions = () => {
    return data?.campuses.data.map((campus) => ({
      value: campus.id,
      label: campus.name,
      grades: campus.grade,
    }));
  };

  const getGradeOptions = () => {
    if (!campus) {
      return null;
    }

    const grades = getGradesByCampusId(campus);

    return grades.map((grade) => ({
      value: grade.id,
      label: <FormattedMessage id={`grade.${grade.name}`} />,
    }));
  };

  const getClassroomOptions = () => {
    if (!campus || !grade) {
      return null;
    }

    const classrooms = getClassroomsByGradeId(campus, grade);

    return classrooms.map((classroom) => ({
      value: classroom.id,
      label: classroom.name,
    }));
  };

  // ===============================================

  const handleSelectCampus = (id) => {
    setCampus(id);
    setGrade();
    setClassroom();

    setCampusId(id);
  };

  const handleSelectGrade = (id) => {
    setGrade(id);
    setClassroom();

    setGradeId(id);
  };

  const handleSelectClassroom = (id) => {
    setClassroom(id);

    setClassroomId(id);
  };

  return (
    <Space
      direction="vertical"
      className={"notification-select-group"}
      size="large"
    >
      <Select
        value={campus}
        style={{ minWidth: 160 }}
        loading={loading}
        placeholder={intl.formatMessage({
          id: "notification.filterSelect.campus",
        })}
        options={getCampusOptions()}
        onChange={handleSelectCampus}
        className={"notification-select-group__select"}
      />
      <Select
        value={grade}
        style={{ minWidth: 160 }}
        loading={loading}
        placeholder={intl.formatMessage({
          id: "notification.filterSelect.grade",
        })}
        options={getGradeOptions()}
        onChange={handleSelectGrade}
        className={"notification-select-group__select"}
      />
      <Select
        value={classroom}
        style={{ minWidth: 160 }}
        loading={loading}
        placeholder={intl.formatMessage({
          id: "notification.filterSelect.class",
        })}
        options={getClassroomOptions()}
        onChange={handleSelectClassroom}
        className={"notification-select-group__select"}
      />
    </Space>
  );
};

export default SelectGroup;
