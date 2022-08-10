import React, { useState, useCallback, useEffect } from 'react';
import moment from "moment";
import { useForceUpdate } from '../../../hooks';
import EditDatePicker from "../../../components/Common/DatePicker/EditDatePicker";
import EditTimePicker from "../../../components/Common/TimePicker/EditTimePicker";
import { DATE_PICKER_FORMAT, SHORT_TIME } from '../../../constants/datetime';

const SendAt = ({ value, onChange, ...rest }) => {
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const { forceUpdate } = useForceUpdate();

  const [dateString, setDateString] = useState();
  const [timeString, setTimeString] = useState();

  useEffect(() => {
    if (value && !date && !time) {
      setDate(value);
      setTime(value);
      setDateString(moment(value).format(DATE_PICKER_FORMAT));
      setTimeString(moment(value).format(SHORT_TIME));
    }
  }, [value, date, time]);

  useEffect(() => {
    if (dateString && timeString) {
      onChange(moment(`${dateString} ${timeString}`, `${DATE_PICKER_FORMAT} ${SHORT_TIME}`));
    }
  }, [dateString, timeString]);

  const handleDateChange = useCallback((d, dString) => {
    setDate(d);
    setDateString(dString);
    forceUpdate();
  }, [forceUpdate]);

  const handleTimeChange = useCallback((t, tString) => {
    setTime(t);
    setTimeString(tString);
  }, []);

  const getDisabledHours = () => {
    if (date && date.isAfter(moment())) {
      return [];
    }
    var hours = [];
    for(var i =0; i < moment().hour(); i++){
      hours.push(i);
    }
    return hours;
  }

  const getDisabledMinutes = (selectedHour) => {
    if (date && date.isAfter(moment())) {
      return [];
    }
    var minutes= [];
    if (selectedHour === moment().hour()){
      for(var i = 0; i < moment().minute(); i++){
        minutes.push(i);
      }
    }
    return minutes;
  }

  return (
    <span>
      <EditDatePicker
        onChange={handleDateChange}
        value={date}
        showToday={false}
        disabledDate={(current) => {
          return current && moment(current).endOf('day').isBefore(moment());
        }}
      />
      <EditTimePicker
        onChange={handleTimeChange}
        value={time}
        style={{ marginLeft: 5 }}
        showNow={false}
        disabled={!date}
        format="HH:mm"
        disabledHours={getDisabledHours}
        disabledMinutes={getDisabledMinutes}
      />
    </span>
  );
}

export default SendAt;
