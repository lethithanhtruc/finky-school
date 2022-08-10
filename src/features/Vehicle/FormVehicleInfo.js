import React, {useState, useEffect} from 'react';
import {Col, Form, Input, InputNumber, Row, Select, DatePicker, Space, Button, message, Image, Radio} from "antd";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_RELEVANT_DATA_FOR_CREATE_VEHICLE, SUBJECTS, VEHICLE_CODE_GENERATE} from "./gql";
import './FormVehicleInfo.scss';
import {FormattedMessage, useIntl} from "react-intl";
import UploadImage from "../../components/Common/UploadImage";

const FormVehicleInfo = ({setAvatar, isOnlyRead, dataVehicle, onCancel, onOk, error}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [isDisabledButtonSubmit, setIsDisabledButtonSubmit] = useState(false);

    // ----------
    // Đổ dữ liệu edit vào form (nếu có)
    // ----------
    useEffect(() => {
        if(dataVehicle){
            form.setFieldsValue({
                txtLicensePlate: dataVehicle.licensePlate,
                txtBrand: dataVehicle.brand,
                txtVersion: dataVehicle.version,
                txtColor: dataVehicle.color,
                txtSeatNumber: dataVehicle.seatNumber,
                selCampus: dataVehicle.campusId,
                txtOwnerName: dataVehicle.ownerName,
                txtOwnerPhone: dataVehicle.ownerPhone,
                txtOwnerEmail: dataVehicle.ownerEmail,
                txtProvider: dataVehicle.provider,
                txtNote: dataVehicle.note,
            });
        }
    }, [dataVehicle]);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForCreateVehicle, error: errorRelevantDataForCreateVehicle, data: dataRelevantDataForCreateVehicle } = useQuery(GET_RELEVANT_DATA_FOR_CREATE_VEHICLE);
    useEffect(() => {
        if(loadingRelevantDataForCreateVehicle === false && dataRelevantDataForCreateVehicle){
            // console.log(dataRelevantDataForCreateVehicle)

            if(!dataVehicle || !dataVehicle.campusId){
                form.setFieldsValue({ selCampus: dataRelevantDataForCreateVehicle.campuses.data[0].id });
            }
        }
    }, [loadingRelevantDataForCreateVehicle, dataRelevantDataForCreateVehicle]);

    // ----------
    // Xử lý lỗi trả về từ mutation create hoặc update
    // ----------
    useEffect(() => {
        if(error){
            let errorFields = [];
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.license_plate){
                errorFields.push({
                    name: 'txtLicensePlate',
                    errors: ['Biển số xe đã tồn tại']
                });
            }

            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.campus_id){
                errorFields.push({
                    name: 'selCampus',
                    errors: ['Cơ sơ đã chọn không có']
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
        <div className="form-vehicle-info">
            <Form
                form={form}
                colon={false}
                onFinish={(values) => {
                    setIsDisabledButtonSubmit(true);
                    onOk(values);
                }}
            >
                <Row gutter={24}>
                    <Col sm={4}>
                        <UploadImage
                            allowChange={true}
                            srcInitial={dataVehicle?.avatar || null}
                            onChange={file => {
                                setAvatar(file);
                            }}
                        />
                    </Col>
                    <Col sm={20}>
                        <Row gutter={24}>
                            <Col sm={24}>
                                <h3 className="wrapper-info">
                                    <FormattedMessage id="vehicle.vehicle-info-form.vehicle-info" />
                                </h3>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtLicensePlate"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-license-plate.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                        {
                                            min: 7,
                                            message: 'Thông tin này phải có tối thiểu 7 kí tự'
                                        },
                                        {
                                            max: 11,
                                            message: 'Thông tin này không được dài hơn 11 kí tự'
                                        },
                                        {
                                            pattern: /^[\.\-a-zA-Z0-9]+$/,
                                            message: 'Thông tin này không được các kí tự đặc biệt, ngoại trừ kí tự . và -'
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-license-plate.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtBrand"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-brand.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-brand.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtVersion"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-version.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-version.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtColor"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-color.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-color.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtSeatNumber"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-seat-number.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Thông tin này bắt buộc điền'
                                        },
                                        {
                                            type: 'number',
                                            min: 4,
                                            max: 99,
                                            message: 'Thông tin phải có giá trị từ 4 - 99'
                                        },
                                    ]}
                                >
                                    <InputNumber style={{width: '100%'}} placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-seat-number.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selCampus"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.select-campus.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Thông tin này bắt buộc chọn'
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.select-campus.placeholder'})}
                                        options={dataRelevantDataForCreateVehicle?.campuses.data.map(campus => {
                                            return {
                                                label: campus.name,
                                                value: campus.id,
                                            }
                                        })}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col sm={24}>
                                <h3 className="wrapper-info owner">
                                    <FormattedMessage id="vehicle.vehicle-info-form.property-info" />
                                </h3>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtOwnerName"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-owner-name.label" />}
                                    rules={[
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
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-owner-name.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtOwnerPhone"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-phone.label" />}
                                    rules={[
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
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-phone.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtOwnerEmail"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-email.label" />}
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'Thông tin này không đúng định dạng email',
                                        },
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-email.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtProvider"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-provider.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-provider.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="txtNote"
                                    label={<FormattedMessage id="vehicle.vehicle-info-form.input-note.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input.TextArea placeholder={intl.formatMessage({id: 'vehicle.vehicle-info-form.input-note.placeholder'})} disabled={isOnlyRead} />
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

export default FormVehicleInfo;
