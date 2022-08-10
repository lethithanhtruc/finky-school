import React from 'react';

export const CSS_PREFIX = 'student-transportation-statistics';

export const FILTER_FORM_LAYOUT = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    },
};

export const MORNING_GOOUT = 0;
export const MORNING_BACK = 1;
export const AFTERNOON_GOOUT = 2;
export const AFTERNOON_BACK = 3;

export const MORNING = 'MORNING';
export const AFTERNOON = 'AFTERNOON';

export const TIME_SHIFT_MORNING = 'MORNING';
export const TIME_SHIFT_AFTERNOON = 'AFTERNOON';
export const TURN_AWAY = 'TURN_AWAY';
export const TURN_BACK = 'TURN_BACK';

export const STATISTIC_BLOCK_SUMMARY_TYPE = 'summary';
export const STATISTIC_BLOCK_FINISH_TYPE = 'finish';
export const STATISTIC_BLOCK_UNFINISHED_TYPE = 'unfinish';
export const STATISTIC_BLOCK_ONTIME_TYPE = 'ontime';
export const STATISTIC_BLOCK_ONLATE_TYPE = 'onlate';

export const SCHEDULE_LOGS_STATISTIC = {
    totalVehicles: 0,
    totalVehiclesCompleted: 0,
    totalVehiclesNotCompleted: 0,
    totalVehiclesOnTime: 0,
    totalVehiclesRunningLate: 0,
};