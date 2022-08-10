import React,{ useCallback } from 'react';
import { useIntl} from "react-intl";
import { Row, Col } from 'antd';
import moment from "moment";

import Form from "../../../components/Common/Form";
import Panel from "../../../components/Common/Panel";
import DatePicker from "../../../components/Common/DatePicker";
import FacilitiesSelect from '../../../components/Common/FacilitiesSelect';
import ShiftAndTurn from './ShiftAndTurn';
import { useFactilityContext } from '../../../components/Common/FacilitiesSelect/context';

import { datePickerMinMax } from '../../../utils';
import {
    CSS_PREFIX,
    MORNING_GOOUT,
    MORNING_BACK,
    AFTERNOON_GOOUT,
    AFTERNOON_BACK,

    TIME_SHIFT_MORNING,
    TIME_SHIFT_AFTERNOON,
    TURN_AWAY,
    TURN_BACK,
    MORNING,
    AFTERNOON
} from '../constants';

import { DATE_REQUEST_FORMAT } from '../../../constants'

import './style.scss';

const FilterForm = ({ activeTab, setActiveTab, setFilterData, loading }) => {
    const [form] = Form.useForm();
    const intl = useIntl();

    const { facilities } = useFactilityContext();

    const handleOnFieldsChange = useCallback((changedFields) => {
        const values = form.getFieldsValue();
        if (activeTab !== values.shiftAndTurn) {
            setActiveTab(values.shiftAndTurn);
        }

        let nearestShiftTurn = values.shiftAndTurn;

        if (changedFields[0]?.name[0] === 'facility') {
            const selectedCampus = facilities.find(item => item.id === values.facility);
            if (selectedCampus && selectedCampus.nearestTurn && selectedCampus.nearestShift) {
                if (selectedCampus.nearestShift === MORNING && selectedCampus.nearestTurn === TURN_AWAY) {
                    nearestShiftTurn = MORNING_GOOUT;
                    form.setFieldsValue({
                        shiftAndTurn: MORNING_GOOUT,
                    });
                } else if (selectedCampus.nearestShift === MORNING && selectedCampus.nearestTurn === TURN_BACK) {
                    nearestShiftTurn = MORNING_BACK;
                    form.setFieldsValue({
                        shiftAndTurn: MORNING_BACK,
                    });
                } else if (selectedCampus.nearestShift === AFTERNOON && selectedCampus.nearestTurn === TURN_AWAY) {
                    nearestShiftTurn = AFTERNOON_GOOUT;
                    form.setFieldsValue({
                        shiftAndTurn: AFTERNOON_GOOUT,
                    });
                } else if (selectedCampus.nearestShift === AFTERNOON && selectedCampus.nearestTurn === TURN_BACK) {
                    nearestShiftTurn = AFTERNOON_BACK;
                    form.setFieldsValue({
                        shiftAndTurn: AFTERNOON_BACK,
                    });
                }
            }
        }
        if (values.date) {
            // call api
            const params = {
                date: values.date.format(DATE_REQUEST_FORMAT),
                turn: [MORNING_GOOUT, AFTERNOON_GOOUT].includes(nearestShiftTurn) ? TURN_AWAY : TURN_BACK,
                shift: [MORNING_GOOUT, MORNING_BACK].includes(nearestShiftTurn) ? TIME_SHIFT_MORNING : TIME_SHIFT_AFTERNOON,
            }
            if (values.facility) {
                params.campusId = Number(values.facility);
            }
            setFilterData(params)
        }
    }, [form, activeTab, setActiveTab, setFilterData, facilities]);

    return (
        <div className={`${CSS_PREFIX}__filter-form`}>
            <Panel className="filter-form__panel" loading={loading}>
                <Form
                    colon={false}
                    form={form}
                    initialValues={{
                        shiftAndTurn: activeTab,
                        date: moment(),
                    }}
                    onFieldsChange={handleOnFieldsChange}
                >
                    <Row gutter={24}>
                        <Col flex="250px">
                            <Form.Item
                                labelAlign="left"
                                label={intl.formatMessage({
                                    id: 'student.transportation.statistic.filterForm.date',
                                })}
                                name="date"
                            >
                                <DatePicker inputReadOnly disabledDate={datePickerMinMax(-30, 0)} allowClear={false} />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                labelAlign="left"
                                label={intl.formatMessage({
                                    id: 'student.transportation.statistic.filterForm.facility',
                                })}
                                name="facility"
                            >
                                <FacilitiesSelect
                                    allLabel={false}
                                    defaultMainCampus
                                    dropdownMatchSelectWidth={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col flex="auto">
                            <Form.Item
                                labelAlign="left"
                                label=""
                                name="shiftAndTurn"
                            >
                                <ShiftAndTurn />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Panel>
        </div>
    );
}

export default FilterForm;
