import React, {useState, useEffect} from 'react';
import {Col, Form, Input, Row, Select, DatePicker, Space, Button, message, Image, Radio, Table, Tag} from "antd";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    GET_RELEVANT_DATA_FOR_CREATE_STATION,
    SUBJECTS,
    STATION_CODE_GENERATE,
    GET_CLASSROOM_DATA_FOR_CREATE_STATION, GET_STUDENT_DATA_FOR_CREATE_STATION
} from "./gql";
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
import './FormStationInfo.scss';
import {FormattedMessage, useIntl} from "react-intl";
import {
    STATION_STATUS,
} from "../../constants";
import UploadImage from "../../components/Common/UploadImage";
import CustomScrollbars from "../../components/Common/CustomScrollbars";
import LocationSearchInput from "../../components/Common/LocationSearchInput";
import UploadMutilImages from "../../components/Common/UploadMutilImages";

const FormStationInfo = ({setAvatar, isOnlyRead, dataStation, onCancel, onOk, error}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [isDisabledButtonSubmit, setIsDisabledButtonSubmit] = useState(false);
    const [currentSchoolyearId, setCurrentSchoolyearId] = useState(false);
    const [dataOptionCampuses, setDataOptionCampuses] = useState(null);
    const [dataOptionGrades, setDataOptionGrades] = useState(null);
    const [dataOptionClassrooms, setDataOptionClassrooms] = useState(null);
    const [dataTableStudents, setDataTableStudents] = useState(null);
    const [dataTableStudentsRegister, setDataTableStudentsRegister] = useState(null);
    const [filterCampusId, setFilterCampusId] = useState(null);
    const [filterGradeId, setFilterGradeId] = useState(null);
    const [filterClassroomId, setFilterClassroomId] = useState(null);
    const [filterName, setFilterName] = useState(null);

    // ----------
    // Đổ dữ liệu edit vào form (nếu có)
    // ----------
    useEffect(() => {
        if(dataStation){
            form.setFieldsValue({
                txtName: dataStation.name,
                dateFrom: dataStation.from ? moment(dataStation.from) : null,
                dateTo: dataStation.to ? moment(dataStation.to) : null,
                txtCode: dataStation.code,
                selStatus: dataStation.status,
                txtNote: dataStation.note,
                txtGmapAddress: dataStation.gmapAddress,
                // txtAddress: dataStation.address,
                txtAddress: "111111111",
            });

            setDataTableStudentsRegister(dataStation.students);
        }
    }, [dataStation]);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForCreateStation, error: errorRelevantDataForCreateStation, data: dataRelevantDataForCreateStation } = useQuery(GET_RELEVANT_DATA_FOR_CREATE_STATION);
    useEffect(() => {
        if(loadingRelevantDataForCreateStation === false && dataRelevantDataForCreateStation){
            setDataOptionCampuses(dataRelevantDataForCreateStation.campuses.data.map(campus => ({
                label: campus.name,
                value: campus.id,
                grades: campus.grades.map(grade => ({
                    value: grade.id,
                    label: intl.formatMessage({
                        id: `grade.${grade.name.toLowerCase()}`,
                    }),
                }))
            })));
            const schoolyearCurrent = dataRelevantDataForCreateStation.schoolyears.data.filter(schoolyear => parseInt(schoolyear.endAt.substring(0, 4)) === new Date().getFullYear());
            setCurrentSchoolyearId(schoolyearCurrent[0].id);
        }
    }, [loadingRelevantDataForCreateStation, dataRelevantDataForCreateStation]);

    // ----------
    // Lấy danh sách lớp học
    // ----------
    const [loadClassrooms, { loading: loadingClassroomsDataForCreateStation, data: dataClassroomsDataForCreateStation }] = useLazyQuery(GET_CLASSROOM_DATA_FOR_CREATE_STATION);
    useEffect(() => {
        if(loadingClassroomsDataForCreateStation === false && dataClassroomsDataForCreateStation){
            console.log('dataClassroomsDataForCreateStation', dataClassroomsDataForCreateStation)
            setDataOptionClassrooms(dataClassroomsDataForCreateStation.classrooms.data.map(classroom => ({
                label: classroom.name,
                value: classroom.id,
            })))
        }
    }, [loadingClassroomsDataForCreateStation, dataClassroomsDataForCreateStation]);

    // ----------
    // Lấy danh sách học sinh
    // ----------
    const [loadStudents, { loading: loadingStudentsDataForCreateStation, data: dataStudentsDataForCreateStation }] = useLazyQuery(GET_STUDENT_DATA_FOR_CREATE_STATION);
    useEffect(() => {
        if(loadingStudentsDataForCreateStation === false && dataStudentsDataForCreateStation){
            // console.log('dataStudentsDataForCreateStation', dataStudentsDataForCreateStation)
            setDataTableStudents(dataStudentsDataForCreateStation.students.data.map(student => {
                let isClickAdd = false;

                if(dataStation){
                    if(student.stationInCurrentSchoolYear && dataStation.key !== student.stationInCurrentSchoolYear.id){
                        isClickAdd = true;
                    }
                }else{
                    if(student.stationInCurrentSchoolYear){
                        isClickAdd = true;
                    }
                }
                if(dataTableStudentsRegister){
                    dataTableStudentsRegister.map(studentRegister => {
                        if(studentRegister.key === student.key){
                            isClickAdd = true;
                        }
                    })
                }

                return {
                    ...student,
                    isClickAdd: isClickAdd
                };
            }));


            /*if(dataTableStudents){
                setDataTableStudents(dataTableStudents => {
                    return dataTableStudents.map(student => {
                        if(student.key === record.key){
                            student.isClickAdd = false;
                        }
                        return student;
                    })
                });
            }*/
        }
    }, [loadingStudentsDataForCreateStation, dataStudentsDataForCreateStation]);

    // ----------
    // Query sinh mã điểm đón tự động
    // ----------
    const [loadStationCodeGenerate, { loading: loadingStationCodeGenerate, error: errorStationCodeGenerate, data: dataStationCodeGenerate }] = useLazyQuery(STATION_CODE_GENERATE);
    useEffect(() => {
        if(loadingStationCodeGenerate === false && dataStationCodeGenerate){
            form.setFieldsValue({ txtCode: dataStationCodeGenerate.stationCodeGenerate });
        }
    }, [loadingStationCodeGenerate, dataStationCodeGenerate]);

    // ----------
    // Xử lý lỗi trả về từ mutation create hoặc update
    // ----------
    useEffect(() => {
        if(error){
            let errorFields = [];
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.code){
                errorFields.push({
                    name: 'txtCode',
                    errors: ['Mã điểm đón đã tồn tại']
                });
            }else if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.name){
                errorFields.push({
                    name: 'txtName',
                    errors: ['Tên điểm đón đã tồn tại']
                });
            }else if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.to){
                errorFields.push({
                    name: 'dateTo',
                    errors: ['Thời gian sử dụng đến không hợp lệ']
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
        <div className="form-station-info">
            <Form
                form={form}
                colon={false}
                initialValues={{
                    selStatus: STATION_STATUS[0].value,
                }}
                onFinish={(values) => {
                    console.log('valuesvaluesvalues', values)
                    setIsDisabledButtonSubmit(true);
                    const registerStudentIds = dataTableStudentsRegister ? dataTableStudentsRegister.map(student => student.key) : [];
                    onOk(values, registerStudentIds);
                }}
            >
                <Row gutter={24}>
                    <Col sm={7}>
                        {/*<UploadImage
                            allowChange={true}
                            srcInitial={dataStation?.avatar || null}
                            onChange={file => {
                                setAvatar(file);
                            }}
                        />*/}
                        <UploadMutilImages

                        />
                        <Row>
                            <Col sm={24}>
                                <Form.Item
                                    className="wrapper-item-status"
                                    name="selStatus"
                                    labelCol={{span: 24}}
                                    label={<FormattedMessage id="station.station-info-form.select-status.label" />}
                                >
                                    <Select
                                        options={STATION_STATUS.map(status => ({
                                            value: status.value,
                                            label: intl.formatMessage({
                                                id: `station.status.${status.label.toLowerCase()}`,
                                            }),
                                        }))}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={17}>
                        <Row gutter={24}>
                            <Col sm={24}>
                                <h3 className="wrapper-info">
                                    <FormattedMessage id="station.station-info-form.station-info" />
                                </h3>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtName"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="station.station-info-form.input-name.label">
                                                {txt => (
                                                    <>
                                                        <span>{txt}</span>
                                                        <span className="required">*</span>
                                                    </>
                                                )}
                                            </FormattedMessage>
                                        </Space>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                        {
                                            max: 50,
                                            message: 'Thông tin này không được dài hơn 50 kí tự'
                                        },
                                        {
                                            pattern: /^[\s0-9/,.\p{L}]+$/u,
                                            message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'station.station-info-form.input-name.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="station.station-info-form.input-code.label">
                                            {txt => (
                                                <>
                                                    <span>{txt}</span>
                                                    <span className="required">*</span>
                                                </>
                                            )}
                                            </FormattedMessage>
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
                                                        max: 5,
                                                        message: 'Thông tin này không được dài hơn 5 kí tự'
                                                    },
                                                    {
                                                        pattern: /^[a-zA-Z0-9]+$/,
                                                        message: 'Thông tin này chỉ được bao gồm chữ và số'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder={intl.formatMessage({id: 'station.station-info-form.input-code.placeholder'})} disabled={isOnlyRead} />
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
                                                    disabled={loadingStationCodeGenerate}
                                                    onClick={() => {
                                                        loadStationCodeGenerate();
                                                    }}
                                                >
                                                    <FormattedMessage id="station.station-info-form.button-auto-create.label" />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="txtGmapAddress"
                                    noStyle
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                        {
                                            min: 10,
                                            message: 'Thông tin này không được ngắn hơn 10 kí tự'
                                        },
                                    ]}
                                >
                                    <Input type="hidden" />
                                </Form.Item>
                                <Form.Item name="txtGmapPlaceId" noStyle>
                                    <Input type="hidden" />
                                </Form.Item>
                                <Form.Item name="txtGmapRaw" noStyle>
                                    <Input type="hidden" />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="station.station-info-form.input-address.label">
                                            {txt => (
                                                <>
                                                    <span>{txt}</span>
                                                    <span className="required">*</span>
                                                </>
                                            )}
                                            </FormattedMessage>
                                        </Space>
                                    }
                                >
                                    <LocationSearchInput
                                        initialValue={dataStation ? dataStation.gmapAddress : null}
                                        onSelect={(address, placeId, suggestion) => {
                                            form.setFieldsValue({
                                                txtGmapAddress: address,
                                                txtGmapPlaceId: placeId,
                                                txtGmapRaw: JSON.stringify(suggestion),
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="dateFrom"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="station.station-info-form.picker-from.label">
                                            {txt => (
                                                <>
                                                    <span>{txt}</span>
                                                    <span className="required">*</span>
                                                </>
                                            )}
                                            </FormattedMessage>
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
                                        placeholder={intl.formatMessage({id: 'station.station-info-form.picker-from.placeholder'})}
                                        style={{width: '100%'}}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="dateTo"
                                    label={<FormattedMessage id="station.station-info-form.picker-to.label" />}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'station.station-info-form.picker-to.placeholder'})}
                                        style={{width: '100%'}}
                                        disabledDate={current => {
                                            return current && current < moment().startOf('day');
                                        }}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="txtNote"
                                    label={<FormattedMessage id="station.station-info-form.input-note.label" />}
                                    rules={[
                                        {
                                            max: 200,
                                            message: 'Thông tin này không được dài hơn 200 kí tự'
                                        },
                                    ]}
                                >
                                    <Input.TextArea placeholder={intl.formatMessage({id: 'station.station-info-form.input-note.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className="wrapper-register-shuttle">
                            <div className="title">
                                <FormattedMessage id="station.station-info-form.register-for-school-bus" />
                            </div>
                            <div className="wrapper-filter">
                                <Row gutter={30}>
                                    <Col span={12}>
                                        <Row gutter={8}>
                                            <Col span={8}>
                                                <Select
                                                    placeholder={intl.formatMessage({id: 'station.station-info-form.register-for-school-bus.filter.select-campus.placeholder'})}
                                                    size="large"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    loading={loadingRelevantDataForCreateStation}
                                                    options={dataOptionCampuses}
                                                    onChange={(value, optionSelected) => {
                                                        setFilterCampusId(value);
                                                        setDataOptionGrades(optionSelected.grades);
                                                        setFilterGradeId(null);
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <Select
                                                    placeholder={intl.formatMessage({id: 'station.station-info-form.register-for-school-bus.filter.select-grade.placeholder'})}
                                                    size="large"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    value={filterGradeId}
                                                    loading={loadingRelevantDataForCreateStation}
                                                    options={dataOptionGrades}
                                                    onChange={(value) => {
                                                        setFilterGradeId(value);
                                                        loadClassrooms({
                                                            variables: {
                                                                filter: {
                                                                    schoolYearId: parseInt(currentSchoolyearId),
                                                                    campusId: parseInt(filterCampusId),
                                                                    gradeId: parseInt(value),
                                                                }
                                                            }
                                                        });
                                                        setFilterClassroomId(null);
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <Select
                                                    placeholder={intl.formatMessage({id: 'station.station-info-form.register-for-school-bus.filter.select-class.placeholder'})}
                                                    size="large"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    value={filterClassroomId}
                                                    loading={loadingClassroomsDataForCreateStation}
                                                    options={dataOptionClassrooms}
                                                    onChange={(value) => setFilterClassroomId(value)}
                                                />
                                            </Col>
                                            <Col span={24}>
                                                <Space
                                                    className="wrapper-filter-search"
                                                    size={5}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder={intl.formatMessage({id: 'station.station-info-form.register-for-school-bus.filter.input-search.placeholder'})}
                                                        prefix={<SearchOutlined />}
                                                        onChange={(value) => setFilterName(value.target.value)}
                                                    />
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        loading={loadingStudentsDataForCreateStation}
                                                        onClick={() => {
                                                            let filter = {};
                                                            if(currentSchoolyearId){
                                                                filter.schoolYearId = parseInt(currentSchoolyearId);
                                                            }
                                                            if(filterCampusId){
                                                                filter.campusId = parseInt(filterCampusId);
                                                            }
                                                            if(filterGradeId){
                                                                filter.gradeId = parseInt(filterGradeId);
                                                            }
                                                            if(filterClassroomId){
                                                                filter.classroomId = parseInt(filterClassroomId);
                                                            }
                                                            if(filterName){
                                                                filter.name = filterName;
                                                                filter.code = `%${filterName}%`;
                                                            }
                                                            // name: String @where(operator: "like")

                                                            loadStudents({
                                                                variables: {
                                                                    filter: filter
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <FormattedMessage id="station.station-info-form.register-for-school-bus.filter.button-search.label" />
                                                    </Button>
                                                </Space>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <div className="wrapper-table-student">
                                                    <CustomScrollbars style={{ height: 442 }}>
                                                        <div>
                                                            <Table
                                                                columns={[
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.code" />,
                                                                        dataIndex: 'code',
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.fullname" />,
                                                                        dataIndex: 'name',
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.class" />,
                                                                        dataIndex: 'classroom',
                                                                        render: (text, record, index) => {
                                                                            let classroomCurrent = record.classrooms.filter(classroom => classroom.schoolYearId === parseInt(currentSchoolyearId));
                                                                            return classroomCurrent?.length ? classroomCurrent[0].name : "";
                                                                        }
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.register" />,
                                                                        dataIndex: 'register',
                                                                        width: 105,
                                                                        render: (text, record, index) => {
                                                                            return (
                                                                                <Button
                                                                                    className="btn-register"
                                                                                    type="primary"
                                                                                    disabled={record.isClickAdd}
                                                                                    onClick={() => {
                                                                                        setDataTableStudentsRegister(dataTableStudentsRegister => {
                                                                                            if(!dataTableStudentsRegister){
                                                                                                dataTableStudentsRegister = [record];
                                                                                            }else{
                                                                                                dataTableStudentsRegister = [
                                                                                                    ...dataTableStudentsRegister,
                                                                                                    record
                                                                                                ]
                                                                                            }

                                                                                            return dataTableStudentsRegister;
                                                                                        });
                                                                                        setDataTableStudents(dataTableStudents => {
                                                                                            return dataTableStudents.map(student => {
                                                                                                if(student.key === record.key){
                                                                                                    student.isClickAdd = !student.isClickAdd;
                                                                                                }
                                                                                                return student;
                                                                                            })
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    {record.isClickAdd ? intl.formatMessage({id: 'station.station-info-form.register-for-school-bus.column-result.register.added'}) : intl.formatMessage({id: 'station.station-info-form.register-for-school-bus.column-result.register.add'})}
                                                                                </Button>
                                                                            );
                                                                        }
                                                                    },
                                                                ]}
                                                                dataSource={dataTableStudents}
                                                                pagination={false}
                                                                loading={loadingStudentsDataForCreateStation}
                                                                bordered
                                                                locale={{
                                                                    emptyText: intl.formatMessage({id: 'table.empty-text'})
                                                                }}
                                                            />
                                                        </div>
                                                    </CustomScrollbars>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12} className="wrapper-student-selected">
                                        <Row>
                                            <Col span={24}>
                                                <div className="title">
                                                    <FormattedMessage id="station.station-info-form.register-for-school-bus.register-list" />
                                                </div>
                                                <div className="wrapper-statistic">
                                                    <Row>
                                                        <Col span={6}>
                                                            <FormattedMessage id="station.station-info-form.register-for-school-bus.register-list.decreased" />: 6
                                                        </Col>
                                                        <Col span={6}>
                                                            <FormattedMessage id="station.station-info-form.register-for-school-bus.register-list.increased" />: 6
                                                        </Col>
                                                        <Col span={6}>
                                                            <FormattedMessage id="station.station-info-form.register-for-school-bus.register-list.register" />: 6
                                                        </Col>
                                                        <Col span={6}>
                                                            <FormattedMessage id="station.station-info-form.register-for-school-bus.register-list.total" />: 6
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <div className="wrapper-table-student">
                                                    <CustomScrollbars style={{ height: 442 }}>
                                                        <div>
                                                            <Table
                                                                columns={[
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.code" />,
                                                                        dataIndex: 'code',
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.fullname" />,
                                                                        dataIndex: 'name',
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.class" />,
                                                                        dataIndex: 'classroom',
                                                                        render: (text, record, index) => {
                                                                            let classroomCurrent = record.classrooms.filter(classroom => classroom.schoolYearId === parseInt(currentSchoolyearId));
                                                                            return classroomCurrent?.length ? classroomCurrent[0].name : "";
                                                                        }
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.register" />,
                                                                        dataIndex: 'register',
                                                                        width: 105,
                                                                        render: (text, record, index) => {
                                                                            return (
                                                                                <Button
                                                                                    className="btn-register cancel"
                                                                                    type="primary"
                                                                                    onClick={() => {
                                                                                        setDataTableStudentsRegister(dataTableStudentsRegister => {
                                                                                            return dataTableStudentsRegister.filter(student => student.key != record.key);
                                                                                        });
                                                                                        if(dataTableStudents){
                                                                                            setDataTableStudents(dataTableStudents => {
                                                                                                return dataTableStudents.map(student => {
                                                                                                    if(student.key === record.key){
                                                                                                        student.isClickAdd = false;
                                                                                                    }
                                                                                                    return student;
                                                                                                })
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <FormattedMessage id="station.station-info-form.register-for-school-bus.column-result.register.cancel" />
                                                                                </Button>
                                                                            );
                                                                        }
                                                                    },
                                                                ]}
                                                                dataSource={dataTableStudentsRegister}
                                                                pagination={false}
                                                                bordered
                                                                locale={{
                                                                    emptyText: intl.formatMessage({id: 'table.empty-text'})
                                                                }}
                                                            />
                                                        </div>
                                                    </CustomScrollbars>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
                {!isOnlyRead && (
                    <Row>
                        <Col>
                            <Form.Item
                                className="wrapper-item-buttons"
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
            </Form>
        </div>
    );
}

export default FormStationInfo;
