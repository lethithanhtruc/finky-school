import React, {useState, useEffect} from 'react';
import {
    Col,
    Form,
    Input,
    Row,
    Select,
    DatePicker,
    Space,
    Button,
    message,
    Image,
    Radio,
    Table,
    Tag,
    TimePicker
} from "antd";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    GET_RELEVANT_DATA_FOR_CREATE_SCHEDULE,
    SUBJECTS,
    SCHEDULE_CODE_GENERATE, LOAD_STATIONS, GET_RELEVANT_DATA_FOR_CREATE_SCHEDULE_BY_CAMPUS,
} from "./gql";
import moment from "moment";
import { SearchOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './FormScheduleInfo.scss';
import {FormattedMessage, useIntl} from "react-intl";
import Block from "../../components/Common/Block";
import DebounceSelect from "../../components/Common/DebounceSelect";

const FormScheduleInfo = ({setAvatar, isOnlyRead, dataSchedule, onCancel, onOk, error}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [isDisabledButtonSubmit, setIsDisabledButtonSubmit] = useState(false);
    const [totalTurnAwayStation, setTotalTurnAwayStation] = useState(0);
    const [totalTurnAwayStudent, setTotalTurnAwayStudent] = useState(0);
    const [totalTurnAwayRedundantStudents, setTotalTurnAwayRedundantStudents] = useState(0);
    const [totalTurnBackStation, setTotalTurnBackStation] = useState(0);
    const [totalTurnBackStudent, setTotalTurnBackStudent] = useState(0);
    const [totalTurnBackRedundantStudents, setTotalTurnBackRedundantStudents] = useState(0);

    // ----------
    // Đổ dữ liệu edit vào form (nếu có)
    // ----------
    useEffect(() => {
        if(dataSchedule){
            let stationsInSchoolYearForTurnAway = [];
            let stationsInSchoolYearForTurnBack = [];
            if(dataSchedule.stationsInCurrentSchoolYear){
                stationsInSchoolYearForTurnAway = dataSchedule.stationsInCurrentSchoolYear
                    .filter(station => station.turn === 'TURN_AWAY')
                    .map(station => ({
                        selStation: station.station ? station.station.id : null,
                        pickerMorning: station.morningAt ? moment(station.morningAt, 'HH:mm') : null,
                        pickerAfternoon: station.afternoonAt ? moment(station.afternoonAt, 'HH:mm') : null,
                    }));
                stationsInSchoolYearForTurnBack = dataSchedule.stationsInCurrentSchoolYear
                    .filter(station => station.turn === 'TURN_BACK')
                    .map(station => ({
                        selStation: station.station ? station.station.id : null,
                        pickerMorning: station.morningAt ? moment(station.morningAt, 'HH:mm') : null,
                        pickerAfternoon: station.afternoonAt ? moment(station.afternoonAt, 'HH:mm') : null,
                    }));
            }
            setTotalTurnAwayStation(dataSchedule.totalTurnAwayStation);
            setTotalTurnAwayStudent(dataSchedule.totalTurnAwayStudent);
            setTotalTurnBackStation(dataSchedule.totalTurnBackStation);
            setTotalTurnBackStudent(dataSchedule.totalTurnBackStudent);

            // console.log('dataScheduledataSchedule', stationsInSchoolYearForTurnAway)

            form.setFieldsValue({
                selCampus: dataSchedule.campusId,
                txtName: dataSchedule.name,
                txtCode: dataSchedule.code,
                selTurnAwayVehicle: dataSchedule.turnAwayVehicleId,
                selTurnAwayDriver: dataSchedule.turnAwayDriverId,
                selTurnAwayNanny: dataSchedule.turnAwayNannyId,
                txtTurnAwayDescription: dataSchedule.turnAwayDescription,
                selTurnBackVehicle: dataSchedule.turnBackVehicleId,
                selTurnBackDriver: dataSchedule.turnBackDriverId,
                selTurnBackNanny: dataSchedule.turnBackNannyId,
                txtTurnBackDescription: dataSchedule.turnBackDescription,
                stationsInSchoolYearForTurnAway: stationsInSchoolYearForTurnAway,
                stationsInSchoolYearForTurnBack: stationsInSchoolYearForTurnBack,
            });

            getRelevantDataForCreateScheduleByCampus({
                variables: {
                    campusId: parseInt(dataSchedule.campusId)
                }
            });
        }
    }, [dataSchedule]);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForCreateSchedule, error: errorRelevantDataForCreateSchedule, data: dataRelevantDataForCreateSchedule } = useQuery(GET_RELEVANT_DATA_FOR_CREATE_SCHEDULE);
    useEffect(() => {

    }, [loadingRelevantDataForCreateSchedule, dataRelevantDataForCreateSchedule]);

    // ----------
    // Lấy các data liên quan dựa theo campus đã chọn
    // ----------
    const [getRelevantDataForCreateScheduleByCampus, { loading: loadingRelevantDataForCreateScheduleByCampus, error: errorRelevantDataForCreateScheduleByCampus, data: dataRelevantDataForCreateScheduleByCampus }] = useLazyQuery(GET_RELEVANT_DATA_FOR_CREATE_SCHEDULE_BY_CAMPUS);
    useEffect(() => {
        if(loadingRelevantDataForCreateScheduleByCampus === false && dataRelevantDataForCreateScheduleByCampus){
            console.log('dataRelevantDataForCreateScheduleByCampus', dataRelevantDataForCreateScheduleByCampus)
        }
    }, [loadingRelevantDataForCreateScheduleByCampus, dataRelevantDataForCreateScheduleByCampus]);

    // ----------
    // Query sinh mã lịch trình tự động
    // ----------
    const [loadScheduleCodeGenerate, { loading: loadingScheduleCodeGenerate, error: errorScheduleCodeGenerate, data: dataScheduleCodeGenerate }] = useLazyQuery(SCHEDULE_CODE_GENERATE);
    useEffect(() => {
        if(loadingScheduleCodeGenerate === false && dataScheduleCodeGenerate){
            form.setFieldsValue({ txtCode: dataScheduleCodeGenerate.scheduleCodeGenerate });
        }
    }, [loadingScheduleCodeGenerate, dataScheduleCodeGenerate]);

    // ----------
    // Query tìm kiếm điểm đón
    // ----------
    const { loading: loadingStations, error: errorStations, data: dataStations } = useQuery(LOAD_STATIONS);

    // ----------
    // Xử lý lỗi trả về từ mutation create hoặc update
    // ----------
    useEffect(() => {
        if(error){
            let errorFields = [];
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.code){
                errorFields.push({
                    name: 'txtCode',
                    errors: ['Mã tuyến đã tồn tại']
                });
            }else if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.name){
                errorFields.push({
                    name: 'txtName',
                    errors: ['Tên tuyến đã tồn tại']
                });
            }

            if(errorFields.length){
                form.setFields(errorFields);
            }

            message.error('Đã có lỗi xảy ra.');
            setIsDisabledButtonSubmit(false);
        }
    }, [error])

    // ----------
    // Tính toán số lượng chỗ ngồi của xe lượt đi có đủ so với tổng số học sinh của các trạm đã chọn hay không
    // ----------
    const calcTurnAwayRedundantStudents = (totalStudents) => {
        if(form.getFieldValue('selTurnAwayVehicle')){
            let seatNumber = 0;
            let vehicle = dataRelevantDataForCreateScheduleByCampus?.vehicles.data.filter(vehicle => vehicle.id == form.getFieldValue('selTurnAwayVehicle')).shift();
            if(vehicle){
                seatNumber = vehicle.seatNumber;
            }
            if(seatNumber > 0 && seatNumber < totalStudents){
                setTotalTurnAwayRedundantStudents(totalStudents - seatNumber);
            }else{
                setTotalTurnAwayRedundantStudents(0);
            }
        }
    }

    // ----------
    // Tính toán số lượng chỗ ngồi của xe lượt về có đủ so với tổng số học sinh của các trạm đã chọn hay không
    // ----------
    const calcTurnBackRedundantStudents = (totalStudents) => {
        if(form.getFieldValue('selTurnBackVehicle')){
            let seatNumber = 0;
            let vehicle = dataRelevantDataForCreateScheduleByCampus?.vehicles.data.filter(vehicle => vehicle.id == form.getFieldValue('selTurnBackVehicle')).shift();
            if(vehicle){
                seatNumber = vehicle.seatNumber;
            }
            if(seatNumber > 0 && seatNumber < totalStudents){
                setTotalTurnBackRedundantStudents(totalStudents - seatNumber);
            }else{
                setTotalTurnBackRedundantStudents(0);
            }
        }
    }

    return (
        <div className="form-schedule-info">
            <Form
                layout="vertical"
                form={form}
                colon={false}
                initialValues={{
                    stationsInSchoolYearForTurnAway: [
                        {
                            // selStation: null,
                            pickerMorning: null,
                            pickerAfternoon: null,
                        },
                    ],
                    stationsInSchoolYearForTurnBack: [
                        {
                            // selStation: null,
                            pickerMorning: null,
                            pickerAfternoon: null,
                        },
                    ]
                }}
                onFinish={(values) => {
                    // console.log('valuesvaluesvalues', values)
                    setIsDisabledButtonSubmit(true);
                    onOk(values);
                }}
            >
                <Row gutter={24}>
                    <Col sm={8}>
                        <Block>
                            <div>
                                <h3 className="wrapper-info">
                                    <FormattedMessage id="schedule.schedule-info-form.schedule-info" />
                                </h3>
                            </div>
                            <div>
                                <Form.Item
                                    name="selCampus"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="schedule.schedule-info-form.select-campus.label">
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
                                    <Select
                                        placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-campus.placeholder'})}
                                        options={dataRelevantDataForCreateSchedule?.campuses.data.map(campus => {
                                            return {
                                                label: campus.name,
                                                value: campus.id,
                                            }
                                        })}
                                        onChange={(value) => {
                                            form.setFieldsValue({
                                                selTurnAwayVehicle: null,
                                                selTurnAwayDriver: null,
                                                selTurnAwayNanny: null,
                                                selTurnBackVehicle: null,
                                                selTurnBackDriver: null,
                                                selTurnBackNanny: null,
                                            });
                                            getRelevantDataForCreateScheduleByCampus({
                                                variables: {
                                                    campusId: value
                                                }
                                            });
                                        }}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="schedule.schedule-info-form.input-code.label">
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
                                                        max: 10,
                                                        message: 'Thông tin này không được dài hơn 10 kí tự'
                                                    },
                                                    {
                                                        pattern: /^[a-zA-Z0-9]+$/,
                                                        message: 'Thông tin này chỉ được bao gồm chữ và số'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.input-code.placeholder'})} disabled={isOnlyRead} />
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
                                                    disabled={loadingScheduleCodeGenerate}
                                                    onClick={() => {
                                                        loadScheduleCodeGenerate();
                                                    }}
                                                >
                                                    <FormattedMessage id="schedule.schedule-info-form.button-auto-create.label" />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item
                                    name="txtName"
                                    label={
                                        <Space align="end" size={0}>
                                            <FormattedMessage id="schedule.schedule-info-form.input-name.label">
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
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.input-name.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                                <div className="wrapper-turn-away-vehicle-curator">
                                    <h4>Lượt đi</h4>
                                    <Form.Item
                                        name="selTurnAwayVehicle"
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-away-vehicle.placeholder'})}
                                            options={dataRelevantDataForCreateScheduleByCampus?.vehicles.data.map(vehicle => {
                                                return {
                                                    label: vehicle.licensePlate,
                                                    value: vehicle.id,
                                                }
                                            })}
                                            onChange={() => calcTurnAwayRedundantStudents(totalTurnBackStudent)}
                                            disabled={isOnlyRead}
                                            loading={loadingRelevantDataForCreateScheduleByCampus}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="selTurnAwayDriver"
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-away-driver.placeholder'})}
                                            options={dataRelevantDataForCreateScheduleByCampus?.drivers.data.map(driver => {
                                                return {
                                                    label: driver.name,
                                                    value: driver.id,
                                                }
                                            })}
                                            disabled={isOnlyRead}
                                            loading={loadingRelevantDataForCreateScheduleByCampus}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="selTurnAwayNanny"
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-away-nanny.placeholder'})}
                                            options={dataRelevantDataForCreateScheduleByCampus?.nannies.data.map(nanny => {
                                                return {
                                                    label: nanny.name,
                                                    value: nanny.id,
                                                }
                                            })}
                                            disabled={isOnlyRead}
                                            loading={loadingRelevantDataForCreateScheduleByCampus}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="txtTurnAwayDescription"
                                        rules={[
                                            {
                                                max: 255,
                                                message: 'Thông tin này không được dài hơn 255 kí tự'
                                            },
                                        ]}
                                    >
                                        <Input.TextArea placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.input-turn-away-description.placeholder'})} disabled={isOnlyRead} />
                                    </Form.Item>
                                </div>
                                <div className="wrapper-turn-back-vehicle-curator">
                                    <h4>Lượt về</h4>
                                    <Form.Item
                                        name="selTurnBackVehicle"
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-back-vehicle.placeholder'})}
                                            options={dataRelevantDataForCreateScheduleByCampus?.vehicles.data.map(vehicle => {
                                                return {
                                                    label: vehicle.licensePlate,
                                                    value: vehicle.id,
                                                }
                                            })}
                                            onChange={() => calcTurnBackRedundantStudents(totalTurnBackStudent)}
                                            disabled={isOnlyRead}
                                            loading={loadingRelevantDataForCreateScheduleByCampus}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="selTurnBackDriver"
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-back-driver.placeholder'})}
                                            options={dataRelevantDataForCreateScheduleByCampus?.drivers.data.map(driver => {
                                                return {
                                                    label: driver.name,
                                                    value: driver.id,
                                                }
                                            })}
                                            disabled={isOnlyRead}
                                            loading={loadingRelevantDataForCreateScheduleByCampus}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="selTurnBackNanny"
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-back-nanny.placeholder'})}
                                            options={dataRelevantDataForCreateScheduleByCampus?.nannies.data.map(nanny => {
                                                return {
                                                    label: nanny.name,
                                                    value: nanny.id,
                                                }
                                            })}
                                            disabled={isOnlyRead}
                                            loading={loadingRelevantDataForCreateScheduleByCampus}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="txtTurnBackDescription"
                                        rules={[
                                            {
                                                max: 255,
                                                message: 'Thông tin này không được dài hơn 255 kí tự'
                                            },
                                        ]}
                                    >
                                        <Input.TextArea placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.input-turn-back-description.placeholder'})} disabled={isOnlyRead} />
                                    </Form.Item>
                                </div>
                            </div>
                        </Block>
                    </Col>
                    <Col sm={16}>
                        <Block className="wrapper-turn-info">
                            <Row gutter={44}>
                                <Col sm={12} className="col-turn-away-info">
                                    <div className="wrapper-turn-away-info">
                                        <div>
                                            <h3 className="wrapper-info">
                                                <FormattedMessage id="schedule.schedule-info-form.turn-away-info" />
                                            </h3>
                                        </div>
                                        <div>
                                            <Row>
                                                <Col span={12}>
                                                    <div className="wrapper-total-station">
                                                        <div className="label">Số điểm đón</div>
                                                        <div className="value">{totalTurnAwayStation}</div>
                                                        <div className="warning"></div>
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="wrapper-total-student">
                                                        <div className="label">Số HS đăng ký</div>
                                                        <div className="value">{totalTurnAwayStudent}</div>
                                                        <div className="warning">{totalTurnAwayRedundantStudents > 0 ? `Dư ${totalTurnAwayRedundantStudents} học sinh` : ''}</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className="wrapper-turn-away-form">
                                        <Form.List
                                            name="stationsInSchoolYearForTurnAway"
                                        >
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map((field, index) => (
                                                        <Row gutter={7} className="wrapper-item">
                                                            <Col flex="auto">
                                                                <div
                                                                    className="label-no"
                                                                    onClick={() => {
                                                                        remove(field.name);
                                                                    }}
                                                                >
                                                                    <span className="index">{index + 1}</span>
                                                                    <span className="remove"></span>
                                                                </div>
                                                                <Form.Item
                                                                    noStyle
                                                                    shouldUpdate={(prevValues, curValues) =>
                                                                        prevValues.area !== curValues.area || prevValues.stationsInSchoolYearForTurnAway !== curValues.stationsInSchoolYearForTurnAway
                                                                    }
                                                                >
                                                                    {() => (
                                                                        <Form.Item
                                                                            {...field}
                                                                            label={index == 0 ? intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-away-station.label'}) : null}
                                                                            name={[field.name, 'selStation']}
                                                                            fieldKey={[field.fieldKey, 'selStation']}
                                                                            className="wrapper-item-station"
                                                                        >
                                                                            {/*<DebounceSelect
                                                                                showSearch
                                                                                // value={value}
                                                                                placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-away-station.placeholder'})}
                                                                                fetchOptions={async (value) => {
                                                                                    return new Promise((resolve, reject) => {
                                                                                        let ret = [];
                                                                                        if(!loadingStations && dataStations){
                                                                                            ret = dataStations.stations.data.map(station => ({
                                                                                                label: station.name,
                                                                                                value: station.id,
                                                                                            }))
                                                                                        }
                                                                                        resolve(ret);
                                                                                    })
                                                                                }}
                                                                                onChange={(newValue) => {
                                                                                    // setValue(newValue);
                                                                                    console.log('xxxx', newValue)
                                                                                }}
                                                                                style={{
                                                                                    width: '100%',
                                                                                }}
                                                                            />*/}
                                                                            <Select
                                                                                options={dataStations?.stations.data.map(station => ({
                                                                                    label: station.name,
                                                                                    value: station.id,
                                                                                    totalStudents: station.totalStudents,
                                                                                }))}
                                                                                onChange={(value, option) => {
                                                                                    // calc total station
                                                                                    setTotalTurnAwayStation(form.getFieldValue('stationsInSchoolYearForTurnAway').filter(list => list?.selStation).length);

                                                                                    // calc total student
                                                                                    const uniqueSet = new Set(form.getFieldValue('stationsInSchoolYearForTurnAway')
                                                                                        .filter(list => list?.selStation)
                                                                                        .map(list => list.selStation));
                                                                                    let totalStudents = dataStations?.stations.data
                                                                                        .filter(station => Array.from(uniqueSet).includes(station.id))
                                                                                        .map(station => station.totalStudents)
                                                                                        .reduce((accumulator, currentValue) => accumulator + currentValue);
                                                                                    setTotalTurnAwayStudent(totalStudents);

                                                                                    //calc alert not enough seats
                                                                                    calcTurnAwayRedundantStudents(totalStudents);
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col>
                                                                <Form.Item
                                                                    {...field}
                                                                    label={index == 0 ? intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-away-morning.label'}) : null}
                                                                    name={[field.name, 'pickerMorning']}
                                                                    fieldKey={[field.fieldKey, 'pickerMorning']}
                                                                >
                                                                    <TimePicker
                                                                        showNow={false}
                                                                        allowClear={false}
                                                                        suffixIcon={null}
                                                                        placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-away-morning.placeholder'})}
                                                                        format="HH:mm"
                                                                        onChange={() => {}}
                                                                        style={{width: '58px'}}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col>
                                                                <Form.Item
                                                                    {...field}
                                                                    label={index == 0 ? intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-away-afternoon.label'}) : null}
                                                                    name={[field.name, 'pickerAfternoon']}
                                                                    fieldKey={[field.fieldKey, 'pickerAfternoon']}
                                                                >
                                                                    <TimePicker
                                                                        showNow={false}
                                                                        allowClear={false}
                                                                        suffixIcon={null}
                                                                        placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-away-afternoon.placeholder'})}
                                                                        format="HH:mm"
                                                                        onChange={() => {}}
                                                                        style={{width: '58px'}}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            {/*<Col>
                                                                <Form.Item
                                                                    label={index == 0 ? " " : null}
                                                                >
                                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                                </Form.Item>
                                                            </Col>*/}
                                                        </Row>
                                                    ))}

                                                    <Form.Item>
                                                        <Button
                                                            className="btn-add-station"
                                                            onClick={() => add()}
                                                            block
                                                            icon={<PlusOutlined />}
                                                        >
                                                            Thêm điểm
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                </Col>
                                <Col sm={12}>
                                    <div className="wrapper-turn-back-info">
                                        <div>
                                            <h3 className="wrapper-info">
                                                <FormattedMessage id="schedule.schedule-info-form.turn-back-info" />
                                            </h3>
                                        </div>
                                        <div>
                                            <Row>
                                                <Col span={12}>
                                                    <div className="wrapper-total-station">
                                                        <div className="label">Số điểm đón</div>
                                                        <div className="value">{totalTurnBackStation}</div>
                                                        <div className="warning"></div>
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="wrapper-total-student">
                                                        <div className="label">Số HS đăng ký</div>
                                                        <div className="value">{totalTurnBackStudent}</div>
                                                        <div className="warning">{totalTurnBackRedundantStudents > 0 ? `Dư ${totalTurnBackRedundantStudents} học sinh` : ''}</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className="wrapper-turn-back-form">
                                        <Form.List
                                            name="stationsInSchoolYearForTurnBack"
                                        >
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map((field, index) => (
                                                        <Row gutter={7} className="wrapper-item">
                                                            <Col flex="auto">
                                                                <div
                                                                    className="label-no"
                                                                    onClick={() => {
                                                                        remove(field.name);
                                                                    }}
                                                                >
                                                                    <span className="index">{index + 1}</span>
                                                                    <span className="remove"></span>
                                                                </div>
                                                                <Form.Item
                                                                    noStyle
                                                                    shouldUpdate={(prevValues, curValues) =>
                                                                        prevValues.area !== curValues.area || prevValues.stationsInSchoolYearForTurnAway !== curValues.stationsInSchoolYearForTurnAway
                                                                    }
                                                                >
                                                                    {() => (
                                                                        <Form.Item
                                                                            {...field}
                                                                            label={index == 0 ? intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-back-station.label'}) : null}
                                                                            name={[field.name, 'selStation']}
                                                                            fieldKey={[field.fieldKey, 'selStation']}
                                                                            className="wrapper-item-station"
                                                                        >
                                                                            {/*<DebounceSelect
                                                                                showSearch
                                                                                // value={value}
                                                                                placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.select-turn-away-station.placeholder'})}
                                                                                fetchOptions={async (value) => {
                                                                                    return new Promise((resolve, reject) => {
                                                                                        let ret = [];
                                                                                        if(!loadingStations && dataStations){
                                                                                            ret = dataStations.stations.data.map(station => ({
                                                                                                label: station.name,
                                                                                                value: station.id,
                                                                                            }))
                                                                                        }
                                                                                        resolve(ret);
                                                                                    })
                                                                                }}
                                                                                onChange={(newValue) => {
                                                                                    // setValue(newValue);
                                                                                    console.log('xxxx', newValue)
                                                                                }}
                                                                                style={{
                                                                                    width: '100%',
                                                                                }}
                                                                            />*/}
                                                                            <Select
                                                                                options={dataStations?.stations.data.map(station => ({
                                                                                    label: station.name,
                                                                                    value: station.id,
                                                                                    totalStudents: station.totalStudents,
                                                                                }))}
                                                                                onChange={(value, option) => {
                                                                                    // calc total station
                                                                                    setTotalTurnBackStation(form.getFieldValue('stationsInSchoolYearForTurnBack').filter(list => list?.selStation).length);

                                                                                    // calc total student
                                                                                    const uniqueSet = new Set(form.getFieldValue('stationsInSchoolYearForTurnBack')
                                                                                        .filter(list => list?.selStation)
                                                                                        .map(list => list.selStation));
                                                                                    let totalStudents = dataStations?.stations.data
                                                                                        .filter(station => Array.from(uniqueSet).includes(station.id))
                                                                                        .map(station => station.totalStudents)
                                                                                        .reduce((accumulator, currentValue) => accumulator + currentValue);
                                                                                    setTotalTurnBackStudent(totalStudents);

                                                                                    //calc alert not enough seats
                                                                                    calcTurnBackRedundantStudents(totalStudents);
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                            <Col>
                                                                <Form.Item
                                                                    {...field}
                                                                    label={index == 0 ? intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-back-morning.label'}) : null}
                                                                    name={[field.name, 'pickerMorning']}
                                                                    fieldKey={[field.fieldKey, 'pickerMorning']}
                                                                >
                                                                    <TimePicker
                                                                        showNow={false}
                                                                        allowClear={false}
                                                                        suffixIcon={null}
                                                                        placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-back-morning.placeholder'})}
                                                                        format="HH:mm"
                                                                        onChange={() => {}}
                                                                        style={{width: '58px'}}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col>
                                                                <Form.Item
                                                                    {...field}
                                                                    label={index == 0 ? intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-back-afternoon.label'}) : null}
                                                                    name={[field.name, 'pickerAfternoon']}
                                                                    fieldKey={[field.fieldKey, 'pickerAfternoon']}
                                                                >
                                                                    <TimePicker
                                                                        showNow={false}
                                                                        allowClear={false}
                                                                        suffixIcon={null}
                                                                        placeholder={intl.formatMessage({id: 'schedule.schedule-info-form.picker-turn-back-afternoon.placeholder'})}
                                                                        format="HH:mm"
                                                                        onChange={() => {}}
                                                                        style={{width: '58px'}}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            {/*<Col>
                                                                <Form.Item
                                                                    label={index == 0 ? " " : null}
                                                                >
                                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                                </Form.Item>
                                                            </Col>*/}
                                                        </Row>
                                                    ))}

                                                    <Form.Item>
                                                        <Button
                                                            className="btn-add-station"
                                                            onClick={() => add()}
                                                            block
                                                            icon={<PlusOutlined />}
                                                        >
                                                            Thêm điểm
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                </Col>
                                <Col sm={24}>
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
                        </Block>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default FormScheduleInfo;
