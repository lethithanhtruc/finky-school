import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (Number.isInteger(value) && value >= 3) {
    obj.props.style = { background: "#ff7766" };
  }
  return obj;
};

export const columnsFilterByClass = [
  {
    title: <FormattedMessage id="rollCallDaily.column.studentName" />,
    dataIndex: "studentName",
    className: "studentNameCol",
    render: (value, row) => {
      const obj = {
        children: (
          <Link className="link-history" to={`/tracking-history/${row.key}`}>
            {row.studentName}
          </Link>
        ),
        props: {},
      };
      return obj;
    },
  },
  {
    title: <FormattedMessage id="rollCallDaily.column.studentCode" />,
    dataIndex: "studentCode",
  },
  {
    title: <FormattedMessage id="rollCallDaily.column.countLateIntheMorning" />,
    dataIndex: "lateInTheMorning",
    render: renderContent,
    align: "right",
  },
  {
    title: (
      <FormattedMessage id="rollCallDaily.column.countLateIntheAfternoon" />
    ),
    dataIndex: "lateInTheAfternoon",
    render: renderContent,
    align: "right",
  },
  {
    title: <FormattedMessage id="rollCallDaily.column.countOffIntheMorning" />,
    dataIndex: "absentInTheMorning",
    render: renderContent,
    align: "right",
  },
  {
    title: (
      <FormattedMessage id="rollCallDaily.column.countOffIntheAfternoon" />
    ),
    dataIndex: "absentInTheAfternoon",
    render: renderContent,
    align: "right",
  },
];
