import React, {useState, useEffect} from 'react';
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
    Pagination,
    Row,
    Space,
    Table,
    Select,
    message, Modal
} from "antd";
import SelectSchoolYear from "../../components/Common/SelectSchoolYear";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    FilterOutlined,
    CalendarOutlined,
    DownOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Link, useHistory} from "react-router-dom";
import {useMutation, useQuery, useLazyQuery} from "@apollo/client";
import {LOAD_TEACHERS, DELETE_TEACHER} from "./gql";
import moment from "moment";
import './index.scss';
import {GET_RELEVANT_DATA_FOR_TEACHER} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import {FormattedMessage, useIntl} from "react-intl";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const Teacher = () => {
    const intl = useIntl();
    const history = useHistory();
    const [form] = Form.useForm();
    const [formCampus] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [activeSchoolYearId, setActiveSchoolYearId] = useState(null);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForTeacher, error: errorRelevantDataForTeacher, data: dataRelevantDataForTeacher } = useQuery(GET_RELEVANT_DATA_FOR_TEACHER);
    useEffect(() => {
        if(!loadingRelevantDataForTeacher && dataRelevantDataForTeacher && activeSchoolYearId){
            console.log('dataRelevantDataForTeacher', dataRelevantDataForTeacher)

            let initialValueCampus = dataRelevantDataForTeacher?.campuses.data[0].id;
            formCampus.setFieldsValue({
                selCampusFilter: initialValueCampus
            });

            loadTeachers({
                variables: {
                    filter: {
                        campusId: initialValueCampus,
                        schoolYearId: parseInt(activeSchoolYearId),
                    }
                }
            });
        }
    }, [loadingRelevantDataForTeacher, dataRelevantDataForTeacher, activeSchoolYearId]);

    // ----------
    // Query lấy danh sách Giáo viên
    // ----------
    const [loadTeachers, { loading: loadingTeachers, error: errorTeacher, data: dataTeachers, refetch: refetchTeachers, fetchMore: fetchMoreTeachers }] = useLazyQuery(LOAD_TEACHERS, {
        notifyOnNetworkStatusChange: true
    });

    // ----------
    // Mutation Xóa Giáo viên và xử lý kết quả trả về từ API
    // ----------
    const [teacherDelete, { loading: loadingTeacherDelete, error: errorTeacherDelete, data: dataTeacherDelete }] = useMutation(DELETE_TEACHER);
    useEffect(() => {
        if(!loadingTeacherDelete && errorTeacherDelete){
            // ...
        }else if(!loadingTeacherDelete && dataTeacherDelete){
            refetchTeachers();
            message.success(intl.formatMessage({id: 'teacher.message.deleted-teacher-successfully'}));
        }
    }, [loadingTeacherDelete, errorTeacherDelete, dataTeacherDelete])

    // ----------
    // Xử lý tìm kiếm
    // ----------
    const filterTeacher = () => {
        let filter = {
            campusId: formCampus.getFieldValue('selCampusFilter'),
            schoolYearId: parseInt(activeSchoolYearId),
        };
        let name = form.getFieldValue('txtSearchFilter');
        if(name && name !== ""){
            filter.name = name.toLowerCase();
            filter.code = `%${filter.name}%`;
        }

        loadTeachers({
            variables: {
                filter: filter
            }
        });
    }

    // ----------
    // Định nghĩa các column cho table Lớp học
    // ----------
    const columns = [
        {
            title: <FormattedMessage id="teacher.index.column.code" />,
            dataIndex: 'code',
        },
        {
            title: <FormattedMessage id="teacher.index.column.fullname" />,
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div className="wrapper-fullname-with-avatar">
                        {record.avatar ? (
                            <Avatar src={<Image src={record.avatar} />} />
                        ) : (
                            <Avatar icon={<UserOutlined />} />
                        )} <strong>{intl.formatMessage({id: `teacher.gender.${record.gender.toLowerCase()}`})}</strong> {text}
                    </div>
                );
            }
        },
        {
            title: <FormattedMessage id="teacher.index.column.age" />,
            dataIndex: 'birthday',
            render: (text, record, index) => {
                return text ? (
                    moment().month(0).diff(moment(text, "YYYY-MM-DD").month(0),'years')
                ) : "";
            }
        },
        {
            title: <FormattedMessage id="teacher.index.column.subjects-taught" />,
            dataIndex: 'subjects.id',
            render: (text, record, index) => {
                let ret = "";
                record.subjects.map((subject) => {
                    if(subject.name != ""){
                        ret += subject.name + ', ';
                    }
                });
                if(ret != ""){
                    ret = ret.substring(0, ret.length - 2);
                }

                return ret;
            }
        },
        {
            title: <FormattedMessage id="teacher.index.column.homeroom-class" />,
            dataIndex: 'classrooms.name',
            render: (text, record, index) => {
                let ret = "";
                record.classrooms.map((classroom) => {
                    if(classroom.name != ""){
                        ret += classroom.name + ', ';
                    }
                });
                if(ret != ""){
                    ret = ret.substring(0, ret.length - 2);
                }

                return ret;
            }
        },
        {
            title: <FormattedMessage id="teacher.index.column.teacher-contact" />,
            dataIndex: 'phone',
        },
        {
            title: <FormattedMessage id="teacher.index.column.status" />,
            dataIndex: 'status',
            render: (text, record, index) => (
                <FormattedMessage id={`teacher.status.${text.toLowerCase()}`} />
            )
        },
        {
            title: '',
            dataIndex: 'actions',
            width: 110,
            render: (text, record, index) => {
                return (
                    <Space className="actions">
                        <Link to={`/edit-teacher/${record.key}`}>
                            <EditOutlined />
                        </Link>
                        <Button type="link" icon={<CalendarOutlined />} onClick={() => history.push('/edit-teacher/' + record.key + '/assign')} />
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                teacherDelete({
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
        <div className="teacher-page">
            <PageHeader title={<FormattedMessage id="teacher.index.title" />} />
            <Row gutter={24} className="wrapper-tool">
                <Col sm={6}>
                    <SelectSchoolYear
                        onChange={(value) => setActiveSchoolYearId(value)}
                    />
                </Col>
                <Col sm={18} align="right">
                    <Space>
                        <Space>
                            <Button type="default" icon={<PlusOutlined />} onClick={() => history.push('/create-teacher')}>
                                <FormattedMessage id="teacher.index.action.button-add-teacher.label" />
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
                                            Nhập dữ liệu giáo viên
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
                                        <FormattedMessage id="teacher.index.action.button-import-export-data.label" /> <DownOutlined />
                                    </>
                                </Button>
                            </Dropdown>
                        </Space>
                    </Space>
                </Col>
            </Row>
            <Row className="wrapper-filter">
                <Col sm={8}>
                    <Form form={formCampus} onFinish={() => {}}>
                        <Space
                            className="wrapper-filter-campus"
                            size={16}
                        >
                            <Form.Item
                                label={<FormattedMessage id="teacher.index.filter.select-campus.label" />}
                                name="selCampusFilter"
                            >
                                <Select
                                    placeholder={intl.formatMessage({id: 'teacher.index.filter.select-campus.placeholder'})}
                                    options={dataRelevantDataForTeacher?.campuses.data.map(campus => ({
                                        value: campus.id,
                                        label: campus.name,
                                    }))}
                                    onChange={(value) => {
                                        filterTeacher();
                                    }}
                                />
                            </Form.Item>
                        </Space>
                    </Form>
                </Col>
                <Col sm={16} align="right">
                    <Space>
                        <Form form={form} name="horizontal_login" className="wrapper-form-search" layout="inline" onFinish={() => {}}>
                            <Form.Item
                                name="txtSearchFilter"
                            >
                                <Input
                                    prefix={
                                        <Space>
                                            <FilterOutlined />
                                            <SearchOutlined />
                                        </Space>
                                    }
                                    placeholder={intl.formatMessage({id: 'teacher.index.filter.input-search.placeholder'}) + '...'}
                                />
                            </Form.Item>
                            <Form.Item shouldUpdate={true}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => filterTeacher()}
                                >
                                    <FormattedMessage id="general.search" />
                                </Button>
                            </Form.Item>
                        </Form>
                        <PaginationTable
                            total={dataTeachers?.teachers?.paginatorInfo.total}
                            onChange={(page) => {
                                fetchMoreTeachers({
                                    variables: {
                                        page: page,
                                    },
                                    updateQuery: (prev, { fetchMoreResult }) => {
                                        if (!fetchMoreResult) return prev;

                                        return Object.assign({}, {
                                            teachers: {
                                                ...fetchMoreResult.teachers
                                            }
                                        });
                                    }
                                })
                            }}
                        />
                    </Space>
                </Col>
            </Row>
            <Row>
                <Col sm={24}>
                    <Table
                        className="actions-hover-style even-style"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataTeachers?.teachers?.data}
                        pagination={false}
                        loading={!dataTeachers || loadingTeachers || loadingTeacherDelete}
                        locale={{
                            emptyText: (!dataTeachers || loadingTeachers || loadingTeacherDelete) ? intl.formatMessage({id: 'table.loading-text'}) : intl.formatMessage({id: 'table.empty-text'})
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Teacher;
