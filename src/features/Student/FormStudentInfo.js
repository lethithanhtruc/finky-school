import React, {useState, useEffect} from 'react';
import {Col, Form, Input, Row, Select, DatePicker, Space, Button, message, Image, Radio} from "antd";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_RELEVANT_DATA_FOR_CREATE_STUDENT, SUBJECTS, STUDENT_CODE_GENERATE} from "./gql";
import moment from "moment";
import {
    CAMPUS_REPRESENTATIVE_POSITIONS,
    STUDENT_EMERGENCY_CONTACT,
    STUDENT_LIVE_WITH,
    STUDENT_RELATIONSHIP,
    STUDENT_STATUS
} from '../../constants';
import { CameraOutlined } from '@ant-design/icons';
import './FormStudentInfo.scss';
import {FormattedMessage, useIntl} from "react-intl";
import UploadImage from "../../components/Common/UploadImage";

const FormStudentInfo = ({setAvatar, isOnlyRead, dataStudent, onCancel, onOk, error}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [isDisabledButtonSubmit, setIsDisabledButtonSubmit] = useState(false);

    // ----------
    // Đổ dữ liệu edit vào form (nếu có)
    // ----------
    useEffect(() => {
        resetFields(dataStudent);
    }, [dataStudent]);

    const resetFields = (dataStudent=null) => {
        if(dataStudent){
            // console.log('zzz', dataStudent)
            form.setFieldsValue({
                selCampus: dataStudent.campusId,
                selStatus: dataStudent.status,
                txtName: dataStudent.name,
                dateBirthday: dataStudent.birthday ? moment(dataStudent.birthday) : null,
                radGender: dataStudent.gender,
                selProvinceOfBirth: dataStudent.provinceIdOfBirth,
                selLiveWith: dataStudent.liveWith,
                selEmergencyContact: dataStudent.emergencyContact,
                txtCode: dataStudent.code,
                startedAt: dataStudent.startedAt ? moment(dataStudent.startedAt) : null,
                endedAt: dataStudent.endedAt ? moment(dataStudent.endedAt) : null,
                txtNote: dataStudent.note,
            });

            dataStudent.parentages.map((parentage, index) => {
                // console.log(parentage.studentRelationship)
                if(parentage.studentRelationship === "FATHER"){
                    form.setFieldsValue({
                        txtNameParent1: parentage.name,
                        txtRelationship1: parentage.studentRelationship,
                        txtPhoneParent1: parentage.phone,
                        txtEmail1: parentage.email,
                        txtAddress1: parentage.address,
                    });
                }else if(parentage.studentRelationship === "MOTHER"){
                    form.setFieldsValue({
                        txtNameParent2: parentage.name,
                        txtRelationship2: parentage.studentRelationship,
                        txtPhoneParent2: parentage.phone,
                        txtEmail2: parentage.email,
                        txtAddress2: parentage.address,
                    });
                }else{
                    if(dataStudent.liveWith === 'GRANDPARENTS'){
                        if(parentage.studentRelationship === "GRANDFATHER" || parentage.studentRelationship === "GRANDMOTHER"){
                            form.setFieldsValue({
                                txtNameParent3: parentage.name,
                                txtRelationship3: parentage.studentRelationship,
                                txtPhoneParent3: parentage.phone,
                                txtEmail3: parentage.email,
                                txtAddress3: parentage.address,
                            });
                        }
                    }else if(dataStudent.liveWith === 'RELATIVES'){
                        if(parentage.studentRelationship === "RELATIVES"){
                            form.setFieldsValue({
                                txtNameParent3: parentage.name,
                                txtRelationship3: parentage.studentRelationship,
                                txtPhoneParent3: parentage.phone,
                                txtEmail3: parentage.email,
                                txtAddress3: parentage.address,
                            });
                        }
                    }
                }
            });
        }else{

        }
    };

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForCreateStudent, error: errorRelevantDataForCreateStudent, data: dataRelevantDataForCreateStudent } = useQuery(GET_RELEVANT_DATA_FOR_CREATE_STUDENT);
    useEffect(() => {
        if(loadingRelevantDataForCreateStudent === false && dataRelevantDataForCreateStudent){
            console.log(dataRelevantDataForCreateStudent)
            // form.setFieldsValue({ selCampus: dataRelevantDataForCreateStudent.campuses.data[0].id });
        }
    }, [loadingRelevantDataForCreateStudent, dataRelevantDataForCreateStudent]);

    // ----------
    // Query sinh mã học sinh tự động
    // ----------
    const [loadStudentCodeGenerate, { loading: loadingStudentCodeGenerate, error: errorStudentCodeGenerate, data: dataStudentCodeGenerate }] = useLazyQuery(STUDENT_CODE_GENERATE);
    useEffect(() => {
        if(loadingStudentCodeGenerate === false && dataStudentCodeGenerate){
            form.setFieldsValue({ txtCode: dataStudentCodeGenerate.studentCodeGenerate });
        }
    }, [loadingStudentCodeGenerate, dataStudentCodeGenerate]);

    // ----------
    // Xử lý lỗi trả về từ mutation create hoặc update
    // ----------
    useEffect(() => {
        if(error){
            let errorFields = [];

            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.campus_id){
                errorFields.push({
                    name: 'selCampus',
                    errors: ['Cơ sở đã chọn không tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'selCampus',
                    errors: []
                });
            }
            if(
                error.graphQLErrors[0]?.extensions?.validation
                && (
                    (dataStudent && error.graphQLErrors[0].extensions.validation['parentages.upsertByStudentRelationship.0.phone'])
                    || (!dataStudent && error.graphQLErrors[0].extensions.validation['parentages.create.0.phone'])
                )
            ){
                errorFields.push({
                    name: 'txtPhoneParent1',
                    errors: ['Số điện thoại đã tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'txtPhoneParent1',
                    errors: []
                });
            }
            if(
                error.graphQLErrors[0]?.extensions?.validation
                && (
                    (dataStudent && error.graphQLErrors[0].extensions.validation['parentages.upsertByStudentRelationship.1.phone'])
                    || (!dataStudent && error.graphQLErrors[0].extensions.validation['parentages.create.1.phone'])
                )
            ){
                errorFields.push({
                    name: 'txtPhoneParent2',
                    errors: ['Số điện thoại đã tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'txtPhoneParent2',
                    errors: []
                });
            }
            if(
                error.graphQLErrors[0]?.extensions?.validation
                && (
                    (dataStudent && error.graphQLErrors[0].extensions.validation['parentages.upsertByStudentRelationship.2.phone'])
                    || (!dataStudent && error.graphQLErrors[0].extensions.validation['parentages.create.2.phone'])
                )
            ){
                errorFields.push({
                    name: 'txtPhoneParent3',
                    errors: ['Số điện thoại đã tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'txtPhoneParent3',
                    errors: []
                });
            }
            if(
                error.graphQLErrors[0]?.extensions?.validation
                && (
                    (dataStudent && error.graphQLErrors[0].extensions.validation['parentages.upsertByStudentRelationship.0.email'])
                    || (!dataStudent && error.graphQLErrors[0].extensions.validation['parentages.create.0.email'])
                )
            ){
                errorFields.push({
                    name: 'txtEmail1',
                    errors: ['Email đã tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'txtEmail1',
                    errors: []
                });
            }
            if(
                error.graphQLErrors[0]?.extensions?.validation
                && (
                    (dataStudent && error.graphQLErrors[0].extensions.validation['parentages.upsertByStudentRelationship.1.email'])
                    || (!dataStudent && error.graphQLErrors[0].extensions.validation['parentages.create.1.email'])
                )
            ){
                errorFields.push({
                    name: 'txtEmail2',
                    errors: ['Email đã tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'txtEmail2',
                    errors: []
                });
            }
            if(
                error.graphQLErrors[0]?.extensions?.validation
                && (
                    (dataStudent && error.graphQLErrors[0].extensions.validation['parentages.upsertByStudentRelationship.2.email'])
                    || (!dataStudent && error.graphQLErrors[0].extensions.validation['parentages.create.2.email'])
                )
            ){
                errorFields.push({
                    name: 'txtEmail3',
                    errors: ['Email đã tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'txtEmail3',
                    errors: []
                });
            }
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.code){
                errorFields.push({
                    name: 'txtCode',
                    errors: ['Mã học sinh đã tồn tại']
                });
            }else{
                errorFields.push({
                    name: 'txtCode',
                    errors: []
                });
            }

            if(errorFields.length){
                form.setFields(errorFields);
            }

            message.error('Đã có lỗi xảy ra.');
            setIsDisabledButtonSubmit(false);
        }
    }, [error])

    return (
        <div className="form-student-info">
            <Form
                form={form}
                colon={false}
                initialValues={{
                    selStatus: "STUDYING",
                    radGender: "MALE",
                    selLiveWith: STUDENT_LIVE_WITH[0].value,
                    selEmergencyContact: STUDENT_EMERGENCY_CONTACT[0].value,
                    txtRelationship1: STUDENT_RELATIONSHIP[0].value,
                    txtRelationship2: STUDENT_RELATIONSHIP[1].value,
                }}
                onFinish={(values) => {
                    setIsDisabledButtonSubmit(true);
                    onOk(values);
                }}
            >
                <Row gutter={24}>
                    <Col sm={4}>
                        <UploadImage
                            allowChange={!isOnlyRead}
                            srcInitial={dataStudent?.avatar || null}
                            onChange={file => {
                                setAvatar(file);
                            }}
                        />
                        <Form.Item
                            className="wrapper-item-status"
                            name="selStatus"
                            label={
                                <Space align="end" size={0}>
                                    <FormattedMessage id="student.student-info-form.select-status.label" />
                                    <span className="required">*</span>
                                </Space>
                            }
                            labelCol={{span: 24}}
                            rules={[
                                {
                                    required: true,
                                    message: intl.formatMessage({id: 'validate.required-input'})
                                },
                            ]}
                        >
                            <Select
                                placeholder={intl.formatMessage({id: 'student.student-info-form.select-status.placeholder'})}
                                options={STUDENT_STATUS.map(status => ({
                                    value: status.value,
                                    label: intl.formatMessage({
                                        id: `student.status.${status.label.toLowerCase()}`,
                                    }),
                                }))}
                                disabled={isOnlyRead}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={20}>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtName"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="student.student-info-form.input-fullname.label" />
                                            <span className="required">*</span>
                                        </Space>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                        {
                                            max: 35,
                                            message: 'Thông tin này không được dài hơn 35 kí tự'
                                        },
                                        {
                                            pattern: /^[\s\p{L}]+$/u,
                                            message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-fullname.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="radGender"
                                    label={<FormattedMessage id="student.student-info-form.radio-gender.label" />}
                                >
                                    <Radio.Group
                                        disabled={isOnlyRead}
                                    >
                                        <Radio value="MALE">
                                            <FormattedMessage id="student.student-info-form.radio-gender.value.male" />
                                        </Radio>
                                        <Radio value="FEMALE">
                                            <FormattedMessage id="student.student-info-form.radio-gender.value.female" />
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="dateBirthday"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="student.student-info-form.picker-birthday.label" />
                                            <span className="required">*</span>
                                        </Space>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'student.student-info-form.picker-birthday.placeholder'})}
                                        style={{width: '100%'}}
                                        showToday={false}
                                        disabledDate={current => {
                                            return current && current >= moment().startOf('day');
                                        }}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selProvinceOfBirth"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="student.student-info-form.select-province-of-birth.label" />
                                            <span className="required">*</span>
                                        </Space>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={intl.formatMessage({id: 'student.student-info-form.select-province-of-birth.placeholder'})}
                                        options={dataRelevantDataForCreateStudent?.provinces.map(province => ({
                                            value: province.id,
                                            label: province.name,
                                        }))}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selLiveWith"
                                    label={<FormattedMessage id="student.student-info-form.select-live-with.label" />}
                                >
                                    <Select
                                        placeholder={intl.formatMessage({id: 'student.student-info-form.select-live-with.placeholder'})}
                                        options={STUDENT_LIVE_WITH.map(liveWith => ({
                                            value: liveWith.value,
                                            label: intl.formatMessage({
                                                id: `student.live-with.${liveWith.label.toLowerCase()}`,
                                            }),
                                        }))}
                                        disabled={isOnlyRead}
                                        onChange={(value, option) => {
                                            if(!['PARENTS', 'GRANDPARENTS', 'FATHER', 'MOTHER'].includes(value)){
                                                form.setFieldsValue({
                                                    txtRelationship3: value
                                                })
                                            }else if(value === 'PARENTS'){
                                                form.setFieldsValue({
                                                    txtAddress2: ''
                                                })
                                            }else if(value === 'GRANDPARENTS'){
                                                form.setFieldsValue({
                                                    txtRelationship3: 'GRANDFATHER'
                                                })
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    label={<FormattedMessage id="student.student-info-form.select-emergency-contact.label" />}
                                >
                                    <Space align="start">
                                        <Form.Item
                                            name="selEmergencyContact"
                                            label=""
                                        >
                                            <Select
                                                placeholder={intl.formatMessage({id: 'student.student-info-form.select-emergency-contact.placeholder'})}
                                                options={STUDENT_EMERGENCY_CONTACT.map(emergencyContact => ({
                                                    value: emergencyContact.value,
                                                    label: intl.formatMessage({
                                                        id: `student.emergency-contact.${emergencyContact.label.toLowerCase()}`,
                                                    }),
                                                }))}
                                                disabled={isOnlyRead}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label=""
                                        >
                                            <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-emergency-number.placeholder'})} disabled />
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="wrapper-parentages">
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.selLiveWith !== currentValues.selLiveWith}
                            >
                                {({ getFieldValue, setFieldsValue }) => {
                                    return (
                                        <>
                                            <Row gutter={24}>
                                                <Col sm={8}>
                                                    <Form.Item
                                                        name="txtNameParent1"
                                                        label={
                                                            <Space align="end" size={0}>
                                                                <FormattedMessage id="student.student-info-form.input-parent-fullname.label" />
                                                                {getFieldValue('selLiveWith') != 'MOTHER' && (
                                                                    <span className="required">*</span>
                                                                )}
                                                            </Space>
                                                        }
                                                        rules={getFieldValue('selLiveWith') == 'MOTHER' ? [] : [
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                            {
                                                                max: 35,
                                                                message: 'Thông tin này không được dài hơn 35 kí tự'
                                                            },
                                                            {
                                                                pattern: /^[\s\p{L}]+$/u,
                                                                message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                                            }
                                                        ]}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-fullname.placeholder'})} disabled={isOnlyRead} />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Item
                                                        name="txtPhoneParent1"
                                                        label={
                                                            <Space align="end" size={0}>
                                                                <FormattedMessage id="student.student-info-form.input-parent-phone.label" />
                                                                {getFieldValue('selLiveWith') != 'MOTHER' && (
                                                                    <span className="required">*</span>
                                                                )}
                                                            </Space>
                                                        }
                                                        rules={getFieldValue('selLiveWith') == 'MOTHER' ? [] : [
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                            {
                                                                min: 10,
                                                                message: 'Thông tin này không được ngắn hơn 10 kí tự'
                                                            },
                                                            {
                                                                max: 30,
                                                                message: 'Thông tin này không được dài hơn 30 kí tự'
                                                            },
                                                            ({ getFieldValue }) => ({
                                                                validator(_, value) {
                                                                    let phone = value;
                                                                    if(phone && phone.length >= 10){
                                                                        if(phone.indexOf('+84') === 0){
                                                                            phone = "0" + phone.substring(3);
                                                                        }
                                                                        phone = phone.replaceAll(/[\W]/ig, '');
                                                                        if (phone.length < 10) {
                                                                            return Promise.reject('Thông tin này không được ngắn hơn 10 kí tự (Không tính các kí tự đặc biệt)');
                                                                        }
                                                                    }

                                                                    return Promise.resolve();
                                                                },
                                                            }),
                                                            {
                                                                pattern: /^[\s0-9\+\.\(\)]+$/u,
                                                                message: 'Thông tin này không được chứa chữ cái và các kí tự đặc biệt, ngoại trừ kí tự + . ( )'
                                                            }
                                                        ]}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-phone.placeholder'})} disabled={isOnlyRead} />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Item
                                                        name="txtRelationship1"
                                                        label={<FormattedMessage id="student.student-info-form.select-parent-relationship.label" />}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            placeholder={intl.formatMessage({id: 'student.student-info-form.select-parent-relationship.placeholder'})}
                                                            options={STUDENT_RELATIONSHIP.filter(relationship => relationship.value == 'FATHER').map(relationship => ({
                                                                value: relationship.value,
                                                                label: intl.formatMessage({
                                                                    id: `student.relationship.${relationship.label.toLowerCase()}`,
                                                                }),
                                                            }))}
                                                            disabled={isOnlyRead}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form.Item
                                                        name="txtEmail1"
                                                        label={<FormattedMessage id="student.student-info-form.input-parent-email.label" />}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-email.placeholder'})} disabled={isOnlyRead} />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form.Item
                                                        name="txtAddress1"
                                                        label={
                                                            <Space align="end" size={0}>
                                                                <FormattedMessage id="student.student-info-form.input-parent-address.label" />
                                                                {getFieldValue('selLiveWith') != 'MOTHER' && (
                                                                    <span className="required">*</span>
                                                                )}
                                                            </Space>
                                                        }
                                                        rules={getFieldValue('selLiveWith') == 'MOTHER' ? [] : [
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                            {
                                                                max: 255,
                                                                message: 'Thông tin này không được dài hơn 255 kí tự'
                                                            },
                                                            {
                                                                pattern: /^[-\.\s0-9,\/\p{L}]+$/u,
                                                                message: 'Thông tin này không được chứa các kí tự đặc biệt, ngoại trừ kí tự - , và /'
                                                            }
                                                        ]}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-address.placeholder'})} disabled={isOnlyRead} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={24}>
                                                <Col sm={8}>
                                                    <Form.Item
                                                        name="txtNameParent2"
                                                        label={
                                                            <Space align="end" size={0}>
                                                                <FormattedMessage id="student.student-info-form.input-parent-fullname.label" />
                                                                {getFieldValue('selLiveWith') != 'FATHER' && (
                                                                    <span className="required">*</span>
                                                                )}
                                                            </Space>
                                                        }
                                                        rules={getFieldValue('selLiveWith') == 'FATHER' ? [] : [
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                            {
                                                                max: 35,
                                                                message: 'Thông tin này không được dài hơn 35 kí tự'
                                                            },
                                                            {
                                                                pattern: /^[\s\p{L}]+$/u,
                                                                message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                                            }
                                                        ]}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-fullname.placeholder'})} disabled={isOnlyRead} />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Item
                                                        name="txtPhoneParent2"
                                                        label={
                                                            <Space align="end" size={0}>
                                                                <FormattedMessage id="student.student-info-form.input-parent-phone.label" />
                                                                {getFieldValue('selLiveWith') != 'FATHER' && (
                                                                    <span className="required">*</span>
                                                                )}
                                                            </Space>
                                                        }
                                                        rules={getFieldValue('selLiveWith') == 'FATHER' ? [] : [
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                            {
                                                                min: 10,
                                                                message: 'Thông tin này không được ngắn hơn 10 kí tự'
                                                            },
                                                            {
                                                                max: 30,
                                                                message: 'Thông tin này không được dài hơn 30 kí tự'
                                                            },
                                                            ({ getFieldValue }) => ({
                                                                validator(_, value) {
                                                                    let phone = value;
                                                                    if(phone && phone.length >= 10){
                                                                        if(phone.indexOf('+84') === 0){
                                                                            phone = "0" + phone.substring(3);
                                                                        }
                                                                        phone = phone.replaceAll(/[\W]/ig, '');
                                                                        if (phone.length < 10) {
                                                                            return Promise.reject('Thông tin này không được ngắn hơn 10 kí tự (Không tính các kí tự đặc biệt)');
                                                                        }
                                                                    }

                                                                    return Promise.resolve();
                                                                },
                                                            }),
                                                            {
                                                                pattern: /^[\s0-9\+\.\(\)]+$/u,
                                                                message: 'Thông tin này không được chứa chữ cái và các kí tự đặc biệt, ngoại trừ kí tự + . ( )'
                                                            }
                                                        ]}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-phone.placeholder'})} disabled={isOnlyRead} />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={8}>
                                                    <Form.Item
                                                        name="txtRelationship2"
                                                        label={<FormattedMessage id="student.student-info-form.select-parent-relationship.label" />}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            placeholder={intl.formatMessage({id: 'student.student-info-form.select-parent-relationship.placeholder'})}
                                                            options={STUDENT_RELATIONSHIP.filter(relationship => relationship.value == 'MOTHER').map(relationship => ({
                                                                value: relationship.value,
                                                                label: intl.formatMessage({
                                                                    id: `student.relationship.${relationship.label.toLowerCase()}`,
                                                                }),
                                                            }))}
                                                            disabled={isOnlyRead}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form.Item
                                                        name="txtEmail2"
                                                        label={<FormattedMessage id="student.student-info-form.input-parent-email.label" />}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-email.placeholder'})} disabled={isOnlyRead} />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form.Item
                                                        name="txtAddress2"
                                                        label={
                                                            <Space align="end" size={0}>
                                                                <FormattedMessage id="student.student-info-form.input-parent-address.label" />
                                                                {getFieldValue('selLiveWith') != 'PARENTS' && getFieldValue('selLiveWith') != 'FATHER' && (
                                                                    <span className="required">*</span>
                                                                )}
                                                            </Space>
                                                        }
                                                        rules={getFieldValue('selLiveWith') == 'PARENTS' || getFieldValue('selLiveWith') == 'FATHER' ? [] : [
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                            {
                                                                max: 255,
                                                                message: 'Thông tin này không được dài hơn 255 kí tự'
                                                            },
                                                            {
                                                                pattern: /^[-\.\s0-9,\/\p{L}]+$/u,
                                                                message: 'Thông tin này không được chứa các kí tự đặc biệt, ngoại trừ kí tự - , và /'
                                                            }
                                                        ]}
                                                    >
                                                        <Input
                                                            placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-address.placeholder'})}
                                                            disabled={isOnlyRead || getFieldValue('selLiveWith') === 'PARENTS'}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {(['GRANDPARENTS', 'RELATIVES']).includes(getFieldValue('selLiveWith')) && (
                                                <Row gutter={24}>
                                                    <Col sm={8}>
                                                        <Form.Item
                                                            name="txtNameParent3"
                                                            label={
                                                                <Space align="end" size={0}>
                                                                    <FormattedMessage id="student.student-info-form.input-parent-fullname.label" />
                                                                    <span className="required">*</span>
                                                                </Space>
                                                            }
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: intl.formatMessage({id: 'validate.required-input'})
                                                                },
                                                                {
                                                                    max: 35,
                                                                    message: 'Thông tin này không được dài hơn 35 kí tự'
                                                                },
                                                                {
                                                                    pattern: /^[\s\p{L}]+$/u,
                                                                    message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-fullname.placeholder'})} disabled={isOnlyRead} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col sm={8}>
                                                        <Form.Item
                                                            name="txtPhoneParent3"
                                                            label={
                                                                <Space align="end" size={0}>
                                                                    <FormattedMessage id="student.student-info-form.input-parent-phone.label" />
                                                                    <span className="required">*</span>
                                                                </Space>
                                                            }
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: intl.formatMessage({id: 'validate.required-input'})
                                                                },
                                                                {
                                                                    min: 10,
                                                                    message: 'Thông tin này không được ngắn hơn 10 kí tự'
                                                                },
                                                                {
                                                                    max: 30,
                                                                    message: 'Thông tin này không được dài hơn 30 kí tự'
                                                                },
                                                                ({ getFieldValue }) => ({
                                                                    validator(_, value) {
                                                                        let phone = value;
                                                                        if(phone && phone.length >= 10){
                                                                            if(phone.indexOf('+84') === 0){
                                                                                phone = "0" + phone.substring(3);
                                                                            }
                                                                            phone = phone.replaceAll(/[\W]/ig, '');
                                                                            if (phone.length < 10) {
                                                                                return Promise.reject('Thông tin này không được ngắn hơn 10 kí tự (Không tính các kí tự đặc biệt)');
                                                                            }
                                                                        }

                                                                        return Promise.resolve();
                                                                    },
                                                                }),
                                                                {
                                                                    pattern: /^[\s0-9\+\.\(\)]+$/u,
                                                                    message: 'Thông tin này không được chứa chữ cái và các kí tự đặc biệt, ngoại trừ kí tự + . ( )'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-phone.placeholder'})} disabled={isOnlyRead} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col sm={8}>
                                                        <Form.Item
                                                            name="txtRelationship3"
                                                            label={<FormattedMessage id="student.student-info-form.select-parent-relationship.label" />}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: intl.formatMessage({id: 'validate.required-input'})
                                                                },
                                                            ]}
                                                        >
                                                            <Select
                                                                placeholder={intl.formatMessage({id: 'student.student-info-form.select-parent-relationship.placeholder'})}
                                                                options={
                                                                    STUDENT_RELATIONSHIP
                                                                        .filter(relationship => {
                                                                            if(getFieldValue('selLiveWith') === 'GRANDPARENTS'){
                                                                                return relationship.value == 'GRANDFATHER' || relationship.value == 'GRANDMOTHER';
                                                                            }else{
                                                                                return relationship.value == getFieldValue('selLiveWith');
                                                                            }
                                                                        })
                                                                        .map(relationship => ({
                                                                            value: relationship.value,
                                                                            label: intl.formatMessage({
                                                                                id: `student.relationship.${relationship.label.toLowerCase()}`,
                                                                            }),
                                                                        }))
                                                                }
                                                                disabled={isOnlyRead}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col sm={12}>
                                                        <Form.Item
                                                            name="txtEmail3"
                                                            label={<FormattedMessage id="student.student-info-form.input-parent-email.label" />}
                                                        >
                                                            <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-email.placeholder'})} disabled={isOnlyRead} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col sm={12}>
                                                        <Form.Item
                                                            name="txtAddress3"
                                                            label={
                                                                <Space align="end" size={0}>
                                                                    <FormattedMessage id="student.student-info-form.input-parent-address.label" />
                                                                    <span className="required">*</span>
                                                                </Space>
                                                            }
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: intl.formatMessage({id: 'validate.required-input'})
                                                                },
                                                                {
                                                                    max: 255,
                                                                    message: 'Thông tin này không được dài hơn 255 kí tự'
                                                                },
                                                                {
                                                                    pattern: /^[-\.\s0-9,\/\p{L}]+$/u,
                                                                    message: 'Thông tin này không được chứa các kí tự đặc biệt, ngoại trừ kí tự - , và /'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-parent-address.placeholder'})} disabled={isOnlyRead} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )}
                                        </>
                                    );
                                }}
                            </Form.Item>
                        </div>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    name="selCampus"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="student.student-info-form.select-campus.label" />
                                            <span className="required">*</span>
                                        </Space>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={intl.formatMessage({id: 'student.student-info-form.select-campus.placeholder'})}
                                        options={dataRelevantDataForCreateStudent?.campuses.data.map(campus => {
                                            return {
                                                label: campus.name,
                                                value: campus.id,
                                            }
                                        })}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="student.student-info-form.input-code.label" />
                                            <span className="required">*</span>
                                        </Space>
                                    }
                                >
                                    <Row gutter={10}>
                                        <Col flex="auto">
                                            <Form.Item
                                                name="txtCode"
                                                label=""
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: intl.formatMessage({id: 'validate.required-input'})
                                                    },
                                                    {
                                                        max: 20,
                                                        message: 'Thông tin này không được dài hơn 20 kí tự'
                                                    },
                                                    {
                                                        pattern: /^[a-zA-Z0-9]+$/,
                                                        message: 'Thông tin này chỉ được bao gồm chữ và số'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder={intl.formatMessage({id: 'student.student-info-form.input-code.placeholder'})} disabled={isOnlyRead} />
                                            </Form.Item>
                                        </Col>
                                        {!isOnlyRead && (
                                            <Col>
                                                <Form.Item
                                                    className="wrapper-item-code-generate"
                                                    name=""
                                                    label=""
                                                >
                                                    <Button
                                                        type="primary"
                                                        ghost
                                                        disabled={loadingStudentCodeGenerate}
                                                        onClick={() => {
                                                            loadStudentCodeGenerate();
                                                        }}
                                                    >
                                                        <FormattedMessage id="student.student-info-form.button-auto-create.label" />
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        )}
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="startedAt"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="student.student-info-form.picker-started-at.label" />
                                            <span className="required">*</span>
                                        </Space>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'student.student-info-form.picker-started-at.placeholder'})}
                                        style={{width: '100%'}}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="endedAt"
                                    label={<FormattedMessage id="student.student-info-form.picker-ended-at.label" />}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'student.student-info-form.picker-ended-at.placeholder'})}
                                        style={{width: '100%'}}
                                        showToday={false}
                                        disabledDate={current => {
                                            return current && current >= moment().startOf('day');
                                        }}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="txtNote"
                                    label={<FormattedMessage id="student.student-info-form.input-note.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input.TextArea placeholder={intl.formatMessage({id: 'student.student-info-form.input-note.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                        </Row>
                        {!isOnlyRead && (
                            <Row>
                                <Col>
                                    <Form.Item
                                        className="wrapper-item-buttons"
                                        label="&nbsp;"
                                    >
                                        <Space>
                                            <Button
                                                type="primary"
                                                ghost
                                                size="large"
                                                onClick={() => {
                                                    resetFields(dataStudent);
                                                    onCancel();
                                                }}
                                            >
                                                <FormattedMessage id="general.cancel" />
                                            </Button>
                                            <Button
                                                htmlType="submit"
                                                type="primary"
                                                size="large"
                                                disabled={isDisabledButtonSubmit}
                                            >
                                                <FormattedMessage id="general.save" />
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default FormStudentInfo;
