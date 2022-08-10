import React from "react";
import { Table, Empty } from "antd";
import { FormattedMessage } from "react-intl";
import { columnsFilterByClass } from "./columns";

const { Summary } = Table;

const FillterClass = (props) => {
  const { listStudentOfClass, loading } = props;

  return (
    <Table
      scroll={{
        y: "calc(100vh - 386px)",
      }}
      className="table-class"
      columns={columnsFilterByClass}
      dataSource={listStudentOfClass}
      bordered
      loading={loading}
      pagination={false}
      summary={(dataSource) => {
        if (dataSource.length > 0) {
          let totalLateIntheMorning = 0;
          let totalLateIntheAfternoon = 0;
          let totalOffIntheMorning = 0;
          let totalOffIntheAfternoon = 0;

          dataSource.forEach(
            ({
              lateInTheMorning,
              lateInTheAfternoon,
              absentInTheMorning,
              absentInTheAfternoon,
            }) => {
              totalLateIntheMorning += lateInTheMorning;
              totalLateIntheAfternoon += lateInTheAfternoon;
              totalOffIntheMorning += absentInTheMorning;
              totalOffIntheAfternoon += absentInTheAfternoon;
            }
          );

          return (
            <>
              <Summary.Row>
                <Summary.Cell colSpan={2}>
                  <FormattedMessage id="rollCallDaily.filterClass.totalCount" />
                </Summary.Cell>
                <Summary.Cell>{totalLateIntheMorning}</Summary.Cell>
                <Summary.Cell>{totalLateIntheAfternoon}</Summary.Cell>
                <Summary.Cell>{totalOffIntheMorning}</Summary.Cell>
                <Summary.Cell>{totalOffIntheAfternoon}</Summary.Cell>
              </Summary.Row>
            </>
          );
        }
        return false;
      }}
      locale={{
        emptyText: loading ? (
          <FormattedMessage id="table.loading-text" />
        ) : (
          <Empty description={<FormattedMessage id="empty.text" />} />
        ),
      }}
    />
  );
};

export default FillterClass;
