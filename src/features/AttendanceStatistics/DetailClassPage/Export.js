import React, { useCallback, useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { useLazyQuery } from "@apollo/client";

import { ReactComponent as IconExport } from "../../../svg/icon-export.svg";
import { GET_URL_EXPORT } from "../gql";

import "../styles.scss";

const Export = ({ classroomId, filter }) => {
  const [getDownloadLink, { loading, data: dataExport }] = useLazyQuery(
    GET_URL_EXPORT,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    }
  );

  const handleOnDownload = useCallback(() => {
    getDownloadLink({
      variables: {
        filter: { classroomId, ...filter },
      },
    });
  }, [getDownloadLink, filter, classroomId]);

  useEffect(() => {
    if (dataExport) {
      window.open(
        dataExport?.studentOfClassroomAttendanceStatisticsExport.url,
        "_blank"
      );
    }
  }, [dataExport]);

  const iconLoading = (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
  );

  return (
    <div className="link-export" onClick={handleOnDownload}>
      <span>
        <FormattedMessage id="rollCallDaily.export" />
      </span>
      {loading ? iconLoading : <IconExport />}
    </div>
  );
};

export default React.memo(Export);
