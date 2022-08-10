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
import {DELETE_NANNY, LOAD_NANNIES} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const Nanny = () => {
    const intl = useIntl();

    const history = useHistory();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        loadNannies();
    }, []);

    // ----------
    // Query lấy danh sách Bảo mẫu
    // ----------
    const [loadNannies, { loading: loadingNannies, error: errorNanny, data: dataNannies, refetch: refetchNannies, fetchMore: fetchMoreNannies }] = useLazyQuery(LOAD_NANNIES, {
        notifyOnNetworkStatusChange: true
    });

    // ----------
    // Mutation Xóa Bảo mẫu và xử lý kết quả trả về từ API
    // ----------
    const [nannyDelete, { loading: loadingNannyDelete, error: errorNannyDelete, data: dataNannyDelete }] = useMutation(DELETE_NANNY);
    useEffect(() => {
        if(!loadingNannyDelete && errorNannyDelete){
            // ...
        }else if(!loadingNannyDelete && dataNannyDelete){
            refetchNannies();
            message.success(intl.formatMessage({id: 'nanny.message.deleted-nanny-successfully'}));
        }
    }, [loadingNannyDelete, errorNannyDelete, dataNannyDelete])

    // ----------
    // Xử lý tìm kiếm
    // ----------
    const filterNanny = () => {
        let filter = {};
        /*filter = {
            campusId: form.getFieldValue('selCampusFilter'),
        };*/
        let name = form.getFieldValue('txtSearchFilter');
        if(name && name !== ""){
            filter.name = name.toLowerCase();
            filter.code = `%${filter.name}%`;
        }

        loadNannies({
            variables: {
                filter: filter
            }
        });
    }

    // ----------
    // Định nghĩa các column cho table Phụ huynh
    // ----------
    const columns = [
        {
            title: <FormattedMessage id="nanny.index.column.code" />,
            dataIndex: 'code',
        },
        {
            title: <FormattedMessage id="nanny.index.column.name" />,
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
            title: <FormattedMessage id="nanny.index.column.age" />,
            dataIndex: 'birthday',
            render: (text, record, index) => {
                return text ? (
                    moment().month(0).diff(moment(text, "YYYY-MM-DD").month(0),'years')
                ) : "";
            }
        },
        {
            title: <FormattedMessage id="nanny.index.column.gender" />,
            dataIndex: 'gender',
            render: (text, record, index) => (
                <FormattedMessage id={`nanny.nanny-info-form.radio-gender.value.${text.toLowerCase()}`} />
            )
        },
        {
            title: <FormattedMessage id="nanny.index.column.address" />,
            dataIndex: 'address',
            render: (text, record, index) => (
                <div style={{
                    maxWidth: '400px'
                }}>
                    {text}
                </div>
            )
        },
        {
            title: <FormattedMessage id="nanny.index.column.contact" />,
            dataIndex: 'phone',
        },
        {
            title: <FormattedMessage id="nanny.index.column.status" />,
            dataIndex: 'status',
            render: (text, record, index) => (
                <div style={{
                    minWidth: '120px'
                }}>
                    <FormattedMessage id={`nanny.status.${text.toLowerCase()}`} />
                </div>
            )
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Link to={`/edit-nanny/${record.key}`}>
                            <EditOutlined />
                        </Link>
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                nannyDelete({
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
        <div className="nanny-page">
            <PageHeader title={(
                <FormattedMessage id="nanny.index.title" />
            )} />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={24} align="right">
                    <Space>
                        <Space>
                            <Button type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-nanny')}>
                                <FormattedMessage id="nanny.index.action.button-add-nanny.label" />
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
                                            Nhập dữ liệu bảo mẫu
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
                                        <FormattedMessage id="nanny.index.action.button-import-export-data.label" /> <DownOutlined />
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
                                        id: 'nanny.index.filter.input-search.placeholder',
                                    }) + '...'}
                                />
                            </Form.Item>
                            <Form.Item
                                className="wrapper-btn-search-filter"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => filterNanny()}
                                >
                                    <FormattedMessage id="general.search" />
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Col>
                <Col sm={8} align="right">
                    <PaginationTable
                        total={dataNannies?.nannies.paginatorInfo.total}
                        onChange={(page) => {
                            fetchMoreNannies({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        nannies: {
                                            ...fetchMoreResult.nannies
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
                        dataSource={dataNannies?.nannies.data}
                        pagination={false}
                        loading={loadingNannies || loadingNannyDelete}
                        locale={{
                            emptyText: (loadingNannies || loadingNannyDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Nanny;
