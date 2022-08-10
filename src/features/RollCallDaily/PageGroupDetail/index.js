import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useQuery } from "@apollo/client";

import PageHeader from "../../../components/Layout/PageHeader";
import FilterWeek from "../FilterWeek";
import FilterGroup from "./FillterGroup";

import {
  LOAD_GRADES,
  LOAD_ATTENDANCE_OF_CLASS_BY_GRADE,
  LOAD_CAMPUS_MAIN,
} from "../gql";

import "../styles.scss";

const PageGroupDetail = () => {
  const [isExpand, setExpand] = useState(false);
  const [paramsDefault, setParamsDefault] = useState({});

  const campusId = useQuery(LOAD_CAMPUS_MAIN).data?.campusMain?.id;
  const { data: listGrade } = useQuery(LOAD_GRADES, {
    variables: { filter: { campusId: paramsDefault?.campusId } },
  });

  const onChangeGroupButton = (e) => {
    setExpand(false);
    setParamsDefault((prevValue) => {
      return {
        ...prevValue,
        gradeId: e.target.value,
      };
    });
  };

  const convertVariableLoadClassRoom = () => {
    if (paramsDefault?.gradeId === "0") delete paramsDefault.gradeId;

    return paramsDefault;
  };

  const { data } = useQuery(LOAD_ATTENDANCE_OF_CLASS_BY_GRADE, {
    variables: { filter: convertVariableLoadClassRoom() },
  });
  const attendanceOfClassroomByGrades = data?.attendanceOfClassroomByGrades;

  useEffect(() => {
    setParamsDefault((prevValue) => {
      return {
        ...prevValue,
        campusId,
      };
    });
  }, [campusId]);

  return (
    <div className="roll-call-daily">
      <PageHeader
        title={<FormattedMessage id="sidebar.item.rollCallDaily" />}
      />
      <div className="group-content">
        <FilterWeek
          setParamsDefault={setParamsDefault}
          listButtonGroup={listGrade?.gradesInCurrentSchoolYear}
          onChangeGroupButton={onChangeGroupButton}
          isAll
          gradeIdActive={paramsDefault?.gradeId || "0"}
        />
      </div>

      <div className="group-content fit-content">
        <FilterGroup
          attendanceOfClassroomByGrades={attendanceOfClassroomByGrades}
          setParamsDefault={setParamsDefault}
          gradeIdActive={paramsDefault?.gradeId || "0"}
        />
      </div>
    </div>
  );
};

export default PageGroupDetail;
