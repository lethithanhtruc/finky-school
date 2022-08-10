import React, { useCallback, useMemo, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useIntl } from "react-intl";

import { Select } from 'antd';

import Checkbox from "../../../components/Common/Checkbox";
import Form from "../../../components/Common/Form";
import Panel from "../../../components/Common/Panel";
import Input from "../../../components/Common/Input";
import FacilitiesSelect from '../../../components/Common/FacilitiesSelect';

import { useValidation } from '../../../utils/validations';
import { useForceUpdate } from '../../../hooks';
import { getDeviceFunctionOptions, getUsedForOptions, getTypeOptions } from '../helpers';
import SettingLocation from './SettingLocation';
import EditDatePicker from './EditDatePicker';
import DeviceStatus from './DeviceStatus';


import './style.scss';

const LAYOUT = {
    labelCol: {
        offset: 4,
        span: 6,
    },
    wrapperCol: {
        offset: 0,
        span: 10,
    },
};

const EditForm = ({
    formType = 'ADD',
    loading,
    children,
    initialValues = {},
    onSubmit,
    validateErrors = {},
    setValidateErrors,
}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const { required, maxLength, pattern } = useValidation();
    const { forceUpdate } = useForceUpdate();

    const formValues = form.getFieldsValue();

    const getText = useCallback((suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.forms.${suffix}`,
        });
    }, [intl]);

    const functionOptions = useMemo(() => {
        return getDeviceFunctionOptions(intl)
    }, [intl]);

    const usedForOptions = useMemo(() => {
        return getUsedForOptions(intl)
    }, [intl]);

    const typeOptions = useMemo(() => {
        return getTypeOptions(intl)
    }, [intl]);

    const handleOnFieldsChange = useCallback((changedFields) => {
        if (changedFields[0]?.name[0] === 'type') {
            forceUpdate();
        }
        if (changedFields[0]?.name[0] === 'campusId') {
            forceUpdate();
        }

        if (Object.keys(validateErrors).includes(changedFields[0]?.name[0])) {
            const updateValidateErrors = { ...validateErrors };
            delete updateValidateErrors[changedFields[0]?.name[0]];
            setValidateErrors({
                ...updateValidateErrors
            });
        }
    }, [forceUpdate, setValidateErrors, validateErrors]);

    useEffect(() => {
        const dataFields = Object.keys(initialValues)
            .map(key => ({ name: key, value: initialValues[key] }));
        form.setFields(dataFields);
        forceUpdate();
    }, [initialValues, form, forceUpdate]);

    const getFieldValidateStatus =  useCallback((fieldName) => {
        if (validateErrors && validateErrors[fieldName]) {
            return 'error';
        }
        return null;
    }, [validateErrors])

    const getHelpField = useCallback((fieldName) => {
        if (validateErrors && validateErrors[fieldName] && validateErrors[fieldName][0]) {
            return validateErrors[fieldName][0];
        }
        return null;
    }, [validateErrors])

    return (
        <div className="device-edit-form">
            <Panel className="edit-form__panel" loading={loading} loadingIcon>
                <Form
                    colon={false}
                    form={form}
                    onFieldsChange={handleOnFieldsChange}
                    // initialValues={initialValues}
                    onFinish={onSubmit}
                >
                    <Row gutter={24}>
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('deviceName')}
                                name="name"
                                {...LAYOUT}
                                rules={[maxLength(40)]}
                                validateStatus={getFieldValidateStatus('name')}
                                help={getHelpField('name')}
                            >
                                <Input placeholder={getText('deviceName.placeholder')} />
                            </Form.Item>
                        </Col>
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('campus')}
                                name="campusId"
                                {...LAYOUT}
                                rules={[required()]}
                                validateStatus={getFieldValidateStatus('campusId')}
                                help={getHelpField('campusId')}
                            >
                                <FacilitiesSelect
                                    key={initialValues.campusId}
                                    allLabel={false}
                                    defaultMainCampus
                                    dropdownMatchSelectWidth={false}
                                />
                            </Form.Item>
                        </Col>
                        {/*  */}
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('deviceIP')}
                                name="ipAddress"
                                {...LAYOUT}
                                validateFirst
                                rules={[required(), maxLength(15), pattern(/^[0-9.]+$/)]}
                                validateStatus={getFieldValidateStatus('ipAddress')}
                                help={getHelpField('ipAddress')}
                            >
                                <Input placeholder={getText('deviceIP.placeholder')}/>
                            </Form.Item>
                        </Col>
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('cloudTopic')}
                                name="topic"
                                {...LAYOUT}
                                rules={[required(), maxLength(7), pattern(/^[0-9]+$/)]}
                                validateStatus={getFieldValidateStatus('topic')}
                                help={getHelpField('topic')}
                            >
                                <Input placeholder={getText('cloudTopic.placeholder')}/>
                            </Form.Item>
                        </Col>
                        {/*  */}
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('deviceType')}
                                name="type"
                                {...LAYOUT}
                                rules={[required()]}

                                validateStatus={getFieldValidateStatus('type')}
                                help={getHelpField('type')}
                            >
                                <Select placeholder={getText('deviceType.placeholder')}>
                                    {typeOptions.map(type => <Select.Option value={type.value}>{type.label}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('settingDate')}
                                name="installedAt"
                                {...LAYOUT}
                                // rules={[required()]}
                                validateStatus={getFieldValidateStatus('installedAt')}
                                help={getHelpField('installedAt')}
                            >
                                <EditDatePicker
                                    style={{ width: '100%' }}
                                    showToday={false}
                                    placeholder={getText('settingDate.placeholder')}
                                />
                            </Form.Item>
                        </Col>
                        {/*  */}
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('deviceFunction')}
                                name="function"
                                {...LAYOUT}
                                rules={[required()]}
                                validateStatus={getFieldValidateStatus('function')}
                                help={getHelpField('function')}
                            >
                                <Checkbox.Group
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    options={functionOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('usedFor')}
                                name="usedFor"
                                {...LAYOUT}
                                rules={[required()]}
                                validateStatus={getFieldValidateStatus('usedFor')}
                                help={getHelpField('usedFor')}
                            >
                                <Checkbox.Group
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    options={usedForOptions}
                                />
                            </Form.Item>
                        </Col>
                        {/*  */}
                        <Col flex="50%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('settingLocation')}
                                name="location"
                                rules={[required()]}
                                {...LAYOUT}
                                validateStatus={getFieldValidateStatus('location')}
                                help={getHelpField('location')}
                            >
                                <SettingLocation
                                    campusId={formValues.campusId}
                                    getText={getText}
                                    disabled={!formValues.type}
                                    type={formValues.type}
                                />
                            </Form.Item>
                        </Col>
                        {/*  */}
                        {formType === 'EDIT' && (
                            <Col flex="50%">
                                <Form.Item
                                    labelAlign="left"
                                    label={getText('deviceStatus')}
                                    name="status"
                                    {...LAYOUT}
                                    validateStatus={getFieldValidateStatus('status')}
                                    help={getHelpField('status')}
                                >
                                    <DeviceStatus />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col flex="100%">
                            <Form.Item
                                labelAlign="left"
                                label={getText('note')}
                                name="note"
                                className="device-edit-form__note"
                                labelCol={{
                                    offset: 2,
                                    span: 3,
                                }}
                                wrapperCol={{
                                    span: 17,
                                }}
                                rules={[maxLength(100)]}
                                validateStatus={getFieldValidateStatus('note')}
                                help={getHelpField('note')}
                            >
                                <Input.TextArea
                                    placeholder={getText('note.placeholder')}
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {children}
                </Form>
            </Panel>
        </div>
    );
}

export default EditForm;
