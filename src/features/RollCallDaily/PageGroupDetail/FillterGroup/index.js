import React from "react";
import { Table, Button, Popover } from "antd";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";

import { columns, renderContent } from "./columns";

const FillterGroup = (props) => {
  const { attendanceOfClassroomByGrades, setParamsDefault, gradeIdActive } =
    props;
  const listDataTable = [];
  const history = useHistory();

  const onShowAllClass = (gradeId) => {
    setParamsDefault((prevValue) => {
      return {
        ...prevValue,
        gradeId,
      };
    });
  };

  const gotoDetailPage = (value) => {
    history.push(`/roll-call-daily/${value.dataIndex}`);
  };

  const renderLabelUnitStudentMorning = (total) => {
    return total > 1 ? (
      <FormattedMessage id="rollCallDaily.filterClass.unit.morning.s" />
    ) : (
      <FormattedMessage id="rollCallDaily.filterClass.unit.morning" />
    );
  };

  const renderLabelUnitStudentAfternoon = (total) => {
    return total > 1 ? (
      <FormattedMessage id="rollCallDaily.filterClass.unit.afternoon.s" />
    ) : (
      <FormattedMessage id="rollCallDaily.filterClass.unit.afternoon" />
    );
  };

  const renderContentPopoverClass = (infor) => {
    return (
      <div className="main-content">
        <div className="label">
          <p>
            <FormattedMessage id="rollCallDaily.label.teacher" />
          </p>
          <p>
            <FormattedMessage id="rollCallDaily.filterClass.total" />
          </p>
          <p>
            <FormattedMessage id="rollCallDaily.label.absent" />
          </p>
          <p>
            <FormattedMessage id="rollCallDaily.label.late" />
          </p>
        </div>
        <div className="value">
          <p>{infor?.classroom?.teacher?.name} </p>
          <p>{infor?.classroom?.totalStudents}</p>
          <p>
            {infor?.statistic?.absentInTheMorning}{" "}
            {renderLabelUnitStudentMorning(
              infor?.statistic?.absentInTheMorning
            )}
            , {infor?.statistic?.absentInTheAfternoon}{" "}
            {renderLabelUnitStudentAfternoon(
              infor?.statistic?.absentInTheAfternoon
            )}
          </p>
          <p>
            {infor?.statistic?.lateInTheMorning}{" "}
            {renderLabelUnitStudentMorning(infor?.statistic?.lateInTheMorning)},{" "}
            {infor?.statistic?.lateInTheAfternoon}{" "}
            {renderLabelUnitStudentAfternoon(
              infor?.statistic?.lateInTheAfternoon
            )}
          </p>
        </div>
      </div>
    );
  };

  attendanceOfClassroomByGrades?.map((grade, index) => {
    const dynamicClassColumns = [];
    const dynamicClassColumnsMore = [];
    const dynamicClassData = [
      {
        absentInTheMorning: [],
        absentInTheAfternoon: [],
        lateInTheMorning: [],
        lateInTheAfternoon: [],
      },
    ];
    const dynamicClassDataMore = [
      {
        absentInTheMorning: [],
        absentInTheAfternoon: [],
        lateInTheMorning: [],
        lateInTheAfternoon: [],
      },
    ];
    grade?.classrooms?.map((item, index) => {
      if (index < 10) {
        dynamicClassColumns.push({
          title: (
            <Popover
              content={renderContentPopoverClass(item)}
              placement="topLeft"
              overlayClassName="wrapper-overlay-hover-info-class"
            >
              <span>{item?.classroom?.name}</span>
            </Popover>
          ),
          dataIndex: item?.classroom?.id,
          render: renderContent,
          align: "right",
          total: item?.classroom?.totalStudents,
          onHeaderCell: (value, index) => {
            return {
              onClick: () => {
                gotoDetailPage(value);
              }, // click header row
            };
          },
        });
        dynamicClassData[0].absentInTheMorning[item?.classroom?.id] =
          item?.statistic?.absentInTheMorning;
        dynamicClassData[0].absentInTheAfternoon[item?.classroom?.id] =
          item?.statistic?.absentInTheAfternoon;
        dynamicClassData[0].lateInTheMorning[item?.classroom?.id] =
          item?.statistic?.lateInTheMorning;
        dynamicClassData[0].lateInTheAfternoon[item?.classroom?.id] =
          item?.statistic?.lateInTheAfternoon;
      } else {
        dynamicClassColumnsMore.push({
          title: (
            <Popover
              content={renderContentPopoverClass(item)}
              placement="topLeft"
              overlayClassName="wrapper-overlay-hover-info-class"
            >
              <span>{item?.classroom?.name}</span>
            </Popover>
          ),
          dataIndex: item?.classroom?.id,
          render: renderContent,
          align: "right",
          total: item?.classroom?.totalStudents,
          onHeaderCell: (value, index) => {
            return {
              onClick: () => {
                gotoDetailPage(value);
              }, // click header row
            };
          },
        });
        dynamicClassDataMore[0].absentInTheMorning[item?.classroom?.id] =
          item?.statistic?.absentInTheMorning;
        dynamicClassDataMore[0].absentInTheAfternoon[item?.classroom?.id] =
          item?.statistic?.absentInTheAfternoon;
        dynamicClassDataMore[0].lateInTheMorning[item?.classroom?.id] =
          item?.statistic?.lateInTheMorning;
        dynamicClassDataMore[0].lateInTheAfternoon[item?.classroom?.id] =
          item?.statistic?.lateInTheAfternoon;
      }
      return item;
    });
    const mappingDataSource = [
      {
        key: "1",
        status: <FormattedMessage id="rollCallDaily.label.absent" />,
        time: <FormattedMessage id="rollCallDaily.label.morning" />,
        ...dynamicClassData[0].absentInTheMorning,
      },
      {
        key: "2",
        status: <FormattedMessage id="rollCallDaily.label.absent" />,
        time: <FormattedMessage id="rollCallDaily.label.afternoon" />,
        ...dynamicClassData[0].absentInTheAfternoon,
      },
      {
        key: "3",
        status: <FormattedMessage id="rollCallDaily.label.late" />,
        time: <FormattedMessage id="rollCallDaily.label.morning" />,
        ...dynamicClassData[0].lateInTheMorning,
      },
      {
        key: "4",
        status: <FormattedMessage id="rollCallDaily.label.late" />,
        time: <FormattedMessage id="rollCallDaily.label.afternoon" />,
        ...dynamicClassData[0].lateInTheAfternoon,
      },
    ];
    const mappingDataSourceMore = [
      {
        key: "1",
        status: <FormattedMessage id="rollCallDaily.label.absent" />,
        time: <FormattedMessage id="rollCallDaily.label.morning" />,
        ...dynamicClassDataMore[0].absentInTheMorning,
      },
      {
        key: "2",
        status: <FormattedMessage id="rollCallDaily.label.absent" />,
        time: <FormattedMessage id="rollCallDaily.label.afternoon" />,
        ...dynamicClassDataMore[0].absentInTheAfternoon,
      },
      {
        key: "3",
        status: <FormattedMessage id="rollCallDaily.label.late" />,
        time: <FormattedMessage id="rollCallDaily.label.morning" />,
        ...dynamicClassDataMore[0].lateInTheMorning,
      },
      {
        key: "4",
        status: <FormattedMessage id="rollCallDaily.label.late" />,
        time: <FormattedMessage id="rollCallDaily.label.afternoon" />,
        ...dynamicClassDataMore[0].lateInTheAfternoon,
      },
    ];
    const mappingColumn = columns.concat(dynamicClassColumns);
    const mappingColumnMore = columns.concat(dynamicClassColumnsMore);
    listDataTable.push({
      id: grade.id,
      title: grade.name,
      columns: mappingColumn,
      dataSource: mappingDataSource,
      children: {
        columns: mappingColumnMore,
        dataSource: mappingDataSourceMore,
      },
    });
    return grade;
  });

  return (
    <div className="filter-group-wrapper">
      {listDataTable?.map((item) => {
        return (
          item.columns.length > 2 && (
            <div key={item.id} className="grade-wrapper">
              <div className="top">
                <p className="title">
                  <FormattedMessage id={`grade.${item.title}`} />
                </p>
                {item.children.columns.length > 2 && gradeIdActive === "0" && (
                  <Button type="link" onClick={() => onShowAllClass(item.id)}>
                    <FormattedMessage id="rollCallDaily.viewmore" />
                  </Button>
                )}
              </div>
              <Table
                columns={item.columns}
                dataSource={item.dataSource}
                bordered
                pagination={false}
                className={`custom-table-group grade _${
                  item.columns.length - 2
                }`}
              />
              {gradeIdActive !== "0" && item.children.columns.length > 2 && (
                <Table
                  columns={item.children.columns}
                  dataSource={item.children.dataSource}
                  bordered
                  pagination={false}
                  className={`custom-table-group grade _${
                    item.children.columns.length - 2
                  }`}
                />
              )}
            </div>
          )
        );
      })}
    </div>
  );
};

export default FillterGroup;
