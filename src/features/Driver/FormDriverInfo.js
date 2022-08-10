import React, {useState, useEffect} from 'react';
import {Col, Form, Input, Row, Select, DatePicker, Space, Button, message, Image, Radio} from "antd";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_RELEVANT_DATA_FOR_CREATE_DRIVER, SUBJECTS, DRIVER_CODE_GENERATE} from "./gql";
import moment from "moment";
import { CameraOutlined } from '@ant-design/icons';
import './FormDriverInfo.scss';
import {FormattedMessage, useIntl} from "react-intl";
import {
    DRIVER_LICENSE_TYPE, DRIVER_STATUS,
    STUDENT_EMERGENCY_CONTACT,
    STUDENT_LIVE_WITH,
    STUDENT_RELATIONSHIP,
    STUDENT_STATUS
} from "../../constants";
import {STUDENT_CODE_GENERATE} from "../Student/gql";
import UploadImage from "../../components/Common/UploadImage";

const FormDriverInfo = ({setAvatar, isOnlyRead, dataDriver, onCancel, onOk, error}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [isDisabledButtonSubmit, setIsDisabledButtonSubmit] = useState(false);

    // ----------
    // Đổ dữ liệu edit vào form (nếu có)
    // ----------
    useEffect(() => {
        if(dataDriver){
            form.setFieldsValue({
                txtName: dataDriver.name,
                radGender: dataDriver.gender,
                dateBirthday: dataDriver.birthday ? moment(dataDriver.birthday) : null,
                selProvinceOfBirth: dataDriver.provinceIdOfBirth,
                txtPhone: dataDriver.phone,
                txtAddress: dataDriver.address,
                selCampus: dataDriver.campusId,
                txtProvider: dataDriver.provider,
                selLicenseType: dataDriver.licenseType,
                dateIssue: dataDriver.dateOfIssue ? moment(dataDriver.dateOfIssue) : null,
                txtCode: dataDriver.code,
                txtStatus: dataDriver.status,
                txtNote: dataDriver.note,
            });
        }
    }, [dataDriver]);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForCreateDriver, error: errorRelevantDataForCreateDriver, data: dataRelevantDataForCreateDriver } = useQuery(GET_RELEVANT_DATA_FOR_CREATE_DRIVER);
    useEffect(() => {
        if(loadingRelevantDataForCreateDriver === false && dataRelevantDataForCreateDriver){
            // console.log(dataRelevantDataForCreateDriver)

            if(!dataDriver || !dataDriver.campusId){
                form.setFieldsValue({ selCampus: dataRelevantDataForCreateDriver.campuses.data[0].id });
            }
        }
    }, [loadingRelevantDataForCreateDriver, dataRelevantDataForCreateDriver]);

    // ----------
    // Query sinh mã tài xế tự động
    // ----------
    const [loadDriverCodeGenerate, { loading: loadingDriverCodeGenerate, error: errorDriverCodeGenerate, data: dataDriverCodeGenerate }] = useLazyQuery(DRIVER_CODE_GENERATE);
    useEffect(() => {
        if(loadingDriverCodeGenerate === false && dataDriverCodeGenerate){
            form.setFieldsValue({ txtCode: dataDriverCodeGenerate.driverCodeGenerate });
        }
    }, [loadingDriverCodeGenerate, dataDriverCodeGenerate]);

    // ----------
    // Xử lý lỗi trả về từ mutation create hoặc update
    // ----------
    useEffect(() => {
        if(error){
            let errorFields = [];
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.phone){
                errorFields.push({
                    name: 'txtPhone',
                    errors: ['Số điện thoại đã tồn tại']
                });
            }
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.campus_id){
                errorFields.push({
                    name: 'selCampus',
                    errors: ['Cơ sở đã chọn không tồn tại']
                });
            }
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.code){
                errorFields.push({
                    name: 'txtCode',
                    errors: ['Mã tài xế đã tồn tại']
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
        <div className="form-driver-info">
            <Form
                form={form}
                colon={false}
                initialValues={{
                    selStatus: DRIVER_STATUS[0].value,
                    selLicenseType: DRIVER_LICENSE_TYPE[0].value,
                    radGender: "MALE",
                }}
                onFinish={(values) => {
                    setIsDisabledButtonSubmit(true);
                    onOk(values);
                }}
            >
                <Row gutter={24}>
                    <Col sm={4}>
                        <UploadImage
                            allowChange={true}
                            srcInitial={dataDriver?.avatar || null}
                            onChange={file => {
                                setAvatar(file);
                            }}
                        />
                    </Col>
                    <Col sm={20}>
                        <Row gutter={24}>
                            <Col sm={24}>
                                <h3 className="wrapper-info">
                                    <FormattedMessage id="driver.driver-info-form.driver-info" />
                                </h3>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtName"
                                    label={<FormattedMessage id="driver.driver-info-form.input-name.label" />}
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
                                    <Input placeholder={intl.formatMessage({id: 'driver.driver-info-form.input-name.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="radGender"
                                    label={<FormattedMessage id="driver.driver-info-form.radio-gender.label" />}
                                >
                                    <Radio.Group
                                        disabled={isOnlyRead}
                                    >
                                        <Radio value="MALE">
                                            <FormattedMessage id="driver.driver-info-form.radio-gender.value.male" />
                                        </Radio>
                                        <Radio value="FEMALE">
                                            <FormattedMessage id="driver.driver-info-form.radio-gender.value.female" />
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="dateBirthday"
                                    label={<FormattedMessage id="driver.driver-info-form.picker-birthday.label" />}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'driver.driver-info-form.picker-birthday.placeholder'})}
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
                                    label={<FormattedMessage id="driver.driver-info-form.select-province-of-birth.label" />}
                                >
                                    <Select
                                        placeholder={intl.formatMessage({id: 'driver.driver-info-form.select-province-of-birth.placeholder'})}
                                        options={dataRelevantDataForCreateDriver?.provinces.map(province => ({
                                            value: province.id,
                                            label: province.name,
                                        }))}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtPhone"
                                    label={<FormattedMessage id="driver.driver-info-form.input-phone.label" />}
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
                                    <Input placeholder={intl.formatMessage({id: 'driver.driver-info-form.input-phone.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtAddress"
                                    label={<FormattedMessage id="driver.driver-info-form.input-address.label" />}
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
                                    <Input placeholder={intl.formatMessage({id: 'driver.driver-info-form.input-address.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col sm={24}>
                                <h3 className="wrapper-info owner">
                                    <FormattedMessage id="driver.driver-info-form.working-info" />
                                </h3>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    name="selCampus"
                                    label={<FormattedMessage id="driver.driver-info-form.select-campus.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={intl.formatMessage({id: 'driver.driver-info-form.select-campus.placeholder'})}
                                        options={dataRelevantDataForCreateDriver?.campuses.data.map(campus => {
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
                                    name="txtProvider"
                                    label={<FormattedMessage id="driver.driver-info-form.input-provider.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'driver.driver-info-form.input-provider.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selLicenseType"
                                    label={<FormattedMessage id="driver.driver-info-form.select-license-type.label" />}
                                >
                                    <Select
                                        options={DRIVER_LICENSE_TYPE.map(licenseType => ({
                                            value: licenseType.value,
                                            label: licenseType.label,
                                        }))}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="dateIssue"
                                    label={<FormattedMessage id="driver.driver-info-form.picker-issue.label" />}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'driver.driver-info-form.picker-issue.placeholder'})}
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
                                    label={<FormattedMessage id="driver.driver-info-form.input-code.label" />}
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
                                                <Input placeholder={intl.formatMessage({id: 'driver.driver-info-form.input-code.placeholder'})} disabled={isOnlyRead} />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                className="wrapper-item-code-generate"
                                                name=""
                                                label=""
                                            >
                                                <Button
                                                    type="primary"
                                                    ghost
                                                    disabled={loadingDriverCodeGenerate}
                                                    onClick={() => {
                                                        loadDriverCodeGenerate();
                                                    }}
                                                >
                                                    <FormattedMessage id="driver.driver-info-form.button-auto-create.label" />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selStatus"
                                    label={<FormattedMessage id="driver.driver-info-form.select-status.label" />}
                                >
                                    <Select
                                        options={DRIVER_STATUS.map(status => ({
                                            value: status.value,
                                            label: intl.formatMessage({
                                                id: `driver.status.${status.label.toLowerCase()}`,
                                            }),
                                        }))}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="txtNote"
                                    label={<FormattedMessage id="driver.driver-info-form.input-note.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input.TextArea placeholder={intl.formatMessage({id: 'driver.driver-info-form.input-note.placeholder'})} disabled={isOnlyRead} />
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
                                                onClick={onCancel}
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

export default FormDriverInfo;
