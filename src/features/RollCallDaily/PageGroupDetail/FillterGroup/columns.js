export const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (Number.isInteger(value) && value > 4) {
    obj.props.style = { background: "#ff7766", color: "#ffffff" };
  }
  if (Number.isInteger(value) && value === 0) {
    obj.props.style = { background: "#e8f0fc" };
  }
  if (Number.isInteger(value) && value === 0) {
    obj.props.style = { background: "#e8f0fc" };
  }

  if (index === 4) {
    obj.props.colSpan = 0;
  }
  return obj;
};

export const columns = [
  {
    colSpan: 2,
    dataIndex: "status",
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 2;
      }
      if (index === 2) {
        obj.props.rowSpan = 2;
      }
      //   These two are merged into above cell
      if (index === 1) {
        obj.props.rowSpan = 0;
      }
      if (index === 3) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
    width: 130,
  },
  {
    colSpan: 0,
    dataIndex: "time",
    render: renderContent,
    width: 110,
  },
];
