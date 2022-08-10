import React from "react";
import VisibilitySensor from "react-visibility-sensor";
import NotificationItem from "../NotificationItem";

import { useIntl } from "react-intl";

import moment from "moment";

const NotificationGroupByDate = React.forwardRef((props, ref) => {
  const intl = useIntl();
  const {
    group,
    scrollViewRef,
    setDataList,
    setModalVisible,
    setSelectConsider,
    setCurrentDateOnScroll,
  } = props;

  const formatedDate = moment(group[0].node.createdAt).format(
    intl.formatMessage({ id: "notification.date.format" })
  );

  const handleChange = (isVisible) => {
    if (isVisible) {
      // console.log(`${formatedDate} is visible`);
      setCurrentDateOnScroll((state) => [...state, formatedDate]);
    } else {
      // console.log(`${formatedDate} is hidden`);
      setCurrentDateOnScroll((state) =>
        state.filter((date) => date !== formatedDate)
      );
    }
  };

  return (
    <VisibilitySensor
      onChange={handleChange}
      offset={{
        top: 200,
        bottom: 400,
      }}
      partialVisibility={200}
      scrollCheck={true}
      scrollDelay={1000}
      intervalDelay={1000}
      containment={scrollViewRef?.current}
    >
      <div
        className="group-wrapper"
        ref={(el) => {
          if (!Boolean(ref?.current)) {
            ref.current = {};
          }

          ref.current[formatedDate] = el;
          return;
        }}
      >
        {group.map((data) => {
          return (
            <NotificationItem
              key={data.node.id}
              data={data.node}
              setDataList={setDataList}
              setModalVisible={setModalVisible}
              setSelectConsider={setSelectConsider}
            />
          );
        })}
      </div>
    </VisibilitySensor>
  );
});

export default NotificationGroupByDate;
