import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import { useIntl } from "react-intl";
import { message } from "antd";

import VisibilitySensor from "react-visibility-sensor";

const DateItem = (props) => {
  const { date, currentDateOnScroll, listDateOnScrollRef, listDateRef } = props;
  const intl = useIntl();
  const ref = useRef();
  const [visible, setVisible] = useState();

  useEffect(() => {
    if (!currentDateOnScroll.length || !ref?.current) {
      return;
    }

    if (currentDateOnScroll[0] === date && !visible) {
      ref.current.scrollIntoView(false);
    }
  }, [currentDateOnScroll]);

  const getClassname = (date) => {
    if (currentDateOnScroll[0] === date && currentDateOnScroll.length) {
      return "date-list__date date-list__date--selected";
    }
    return "date-list__date";
  };

  const handleClick = (date) => {
    if (!Boolean(listDateOnScrollRef.current[date])) {
      message.error(intl.formatMessage({ id: "empty.text" }));
      return;
    }

    listDateOnScrollRef.current[date].scrollIntoView();
  };

  const handleChange = (visible) => {
    setVisible(visible);
  };

  return (
    <VisibilitySensor
      scrollCheck={true}
      scrollDelay={100}
      intervalDelay={100}
      onChange={handleChange}
      containment={listDateRef?.current}
    >
      <div
        ref={ref}
        key={date}
        className={getClassname(date)}
        onClick={() => handleClick(date)}
      >
        {date}
      </div>
    </VisibilitySensor>
  );
};

export default DateItem;
