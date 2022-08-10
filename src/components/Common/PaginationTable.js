import React, { useState, useEffect } from "react";
import "./PaginationTable.scss";
import { Pagination } from "antd";

const PaginationTable = ({ total, onChange, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [total]);

  return (
    <Pagination
      className="wrapper-pagination-table"
      hideOnSinglePage
      showSizeChanger={false}
      defaultCurrent={1}
      current={currentPage}
      total={total}
      pageSize={pageSize}
      onChange={(page, pageSize) => {
        setCurrentPage(page);
        onChange(page, pageSize);
      }}
    />
  );
};

export default PaginationTable;
