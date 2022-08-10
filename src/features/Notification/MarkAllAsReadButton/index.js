import { useMutation } from "@apollo/client";
import { message } from "antd";
import moment from "moment";
import React, { useEffect, useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { StoreContext } from "../../../store";
import { MARK_ALL_AS_READ } from "../gql";
import "./index.scss";



const MarkAllAsReadButton = ({ setDataList, dataList }) => {
  const intl = useIntl();
  const [me, setme] = useContext(StoreContext).me;

  const [
    markAllAsRead,
    {
      loading: loadingMarkAllAsRead,
      error: errorMarkAllAsRead,
      data: dataMarkAllAsRead,
    },
  ] = useMutation(MARK_ALL_AS_READ);

  useEffect(() => {
    if (!loadingMarkAllAsRead && errorMarkAllAsRead) {
      message.error(intl.formatMessage({ id: "notification.message.error" }));
    }

    if (!loadingMarkAllAsRead && dataMarkAllAsRead) {
      message.success(
        intl.formatMessage({ id: "notification.message.success" })
      );

      const newList = dataList.map((dataItem) => {
        dataItem.node.readAt = moment().format("YYYY-MM-DD HH:mm:ss");
        return dataItem;
      });

      setme((state) => ({
        ...state,
        totalNewConsiders: 0
      }))

      setDataList(newList);
    }
  }, [loadingMarkAllAsRead, errorMarkAllAsRead, dataMarkAllAsRead]);

  return (
    <div className="mark-all-as-read-btn">
      <span onClick={markAllAsRead}>
        <FormattedMessage id="notification.markAllAsRead" />
      </span>
    </div>
  );
};

export default MarkAllAsReadButton;
