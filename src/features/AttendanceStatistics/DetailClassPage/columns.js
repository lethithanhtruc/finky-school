import { FormattedMessage } from "react-intl";

export const columns = [
  {
    title: <FormattedMessage id="attendanceStatistics.column.className" />,
    dataIndex: "className",
  },
  {
    title: <FormattedMessage id="attendanceStatistics.column.group" />,
    dataIndex: "group",
  },
  {
    title: <FormattedMessage id="attendanceStatistics.column.teacherName" />,
    dataIndex: "teacherName",
  },
  {
    title: <FormattedMessage id="attendanceStatistics.column.countLate" />,
    dataIndex: "countLate",
    align: "right",
  },
  {
    title: <FormattedMessage id="attendanceStatistics.column.countOff" />,
    dataIndex: "countOff",
    align: "right",
  },
];
