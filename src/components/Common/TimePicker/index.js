import React from 'react';
import { TimePicker as AntdTimePicker } from 'antd';

const TimePicker = ({...rest}) => {
  return (
    <AntdTimePicker
        {...rest}
    />
  );
}

export default TimePicker;