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
    DownOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {useHistory} from "react-router-dom";
import './index.scss';
import moment from "moment";
import {useLazyQuery, useMutation} from "@apollo/client";
import {DELETE_PARENTAGE, LOAD_PARENTAGES} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const FILTER_BY = [
    {
        value: 'PAPARENTAGE_CODE',
        label: <FormattedMessage id="parents.index.filter.select-filter-by.value.parent-code" />,
    },
    {
        value: 'PAPARENTAGE_NAME',
        label: <FormattedMessage id="parents.index.filter.select-filter-by.value.parent-fullname" />,
    },
    {
        value: 'STUDENT_NAME',
        label: <FormattedMessage id="parents.index.filter.select-filter-by.value.student-fullname" />,
    },
]

const Parentage = () => {
    const intl = useIntl();

    const history = useHistory();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        loadParentages();
    }, []);

    // ----------
    // Query lấy danh sách Phụ huynh
    // ----------
    const [loadParentages, { loading: loadingParentages, data: dataParentages, refetch: refetchParentages, fetchMore: fetchMoreParentages }] = useLazyQuery(LOAD_PARENTAGES, {
        notifyOnNetworkStatusChange: true
    });

    // ----------
    // Mutation Xóa Phụ huynh và xử lý kết quả trả về từ API
    // ----------
    const [parentageDelete, { loading: loadingParentageDelete, error: errorParentageDelete, data: dataParentageDelete }] = useMutation(DELETE_PARENTAGE);
    useEffect(() => {
        if(!loadingParentageDelete && dataParentageDelete){
            refetchParentages();
            message.success(intl.formatMessage({id: 'parents.message.deleted-parents-successfully'}));
        }
    }, [loadingParentageDelete, errorParentageDelete, dataParentageDelete])

    // ----------
    // Xử lý tìm kiếm
    // ----------
    const filterParentage = () => {
        let filter = {};
        let name = form.getFieldValue('txtSearchFilter');
        if(name && name !== ""){
            if(form.getFieldValue('selFilterBy') === 'PAPARENTAGE_CODE') {
                filter.code = `%${name.toLowerCase()}%`;
            }else if(form.getFieldValue('selFilterBy') === 'PAPARENTAGE_NAME'){
                filter.name = name.toLowerCase();
            }else if(form.getFieldValue('selFilterBy') === 'STUDENT_NAME'){
                filter.studentName = name.toLowerCase();
            }
        }
        /*filter = {
            campusId: form.getFieldValue('selFilterBy'),
        };*/

        loadParentages({
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
            title: <FormattedMessage id="parents.index.column.code" />,
            dataIndex: 'code',
        },
        {
            title: <FormattedMessage id="parents.index.column.fullname" />,
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
            title: <FormattedMessage id="parents.index.column.relationship" />,
            dataIndex: 'studentRelationship',
            render: (text, record, index) => (
                <FormattedMessage id={`student.relationship.${text.toLowerCase()}`} />
            )
        },
        {
            title: <FormattedMessage id="parents.index.column.parents-of" />,
            dataIndex: 'students.name',
            render: (text, record, index) => {
                let ret = "";
                record.students.map((student) => {
                    if(student.name != ""){
                        ret += student.name + ', ';
                    }
                });
                if(ret != ""){
                    ret = ret.substring(0, ret.length - 2);
                }

                return (
                    <div className="wrapper-fullname-with-avatar">{ret}</div>
                );
            }
        },
        {
            title: <FormattedMessage id="parents.index.column.address" />,
            dataIndex: 'address',
            render: (text, record, index) => (
                <div style={{maxWidth: '400px'}}>{text}</div>
            )
        },
        {
            title: <FormattedMessage id="parents.index.column.age" />,
            dataIndex: 'birthday',
            render: (text, record, index) => {
                return text ? (
                    moment().month(0).diff(moment(text, "YYYY-MM-DD").month(0),'years')
                ) : "";
            }
        },
        {
            title: <FormattedMessage id="parents.index.column.job" />,
            dataIndex: 'job',
        },
        {
            title: <FormattedMessage id="parents.index.column.contact" />,
            dataIndex: 'phone',
            render: (text, record, index) => {
                return (
                    <>
                        <a href={`tel:${text}`}>{text}</a>
                    </>
                );
            }
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Button disabled type="link" icon={<EditOutlined />} onClick={() => history.push('/edit-parentage/' + record.key)} />
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                parentageDelete({
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
        <div className="parentage-page">
            <PageHeader title={(
                <FormattedMessage id="parents.index.title" />
            )} />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={24} align="right">
                    <Space>
                        <Space>
                            <Button disabled type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-parentage')}>
                                <FormattedMessage id="parents.index.action.button-add-parent.label" />
                            </Button>
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
                                            Xóa phụ huynh
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            Đổi lớp
                                        </Menu.Item>
                                        <Menu.Item key="3">
                                            Đăng ký đưa rước
                                        </Menu.Item>
                                    </Menu>
                                )}
                            >
                                <Button>
                                    <>
                                        <FormattedMessage id="parents.index.action.button-action.label" /> <DownOutlined />
                                    </>
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
                                            Nhập dữ liệu phụ huynh
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
                                        <FormattedMessage id="parents.index.action.button-import-export-data.label" /> <DownOutlined />
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
                        initialValues={{
                            selFilterBy: "PAPARENTAGE_NAME"
                        }}
                    >
                        <Space size={8}>
                            <Form.Item
                                className="wrapper-condition-filter"
                                name="selFilterBy"
                            >
                                <Select
                                    options={FILTER_BY}
                                />
                            </Form.Item>
                            <Form.Item
                                className="wrapper-input-search-filter"
                                name="txtSearchFilter"
                            >
                                <Input
                                    prefix={<SearchOutlined />}
                                    placeholder={intl.formatMessage({
                                        id: 'parents.index.filter.input-search.placeholder',
                                    }) + '...'}
                                />
                            </Form.Item>
                            <Form.Item
                                className="wrapper-btn-search-filter"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => filterParentage()}
                                >
                                    <FormattedMessage id="general.search" />
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Col>
                <Col sm={8} align="right">
                    <PaginationTable
                        total={dataParentages?.parentages.paginatorInfo.total}
                        onChange={(page) => {
                            fetchMoreParentages({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        parentages: {
                                            ...fetchMoreResult.parentages
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
                        dataSource={dataParentages?.parentages.data}
                        pagination={false}
                        loading={loadingParentages || loadingParentageDelete}
                        locale={{
                            emptyText: (loadingParentages || loadingParentageDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Parentage;
