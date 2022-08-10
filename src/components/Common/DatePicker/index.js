import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

import { DATE_PICKER_FORMAT } from '../../../constants';
import iconCalendar from './images/Calendar.svg';

const DatePicker = ({ style, dateFormat = DATE_PICKER_FORMAT, ...rest }) => {
    return (
        <AntdDatePicker
            format={dateFormat}
            suffixIcon={<div style={{
                background: `url(${iconCalendar})`,
                width: 14,
                height: 14,
                backgroundSize: 'cover'
            }} />}
            style={{
                ...style,
                minWidth: 150,
            }}
            {...rest}
        />
    );
}

export default DatePicker;
