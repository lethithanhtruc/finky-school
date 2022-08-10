import React, {useEffect, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";
import {Button, Col, Input, Row, Form, Tabs, Collapse, Table, Avatar, Image, Space, Menu, Dropdown, message, Modal } from "antd";
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
    UserOutlined,
} from '@ant-design/icons';
import './index.scss';
import {useQuery, useLazyQuery, useMutation} from "@apollo/client";
import {DELETE_CLASSROOM, GET_RELEVANT_DATA_FOR_CLASSROOM, LOAD_CLASSROOMS} from "./gql";
import {FormattedMessage, useIntl} from "react-intl";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const { TabPane } = Tabs;
const { Panel } = Collapse;

const Classroom = () => {
    const intl = useIntl();
    const history = useHistory();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [grades, setGrades] = useState([]);
    const [activeSchoolYearId, setActiveSchoolYearId] = useState(null);
    const [selectedGradeId, setSelectedGradeId] = useState(null);
    const [selectedCampusId, setSelectedCampusId] = useState(null);
    const [filterName, setFilterName] = useState(null);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForClassroom, error: errorRelevantDataForClassroom, data: dataRelevantDataForClassroom } = useQuery(GET_RELEVANT_DATA_FOR_CLASSROOM);
    useEffect(() => {
        if(loadingRelevantDataForClassroom === false && dataRelevantDataForClassroom){
            // console.log(dataRelevantDataForClassroom.campuses)

            let arrGrades = [];
            dataRelevantDataForClassroom.campuses.data.map(campus => {
                arrGrades = [...new Set([...arrGrades ,...campus.grades])];
            })
            let gradesTmp = arrGrades.sort((a, b) => {
                return a.id - b.id;
            });
            setGrades(gradesTmp);

            if(gradesTmp.length){
                setSelectedGradeId(gradesTmp[0].id);

                let campusesFilter = dataRelevantDataForClassroom.campuses.data.filter(campus => {
                    let gradeFilter = campus.grades.filter(gradeInCampus => gradeInCampus.id === gradesTmp[0].id);
                    return gradeFilter.length > 0;
                });

                if(campusesFilter.length){
                    setSelectedCampusId(campusesFilter[0].id);
                }
            }
        }
    }, [loadingRelevantDataForClassroom, dataRelevantDataForClassroom]);

    // ----------
    // Query lấy danh sách Lớp học
    // ----------
    const [loadClassrooms, { loading: loadingClassrooms, data: dataClassrooms, variables: variablesClassrooms }] = useLazyQuery(LOAD_CLASSROOMS);

    // ----------
    // Mutation Xóa Lớp học và xử lý kết quả trả về từ API
    // ----------
    const [classroomsDelete, { loading: loadingClassroomsDelete, error: errorClassroomsDelete, data: dataClassroomsDelete }] = useMutation(DELETE_CLASSROOM);
    useEffect(() => {
        if(!loadingClassroomsDelete && errorClassroomsDelete){
            message.error('Xóa lớp học không thành công. Vui lòng thử lại');
        }else if(!loadingClassroomsDelete && dataClassroomsDelete){
            message.success('Đã xóa lớp học thành công');
        }
    }, [loadingClassroomsDelete, dataClassroomsDelete]);

    // ----------
    // Định nghĩa các column cho table Lớp học
    // ----------
    const columns = [
        {
            title: <FormattedMessage id="class.index.column.name" />,
            dataIndex: 'name',
        },
        {
            title: <FormattedMessage id="class.index.column.code" />,
            dataIndex: 'code',
        },
        {
            title: <FormattedMessage id="class.index.column.quantity" />,
            dataIndex: 'totalStudents',
        },
        {
            title: <FormattedMessage id="class.index.column.register-for-a-shuttle" />,
            dataIndex: 'address1',
        },
        {
            title: <FormattedMessage id="class.index.column.school-time" />,
            dataIndex: 'shift',
            render: (text, record, index) => (
                <FormattedMessage id={`class.school-time.${text.toLowerCase()}`} />
            )
        },
        {
            title: <FormattedMessage id="class.index.column.homeroom-teacher" />,
            dataIndex: 'teacher.id',
            render: (text, record, index) => {
                return record?.teacher ? (
                    <div className="wrapper-fullname-with-avatar">
                        {record.teacher.avatar ? (
                            <Avatar src={<Image src={record.teacher.avatar} />} />
                        ) : (
                            <Avatar icon={<UserOutlined />} />
                        )} <strong>{intl.formatMessage({id: `teacher.gender.${record.teacher.gender.toLowerCase()}`})}</strong> {record.teacher.name}
                    </div>
                ) : null;
            }
        },
        {
            title: <FormattedMessage id="class.index.column.teacher-contact" />,
            dataIndex: 'teacher.phone',
            render: (text, record, index) => {
                return record?.teacher?.phone;
            }
        },
        {
            title: '',
            dataIndex: 'actions',
            width: 110,
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Link to="#">
                            <EditOutlined />
                        </Link>
                        <Button type="link" icon={<CopyOutlined />} />
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                classroomsDelete({
                                    variables: {
                                        "id": [record.key]
                                    },
                                    refetchQueries: [{
                                        query: LOAD_CLASSROOMS,
                                        variables: {
                                            filter: {
                                                schoolYearId: record.schoolYearId,
                                                campusId: record.campusId,
                                                gradeId: record.gradeId,
                                            }
                                        }
                                    }],
                                    awaitRefetchQueries: true
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

    // ----------
    // Xử lý lấy danh sách lớp học theo các tiêu chí về cơ sở và khối lớp
    // ----------
    useEffect(() => {
        // console.log("xxxxxxxxxx", selectedGradeId, selectedCampusId, activeSchoolYearId)
        if(selectedGradeId && selectedCampusId && activeSchoolYearId){
            let filter = {
                schoolYearId: parseInt(activeSchoolYearId),
                campusId: parseInt(selectedCampusId),
                gradeId: parseInt(selectedGradeId),
            };
            if(filterName){
                filter.name = filterName.toLowerCase();
                filter.code = `%${filterName}%`;
            }

            loadClassrooms({
                variables: {
                    filter: filter
                }
            });
        }
    }, [selectedGradeId, selectedCampusId, activeSchoolYearId, filterName]);

    // ----------
    // Xử lý tìm kiếm
    // ----------
    const handleSearch = () => {
        form
            .validateFields()
            .then(values => {
                console.log('values.filter', values.filter)
                setFilterName(values.filter);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    return (
        <>
            <div className="classroom-page">
                <PageHeader title={<FormattedMessage id="class.index.title" />} />
                <Row gutter={24} className="wrapper-tool">
                    <Col sm={6}>
                        <SelectSchoolYear
                            onChange={(value) => setActiveSchoolYearId(value)}
                        />
                    </Col>
                    <Col sm={18} align="right">
                        <Space>
                            <Form form={form} name="horizontal_login" className="wrapper-form-filter" layout="inline" onFinish={handleSearch}>
                                <Form.Item
                                    name="filter"
                                >
                                    <Input prefix={<SearchOutlined />} placeholder={intl.formatMessage({
                                        id: 'class.index.filter.input-search.placeholder',
                                    }) + '...'} />
                                </Form.Item>
                                <Form.Item shouldUpdate={true}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        <FormattedMessage id="general.search" />
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Space>
                                <Button type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-class')}>
                                    <FormattedMessage id="class.index.action.button-add-class.label" />
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
                                                Chỉnh sửa lớp học
                                            </Menu.Item>
                                            <Menu.Item key="2">
                                                Đổi giáo viên chủ nhiệm
                                            </Menu.Item>
                                            <Menu.Item key="3">
                                                Thay đổi môn học
                                            </Menu.Item>
                                            <Menu.Item key="4">
                                                Xóa lớp học
                                            </Menu.Item>
                                            <Menu.Item key="5">
                                                Tạm dùng lớp học
                                            </Menu.Item>
                                            <Menu.Item key="6">
                                                Gộp lớp học
                                            </Menu.Item>
                                            <Menu.Item key="7">
                                                Chọn buổi học
                                            </Menu.Item>
                                        </Menu>
                                    )}
                                >
                                    <Button>
                                        <>
                                            <FormattedMessage id="class.index.action.button-action.label" /> <DownOutlined />
                                        </>
                                    </Button>
                                </Dropdown>
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
                                                Nhập dữ liệu lớp học
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
                                            <FormattedMessage id="class.index.action.button-import-export-data.label" /> <DownOutlined />
                                        </>
                                    </Button>
                                </Dropdown>
                            </Space>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col sm={24}>
                        <Tabs
                            size="large"
                            defaultActiveKey={grades.length ? grades[0].id : null}
                            onChange={(activeKey) => {
                                // console.log('activeKey', activeKey);

                                let campusesFilter = dataRelevantDataForClassroom.campuses.data.filter(campus => {
                                    let gradeFilter = campus.grades.filter(gradeInCampus => gradeInCampus.id === activeKey);
                                    return gradeFilter.length > 0;
                                });

                                if(campusesFilter.length){
                                    setSelectedGradeId(activeKey);
                                }
                            }}
                        >
                            {grades.map(grade => {
                                let campusesFilter = dataRelevantDataForClassroom.campuses.data.filter(campus => {
                                    let gradeFilter = campus.grades.filter(gradeInCampus => gradeInCampus.id === grade.id);
                                    return gradeFilter.length > 0;
                                });

                                return (
                                    <TabPane tab={<FormattedMessage id={`grade.${grade.name}`} />} key={grade.id}>
                                        <Collapse
                                            accordion
                                            defaultActiveKey={[selectedCampusId ? selectedCampusId : (campusesFilter.length ? campusesFilter[0].id : null)]}
                                            ghost
                                            expandIcon={(panelProps) => panelProps.isActive ? <DownCircleOutlined /> : <RightCircleOutlined />}
                                            onChange={key => {
                                                if(key){
                                                    // console.log(key, grade.id)
                                                    setSelectedCampusId(key);
                                                }
                                            }}
                                        >
                                            {campusesFilter.map(campusFilter => {
                                                return (
                                                    <Panel header={campusFilter.name} key={campusFilter.id}>
                                                        <Table
                                                            className="actions-hover-style even-style"
                                                            rowSelection={rowSelection}
                                                            columns={columns}
                                                            dataSource={dataClassrooms?.classrooms.data}
                                                            loading={variablesClassrooms?.filter.gradeId === parseInt(grade.id) && variablesClassrooms?.filter.campusId === parseInt(campusFilter.id) && loadingClassrooms}
                                                            pagination={false}
                                                            locale={{
                                                                emptyText: (variablesClassrooms?.filter.gradeId === parseInt(grade.id) && variablesClassrooms?.filter.campusId === parseInt(campusFilter.id) && loadingClassrooms) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                                                            }}
                                                        />
                                                    </Panel>
                                                );
                                            })}
                                        </Collapse>
                                    </TabPane>
                                );
                            })}
                        </Tabs>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Classroom;
