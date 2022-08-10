import React, {useState, useEffect} from 'react';
import {useIntl, FormattedMessage} from 'react-intl';
import PageHeader from "../../components/Layout/PageHeader";
import {Button, Col, Dropdown, Form, Input, Menu, message, Modal, Pagination, Row, Select, Space, Table} from "antd";
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
import {DELETE_VEHICLE, LOAD_VEHICLES} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const FILTER_BY = [
    {
        value: 'LICENSE_PLATE',
        label: <FormattedMessage id="vehicle.index.filter.select-filter-by.value.license-plate" />,
    },
    {
        value: 'OWNER_NAME',
        label: <FormattedMessage id="vehicle.index.filter.select-filter-by.value.owner-name" />,
    },
    {
        value: 'BRAND',
        label: <FormattedMessage id="vehicle.index.filter.select-filter-by.value.brand" />,
    },
    {
        value: 'VERSION',
        label: <FormattedMessage id="vehicle.index.filter.select-filter-by.value.version" />,
    },
]

const Vehicle = () => {
    const intl = useIntl();

    const history = useHistory();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        loadVehicle();
    }, []);

    const [loadVehicle, { loading: loadingVehicle, error: errorVehicle, data: dataVehicle, variables: variablesVehicle, refetch: refetchVehicle, fetchMore: fetchMoreVehicle }] = useLazyQuery(LOAD_VEHICLES, {
        notifyOnNetworkStatusChange: true
    });
    useEffect(() => {
        if(loadingVehicle === false && dataVehicle){
            console.log('dataVehicle.vehicles', dataVehicle.vehicles)
        }
    }, [loadingVehicle, dataVehicle]);

    const [vehicleDelete, { loading: loadingVehicleDelete, error: errorVehicleDelete, data: dataVehicleDelete }] = useMutation(DELETE_VEHICLE);
    useEffect(() => {
        if(!loadingVehicleDelete && errorVehicleDelete){
            // ...
        }else if(!loadingVehicleDelete && dataVehicleDelete){
            refetchVehicle();
            message.success(intl.formatMessage({id: 'vehicle.message.deleted-vehicle-successfully'}));
        }
    }, [loadingVehicleDelete, errorVehicleDelete, dataVehicleDelete])

    const filterVehicle = () => {
        let filter = {};
        /*filter = {
            campusId: form.getFieldValue('selCampusFilter'),
        };*/
        let name = form.getFieldValue('txtSearchFilter');
        let selFilterBy = form.getFieldValue('selFilterBy');
        if(name && name !== ""){
            if(selFilterBy === 'LICENSE_PLATE') {
                filter.licensePlate = `%${name.toLowerCase()}%`;
            }else if(selFilterBy === 'OWNER_NAME'){
                filter.ownerName = name.toLowerCase();
            }else if(selFilterBy === 'BRAND'){
                filter.brand = name.toLowerCase();
            }else if(selFilterBy === 'VERSION'){
                filter.version = name.toLowerCase();
            }

        }

        loadVehicle({
            variables: {
                filter: filter
            }
        });
    }

    const columns = [
        {
            title: <FormattedMessage id="vehicle.index.column.license-plate" />,
            dataIndex: 'licensePlate',
        },
        {
            title: <FormattedMessage id="vehicle.index.column.owner-name" />,
            dataIndex: 'ownerName',
        },
        {
            title: <FormattedMessage id="vehicle.index.column.contact" />,
            dataIndex: 'ownerPhone',
        },
        {
            title: <FormattedMessage id="vehicle.index.column.brand" />,
            dataIndex: 'brand',
        },
        {
            title: <FormattedMessage id="vehicle.index.column.version" />,
            dataIndex: 'version',
        },
        {
            title: <FormattedMessage id="vehicle.index.column.color" />,
            dataIndex: 'color',
        },
        {
            title: <FormattedMessage id="vehicle.index.column.seat-number" />,
            dataIndex: 'seatNumber',
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Link to={`/edit-vehicle/${record.key}`}>
                            <EditOutlined />
                        </Link>
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                vehicleDelete({
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
        <div className="vehicle-page">
            <PageHeader title={(
                <FormattedMessage id="vehicle.index.title" />
            )} />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={24} align="right">
                    <Space>
                        <Space>
                            <Button type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-vehicle')}>
                                <FormattedMessage id="vehicle.index.action.button-add-vehicle.label" />
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
                                            Nhập dữ liệu phương tiện
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
                                        <FormattedMessage id="vehicle.index.action.button-import-export-data.label" /> <DownOutlined />
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
                            selFilterBy: "LICENSE_PLATE"
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
                                        id: 'vehicle.index.filter.input-search.placeholder',
                                    }) + '...'}
                                />
                            </Form.Item>
                            <Form.Item
                                className="wrapper-btn-search-filter"
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => filterVehicle()}
                                >
                                    <FormattedMessage id="general.search" />
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Col>
                <Col sm={8} align="right">
                    <PaginationTable
                        total={dataVehicle?.vehicles.paginatorInfo.total}
                        onChange={(page) => {
                            fetchMoreVehicle({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        vehicles: {
                                            ...fetchMoreResult.vehicles
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
                        dataSource={dataVehicle?.vehicles.data}
                        pagination={false}
                        loading={loadingVehicle || loadingVehicleDelete}
                        locale={{
                            emptyText: (loadingVehicle || loadingVehicleDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Vehicle;
