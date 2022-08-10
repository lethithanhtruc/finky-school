import React, {useState, useEffect} from 'react';
import {Button, Col, Form, Input, message, Row, Select, Space, TimePicker} from "antd";
import UploadImage from "../../components/Common/UploadImage";
import {FormattedMessage, useIntl} from "react-intl";
import {
    CAMPUS_ISMAIN,
    CAMPUS_LEVELS,
    CAMPUS_REPRESENTATIVE_POSITIONS,
    CAMPUS_SCALES,
    CAMPUS_STATUSES
} from "../../constants";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {CAMPUS_CREATE, GET_DISTRICTS, GET_RELEVANT_DATA_FOR_CREATE_OR_UPDATE_CAMPUS} from "./gql";
import Block from "../../components/Common/Block";

const CampusCreateBlock = ({
    dataCampusMain,
    onCancel,
    onOk
}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState(null);
    const [loadingButtonSubmit, setLoadingButtonSubmit] = useState(false);

    // ----------
    // Lấy các data liên quan: tỉnh/thành
    // ----------
    const { loading: loadingRelevantDataForCreateOrUpdate, error: errorRelevantDataForCreateOrUpdate, data: dataRelevantDataForCreateOrUpdate } = useQuery(GET_RELEVANT_DATA_FOR_CREATE_OR_UPDATE_CAMPUS);
    useEffect(() => {
        if(!loadingRelevantDataForCreateOrUpdate && errorRelevantDataForCreateOrUpdate){

        }else if(!loadingRelevantDataForCreateOrUpdate && dataRelevantDataForCreateOrUpdate){
            form.setFieldsValue({
                selCreateProvince: dataCampusMain.province.id,
            });
            loadDistricts({
                variables: {
                    filter: {
                        provinceId: dataCampusMain.province.id
                    }
                }
            });
        }
    }, [loadingRelevantDataForCreateOrUpdate, errorRelevantDataForCreateOrUpdate, dataRelevantDataForCreateOrUpdate])

    // ----------
    // Lấy danh sách quận/huyện
    // ----------
    const [loadDistricts, { loading: loadingDistricts, data: dataDistricts }] = useLazyQuery(GET_DISTRICTS);

    // ----------
    // Mutation thêm cơ sở và xử lý kết quả trả về từ API
    // ----------
    const [campusCreate, { loading: loadingCampusCreate, error: errorCampusCreate, data: dataCampusCreate }] = useMutation(CAMPUS_CREATE);
    useEffect(() => {
        if(!loadingCampusCreate && errorCampusCreate){
            let errorFields = [];
            if(errorCampusCreate.graphQLErrors[0]?.extensions?.validation?.name){
                errorFields.push({
                    name: 'txtCreateName',
                    errors: ['Tên cơ sở đã tồn tại']
                });
            }
            if(errorCampusCreate.graphQLErrors[0]?.extensions?.validation?.address){
                errorFields.push({
                    name: 'txtCreateAddress',
                    errors: ['Địa chỉ đã tồn tại']
                });
            }

            if(errorFields.length){
                form.setFields(errorFields);
            }

            message.error('Đã có lỗi xảy ra.');
            setLoadingButtonSubmit(false);
        }else if(!loadingCampusCreate && dataCampusCreate){
            form.resetFields();
            message.success(intl.formatMessage({id: 'campus.message.added-campus-successfully'}));
            setLoadingButtonSubmit(false);
            onOk();
        }
    }, [loadingCampusCreate, errorCampusCreate, dataCampusCreate])

    // ----------
    // Xử lý submit form edit
    // ----------
    const onSubmitFormCreate = () => {
        setLoadingButtonSubmit(true);
        form
            .validateFields()
            .then(values => {
                let input = {
                    "name": values.txtCreateName,
                    "provinceId": values.selCreateProvince,
                    "districtId": values.selCreateDistrict,
                    "address": values.txtCreateAddress,
                    "representativeName": values.txtCreateRepresentativeName,
                    "representativePosition": values.selCreateRepresentativePosition,
                    "phone": values.txtCreatePhone,
                    "email": values.txtCreateEmail,
                    "level": values.selCreateLevel,
                    "scale": values.selCreateScale,
                    "isActivated": values.selCreateStatus === 'ACTIVATED',
                    "isMain": values.selCreateIsMain === 'MAIN'
                };
                if(values.pickerCreateOperationStart){
                    input.operationStart = values.pickerCreateOperationStart.format('HH:mm');
                }
                if(values.pickerCreateOperationEnd){
                    input.operationEnd = values.pickerCreateOperationEnd.format('HH:mm');
                }
                if(avatar){
                    input.avatar = avatar;
                }
                campusCreate({
                    variables: {
                        "input": input
                    },
                }).catch ((e) => {
                    // console.log(e.graphQLErrors)
                });
            })
            .catch(info => {
                setLoadingButtonSubmit(false);
                // console.log('Validate Failed:', info);
            });
    };

    return (
        <Block title={<FormattedMessage id="campus.index.campus-info-form.add-title" />}>
            <div className="wrapper-campus-info">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        selCreateStatus: 'ACTIVATED',
                    }}
                >
                    <Row gutter={17}>
                        <Col sm={6}>
                            <UploadImage
                                allowChange={true}
                                srcInitial={null}
                                onChange={file => {
                                    setAvatar(file);
                                }}
                            />
                        </Col>
                        <Col sm={18}>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-name.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="txtCreateName"
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
                                                pattern: /^[\s0-9\p{L}]+$/u,
                                                message: 'Thông tin này không được chứa các kí tự đặc biệt'
                                            }
                                        ]}
                                    >
                                        <Input placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.input-name.placeholder'})} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-address.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <>
                                        <Form.Item
                                            name="selCreateProvince"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: intl.formatMessage({id: 'validate.required-select'})
                                                }
                                            ]}
                                        >
                                            <Select
                                                placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.select-province.placeholder'})}
                                                loading={loadingRelevantDataForCreateOrUpdate}
                                                options={dataRelevantDataForCreateOrUpdate?.provinces.map(province => {
                                                    return {
                                                        label: province.name,
                                                        value: province.id,
                                                    }
                                                })}
                                                onChange={(value) => {
                                                    form.setFieldsValue({
                                                        selCreateDistrict: null
                                                    });
                                                    loadDistricts({
                                                        variables: {
                                                            filter: {
                                                                provinceId: value
                                                            }
                                                        }
                                                    });
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="selCreateDistrict"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: intl.formatMessage({id: 'validate.required-select'})
                                                }
                                            ]}
                                        >
                                            <Select
                                                placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.select-district.placeholder'})}
                                                loading={loadingDistricts}
                                                options={dataDistricts?.dictricts.map(district => {
                                                    return {
                                                        label: district.name,
                                                        value: district.id,
                                                    }
                                                })}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="txtCreateAddress"
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
                                            <Input placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.input-address.placeholder'})} />
                                        </Form.Item>
                                    </>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-representative.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="txtCreateRepresentativeName"
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
                                        <Input placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.input-representative.placeholder'})} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-representative-position.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="selCreateRepresentativePosition"
                                        rules={[
                                            {
                                                required: true,
                                                message: intl.formatMessage({id: 'validate.required-select'})
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.select-representative-position.placeholder'})}
                                            options={CAMPUS_REPRESENTATIVE_POSITIONS.map(position => ({
                                                value: position.value,
                                                label: intl.formatMessage({
                                                    id: `campus.representative.position.${position.label.toLowerCase()}`,
                                                }),
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-phone.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="txtCreatePhone"
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
                                        <Input placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.input-phone.placeholder'})} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-email.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="txtCreateEmail"
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
                                        <Input placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.input-email.placeholder'})} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-level.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="selCreateLevel"
                                        rules={[
                                            {
                                                required: true,
                                                message: intl.formatMessage({id: 'validate.required-select'})
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.select-level.placeholder'})}
                                            options={CAMPUS_LEVELS.map(level => ({
                                                value: level.value,
                                                label: intl.formatMessage({
                                                    id: `campus.level.${level.label.toLowerCase()}`,
                                                }),
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-scale.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="selCreateScale"
                                        rules={[
                                            {
                                                required: true,
                                                message: intl.formatMessage({id: 'validate.required-select'})
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.select-scale.placeholder'})}
                                            options={CAMPUS_SCALES.map(scale => ({
                                                value: scale.value,
                                                label: intl.formatMessage({
                                                    id: `campus.scale.${scale.label.toLowerCase()}`,
                                                }),
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.picker-operation-time.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Space size={4}>
                                        <Form.Item
                                            name="pickerCreateOperationStart"
                                        >
                                            <TimePicker
                                                placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.picker-operation-start.placeholder'})}
                                                format="HH:mm"
                                                onChange={() => {}}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="pickerCreateOperationEnd"
                                        >
                                            <TimePicker
                                                placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.picker-operation-end.placeholder'})}
                                                format="HH:mm"
                                                onChange={() => {}}
                                            />
                                        </Form.Item>
                                    </Space>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-status.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="selCreateStatus"
                                        rules={[
                                            {
                                                required: true,
                                                message: intl.formatMessage({id: 'validate.required-select'})
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.select-status.placeholder'})}
                                            options={CAMPUS_STATUSES.map(status => ({
                                                value: status.value,
                                                label: intl.formatMessage({
                                                    id: `campus.status.${status.label.toLowerCase()}`,
                                                }),
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-is-main.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    <Form.Item
                                        name="selCreateIsMain"
                                        rules={[
                                            {
                                                required: true,
                                                message: intl.formatMessage({id: 'validate.required-select'})
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.select-is-main.placeholder'})}
                                            options={CAMPUS_ISMAIN.map(isMain => ({
                                                value: isMain.value,
                                                label: intl.formatMessage({
                                                    id: `campus.is-main.${isMain.label.toLowerCase()}`,
                                                }),
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
                <div className="wrapper-btn-actions">
                    <Button
                        type="primary"
                        ghost
                        size="large"
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        <FormattedMessage id="general.cancel" />
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={loadingButtonSubmit}
                        onClick={onSubmitFormCreate}
                    >
                        <FormattedMessage id="general.save" />
                    </Button>
                </div>
            </div>
        </Block>
    );
}

export default CampusCreateBlock;
