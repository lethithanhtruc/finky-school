import React,{ useCallback } from 'react';
import { useIntl} from "react-intl";

import {
    MORNING_GOOUT,
    MORNING_BACK,
    AFTERNOON_GOOUT,
    AFTERNOON_BACK,
} from '../constants';

const ShiftAndTurn = ({ value, onChange }) => {
    const intl = useIntl();

    const handleItemClick = useCallback((itemIndex) => () => {
        onChange(itemIndex);
    }, [onChange]);
    return (
        <div className="filter-form__travel-turn">
            <div className="filter-form__travel-turn__label">
                {intl.formatMessage({
                    id: 'student.transportation.statistic.filterForm.travelTurn',
                })}:
            </div>
            <div onClick={handleItemClick(0)} className={`filter-form__travel-turn__item ${value === MORNING_GOOUT ? 'active' : ''}`}>
                {intl.formatMessage({
                    id: 'student.transportation.statistic.filterForm.morningGoOut',
                })}
            </div>
            <div onClick={handleItemClick(1)} className={`filter-form__travel-turn__item ${value === MORNING_BACK ? 'active' : ''}`}>
                {intl.formatMessage({
                    id: 'student.transportation.statistic.filterForm.morningBack',
                })}
            </div>
            <div onClick={handleItemClick(2)} className={`filter-form__travel-turn__item ${value === AFTERNOON_GOOUT ? 'active' : ''}`}>
                {intl.formatMessage({
                    id: 'student.transportation.statistic.filterForm.afternoonGoOut',
                })}
            </div>
            <div onClick={handleItemClick(3)} className={`filter-form__travel-turn__item ${value === AFTERNOON_BACK ? 'active' : ''}`}>
                {intl.formatMessage({
                    id: 'student.transportation.statistic.filterForm.afternoonBack',
                })}
            </div>
        </div>
    );
}

export default ShiftAndTurn;
