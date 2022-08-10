import React, {useState, useEffect} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import {Button, Col, Dropdown, Form, Input, Menu, message, Modal, Pagination, Row, Select, Space, Table} from "antd";
import SelectSchoolYear from "../../components/Common/SelectSchoolYear";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    CopyOutlined,
    DownCircleOutlined,
    RightCircleOutlined,
    DownOutlined,
} from '@ant-design/icons';
import {Link, useHistory} from "react-router-dom";
import './index.scss';
import moment from "moment";
import {useLazyQuery, useMutation} from "@apollo/client";
import {DELETE_USER, LOAD_USERS} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import {useIntl} from "react-intl";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const User = () => {
    const intl = useIntl();
    const history = useHistory();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        loadUser();
    }, []);

    const [loadUser, { loading: loadingUser, error: errorUser, data: dataUser, variables: variablesUser, refetch: refetchUser, fetchMore: fetchMoreUser }] = useLazyQuery(LOAD_USERS, {
        notifyOnNetworkStatusChange: true
    });
    useEffect(() => {
        if(loadingUser === false && dataUser){
            console.log('dataUser.users', dataUser.users)
        }
    }, [loadingUser, dataUser]);

    const [userDelete, { loading: loadingUserDelete, error: errorUserDelete, data: dataUserDelete }] = useMutation(DELETE_USER);
    useEffect(() => {
        if(!loadingUserDelete && errorUserDelete){
            // ...
        }else if(!loadingUserDelete && dataUserDelete){
            refetchUser();
            message.success('Xóa tài khoản thành công.');
        }
    }, [loadingUserDelete, errorUserDelete, dataUserDelete])

    const filterUser = () => {
        let filter = {};
        /*filter = {
            campusId: form.getFieldValue('selCampusFilter'),
        };*/
        let name = form.getFieldValue('txtSearchFilter');
        if(name && name !== ""){
            filter.name = `%${name}%`;
        }

        loadUser({
            variables: {
                filter: filter
            }
        });
    }

    const columns = [
        {
            title: 'Mã tài khoản',
            dataIndex: 'code',
        },
        {
            title: 'Họ tên',
            dataIndex: 'name',
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Link to={`/edit-user/${record.key}`}>
                            <EditOutlined />
                        </Link>
                        <Button type="link" icon={<CopyOutlined />} />
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                userDelete({
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
        <div className="user-page">
            <PageHeader title="Tài khoản" />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={24} align="right">
                    <Space>
                        <Space>
                            <Button
                                type="default"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    // history.push('/create-user')
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
                                }}
                            >
                                Thêm tài khoản
                            </Button>
                            <Dropdown
                                trigger={['click']}
                                overlay={(
                                    <Menu onClick={() => {}}>
                                        <Menu.Item key="1">
                                            Xóa tài khoản
                                        </Menu.Item>
                                    </Menu>
                                )}
                            >
                                <Button>
                                    Các hành động <DownOutlined />
                                </Button>
                            </Dropdown>
                            <Dropdown
                                trigger={['click']}
                                overlay={(
                                    <Menu
                                        onClick={() => {
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
                                        }}
                                    >
                                        <Menu.Item key="1">
                                            Nhập/xuất dữ liệu
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            Nhập dữ liệu tài khoản
                                        </Menu.Item>
                                        <Menu.Item key="3">
                                            Xuất dữ liệu tài khoản
                                        </Menu.Item>
                                        <Menu.Item key="4">
                                            Tải về mẫu danh sách
                                        </Menu.Item>
                                    </Menu>
                                )}
                            >
                                <Button>
                                    Nhập/xuất dữ liệu <DownOutlined />
                                </Button>
                            </Dropdown>
                        </Space>
                    </Space>
                </Col>
            </Row>
            <Row className="wrapper-filter">
                <Col sm={8}>
                    <Form form={form} name="horizontal_login" className="wrapper-form-search" layout="inline" onFinish={() => {}}>
                        <Form.Item
                            name="txtSearchFilter"
                        >
                            <Input prefix={<SearchOutlined />} placeholder="Tìm tài khoản..." />
                        </Form.Item>
                        <Form.Item shouldUpdate={true}>
                            <Button
                                type="primary"
                                onClick={() => filterUser()}
                            >
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col sm={16} align="right">
                    <PaginationTable
                        total={dataUser?.users.paginatorInfo.total}
                        onChange={(page) => {
                            fetchMoreUser({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        users: {
                                            ...fetchMoreResult.users
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
                        dataSource={dataUser?.users.data}
                        pagination={false}
                        loading={loadingUser || loadingUserDelete}
                        locale={{
                            emptyText: (loadingUser || loadingUserDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default User;
