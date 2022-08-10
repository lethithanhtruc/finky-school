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
    DatePicker, Modal
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
import {DELETE_STATION, LOAD_STATIONS} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import {GET_RELEVANT_DATA_FOR_STATION} from "../Station/gql";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const { RangePicker } = DatePicker;

const Station = () => {
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
            startDate: filterStartDate
        };
        if(filterEndDate){
            filter.endDate = filterEndDate;
        }
        if(filterName){
            filter.name = filterName.toLowerCase();
            filter.code = `%${filterName}%`;
        }

        loadStations({
            variables: {
                filter: filter
            }
        });
    }, [filterStartDate, filterEndDate, filterCampusId, filterName]);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForStation, error: errorRelevantDataForStation, data: dataRelevantDataForStation } = useQuery(GET_RELEVANT_DATA_FOR_STATION);
    useEffect(() => {
        if(!loadingRelevantDataForStation && dataRelevantDataForStation){
            console.log('dataRelevantDataForStation', dataRelevantDataForStation)

            setDataOptionCampuses([
                {
                    value: "",
                    label: intl.formatMessage({id: 'general.all'}),
                },
                ...dataRelevantDataForStation.campuses.data.map(campus => ({
                    value: campus.id,
                    label: campus.name,
                }))
            ]);

            const schoolyearCurrent = dataRelevantDataForStation.schoolyears.data.filter(schoolyear => parseInt(schoolyear.endAt.substring(0, 4)) === new Date().getFullYear());
            setfilterStartDate(schoolyearCurrent[0].startAt);
            // setSelectedSchoolyearId(schoolyearCurrent[0].id);

            /*let initialValueCampus = dataRelevantDataForStation?.campuses.data[0].id;
            setfilterCampusId(initialValueCampus);*/

            /*loadStations({
                variables: {
                    filter: {
                        campusId: initialValueCampus,
                    }
                }
            });*/
        }
    }, [loadingRelevantDataForStation, dataRelevantDataForStation]);

    // ----------
    // Query lấy danh sách Điểm đón
    // ----------
    const [loadStations, { loading: loadingStations, data: dataStations, refetch: refetchStations, fetchMore: fetchMoreStations }] = useLazyQuery(LOAD_STATIONS, {
        notifyOnNetworkStatusChange: true
    });

    // ----------
    // Mutation Xóa Điểm đón và xử lý kết quả trả về từ API
    // ----------
    const [stationDelete, { loading: loadingStationDelete, error: errorStationDelete, data: dataStationDelete }] = useMutation(DELETE_STATION);
    useEffect(() => {
        if(!loadingStationDelete && errorStationDelete){
            // ...
        }else if(!loadingStationDelete && dataStationDelete){
            refetchStations();
            message.success(intl.formatMessage({id: 'station.message.deleted-station-successfully'}));
        }
    }, [loadingStationDelete, errorStationDelete, dataStationDelete])

    // ----------
    // Xử lý tìm kiếm
    // ----------
    const filterStation = () => {
        setfilterName(form.getFieldValue('txtSearchFilter'));
    }

    // ----------
    // Định nghĩa các column cho table Điểm đón
    // ----------
    const columns = [
        {
            title: <FormattedMessage id="station.index.column.code" />,
            dataIndex: 'code',
        },
        {
            title: <FormattedMessage id="station.index.column.avatar" />,
            dataIndex: 'avatar',
            render: (text, record, index) => {
                if(!text){
                    return (
                        <Image
                            preview={false}
                            src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAYAAADvCdDvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAT7SURBVHgB7Z1NUhpBFMcfyMKVsnKbOQLeAE+QiGKVq8gJYk6gnkByAsjKKgUxJ5CcIOYEMVtXurRKNP+HPQlRGbqnP6bF96sifAQU50f3e/266SnRBIPBoI6rvYeHhxquqyT45BqXC1y6jUbja/pgKb3R6/W65XL5IwnBKZVK7fX19c/j2/zP6elpG1efSCgM9ErdjY2NVom7Kdw5J6FwRqPRWpmkZUQDQsanMlpHnYQoQCypV2hKNgVRZzB2QYIPaji+H154vFqZ9grYOkPk/0qCc/r9/g6O70tCqExCVIiQyBAhkSFCIkOERIYIiYwKCTNBeal6d3dXS+9XKpULDAmuyQMiJAMeL3AFnKsZCwsLfx/HfS7IDlF7Omg2m0NyiHRZL4AWkeByjsFbJ6O0xJLO8bxDcogIeQLL4Oq3bo0Pz9tFS+qQI0TIc/jgJiYvQEvacdVSRMgEHDPyVr+5pXDrIktEyAS2U9j39/fWc0siRMGpre3c0LQKrgki5B81sifpdDpWq3UKG4fwJxJNfBefqrSbuKQnS2JCgveS4L2QLSsrK8v0uMQnF4W0EJVa/sAB2KPHjIYvdVy6rvN6XfB+nIy8r66ubsiC4ELSPJ+mpJacrZycnOxTYDDIczFdfd1qtazEBheCAz6gGXk+Ds5er9ezDpAmoDZ1SRZdDYO/bUiWBBWiFuRpBU+koB0Xeb0JvIKQLMDru2RJMCEYdO2T2RowTkPPbbMWQ77QY3KRhyESkm9kSRAh3P2oAG5Ksry8PKBAcEkd77NF5lze3t7med0zvAvhboe7H8pPPWTmBSlDpMDrpB9PWMba9vb2JTnAq5CJjMqq2+HMC/En2Mr8zc3NMxzkVV4AnfU8/H/75uZm1ZUMxuvAUCejMqB9fHz8c2trK8hqSnWQW0dHRweLi4vvSSUjaD3crV1AxDfbFPclvAkxyag0qWLqFI1usKZS1CAoMV8oEF66rBwZlS6JanVzi3MhFhmVLrWiyishcCrEQUalhZo23aU5xJkQVxmVLmiFh6h51WnOcCbEcUalBWpeg9DlFd84EeIho9KliPKKV6yFeMyodEmWlpbmJshbjUMCZFRa8DIcxJPfzWZznzzyZGOF8bfMcHXgclyUu4WEyqh04TkUn+UV7gkmFtBxF8ndJS8b+uXy9+YSEjqjMqDtI8izjBk9QdfVLGcuIUVkVJo4D/IaMsZwC3UhxVhIgRmVLs7mUNS3ZbVjpAspRkIiyKh0sZ5DUTKMY6StFG0hXKqIIaPSxaa8kldGCkvJuyJeSwgHytckI4XLK5hDMepebWVM/O4d/KyBaTybKSTijEoLNYeS6DxXjaucpfK81hfxzCjJyBSiFiBPXdT2ShjPocw6KPhba57GVTVI+aH7ocgUMhqNOKNK6PVTyyqvsAzPvcC4l9GRkiVkd562/FN9+rMgH0BGipaULCExjzVy8XQOJaCMlLEUfNDfTXtCCQO9B3pb8KqRVb4RY3x8i99Tr07sMZlQZLzVjQMSihT5SltkiJDIECGRIUIiQ4REhgiJDBESGSIkMkRIZIiQyBAhkSFCIkOERIYIiQwREhkiJDJESGSwEOe7EQi5uS5jwn9IQhTwBmjcQoJtGyFkwxuoldV2RHI2toLhnYUajcb3v/ui9vv9Qxiay90RYic9Dy7f/m+j2onzZcjpu/2Tnr57n1tG+uAfAZxWrH7MuzQAAAAASUVORK5CYII='}
                        />
                    );
                }
            }
        },
        {
            title: <FormattedMessage id="station.index.column.name" />,
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <strong>{text}</strong>
                );
            }
        },
        {
            title: <FormattedMessage id="station.index.column.address" />,
            dataIndex: 'gmapAddress',
        },
        {
            title: <FormattedMessage id="station.index.column.total-register" />,
            dataIndex: 'students',
            render: (text, record, index) => record.students ? record.students.length : 0
        },
        {
            title: <FormattedMessage id="station.index.column.from" />,
            dataIndex: 'from',
        },
        {
            title: <FormattedMessage id="station.index.column.status" />,
            dataIndex: 'status',
            render: (text, record, index) => (
                <Tag color={text.toLowerCase() == 'active' ? '#27AE60' : '#AEAEAE'}>
                    <FormattedMessage id={`station.status.${text.toLowerCase()}`} />
                </Tag>
            )
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Link to={`/edit-station/${record.key}`}>
                            <EditOutlined />
                        </Link>
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                stationDelete({
                                    variables: {
                                        "id": [record.key]
                                    },
                                });
                            }}
                        />
                    </Space>
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
        <div className="station-page">
            <PageHeader title={(
                <FormattedMessage id="station.index.title" />
            )} />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={15} align="left" className="tool-filter">
                    <Space size={24}>
                        <div className="item-filter">
                            <label htmlFor=""><FormattedMessage id="station.index.filter.rangepicker-from-to.label" />:</label>
                            <RangePicker
                                value={[
                                    filterStartDate ? moment(filterStartDate, 'YYYY-MM-DD') : null,
                                    filterEndDate ? moment(filterEndDate, 'YYYY-MM-DD') : null,
                                ]}
                                allowClear={false}
                                allowEmpty={[false, true]}
                                onChange={dates => {
                                    setfilterStartDate(dates && dates[0] ? dates[0].format('YYYY-MM-DD') : null);
                                    setfilterEndDate(dates && dates[1] ? dates[1].format('YYYY-MM-DD') : null);
                                }}
                            />
                        </div>
                        <div className="item-filter">
                            <label htmlFor=""><FormattedMessage id="station.index.filter.select-campus.label" />:</label>
                            <Select
                                placeholder={intl.formatMessage({id: 'station.index.filter.select-campus.placeholder'})}
                                options={dataOptionCampuses}
                                onChange={(value) => {
                                    setfilterCampusId(value);
                                }}
                            />
                        </div>
                    </Space>
                </Col>
                <Col sm={9} align="right">
                    <Space>
                        <Space>
                            <Button type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-station')}>
                                <FormattedMessage id="station.index.action.button-add-station.label" />
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
                                        <FormattedMessage id="station.index.action.button-import-export-data.label" /> <DownOutlined />
                                    </>
                                </Button>
                            </Dropdown>
                        </Space>
                    </Space>
                </Col>
            </Row>
            <Row className="wrapper-filter">
                <Col sm={16}>
                    <Form
                        form={form}
                        className="wrapper-form-search"
                        onFinish={() => {}}
                    >
                        <Space size={8}>
                            <Form.Item
                                className="wrapper-input-search-filter"
                                name="txtSearchFilter"
                            >
                                <Input
                                    prefix={<SearchOutlined />}
                                    placeholder={intl.formatMessage({
                                        id: 'station.index.filter.input-search.placeholder',
                                    }) + '...'}
                                />
                            </Form.Item>
                            <Form.Item
                                className="wrapper-btn-search-filter"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => filterStation()}
                                >
                                    <FormattedMessage id="general.search" />
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Col>
                <Col sm={8} align="right">
                    <PaginationTable
                        total={dataStations?.stations.paginatorInfo.total}
                        onChange={(page) => {
                            fetchMoreStations({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        stations: {
                                            ...fetchMoreResult.stations
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
                        className="actions-hover-style even-style"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataStations?.stations.data}
                        pagination={false}
                        loading={loadingStations || loadingStationDelete}
                        locale={{
                            emptyText: (loadingStations || loadingStationDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Station;
