import { useMutation } from "@apollo/client";
import { Col, List, message, Row } from "antd";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { CONSIDER_CONFIRM } from "../gql";
import moment from "moment";

import "./index.scss";
import NotificationAvatar from "./NotificationAvatar";
import NotificationButtonGroup from "./NotificationButtonGroup";
import NotificationDate from "./NotificationDate";
import NotificationDescription from "./NotificationDescription";
import NotificationDetail from "./NotificationDetail";
import NotificationTagGroup from "./NotificationTagGroup";
import NotificationTitle from "./NotificationTitle";
import { TIME_READ_AT_FORMAT } from "../../../constants/datetime";
// import { NOTIFICATION_TYPE } from "../../../constants";

const NotificationItem = (props) => {
  const intl = useIntl();

  const { data, setDataList, setModalVisible, setSelectConsider } = props;

  const { type, createdAt, readAt, isShowDate, activityLog, accept } = data;
  const { causer, subject, changeLogs } = activityLog;

  // ----------
  // Mutation Đồng ý với yêu cầu kiểm duyệt
  // ----------
  const [
    considerConfirm,
    { loading: loadingConfirm, error: errorConfirm, data: dataConfirm },
  ] = useMutation(CONSIDER_CONFIRM);

  useEffect(() => {
    if (!loadingConfirm && errorConfirm) {
      message.error(intl.formatMessage({ id: "notification.message.error" }));
    } else if (!loadingConfirm && dataConfirm) {
      setDataList((dataList) => {
        const newDataList = dataList.map((dataItem) => {
          if (dataItem.node.id === dataConfirm.considerConfirm.id) {
            dataItem.node.accept = dataConfirm.considerConfirm.accept;
            dataItem.node.readAt = moment().format(TIME_READ_AT_FORMAT);
          }

          return dataItem;
        });
        return newDataList;
      });
      message.success(
        intl.formatMessage({ id: "notification.message.success" })
      );
    }
  }, [loadingConfirm, errorConfirm, dataConfirm]);

  const handleConfirm = (value) => {
    considerConfirm({
      variables: {
        id: data.id,
        input: { confirm: value },
      },
    });
  };

  const handleOpenDetailModal = () => {
    setModalVisible(true);
    setSelectConsider(data);
  };

  // if (type === NOTIFICATION_TYPE.CAUTION_NUMBER_STUDENT_INSUFFICIENT) {
  //   console.log("=====================================");
  //   console.log("type :", data.type);
  //   console.log("id :", data.id);
  //   console.log("causer :", data.activityLog.causer);
  //   console.log("subject :", data.activityLog.subject);
  //   console.log("changeLogs :", data.activityLog.changeLogs);
  //   console.log("");
  //   console.log("");
  // } else {
  //   return null;
  // }

  return (
    <List.Item className="notification-item">
      {isShowDate && <NotificationDate createdAt={createdAt} />}

      <List.Item.Meta
        className="notification-item__meta"
        avatar={<NotificationAvatar src={""} readAt={readAt} />}
        title={<NotificationTitle type={type} createdAt={createdAt} />}
        description={
          <>
            <NotificationDescription
              type={type}
              causer={causer}
              subject={subject}
              changeLogs={changeLogs}
            />
            <NotificationDetail
              type={type}
              subject={subject}
              changeLogs={changeLogs}
            />
            <Row className="notification-item__footer" align="middle">
              <Col flex={1}>
                <NotificationTagGroup type={type} subject={subject} />
              </Col>
              <Col>
                <NotificationButtonGroup
                  type={type}
                  accept={accept}
                  onConfirm={handleConfirm}
                  onOpenDetail={handleOpenDetailModal}
                />
              </Col>
            </Row>
          </>
        }
      />
    </List.Item>
  );
};

export default NotificationItem;
