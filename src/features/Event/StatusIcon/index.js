import React from 'react';
import { STATUS_OPTIONS } from '../constants';

const StatusIcon = ({ type }) => {

  let style = {
      marginRight: 8,
      minWidth: 10,
      minHeight: 10,
      width: 10,
      height: 10,
      borderRadius: '50%',
  }
  if (type === STATUS_OPTIONS.SAVE_DRAFT) {
      style = {
          ...style,
          border: '2px solid #FFBF60'
      };
  }
  if (type === STATUS_OPTIONS.SCHEDULE) {
      style = {
          ...style,
          border: '2px solid #4C87E6'
      };
  }
  if (type === STATUS_OPTIONS.SENDING) {
      style = {
          ...style,
          border: '2px solid #44D581'
      };
  }
  if (type === STATUS_OPTIONS.SEND) {
      style = {
          ...style,
          background: '#44D581'
      };
  }
  if (type === STATUS_OPTIONS.STOP_SEND) {
      style = {
          ...style,
          border: '2px solid #E11900'
      };
  }

  return (
      <span
          style={{
              ...style
          }}
      />
  );
}

export default StatusIcon;