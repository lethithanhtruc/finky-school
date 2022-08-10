import React, {useState, useEffect} from 'react';
import {Button, Col, Form, Input, message, Row, Select, Skeleton, Space, TimePicker} from "antd";
import {FormattedMessage, useIntl} from "react-intl";
import {
    CAMPUS_ISMAIN,
    CAMPUS_LEVELS,
    CAMPUS_REPRESENTATIVE_POSITIONS,
    CAMPUS_SCALES,
    CAMPUS_STATUSES
} from "../../constants";
import { PartitionOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ArrowsAltOutlined } from '@ant-design/icons';
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CAMPUS_DELETE,
    CAMPUS_UPDATE,
    GET_DISTRICTS,
    GET_GRADES,
    GET_RELEVANT_DATA_FOR_CREATE_OR_UPDATE_CAMPUS
} from "./gql";
import {useHistory} from "react-router-dom";
import Block from "../../components/Common/Block";
import UploadImage from "../../components/Common/UploadImage";
import moment from "moment";

const CampusEditBlock = ({
     schoolYearId,
     setVisibleCreateCampusBlock,
     dataCampusEdit,
     setDataCampusEdit,
     dataCampusForShowClassrooms,
     setDataCampusForShowClassrooms,
     dataCampus,
     onCancel,
     onOk,
     onDeletedSuccess
}) => {
    const history = useHistory();
    const intl = useIntl();
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState(null);
    const [loadingButtonSubmit, setLoadingButtonSubmit] = useState(false);

    // ----------
    // Lấy các data liên quan: tỉnh/thành
    // ----------
    const [loadRelevantDataForCreateOrUpdate, { loading: loadingRelevantDataForCreateOrUpdate, data: dataRelevantDataForCreateOrUpdate }] = useLazyQuery(GET_RELEVANT_DATA_FOR_CREATE_OR_UPDATE_CAMPUS);

    // ----------
    // Lấy danh sách quận/huyện
    // ----------
    const [loadDistricts, { loading: loadingDistricts, data: dataDistricts }] = useLazyQuery(GET_DISTRICTS);

    // ----------
    // Lấy danh sách khối lớp
    // ----------
    const [loadGrades, { loading: loadingGrades, data: dataGrades }] = useLazyQuery(GET_GRADES);

    // ----------
    // Mutation cập nhật cơ sở và xử lý kết quả trả về từ API
    // ----------
    const [campusUpdate, { loading: loadingCampusUpdate, error: errorCampusUpdate, data: dataCampusUpdate }] = useMutation(CAMPUS_UPDATE);
    useEffect(() => {
        if(!loadingCampusUpdate && errorCampusUpdate){
            let errorFields = [];
            if(errorCampusUpdate.graphQLErrors[0]?.extensions?.validation?.name){
                errorFields.push({
                    name: 'txtName',
                    errors: ['Tên cơ sở đã tồn tại']
                });
            }
            if(errorCampusUpdate.graphQLErrors[0]?.extensions?.validation?.address){
                errorFields.push({
                    name: 'txtAddress',
                    errors: ['Địa chỉ đã tồn tại']
                });
            }

            if(errorFields.length){
                form.setFields(errorFields);
            }

            message.error('Đã có lỗi xảy ra.');
            setLoadingButtonSubmit(false);
        }else if(!loadingCampusUpdate && dataCampusUpdate){
            form.resetFields();
            message.success(intl.formatMessage({id: 'campus.message.edited-campus-successfully'}));
            setLoadingButtonSubmit(false);
            onOk();
        }
    }, [loadingCampusUpdate, errorCampusUpdate]);

    // ----------
    // Mutation Xóa cơ sở và xử lý kết quả trả về từ API
    // ----------
    const [campusDelete, { loading: loadingCampusDelete, error: errorCampusDelete, data: dataCampusDelete }] = useMutation(CAMPUS_DELETE);
    useEffect(() => {
        if(!loadingCampusDelete && errorCampusDelete){
            // ...
        }else if(!loadingCampusDelete && dataCampusDelete){
            message.success(intl.formatMessage({id: 'campus.message.deleted-campus-successfully'}));
            onDeletedSuccess();
        }
    }, [loadingCampusDelete, errorCampusDelete, dataCampusDelete, onDeletedSuccess]);

    // ----------
    // Khởi tạo dữ liệu ban đầu cho form edit
    // ----------
    let [showForm, setShowForm] = useState(false);
    useEffect(() => {
        if(dataCampus){
            if(dataCampusEdit && dataCampusEdit.id && dataCampusEdit.id === dataCampus.id){
                setShowForm(true);
                form.setFieldsValue({
                    txtName: dataCampus ? dataCampus.name : '',
                    selProvince: dataCampus ? dataCampus.province.id : '',
                    selDistrict: dataCampus ? dataCampus.district.id : '',
                    txtAddress: dataCampus ? dataCampus.address : '',
                    txtRepresentativeName: dataCampus ? dataCampus.representativeName : '',
                    selRepresentativePosition: dataCampus ? dataCampus.representativePosition : '',
                    txtPhone: dataCampus ? dataCampus.phone : '',
                    txtEmail: dataCampus ? dataCampus.email : '',
                    selLevel: dataCampus ? dataCampus.level : '',
                    selScale: dataCampus ? dataCampus.scale : '',
                    pickerOperationStart: dataCampus && dataCampus.operationStart ? moment(dataCampus.operationStart, "HH:mm") : '',
                    pickerOperationEnd: dataCampus && dataCampus.operationEnd ? moment(dataCampus.operationEnd, "HH:mm") : '',
                    selStatus: dataCampus && dataCampus.isActivated ? 'ACTIVATED' : 'NOT_ACTIVATED',
                    selIsMain: dataCampus && dataCampus.isMain ? 'MAIN' : 'SUB',
                });
            }else{
                setShowForm(false);
            }
        }
    }, [dataCampus, dataCampusEdit, form]);

    // ----------
    // Xử lý submit form edit
    // ----------
    const onSubmitFormEdit = () => {
        setLoadingButtonSubmit(true);
        form
            .validateFields()
            .then(values => {
                let input = {
                    "name": values.txtName,
                    "provinceId": values.selProvince,
                    "districtId": values.selDistrict,
                    "address": values.txtAddress,
                    "representativeName": values.txtRepresentativeName,
                    "representativePosition": values.selRepresentativePosition,
                    "phone": values.txtPhone,
                    "level": values.selLevel,
                    "scale": values.selScale,
                    "isActivated": values.selStatus === 'ACTIVATED',
                    "isMain": values.selIsMain === 'MAIN'
                };
                if(values.txtEmail){
                    input.email = values.txtEmail;
                }
                if(values.pickerOperationStart){
                    input.operationStart = values.pickerOperationStart.format('HH:mm');
                }
                if(values.pickerOperationEnd){
                    input.operationEnd = values.pickerOperationEnd.format('HH:mm');
                }
                if(avatar){
                    input.avatar = avatar;
                }

                campusUpdate({
                    variables: {
                        id: parseInt(dataCampusEdit.id),
                        input: input
                    }
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
        <Block
            active={dataCampus.isMain}
            title={intl.formatMessage({id: dataCampus.isMain ? 'campus.main' : 'campus'}) + `: ${dataCampus.name}`}
        >
            <div className="wrapper-campus-info">
                <Row gutter={17}>
                    <Col sm={6}>
                        <UploadImage
                            allowChange={showForm}
                            srcInitial={dataCampus.avatar ? dataCampus.avatar : null}
                            onChange={file => {
                                setAvatar(file);
                            }}
                        />
                    </Col>
                    <Col sm={18}>
                        <Form
                            form={form}
                            layout="vertical"
                        >
                            {showForm && (
                                <Row className="wrapper-info">
                                    <Col sm={8}>
                                        <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-name.label" />:</label>
                                    </Col>
                                    <Col sm={16}>
                                        <Form.Item
                                            name="txtName"
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
                            )}
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-address.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <>
                                            <Form.Item
                                                name="selProvince"
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
                                                            selDistrict: null
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
                                                name="selDistrict"
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
                                                name="txtAddress"
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
                                                <Input />
                                            </Form.Item>
                                        </>
                                    ) : (
                                        <div className="text">{`${dataCampus.address}, ${dataCampus.district.name}, ${dataCampus.province.name}`}</div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-representative.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <Form.Item
                                            name="txtRepresentativeName"
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
                                    ) : (
                                        <div className="text">{dataCampus.representativeName}</div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-representative-position.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <Form.Item
                                            name="selRepresentativePosition"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: intl.formatMessage({id: 'validate.required-input'})
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
                                    ) : (
                                        <div className="text">
                                            <FormattedMessage id={`campus.representative.position.${dataCampus.representativePosition.toLowerCase()}`} />
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-phone.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <Form.Item
                                            name="txtPhone"
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
                                    ) : (
                                        <div className="text">{dataCampus.phone}</div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.input-email.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <Form.Item
                                            name="txtEmail"
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
                                    ) : (
                                        <div className="text">{dataCampus.email}</div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-level.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <Form.Item
                                            name="selLevel"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: intl.formatMessage({id: 'validate.required-input'})
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
                                    ) : (
                                        <div className="text">
                                            <FormattedMessage id={`campus.level.${dataCampus.level.toLowerCase()}`} />
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-scale.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <Form.Item
                                            name="selScale"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: intl.formatMessage({id: 'validate.required-input'})
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
                                    ) : (
                                        <div className="text">
                                            <FormattedMessage id={`campus.scale.${dataCampus.scale.toLowerCase()}`} />
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row className="wrapper-info">
                                <Col sm={8}>
                                    <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.picker-operation-time.label" />:</label>
                                </Col>
                                <Col sm={16}>
                                    {showForm ? (
                                        <Space size={4}>
                                            <Form.Item
                                                name="pickerOperationStart"
                                            >
                                                <TimePicker
                                                    placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.picker-operation-start.placeholder'})}
                                                    format="HH:mm"
                                                    onChange={() => {}}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="pickerOperationEnd"
                                            >
                                                <TimePicker
                                                    placeholder={intl.formatMessage({id: 'campus.index.campus-info-form.picker-operation-end.placeholder'})}
                                                    format="HH:mm"
                                                    onChange={() => {}}
                                                />
                                            </Form.Item>
                                        </Space>
                                    ) : (
                                        <div className="text">
                                            {`${dataCampus.operationStart ? dataCampus.operationStart.substring(0, 5) : ""} - ${dataCampus.operationEnd ? dataCampus.operationEnd.substring(0, 5) : ""}`}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            {showForm && (
                                <>
                                    <Row className="wrapper-info">
                                        <Col sm={8}>
                                            <label className="label-info"><FormattedMessage id="campus.index.campus-info-form.select-status.label" />:</label>
                                        </Col>
                                        <Col sm={16}>
                                            <Form.Item
                                                name="selStatus"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: intl.formatMessage({id: 'validate.required-input'})
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
                                                name="selIsMain"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: intl.formatMessage({id: 'validate.required-input'})
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
                                </>
                            )}
                        </Form>
                    </Col>
                </Row>
                {showForm ? (
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
                            onClick={onSubmitFormEdit}
                        >
                            <FormattedMessage id="general.save" />
                        </Button>
                    </div>
                ) : (
                    <>
                        <Row>
                            <Col span={24} align="right">
                                <div className="actions">
                                    <Button
                                        type="link"
                                        icon={<ArrowsAltOutlined />}
                                        onClick={() => {
                                            if(dataCampusForShowClassrooms && dataCampusForShowClassrooms.id === dataCampus.id){
                                                setDataCampusForShowClassrooms(null);
                                            }else{
                                                loadGrades({
                                                    variables: {
                                                        filter: {
                                                            schoolYearId: schoolYearId,
                                                            campusId: parseInt(dataCampus.id)
                                                        }
                                                    }
                                                });
                                                setDataCampusForShowClassrooms(dataCampus);
                                            }
                                        }}
                                    />
                                    <Button
                                        type="link"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            // setAvatar(null);
                                            loadRelevantDataForCreateOrUpdate();
                                            loadDistricts({
                                                variables: {
                                                    filter: {
                                                        provinceId: dataCampus.province.id
                                                    }
                                                }
                                            });
                                            setVisibleCreateCampusBlock(false);
                                            setDataCampusEdit(dataCampus);
                                            setDataCampusForShowClassrooms(null);
                                        }}
                                    />
                                    {dataCampus && !dataCampus.isMain && (
                                        <Button
                                            type="link"
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                                setVisibleCreateCampusBlock(false);
                                                setDataCampusEdit(null);
                                                setDataCampusForShowClassrooms(null);
                                                campusDelete({
                                                    variables: {
                                                        id: dataCampus.id
                                                    }
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                            </Col>
                        </Row>
                        {dataCampusForShowClassrooms && dataCampusForShowClassrooms.id === dataCampus.id && (
                            <div className="wrapper-grades">
                                {loadingGrades && (
                                    <div>
                                        <Skeleton active />
                                    </div>
                                )}
                                {!loadingGrades && dataGrades && dataGrades.grades.map(grade => (
                                    <div className="wrapper-grade" key={grade.id}>
                                        <div className="grade-title">
                                            <FormattedMessage id={`grade.${grade.name}`} />
                                        </div>
                                        <div className="wrapper-classrooms">
                                            <span className="classrooms">
                                                {grade.classroom
                                                    .map(classroom => (
                                                        <span key={classroom.id} className="classroom">{`${classroom.name} | 24`}</span>
                                                    ))}
                                            </span>
                                            <span className="wrapper-btn-add">
                                                <Button
                                                    icon={<PlusOutlined />}
                                                    onClick={() => {
                                                        const fill = encodeURIComponent(JSON.stringify({
                                                            'campusId': parseInt(dataCampus.id),
                                                            'schoolYearId': parseInt(schoolYearId),
                                                            'gradeId': parseInt(grade.id),
                                                        }));
                                                        history.push(`/create-class/${fill}`);
                                                    }}
                                                >
                                                    <FormattedMessage id="general.add" />
                                                </Button>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Block>
    );
}

export default CampusEditBlock;
