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
    message, Modal,
    Pagination,
    Row,
    Select,
    Space,
    Table
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
import {useLazyQuery, useMutation} from "@apollo/client";
import {DELETE_DRIVER, LOAD_DRIVERS} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const Driver = () => {
    const intl = useIntl();

    const history = useHistory();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        loadDrivers();
    }, []);

    // ----------
    // Query lấy danh sách Tài xế
    // ----------
    const [loadDrivers, { loading: loadingDrivers, data: dataDrivers, refetch: refetchDrivers, fetchMore: fetchMoreDrivers }] = useLazyQuery(LOAD_DRIVERS, {
        notifyOnNetworkStatusChange: true
    });

    // ----------
    // Mutation Xóa Tài xế và xử lý kết quả trả về từ API
    // ----------
    const [driverDelete, { loading: loadingDriverDelete, error: errorDriverDelete, data: dataDriverDelete }] = useMutation(DELETE_DRIVER);
    useEffect(() => {
        if(!loadingDriverDelete && errorDriverDelete){
            // ...
        }else if(!loadingDriverDelete && dataDriverDelete){
            refetchDrivers();
            message.success(intl.formatMessage({id: 'driver.message.deleted-driver-successfully'}));
        }
    }, [loadingDriverDelete, errorDriverDelete, dataDriverDelete])

    // ----------
    // Xử lý tìm kiếm
    // ----------
    const filterDriver = () => {
        let filter = {};
        /*filter = {
            campusId: form.getFieldValue('selCampusFilter'),
        };*/
        let name = form.getFieldValue('txtSearchFilter');
        if(name && name !== ""){
            filter.name = name.toLowerCase();
            filter.code = `%${filter.name}%`;
        }

        loadDrivers({
            variables: {
                filter: filter
            }
        });
    }

    // ----------
    // Định nghĩa các column cho table Tài xế
    // ----------
    const columns = [
        {
            title: <FormattedMessage id="driver.index.column.code" />,
            dataIndex: 'code',
        },
        {
            title: <FormattedMessage id="driver.index.column.name" />,
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div className="wrapper-fullname-with-avatar">
                        {record.avatar ? (
                            <Avatar src={<Image src={record.avatar} />} />
                        ) : (
                            <Avatar icon={<UserOutlined />} />
                        )} {text}
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="driver.index.column.age" />,
            dataIndex: 'birthday',
            render: (text, record, index) => {
                return text ? (
                    moment().month(0).diff(moment(text, "YYYY-MM-DD").month(0),'years')
                ) : "";
            }
        },
        {
            title: <FormattedMessage id="driver.index.column.gender" />,
            dataIndex: 'gender',
            render: (text, record, index) => (
                <FormattedMessage id={`driver.driver-info-form.radio-gender.value.${text.toLowerCase()}`} />
            )
        },
        {
            title: <FormattedMessage id="driver.index.column.address" />,
            dataIndex: 'address',
            render: (text, record, index) => (
                <div style={{maxWidth: '400px'}}>{text}</div>
            )
        },
        {
            title: <FormattedMessage id="driver.index.column.contact" />,
            dataIndex: 'phone',
        },
        {
            title: <FormattedMessage id="driver.index.column.status" />,
            dataIndex: 'status',
            render: (text, record, index) => (
                <FormattedMessage id={`driver.status.${text.toLowerCase()}`} />
            )
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Link to={`/edit-driver/${record.key}`}>
                            <EditOutlined />
                        </Link>
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                driverDelete({
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
        <div className="driver-page">
            <PageHeader title={(
                <FormattedMessage id="driver.index.title" />
            )} />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={24} align="right">
                    <Space>
                        <Space>
                            <Button type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-driver')}>
                                <FormattedMessage id="driver.index.action.button-add-driver.label" />
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
                                            Nhập dữ liệu tài xế
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
                                        <FormattedMessage id="driver.index.action.button-import-export-data.label" /> <DownOutlined />
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
                                        id: 'driver.index.filter.input-search.placeholder',
                                    }) + '...'}
                                />
                            </Form.Item>
                            <Form.Item
                                className="wrapper-btn-search-filter"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => filterDriver()}
                                >
                                    <FormattedMessage id="general.search" />
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Col>
                <Col sm={8} align="right">
                    <PaginationTable
                        total={dataDrivers?.drivers.paginatorInfo.total}
                        onChange={(page) => {
                            fetchMoreDrivers({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        drivers: {
                                            ...fetchMoreResult.drivers
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
                        dataSource={dataDrivers?.drivers.data}
                        pagination={false}
                        loading={loadingDrivers || loadingDriverDelete}
                        locale={{
                            emptyText: (loadingDrivers || loadingDriverDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Driver;
