import { Button } from "antd";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IconExport } from "../../svg/icon-export.svg";

export const TIME_TYPE = {
  SEMESTER1: "SEMESTER1",
  SEMESTER2: "SEMESTER2",
  BY_WEEK: "BY_WEEK",
  BY_MONTH: "BY_MONTH",
  BY_SEMESTER: "BY_SEMESTER",
};

export const SORT_OPTION = {
  maxAbsent: {
    field: "TOTAL_ABSENT",
    order: "DESC",
  },
  minAbsent: {
    field: "TOTAL_ABSENT",
    order: "ASC",
  },
  maxLate: {
    field: "TOTAL_LATE",
    order: "DESC",
  },
  minLate: {
    field: "TOTAL_LATE",
    order: "ASC",
  },
};

export const SEMESTER_OPTION = [
  {
    value: TIME_TYPE.SEMESTER1,
    label: <FormattedMessage id="attendanceStatistics.option.semester1" />,
  },
  {
    value: TIME_TYPE.SEMESTER2,
    label: <FormattedMessage id="attendanceStatistics.option.semester2" />,
  },
];

export const STATISTIC_CLASSES = {
  maxAbsent: (
    <FormattedMessage id="attendanceStatistics.title.statistic.classMaxAbsent" />
  ),
  maxLate: (
    <FormattedMessage id="attendanceStatistics.title.statistic.classMaxLate" />
  ),
  minAbsent: (
    <FormattedMessage id="attendanceStatistics.title.statistic.classMinAbsent" />
  ),
  minLate: (
    <FormattedMessage id="attendanceStatistics.title.statistic.classMinLate" />
  ),
};

export const MONTH_OPTION = [
  {
    value: 1,
    label: <FormattedMessage id="attendanceStatistics.option.jan" />,
  },
  {
    value: 2,
    label: <FormattedMessage id="attendanceStatistics.option.feb" />,
  },
  {
    value: 3,
    label: <FormattedMessage id="attendanceStatistics.option.mar" />,
  },
  {
    value: 4,
    label: <FormattedMessage id="attendanceStatistics.option.apr" />,
  },
  {
    value: 5,
    label: <FormattedMessage id="attendanceStatistics.option.may" />,
  },
  {
    value: 6,
    label: <FormattedMessage id="attendanceStatistics.option.june" />,
  },
  {
    value: 7,
    label: <FormattedMessage id="attendanceStatistics.option.july" />,
  },
  {
    value: 8,
    label: <FormattedMessage id="attendanceStatistics.option.aug" />,
  },
  {
    value: 9,
    label: <FormattedMessage id="attendanceStatistics.option.sep" />,
  },
  {
    value: 10,
    label: <FormattedMessage id="attendanceStatistics.option.oct" />,
  },
  {
    value: 11,
    label: <FormattedMessage id="attendanceStatistics.option.nov" />,
  },
  {
    value: 12,
    label: <FormattedMessage id="attendanceStatistics.option.dec" />,
  },
];

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
  {
    title: <FormattedMessage id="attendanceStatistics.column.list" />,
    align: "center",
    render: () => (
      <Button icon={<IconExport />}>
        <FormattedMessage id="attendanceStatistics.column.download" />
      </Button>
    ),
  },
];

export const INIT_DATA_FILTER = {
  timeType: TIME_TYPE.BY_MONTH,
  dataBySemester: TIME_TYPE.SEMESTER1,
  timeTypeForView: TIME_TYPE.BY_WEEK,
};

const lang = localStorage.getItem("language");
const labelAbsent = lang === "vi" ? "Nghỉ học" : "Absent";
const labelLate = lang === "vi" ? "Đi trễ" : "Late";

export const INIT_DATA_CHART = {
  datasets: [
    {
      label: labelAbsent,
      fill: false,
      backgroundColor: "#FF331A",
      borderColor: "#FF331A",
      borderWidth: 2,
    },
    {
      label: labelLate,
      fill: false,
      backgroundColor: "#16499C",
      borderColor: "#16499C",
      borderWidth: 2,
    },
  ],
};
