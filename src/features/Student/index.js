/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
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
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd";
import SelectSchoolYear from "../../components/Common/SelectSchoolYear";
import {
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  UserOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import "./index.scss";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  DELETE_STUDENT,
  GET_RELEVANT_DATA_FOR_STUDENT,
  LOAD_STUDENTS,
  STUDENTS_UPLOAD,
} from "./gql";
import PaginationTable from "../../components/Common/PaginationTable";
import { FormattedMessage, useIntl } from "react-intl";
import UpcomingFeature from "../../components/Common/UpcomingFeature";
import DraggerUploadFeature from "../../components/Common/DraggerUploadFeature";
import { ReactComponent as IconDeleteStudent } from "../../svg/icon-delete-student.svg";
import { ReactComponent as IconChangeClass } from "../../svg/icon-change-class.svg";
import { ReactComponent as IconRegistTransport } from "../../svg/icon-document.svg";
import { ReactComponent as IconHistory } from "../../svg/icon-history.svg";
import { ReactComponent as IconEdit } from "../../svg/icon-edit.svg";
import { ReactComponent as IconCalendar } from "../../svg/icon-calandar.svg";
import { ReactComponent as IconDelete } from "../../svg/icon-delete.svg";

const { TabPane } = Tabs;

const Student = () => {
  const intl = useIntl();
  const history = useHistory();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [grades, setGrades] = useState([]);
  const [activeSchoolYearId, setActiveSchoolYearId] = useState(null);
  const [activeCampusId, setActiveCampusId] = useState(null);
  const [activeGradeId, setActiveGradeId] = useState(null);
  const [activeClassroomId, setActiveClassroomId] = useState(null);
  const [dataClassroomFilter, setDataClassroomFilter] = useState(null);

  // ----------
  // Lấy các data liên quan
  // ----------
  const {
    loading: loadingRelevantDataForStudent,
    data: dataRelevantDataForStudent,
  } = useQuery(GET_RELEVANT_DATA_FOR_STUDENT);
  useEffect(() => {
    if (loadingRelevantDataForStudent === false && dataRelevantDataForStudent) {
      let arrGrades = [];
      dataRelevantDataForStudent.campuses.data.map((campus) => {
        arrGrades = [...new Set([...arrGrades, ...campus.grades])];
      });
      let gradesTmp = arrGrades.sort((a, b) => {
        return a.id - b.id;
      });
      setGrades(gradesTmp);
      setActiveCampusId(dataRelevantDataForStudent.campuses.data[0].id);
      setActiveGradeId(gradesTmp[0].id);

      updateDataClassroomFilter();

      /*if(gradesTmp.length){
                let campusesFilter = dataRelevantDataForStudent.campuses.data.filter(campus => {
                    let gradeFilter = campus.grades.filter(gradeInCampus => gradeInCampus.id === gradesTmp[0].id);
                    return gradeFilter.length > 0;
                });

                if(campusesFilter.length){
                    handleLoadClassroom(gradesTmp[0].id, [campusesFilter[0].id]);
                }
            }*/
    }
  }, [loadingRelevantDataForStudent, dataRelevantDataForStudent]);

  // ----------
  // Query lấy danh sách Học sinh
  // ----------
  const [
    loadStudents,
    {
      loading: loadingStudents,
      data: dataStudents,
      refetch: refetchStudents,
      fetchMore: fetchMoreStudents,
    },
  ] = useLazyQuery(LOAD_STUDENTS, {
    notifyOnNetworkStatusChange: true,
  });

  // ----------
  // Mutation Xóa Học sinh và xử lý kết quả trả về từ API
  // ----------
  const [
    studentDelete,
    {
      loading: loadingStudentDelete,
      error: errorStudentDelete,
      data: dataStudentDelete,
    },
  ] = useMutation(DELETE_STUDENT);
  useEffect(() => {
    if (!loadingStudentDelete && errorStudentDelete) {
      // ...
    } else if (!loadingStudentDelete && dataStudentDelete) {
      refetchStudents();
      message.success(
        intl.formatMessage({
          id: "student.message.deleted-student-successfully",
        })
      );
    }
  }, [loadingStudentDelete, errorStudentDelete, dataStudentDelete]);

  // ----------
  // Mutation upload file danh sách học sinh và xử lý kết quả trả về từ API
  // ----------
  const [
    studentsUpload,
    {
      loading: loadingStudentsUpload,
      error: errorStudentsUpload,
      data: dataStudentsUpload,
    },
  ] = useMutation(STUDENTS_UPLOAD);
  useEffect(() => {
    if (!loadingStudentsUpload && errorStudentsUpload) {
      message.error("Đã có lỗi xảy ra khi upload file.");
      if (errorStudentsUpload.graphQLErrors[0]?.extensions?.validation) {
        for (const [key, value] of Object.entries(
          errorStudentsUpload.graphQLErrors[0]?.extensions?.validation
        )) {
          console.log(`Dòng số ${key.split(".")[0]}: ${value}`);
        }
      }
    } else if (!loadingStudentsUpload && dataStudentsUpload) {
      if (dataStudentsUpload.studentsUpload) {
        message.success("Đã import học sinh thành công.");
      } else {
        message.error("Đã có lỗi xảy ra.");
      }
    }
  }, [loadingStudentsUpload, dataStudentsUpload]);

  useEffect(() => {
    updateDataClassroomFilter();
  }, [activeGradeId, activeSchoolYearId]);

  useEffect(() => {
    if (activeCampusId || activeGradeId || activeClassroomId) {
      let filter = {};
      if (activeCampusId) {
        filter.campusId = parseInt(activeCampusId);
      }
      if (activeGradeId) {
        if (activeGradeId > 0) {
          if (activeSchoolYearId) {
            filter.schoolYearId = parseInt(activeSchoolYearId);
          }
        }
        filter.gradeId = parseInt(activeGradeId);
      } else {
        if (activeSchoolYearId) {
          filter.schoolYearId = parseInt(activeSchoolYearId);
        }
      }
      if (activeClassroomId && activeClassroomId !== "ALL") {
        filter.classroomId = parseInt(activeClassroomId);
      }
      loadStudents({
        variables: {
          filter: filter,
        },
      });
    }
  }, [activeSchoolYearId, activeCampusId, activeGradeId, activeClassroomId]);

  const updateDataClassroomFilter = () => {
    let dataClassroom = [];
    dataRelevantDataForStudent?.campuses.data.map((campus) => {
      campus.grades
        .filter((grade) => grade.id === activeGradeId)
        .map((grade) => {
          grade.classroom
            .filter(
              (classroom) =>
                classroom.schoolYearId === parseInt(activeSchoolYearId)
            )
            .map((classroom) => {
              if (!dataClassroom.map((tmp) => tmp.id).includes(classroom.id)) {
                dataClassroom.push(classroom);
              }
            });
        });
    });
    setDataClassroomFilter(dataClassroom);
  };

  // ----------
  // Xử lý tìm kiếm
  // ----------
  const filterStudent = () => {
    let filter = {};
    let name = form.getFieldValue("txtSearchFilter");

    if (name && name !== "") {
      filter.name = name.toLowerCase();
      filter.code = `%${filter.name}%`;
    }

    loadStudents({
      variables: {
        filter: filter,
      },
    });
  };

  // ----------
  // Định nghĩa các column cho table Lớp học
  // ----------
  const columns = [
    {
      title: <FormattedMessage id="student.index.column.code" />,
      dataIndex: "code",
    },
    {
      title: <FormattedMessage id="student.index.column.fullname" />,
      dataIndex: "name",
      render: (text, record, index) => {
        return (
          <div className="wrapper-fullname-with-avatar">
            {record.avatar ? (
              <Avatar src={<Image src={record.avatar} />} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}{" "}
            <Link to={`/edit-student/${record.key}`}>{text}</Link>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="student.index.column.gender" />,
      dataIndex: "gender",
      render: (text, record, index) => (
        <FormattedMessage
          id={`student.student-info-form.radio-gender.value.${text.toLowerCase()}`}
        />
      ),
    },
    {
      title: <FormattedMessage id="student.index.column.birthday" />,
      dataIndex: "birthday",
      render: (text, record, index) => (
        <div style={{ minWidth: "105px" }}>{text}</div>
      ),
    },
    {
      title: <FormattedMessage id="student.index.column.address" />,
      dataIndex: "address",
      render: (text, record, index) => {
        let ret = {};
        let addressBy = "";
        if (record.liveWith === "PARENTS") {
          addressBy = "FATHER";
        } else if (record.liveWith === "GRANDPARENTS") {
          addressBy = "GRANDFATHER";
        } else if (record.liveWith === "RELATIVES") {
          addressBy = "RELATIVES";
        } else if (record.liveWith === "FATHER") {
          addressBy = "FATHER";
        } else if (record.liveWith === "MOTHER") {
          addressBy = "MOTHER";
        }
        record.parentages.map((parentage) => {
          if (parentage.studentRelationship === addressBy) {
            ret = parentage;
          }
        });
        return (
          <>
            <div
              style={{
                maxWidth: "400px",
              }}
            >
              {ret.address}
            </div>
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="student.index.column.class" />,
      dataIndex: "classroom",
      render: (text, record, index) => {
        let ret = "";
        record.classrooms.map((classroom) => {
          if (classroom.name !== "") {
            ret += classroom.name + ", ";
          }
        });
        if (ret !== "") {
          ret = ret.substring(0, ret.length - 2);
        }

        return ret;
      },
    },
    {
      title: <FormattedMessage id="student.index.column.parents-contact" />,
      dataIndex: "emergencyNumber",
      render: (text, record, index) => {
        let ret = {};
        record.parentages.map((parentage) => {
          if (parentage.studentRelationship === record.emergencyContact) {
            ret = parentage;
          }
        });
        return (
          <>
            <a href={`tel:${ret.phone}`}>{ret.phone}</a>
            <div>{ret.name}</div>
          </>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="student.index.column.register-for-a-shuttle" />
      ),
      dataIndex: "stationInCurrentSchoolYear.id",
      render: (text, record, index) => {
        if (record.stationInCurrentSchoolYear) {
          return (
            <Tag style={{ width: "55px", textAlign: "center" }} color="#219653">
              <FormattedMessage
                id={`student.index.column.register-for-a-shuttle.yes`}
              />
            </Tag>
          );
        } else {
          return (
            <Tag style={{ width: "55px", textAlign: "center" }} color="#cd201f">
              <FormattedMessage
                id={`student.index.column.register-for-a-shuttle.no`}
              />
            </Tag>
          );
        }
      },
    },
    {
      title: "",
      dataIndex: "actions",
      className: "column-action",
      render: (text, record, index) => {
        return (
          <Space className="actions">
            <Link to={`/edit-student/${record.key}`}>
              <IconEdit />
            </Link>
            <Link
              className="link-history"
              to={`/tracking-history/${record.key}`}
            >
              <IconCalendar />
            </Link>
            <Button
              type="link"
              icon={<IconDelete />}
              onClick={() => {
                studentDelete({
                  variables: {
                    id: [record.key],
                  },
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  const handleSelectedRow = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectedRow,
  };

  const handleChangeDropdownAction = (menu) => {
    if (menu.key !== "4") {
      return Modal.confirm({
        className: "modal-upcoming-feature",
        maskClosable: true,
        title: null,
        icon: null,
        content: (
          <UpcomingFeature
            title={intl.formatMessage({
              id: "upcoming-feature.title",
            })}
            description={intl.formatMessage({
              id: "upcoming-feature.description",
            })}
          />
        ),
        width: 580,
      });
    } else {
      history.push(`/tracking-history/${selectedRowKeys[0]}`);
    }
  };

  return (
    <div className="student-page">
      <PageHeader title={<FormattedMessage id="student.index.title" />} />
      <Row gutter={24} className="wrapper-tool">
        <Col sm={6}>
          <SelectSchoolYear
            onChange={(value) => setActiveSchoolYearId(value)}
          />
        </Col>
        <Col sm={18} align="right">
          <Space>
            <Space>
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={() => history.push("/create-student")}
                className="custom-color action-create"
              >
                <FormattedMessage id="student.index.action.button-add-student.label" />
              </Button>
              <Dropdown
                trigger={["click"]}
                className="custom-color"
                overlayClassName="student-page-dropdown-action-wrapper"
                overlay={
                  <Menu onClick={handleChangeDropdownAction}>
                    <Menu.Item key="1">
                      <IconDeleteStudent />
                      <FormattedMessage id="student.action.dropdown.deleteStudent" />
                    </Menu.Item>
                    <Menu.Item key="2">
                      <IconChangeClass />
                      <FormattedMessage id="student.action.dropdown.changeClass" />
                    </Menu.Item>
                    <Menu.Item key="3">
                      <IconRegistTransport />
                      <FormattedMessage id="student.action.dropdown.registTransport" />
                    </Menu.Item>
                    <Menu.Item
                      key="4"
                      disabled={
                        selectedRowKeys?.length === 0 ||
                        selectedRowKeys?.length > 1
                      }
                    >
                      <IconHistory />
                      <FormattedMessage id="historyAttendanceAndTransport.title" />
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <FormattedMessage id="student.index.action.button-action.label" />{" "}
                  <DownOutlined />
                </Button>
              </Dropdown>
              <Dropdown
                trigger={["click"]}
                className="custom-color"
                overlay={
                  <Menu
                    onClick={(data) => {
                      if (data.key === 4) {
                        window.open(
                          `${process.env.REACT_APP_BACKEND_URL}/download/students-template`,
                          "_blank"
                        );
                      } else if (data.key === 2) {
                        Modal.confirm({
                          className: "modal-upcoming-feature",
                          maskClosable: true,
                          title: null,
                          icon: null,
                          content: (
                            <DraggerUploadFeature
                              description={intl.formatMessage({
                                id: "class.class-info-form.input-upload-student-list.placeholder",
                              })}
                              accept=".xlsx,.xls"
                              customRequest={({ file, onSuccess }) => {
                                console.log("filexxxxxxxx", file);
                                if (
                                  file.type === "application/vnd.ms-excel" ||
                                  file.type ===
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                ) {
                                  studentsUpload({
                                    variables: {
                                      input: {
                                        file: file,
                                      },
                                    },
                                  }).catch((e) => {});

                                  onSuccess("ok");
                                } else {
                                  message.error("File không hợp lệ.");
                                }

                                return;
                              }}
                              onChange={(info) => {
                                /*const { status } = info.file;
                                                            if (status !== 'uploading') {
                                                                console.log(info.file, info.fileList);
                                                            }
                                                            if (status === 'done') {
                                                                // message.success(`Tải lên ${info.file.name} thành công.`);
                                                                setIsDisabledButtonNextStepOrFinish(false);
                                                            } else if (status === 'error') {
                                                                message.error(`Tải lên ${info.file.name} thất bại.`);
                                                            }*/
                              }}
                            />
                          ),
                          width: 580,
                        });
                      } else {
                        Modal.confirm({
                          className: "modal-upcoming-feature",
                          maskClosable: true,
                          title: null,
                          icon: null,
                          content: (
                            <UpcomingFeature
                              title={intl.formatMessage({
                                id: "upcoming-feature.title",
                              })}
                              description={intl.formatMessage({
                                id: "upcoming-feature.description",
                              })}
                            />
                          ),
                          width: 580,
                        });
                      }
                    }}
                  >
                    <Menu.Item key="1">Nhập/xuất dữ liệu</Menu.Item>
                    <Menu.Item key="2">Nhập dữ liệu học sinh</Menu.Item>
                    <Menu.Item key="3">Xuất dữ liệu học</Menu.Item>
                    <Menu.Item key="4">Tải về mẫu danh sách</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <>
                    <FormattedMessage id="student.index.action.button-import-export-data.label" />{" "}
                    <DownOutlined />
                  </>
                </Button>
              </Dropdown>
            </Space>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Tabs
            size="large"
            defaultActiveKey={grades.length ? grades[0].id : null}
            onChange={(activeKey) => {
              setActiveGradeId(activeKey);
            }}
          >
            {grades.map((grade) => {
              return (
                <TabPane
                  tab={<FormattedMessage id={`grade.${grade.name}`} />}
                  key={grade.id}
                />
              );
            })}
            {grades.length && (
              <TabPane
                tab={<FormattedMessage id={`student.index.ungraded`} />}
                key={-1}
              />
            )}
          </Tabs>
        </Col>
      </Row>
      <Row className="wrapper-filter">
        <Col sm={24}>
          <div className="wrapper-campus-filter">
            <label htmlFor="">
              <FormattedMessage id="student.index.filter.select-campus.label" />
              :
            </label>
            <Select
              placeholder={intl.formatMessage({
                id: "student.index.filter.select-campus.placeholder",
              })}
              value={activeCampusId}
              options={dataRelevantDataForStudent?.campuses.data.map(
                (campus) => ({
                  value: campus.id,
                  label: campus.name,
                })
              )}
              onChange={(value) => {
                setActiveCampusId(value);
              }}
            />
          </div>
        </Col>
        <Col sm={24}>
          <div className="wrapper-classroom-filter">
            <label htmlFor="">
              <FormattedMessage id="student.index.filter.radio-class.label" />
            </label>
            <Radio.Group
              style={{
                width: "100%",
              }}
              onChange={(checkedValue) => {
                // console.log('checkedValue', checkedValue.target.value)
                setActiveClassroomId(checkedValue.target.value);
              }}
              defaultValue="ALL"
            >
              <div className="wrapper-classrooms">
                <span className="classrooms">
                  <Radio key="ALL" value="ALL">
                    <FormattedMessage id="general.all" />
                  </Radio>

                  {dataClassroomFilter?.map((classroom) => (
                    <Radio key={classroom.id} value={classroom.id}>
                      {classroom.name + " | 24"}
                    </Radio>
                  ))}
                </span>
              </div>
            </Radio.Group>
          </div>
        </Col>
        <Col sm={16}>
          <Form form={form} className="wrapper-form-search" onFinish={() => {}}>
            <Space size={8}>
              <Form.Item
                className="wrapper-input-search-filter"
                name="txtSearchFilter"
              >
                <Input
                  prefix={
                    <Space>
                      <FilterOutlined />
                      <SearchOutlined />
                    </Space>
                  }
                  placeholder={
                    intl.formatMessage({
                      id: "student.index.filter.input-search.placeholder",
                    }) + "..."
                  }
                />
              </Form.Item>
              <Form.Item className="wrapper-btn-search-filter">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => filterStudent()}
                >
                  <FormattedMessage id="general.search" />
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Col>
        <Col sm={8} align="right">
          <PaginationTable
            total={dataStudents?.students.paginatorInfo.total}
            onChange={(page) => {
              fetchMoreStudents({
                variables: {
                  page: page,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;

                  return Object.assign(
                    {},
                    {
                      students: {
                        ...fetchMoreResult.students,
                      },
                    }
                  );
                },
              });
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
            dataSource={dataStudents?.students.data}
            pagination={false}
            loading={loadingStudents || loadingStudentDelete}
            locale={{
              emptyText:
                loadingStudents || loadingStudentDelete
                  ? intl.formatMessage({ id: "table.loading-text" })
                  : intl.formatMessage({ id: "table.empty-text" }),
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Student;
