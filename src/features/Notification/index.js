import { useLazyQuery } from "@apollo/client";
import { List, Spin } from "antd";
import { groupBy, values } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage } from "react-intl";
import Block from "../../components/Common/Block";
import CustomScrollbars from "../../components/Common/CustomScrollbars";
import EmptyData from "../../components/Common/Table/EmptyData";
import PageHeader from "../../components/Layout/PageHeader";
import DateList from "./DateList";
import { LOAD_CONSIDERS } from "./gql";
import "./index.scss";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import NotificationFilter from "./NotificationFilter";
import NotificationGroupByDate from "./NotificationGroupByDate";
import NotificationModal from "./NotificationModal";
import { NOTIFICATION_TYPE } from "../../constants";

const Notification = () => {
  const [dataList, setDataList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectConsider, setSelectConsider] = useState("");
  const [currentDateOnScroll, setCurrentDateOnScroll] = useState([]);
  const listDateOnScrollRef = useRef(null);
  const scrollViewRef = useRef(null);
  const listDateRef = useRef(null);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    setDataList([]);
    setCurrentDateOnScroll([]);

    loadConsiders({
      variables: {
        filter: filter,
      },
    });
  }, [filter]);

  // ----------
  // Query lấy danh sách Kiểm duyệt
  // ----------
  const [loadConsiders, { loading: loadingConsiders, data: dataConsiders }] =
    useLazyQuery(LOAD_CONSIDERS, {
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (loadingConsiders === false && dataConsiders) {
      setDataList((dataList) => {
        const validTypes = Object.values(NOTIFICATION_TYPE);
        const newList = [...dataList, ...dataConsiders.considers.edges];

        // Filter out not-support-yet type
        const filteredList = newList.filter((data) =>
          validTypes.includes(data.node.type)
        );

        // Xác định các considerNode sẽ hiển thị ngày tạo đầu tiên cho mỗi ngày
        let dataShowDate = [];
        const finalList = filteredList.map((considerNode) => {
          let date = considerNode.node.createdAt.substring(0, 10);
          let isShowDate = false;
          if (!dataShowDate.includes(date)) {
            isShowDate = true;
            dataShowDate.push(date);
          }
          return {
            node: {
              ...considerNode.node,
              isShowDate: isShowDate,
            },
          };
        });

        return finalList;
      });
    }
  }, [loadingConsiders, dataConsiders]);

  const groupDataListByDate = (dataList) => {
    const groupList = groupBy(dataList, (data) => {
      return data.node.createdAt.substring(0, 10);
    });

    return values(groupList);
  };

  return (
    <div className="notification-page">
      <PageHeader title={<FormattedMessage id="notification.index.title" />} />
      <div className="wrapper-notification">
        <NotificationFilter
          setFilter={setFilter}
          setDataList={setDataList}
          setCurrentDateOnScroll={setCurrentDateOnScroll}
        />
        <Block className="notification-data">
          <div className="wrapper-preview-date" ref={listDateRef}>
            <div className="date-list__heading">
              <FormattedMessage id="notification.dateList.date" />
            </div>
            <CustomScrollbars>
              <DateList
                dataList={dataList}
                listDateRef={listDateRef}
                currentDateOnScroll={currentDateOnScroll}
                listDateOnScrollRef={listDateOnScrollRef}
                setCurrentDateOnScroll={setCurrentDateOnScroll}
              />
            </CustomScrollbars>
          </div>
          <div className="wrapper-data" ref={scrollViewRef}>
            <CustomScrollbars>
              {Boolean(dataList.length) && (
                <MarkAllAsReadButton
                  dataList={dataList}
                  setDataList={setDataList}
                />
              )}
              <InfiniteScroll
                className="notification-scroll"
                initialLoad={false}
                pageStart={0}
                loadMore={() => {
                  const endCursor = dataConsiders?.considers.pageInfo.endCursor;
                  const hasMore = dataConsiders?.considers.pageInfo.hasNextPage;

                  if (endCursor && hasMore) {
                    loadConsiders({
                      variables: {
                        filter: filter,
                        after: endCursor,
                      },
                    });
                  }
                }}
                hasMore={dataConsiders?.considers.pageInfo.hasNextPage}
                useWindow={false}
              >
                <List
                  className="wrapper-list-notification"
                  dataSource={groupDataListByDate(dataList)}
                  locale={{ emptyText: <EmptyData /> }}
                  renderItem={(item, index) => (
                    <NotificationGroupByDate
                      key={index}
                      group={item}
                      ref={listDateOnScrollRef}
                      scrollViewRef={scrollViewRef}
                      setDataList={setDataList}
                      setModalVisible={setModalVisible}
                      setSelectConsider={setSelectConsider}
                      setCurrentDateOnScroll={setCurrentDateOnScroll}
                    />
                  )}
                >
                  {loadingConsiders && (
                    <div className="notification__spinner">
                      <Spin />
                    </div>
                  )}
                </List>
              </InfiniteScroll>
            </CustomScrollbars>
          </div>
        </Block>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        data={selectConsider}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
    </div>
  );
};

export default Notification;
