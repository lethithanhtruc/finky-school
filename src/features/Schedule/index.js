import React, {useState, useEffect} from 'react';
import {useIntl, FormattedMessage} from 'react-intl';
import PageHeader from "../../components/Layout/PageHeader";
import {
    Avatar,
    Button,
    Col,
    Dropdown,
    Form,
    Image,
    Input,
    Menu,
    message,
    Pagination,
    Row,
    Select,
    Space,
    Table, Tag,
    Modal
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    CopyOutlined,
    DownCircleOutlined,
    RightCircleOutlined,
    DownOutlined,
    UserOutlined
} from '@ant-design/icons';
import {Link, useHistory} from "react-router-dom";
import './index.scss';
import moment from "moment";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {DELETE_SCHEDULE, LOAD_SCHEDULES} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import {GET_RELEVANT_DATA_FOR_SCHEDULE} from "../Schedule/gql";
import UpcomingFeature from "../../components/Common/UpcomingFeature";
import Login from "../Login";

const Schedule = () => {
    const intl = useIntl();

    const history = useHistory();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataOptionCampuses, setDataOptionCampuses] = useState([
        {
            value: "",
            label: intl.formatMessage({id: 'general.all'}),
        }
    ]);
    const [filterCampusId, setfilterCampusId] = useState(null);
    const [filterStartDate, setfilterStartDate] = useState(null);
    const [filterEndDate, setfilterEndDate] = useState(null);
    const [filterName, setfilterName] = useState(null);

    useEffect(() => {
        let filter = {
            campusId: filterCampusId,
        };
        if(filterName){
            filter.name = filterName.toLowerCase();
            filter.code = `%${filterName}%`;
        }

        loadSchedules({
            variables: {
                filter: filter
            }
        });
    }, [filterStartDate, filterEndDate, filterCampusId, filterName]);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForSchedule, error: errorRelevantDataForSchedule, data: dataRelevantDataForSchedule } = useQuery(GET_RELEVANT_DATA_FOR_SCHEDULE);
    useEffect(() => {
        if(!loadingRelevantDataForSchedule && dataRelevantDataForSchedule){
            console.log('dataRelevantDataForSchedule', dataRelevantDataForSchedule)

            setDataOptionCampuses([
                {
                    value: "",
                    label: intl.formatMessage({id: 'general.all'}),
                },
                ...dataRelevantDataForSchedule.campuses.data.map(campus => ({
                    value: campus.id,
                    label: campus.name,
                }))
            ]);

            const schoolyearCurrent = dataRelevantDataForSchedule.schoolyears.data.filter(schoolyear => parseInt(schoolyear.endAt.substring(0, 4)) === new Date().getFullYear());
            setfilterStartDate(schoolyearCurrent[0].startAt);
            // setSelectedSchoolyearId(schoolyearCurrent[0].id);

            /*let initialValueCampus = dataRelevantDataForSchedule?.campuses.data[0].id;
            setfilterCampusId(initialValueCampus);*/

            /*loadSchedules({
                variables: {
                    filter: {
                        campusId: initialValueCampus,
                    }
                }
            });*/
        }
    }, [loadingRelevantDataForSchedule, dataRelevantDataForSchedule]);

    // ----------
    // Query lấy danh sách Lịch trình
    // ----------
    const [loadSchedules, { loading: loadingSchedules, data: dataSchedules, refetch: refetchSchedules, fetchMore: fetchMoreSchedules }] = useLazyQuery(LOAD_SCHEDULES, {
        notifyOnNetworkStatusChange: true
    });

    // ----------
    // Mutation Xóa Lịch trình và xử lý kết quả trả về từ API
    // ----------
    const [scheduleDelete, { loading: loadingScheduleDelete, error: errorScheduleDelete, data: dataScheduleDelete }] = useMutation(DELETE_SCHEDULE);
    useEffect(() => {
        if(!loadingScheduleDelete && errorScheduleDelete){
            // ...
        }else if(!loadingScheduleDelete && dataScheduleDelete){
            refetchSchedules();
            message.success(intl.formatMessage({id: 'schedule.message.deleted-schedule-successfully'}));
        }
    }, [loadingScheduleDelete, errorScheduleDelete, dataScheduleDelete])

    // ----------
    // Xử lý tìm kiếm
    // ----------
    const filterSchedule = () => {
        setfilterName(form.getFieldValue('txtSearchFilter'));
    }

    // ----------
    // Định nghĩa các column cho table Lịch trình
    // ----------
    const columns = [
        {
            title: <FormattedMessage id="schedule.index.column.code" />,
            dataIndex: 'code',
            render: (text, record, index) => {
                return (
                    <div className="multi-row" style={{fontSize: '16px'}}>
                        <div className="row-top">{text}</div>
                        <div className="row-bottom"></div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.name" />,
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div className="multi-row" style={{fontSize: '16px'}}>
                        <div className="row-top">{text}</div>
                        <div className="row-bottom"></div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.turn" />,
            dataIndex: 'turn',
            render: (text, record, index) => {
                return (
                    <div className="multi-row">
                        <div className="row-top">Đi</div>
                        <div className="row-bottom">Về</div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.route" />,
            dataIndex: 'route',
            render: (text, record, index) => {
                let routeTurnAway = '';
                let routeTurnBack = '';
                if(record.stationsInCurrentSchoolYear){
                    routeTurnAway = record.stationsInCurrentSchoolYear
                        .filter(station => station.turn == 'TURN_AWAY')
                        .map(station => station.station.name).join(' - ');
                    routeTurnBack = record.stationsInCurrentSchoolYear
                        .filter(station => station.turn == 'TURN_BACK')
                        .map(station => station.station.name).join(' - ');
                }
                return (
                    <div className="multi-row">
                        <div className="row-top">{routeTurnAway}</div>
                        <div className="row-bottom">{routeTurnBack}</div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.total-station" />,
            dataIndex: 'totalStation',
            render: (text, record, index) => {
                return (
                    <div className="multi-row">
                        <div className="row-top">{record.totalTurnAwayStation}</div>
                        <div className="row-bottom">{record.totalTurnBackStation}</div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.total-student" />,
            dataIndex: 'totalStudent',
            render: (text, record, index) => {
                return (
                    <div className="multi-row">
                        <div className="row-top">{record.totalTurnAwayStudent}</div>
                        <div className="row-bottom">{record.totalTurnBackStudent}</div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.curator" />,
            dataIndex: 'curator',
            render: (text, record, index) => {
                return (
                    <div className="multi-row" style={{minWidth: '180px'}}>
                        <div className="row-top">
                            <div>TX: {record.turnAwayDriver?.name}</div>
                            <div>BM: {record.turnAwayNanny?.name}</div>
                        </div>
                        <div className="row-bottom">
                            <div>TX: {record.turnBackDriver?.name}</div>
                            <div>BM: {record.turnBackNanny?.name}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.vehicle" />,
            dataIndex: 'vehicle',
            render: (text, record, index) => {
                return (
                    <div className="multi-row">
                        <div className="row-top">
                            <div>{record.turnAwayVehicle ? `${record.turnAwayVehicle.seatNumber} chỗ` : ''}</div>
                            <div>{record.turnAwayVehicle?.licensePlate}</div>
                        </div>
                        <div className="row-bottom">
                            <div>{record.turnBackVehicle ? `${record.turnBackVehicle.seatNumber} chỗ` : ''}</div>
                            <div>{record.turnBackVehicle?.licensePlate}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.morning-departure-time" />,
            dataIndex: 'morningDepartureTime',
            render: (text, record, index) => {
                let morningTurnAway = '';
                let morningTurnBack = '';
                if(record.stationsInCurrentSchoolYear){
                    let firstMorningTurnAway = record.stationsInCurrentSchoolYear
                        .filter(station => station.turn == 'TURN_AWAY' && station.morningAt)
                        .shift();
                    if(firstMorningTurnAway){
                        morningTurnAway = firstMorningTurnAway.morningAt.substring(0, 5);
                    }

                    let firstMorningTurnBack = record.stationsInCurrentSchoolYear
                        .filter(station => station.turn == 'TURN_BACK' && station.morningAt)
                        .shift();
                    if(firstMorningTurnBack){
                        morningTurnBack = firstMorningTurnBack.morningAt.substring(0, 5);
                    }
                }

                return (
                    <div className="multi-row">
                        <div className="row-top">{morningTurnAway}</div>
                        <div className="row-bottom">{morningTurnBack}</div>
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="schedule.index.column.afternoon-departure-time" />,
            dataIndex: 'afternoonDepartureTime',
            render: (text, record, index) => {
                let afternoonTurnAway = '';
                let afternoonTurnBack = '';
                if(record.stationsInCurrentSchoolYear){
                    let firstAfternoonTurnAway = record.stationsInCurrentSchoolYear
                        .filter(station => station.turn == 'TURN_AWAY' && station.afternoonAt)
                        .shift();
                    if(firstAfternoonTurnAway){
                        afternoonTurnAway = firstAfternoonTurnAway.afternoonAt.substring(0, 5);
                    }

                    let firstAfternoonTurnBack = record.stationsInCurrentSchoolYear
                        .filter(station => station.turn == 'TURN_BACK' && station.afternoonAt)
                        .shift();
                    if(firstAfternoonTurnBack){
                        afternoonTurnBack = firstAfternoonTurnBack.afternoonAt.substring(0, 5);
                    }
                }

                return (
                    <div className="multi-row">
                        <div className="row-top">{afternoonTurnAway}</div>
                        <div className="row-bottom">{afternoonTurnBack}</div>
                    </div>
                );
            }
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return (
                    <div className="multi-row">
                        <div className="row-top no-border">
                            <Space className="actions">
                                <Link to={`/edit-schedule/${record.key}`}>
                                    <EditOutlined />
                                </Link>
                                <Button
                                    type="link"
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        scheduleDelete({
                                            variables: {
                                                "id": [record.key]
                                            },
                                        });
                                    }}
                                />
                            </Space>
                        </div>
                        <div className="row-bottom"></div>
                    </div>
                );
            }
        },
    ];

    const onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className="schedule-page">
            <PageHeader title={(
                <FormattedMessage id="schedule.index.title" />
            )} />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={15} align="left" className="tool-filter">
                    <Form
                        form={form}
                        className="wrapper-form-search"
                        onFinish={() => {}}
                    >
                        <Space size={8}>
                            <div className="item-filter-campus">
                                <label htmlFor=""><FormattedMessage id="schedule.index.filter.select-campus.label" />:</label>
                                <Select
                                    placeholder={intl.formatMessage({id: 'schedule.index.filter.select-campus.placeholder'})}
                                    options={dataOptionCampuses}
                                    onChange={(value) => {
                                        setfilterCampusId(value);
                                    }}
                                    style={{width: '186px'}}
                                />
                            </div>
                            <Form.Item
                                className="wrapper-input-search-filter"
                                name="txtSearchFilter"
                            >
                                <Input
                                    prefix={<SearchOutlined />}
                                    placeholder={intl.formatMessage({
                                        id: 'schedule.index.filter.input-search.placeholder',
                                    }) + '...'}
                                />
                            </Form.Item>
                            <Form.Item
                                className="wrapper-btn-search-filter"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => filterSchedule()}
                                >
                                    <FormattedMessage id="general.search" />
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Col>
                <Col sm={9} align="right">
                    <Space>
                        <Space>
                            <Button type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-schedule')}>
                                <FormattedMessage id="schedule.index.action.button-add-schedule.label" />
                            </Button>
                            <Dropdown
                                trigger={['click']}
                                overlay={(
                                    <Menu onClick={() => {
                                        Modal.confirm({
                                            className: 'modal-upcoming-feature',
                                            maskClosable: true,
                                            title: null,
                                            icon: null,
                                            content: (
                                                <UpcomingFeature
                                                    title={intl.formatMessage({id: 'upcoming-feature.title'})}
                                                    description={intl.formatMessage({id: 'upcoming-feature.description'})}
                                                />
                                            ),
                                            width: 580,
                                        });
                                    }}>
                                        <Menu.Item key="1">
                                            Nhập/xuất dữ liệu
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            Nhập dữ liệu điểm đón
                                        </Menu.Item>
                                        <Menu.Item key="3">
                                            Xuất dữ liệu học
                                        </Menu.Item>
                                        <Menu.Item key="4">
                                            Tải về mẫu danh sách
                                        </Menu.Item>
                                    </Menu>
                                )}
                            >
                                <Button>
                                    <>
                                        <FormattedMessage id="schedule.index.action.button-import-export-data.label" /> <DownOutlined />
                                    </>
                                </Button>
                            </Dropdown>
                        </Space>
                    </Space>
                </Col>
            </Row>
            <Row className="wrapper-filter">
                <Col sm={16}></Col>
                <Col sm={8} align="right">
                    <PaginationTable
                        total={dataSchedules?.schedules.paginatorInfo.total}
                        onChange={(page) => {
                            fetchMoreSchedules({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        schedules: {
                                            ...fetchMoreResult.schedules
                                        }
                                    });
                                }
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col sm={24}>
                    <Table
                        className="actions-hover-style even-style multi-row-style"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataSchedules?.schedules.data}
                        pagination={false}
                        loading={loadingSchedules || loadingScheduleDelete}
                        locale={{
                            emptyText: (loadingSchedules || loadingScheduleDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Schedule;
