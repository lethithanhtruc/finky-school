import React from 'react';
import { useIntl} from "react-intl";
import {
    CSS_PREFIX,
    STATISTIC_BLOCK_SUMMARY_TYPE,
    STATISTIC_BLOCK_FINISH_TYPE,
    STATISTIC_BLOCK_UNFINISHED_TYPE,
    STATISTIC_BLOCK_ONTIME_TYPE,
    STATISTIC_BLOCK_ONLATE_TYPE,
    MORNING_GOOUT,
    MORNING_BACK,
} from '../constants';

const StatisticBlock = ({ type, total, activeTab }) => {
    const intl = useIntl();
    if (type === STATISTIC_BLOCK_SUMMARY_TYPE) {
        const blockType = [MORNING_GOOUT, MORNING_BACK].includes(activeTab) ? 'morning' : 'afternoon';
        return (
            <div className={`${CSS_PREFIX}__statistic-block ${type} ${blockType}`}>
                <div className="block__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.blocks.summary',
                    })}
                </div>
                <div className="block__total">{total}</div>
            </div>
        );
    }
    if (type === STATISTIC_BLOCK_FINISH_TYPE) {
        return (
            <div className={`${CSS_PREFIX}__statistic-block ${type}`}>
                <div className="block__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.blocks.finish',
                    })}
                </div>
                <div className="block__total">{total}</div>
            </div>
        );
    }
    if (type === STATISTIC_BLOCK_UNFINISHED_TYPE) {
        return (
            <div className={`${CSS_PREFIX}__statistic-block ${type}`}>
                <div className="block__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.blocks.unfinish',
                    })}
                </div>
                <div className="block__total">{total}</div>
            </div>
        );
    }
    if (type === STATISTIC_BLOCK_ONTIME_TYPE) {
        return (
            <div className={`${CSS_PREFIX}__statistic-block ${type}`}>
                <div className="block__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.blocks.ontime',
                    })}
                </div>
                <div className="block__total">{total}</div>
            </div>
        );
    }
    if (type === STATISTIC_BLOCK_ONLATE_TYPE) {
        return (
            <div className={`${CSS_PREFIX}__statistic-block ${type}`}>
                <div className="block__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.blocks.onlate',
                    })}
                </div>
                <div className="block__total">{total}</div>
            </div>
        );
    }
    return null;
}

export default StatisticBlock;
