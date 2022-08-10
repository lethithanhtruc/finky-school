import React, {useState, useEffect} from 'react';
import {useHistory, useParams} from "react-router-dom";
import Slider from "react-slick";
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormStudentInfo from "./FormStudentInfo";
import {useMutation, useQuery} from "@apollo/client";
import {LOAD_STUDENT, STUDENT_UPDATE} from "./gql";
import {Col, Row, Collapse, Button, Space, message, Card, List, Modal} from "antd";
import SelectSchoolYear from "../../components/Common/SelectSchoolYear";
import {
    EditOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import ModalAssignment from "./ModalAssignment";
import './Edit.scss';
import moment from "moment";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {FormattedMessage, useIntl} from "react-intl";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const { Panel } = Collapse;
const { Meta } = Card;

const Edit = () => {
    const intl = useIntl();
    const history = useHistory();
    let { studentId } = useParams();
    if(studentId){
        studentId = parseInt(studentId);
    }

    const [avatar, setAvatar] = useState(null);

    const [isEdit, setIsEdit] = useState(false);
    const [visibleModalAssignment, setVisibleModalAssignment] = useState(false);

    // ----------
    // Query Lấy 1 Học sinh
    // ----------
    const { loading: loadingStudent, error: errorStudent, data: dataStudent, refetch: refetchStudent } = useQuery(LOAD_STUDENT, {
        variables: {
            id: studentId
        }
    });

    // ----------
    // Mutation cập nhật Học sinh và xử lý kết quả trả về từ API
    // ----------
    const [studentUpdate, { loading: loadingStudentUpdate, error: errorStudentUpdate, data: dataStudentUpdate }] = useMutation(STUDENT_UPDATE);
    useEffect(() => {
        if(!loadingStudentUpdate && errorStudentUpdate){
            // ...
        }else if(!loadingStudentUpdate && dataStudentUpdate){
            setIsEdit(false);
            history.push('/student');
            message.success(intl.formatMessage({id: 'student.message.edited-student-successfully'}));
        }
    }, [loadingStudentUpdate, errorStudentUpdate, dataStudentUpdate])

    // ----------
    // Xử lý submit form
    // ----------
    const submitForm = (values) => {
        let parentages = [];
        if(values.txtNameParent1 && values.txtNameParent1 != ""){
            let parentageTmp = {
                name: values.txtNameParent1,
                studentRelationship: values.txtRelationship1,
                phone: values.txtPhoneParent1,
                address: values.txtAddress1,
            };
            if(values.txtEmail1){
                parentageTmp.email = values.txtEmail1;
            }
            parentages.push(parentageTmp);
        }
        if(values.txtNameParent2 && values.txtNameParent2 != ""){
            let parentageTmp = {
                name: values.txtNameParent2,
                studentRelationship: values.txtRelationship2,
                phone: values.txtPhoneParent2,
                address: values.selLiveWith == 'PARENTS' ? values.txtAddress1 : values.txtAddress2,
            };
            if(values.txtEmail2){
                parentageTmp.email = values.txtEmail2;
            }
            parentages.push(parentageTmp);
        }
        if(values.txtNameParent3 && values.txtNameParent3 != ""){
            let parentageTmp = {
                name: values.txtNameParent3,
                studentRelationship: values.txtRelationship3,
                phone: values.txtPhoneParent3,
                address: values.txtAddress3,
            };
            if(values.txtEmail3){
                parentageTmp.email = values.txtEmail3;
            }
            parentages.push(parentageTmp);
        }

        let input = {
            parentages:{
                upsertByStudentRelationship: parentages
            },
            campusId: values.selCampus,
            name: values.txtName,
            birthday: moment(values.dateBirthday).format('YYYY-MM-DD'),
            gender: values.radGender,
            provinceIdOfBirth: parseInt(values.selProvinceOfBirth),
            liveWith: values.selLiveWith,
            emergencyContact: values.selEmergencyContact,
            code: values.txtCode,
            startedAt: moment(values.startedAt).format('YYYY-MM-DD'),
            status: values.selStatus,
        };
        if(values.endedAt){
            input.endedAt = moment(values.endedAt).format('YYYY-MM-DD');
        }
        if(values.txtNote){
            input.note = values.txtNote;
        }
        if(avatar){
            input.avatar = avatar;
        }
        studentUpdate({
            variables: {
                "id": parseInt(dataStudent.student.key),
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };

    return (
        <div className="student-edit-page">
            <PageHeader title={<FormattedMessage id="student.profile" />} />
            <Row>
                <Col span={24} align="right">
                    <div className="wrapper-button-tool">
                        <Space>
                            <Button
                                type="default"
                                icon={<EditOutlined />}
                                disabled={loadingStudent || isEdit}
                                onClick={() => setIsEdit(true)}
                            >
                                <FormattedMessage id="student.edit-profile" />
                            </Button>
                            <Button
                                type="default"
                                icon={<CalendarOutlined />}
                                disabled={loadingStudent}
                                onClick={() => setVisibleModalAssignment(true)}
                            >
                                <FormattedMessage id="student.assign-class" />
                            </Button>
                        </Space>
                    </div>
                </Col>
            </Row>
            <Block
                title={<FormattedMessage id="student.student-info-form.title" />}
            >
                {dataStudent ? (
                    <>
                        <FormStudentInfo
                            setAvatar={setAvatar}
                            isOnlyRead={!isEdit}
                            dataStudent={dataStudent.student}
                            onCancel={() => setIsEdit(false)}
                            onOk={submitForm}
                            error={errorStudentUpdate}
                        />
                        <div className="wrapper-study-infor">
                            <div className="title">
                                <FormattedMessage id="student.study-process.title" />
                            </div>
                            <Row gutter={10}>
                                <Col sm={5}>
                                    <div className="study-infor">
                                        <div><FormattedMessage id="student.study-process.campus" />: {dataStudent.student.campus.name}</div>
                                        <div><FormattedMessage id="student.study-process.started-at" />: {dataStudent.student.startedAt}</div>
                                        <div><FormattedMessage id="student.study-process.is-a-student-of-the-class" />: </div>
                                        <div><FormattedMessage id="student.study-process.register-for-school-bus" />: </div>
                                    </div>
                                    <div className="cmd-study-infor">
                                        <Button
                                            type="primary"
                                            ghost
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
                                            <FormattedMessage id="student.study-process.register-for-school-bus" />
                                        </Button>
                                    </div>
                                </Col>
                                <Col sm={19}>
                                    {dataStudent?.student?.classrooms?.length ? (
                                        <div className="wrapper-classrooms">
                                            <div className="inner-classrooms">
                                                <div className="wrapper-classrooms-assigned">
                                                    <Slider
                                                        dots
                                                        infinite={false}
                                                        lazyLoad
                                                        speed={500}
                                                        slidesToShow={4}
                                                        slidesToScroll={4}
                                                        // initialSlide={4}
                                                        // nextArrow={<div>aaaaaaa</div>}
                                                        // prevArrow={<div>bbbbbbb</div>}
                                                    >
                                                        {dataStudent?.student?.classrooms?.map(classroom => (
                                                            <div key={classroom.id}>
                                                                <Card
                                                                    cover={
                                                                        <img
                                                                            alt="example"
                                                                            src={classroom.teacher?.avatar || "data:image/png;base64,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"}
                                                                        />
                                                                    }
                                                                >
                                                                    <Meta
                                                                        description={(
                                                                            <div>
                                                                                <Row>
                                                                                    <Col span={10}>
                                                                                        <label htmlFor=""><FormattedMessage id="student.study-process.school-year" />:</label>
                                                                                    </Col>
                                                                                    <Col span={14} align="right">
                                                                                        <span>{classroom.schoolYear.name}</span>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col span={24}>
                                                                                        <label htmlFor=""><FormattedMessage id="student.study-process.homeroom-teacher" />:</label>
                                                                                    </Col>
                                                                                    <Col span={24}>
                                                                                        <span>{classroom.teacher?.name}</span>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col span={24}>
                                                                                        <Button
                                                                                            style={{
                                                                                                width: '100%'
                                                                                            }}
                                                                                            type="primary"
                                                                                            ghost
                                                                                        >
                                                                                            <FormattedMessage id="student.study-process.class" />: {classroom.name}
                                                                                        </Button>
                                                                                    </Col>
                                                                                </Row>
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Card>
                                                            </div>
                                                        ))}
                                                    </Slider>
                                                </div>
                                                <div className="wrapper-classroom-add">
                                                    <button
                                                        onClick={() => setVisibleModalAssignment(true)}
                                                    >
                                                        <FormattedMessage id="general.add" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="wrapper-classrooms-empty">
                                            <FormattedMessage id="student.study-process.student-not-assign-class" />
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </div>
                        {visibleModalAssignment && (
                            <ModalAssignment
                                dataStudent={dataStudent.student}
                                onCancel={() => setVisibleModalAssignment(false)}
                                onOk={() => {
                                    setVisibleModalAssignment(false);
                                    refetchStudent();
                                }}
                            />
                        )}
                    </>
                ) : (
                    <div>Loading...</div>
                )}

            </Block>
        </div>
    );
}

export default Edit;
