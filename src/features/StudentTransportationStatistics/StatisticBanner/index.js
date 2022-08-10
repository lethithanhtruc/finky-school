import React from 'react';
import { Spin } from 'antd';
import StatisticBlock from './StatisticBlock';
import {
    CSS_PREFIX,
    STATISTIC_BLOCK_SUMMARY_TYPE,
    STATISTIC_BLOCK_FINISH_TYPE,
    STATISTIC_BLOCK_UNFINISHED_TYPE,
    STATISTIC_BLOCK_ONTIME_TYPE,
    STATISTIC_BLOCK_ONLATE_TYPE,
    SCHEDULE_LOGS_STATISTIC,
} from '../constants';
import './style.scss';

const StatisticBanner = ({ activeTab, data = SCHEDULE_LOGS_STATISTIC, loading }) => {
    const {
        totalVehicles,
        totalVehiclesCompleted,
        totalVehiclesNotCompleted,
        totalVehiclesOnTime,
        totalVehiclesRunningLate,
    } = data;
    return (
        <div className={`${CSS_PREFIX}__statistic-banner`}>
            <StatisticBlock total={totalVehicles} type={STATISTIC_BLOCK_SUMMARY_TYPE} activeTab={activeTab} />
            <StatisticBlock total={totalVehiclesCompleted} type={STATISTIC_BLOCK_FINISH_TYPE} />
            <StatisticBlock total={totalVehiclesNotCompleted} type={STATISTIC_BLOCK_UNFINISHED_TYPE} />
            <StatisticBlock total={totalVehiclesOnTime} type={STATISTIC_BLOCK_ONTIME_TYPE} />
            <StatisticBlock total={totalVehiclesRunningLate} type={STATISTIC_BLOCK_ONLATE_TYPE} />
            <div className="empty-block" />
            <div className="empty-block" />
            <div className="empty-block" />
            <div className="empty-block" />
            <div className="empty-block" />
            {loading && (<div className="statistic-banner__loading" ><Spin /></div>)}
        </div>
    );
}

export default StatisticBanner;
