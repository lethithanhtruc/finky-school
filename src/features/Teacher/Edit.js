import React, {useState, useEffect} from 'react';
import {useHistory, useParams} from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormTeacherInfo from "./FormTeacherInfo";
import {useMutation, useQuery} from "@apollo/client";
import {LOAD_TEACHER, TEACHER_UPDATE} from "./gql";
import {Col, Row, Collapse, Button, Space, message} from "antd";
import SelectSchoolYear from "../../components/Common/SelectSchoolYear";
import {
    EditOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import ModalAssignment from "./ModalAssignment";
import './Edit.scss';
import moment from "moment";
import {FormattedMessage, useIntl} from "react-intl";

const { Panel } = Collapse;

const Edit = () => {
    const intl = useIntl();
    const history = useHistory();
    let { teacherId, moreAction } = useParams();
    if(teacherId){
        teacherId = parseInt(teacherId);
    }

    const [avatar, setAvatar] = useState(null);

    const [isEdit, setIsEdit] = useState(false);
    const [visibleModalAssignment, setVisibleModalAssignment] = useState(false);
    const [classroomsHasHomeroomTeacher, setClassroomsHasHomeroomTeacher] = useState(null);
    const [classroomsHasSubjectTeacher, setClassroomsHasSubjectTeacher] = useState(null);
    const [activeSchoolYearId, setActiveSchoolYearId] = useState(null);

    // ----------
    // Query Lấy 1 giáo viên
    // ----------
    const { loading: loadingTeacher, data: dataTeacher, refetch: refetchTeacher } = useQuery(LOAD_TEACHER, {
        variables: {
            id: teacherId
        }
    });
    useEffect(() => {
        if(loadingTeacher === false && dataTeacher){
            // console.log('j222222222', dataTeacher)

            setClassroomsHasHomeroomTeacher(classroomsHasHomeroomTeacher => {
                classroomsHasHomeroomTeacher = [];
                dataTeacher.teacher.campuses.map(campus => {
                    campus.grades.map(grade => {
                        grade.classroom.map(classroom => {
                            if(classroom.teacher?.id === dataTeacher.teacher.key){
                                // console.log('222222222')
                                if(!classroomsHasHomeroomTeacher){
                                    classroomsHasHomeroomTeacher = [classroom.id];
                                }else if(!classroomsHasHomeroomTeacher.includes(classroom.id)){
                                    classroomsHasHomeroomTeacher.push(classroom.id);
                                }
                            }
                        });
                    });
                });

                // console.log('yyy',classroomsHasHomeroomTeacher)
                return classroomsHasHomeroomTeacher;
            });

            setClassroomsHasSubjectTeacher(classroomsHasSubjectTeacher => {
                classroomsHasSubjectTeacher = [];
                dataTeacher.teacher.subjects
                    .map(subjectTmp => {
                        subjectTmp.classrooms
                            .map(classroomTmp => {
                                classroomsHasSubjectTeacher.push(classroomTmp.id);
                            })
                    });

                // console.log('ssssss', classroomsHasSubjectTeacher);
                return classroomsHasSubjectTeacher;
            });

            if(moreAction && moreAction == 'assign'){
                setVisibleModalAssignment(true);
            }
        }
    }, [loadingTeacher, dataTeacher]);

    // ----------
    // Mutation cập nhật Giáo viên và xử lý kết quả trả về từ API
    // ----------
    const [teacherUpdate, { loading: loadingTeacherUpdate, error: errorTeacherUpdate, data: dataTeacherUpdate }] = useMutation(TEACHER_UPDATE);
    useEffect(() => {
        if(!loadingTeacherUpdate && dataTeacherUpdate){
            setIsEdit(false);
            // refetchTeacher();
            history.push('/teacher');
            message.success(intl.formatMessage({id: 'teacher.message.edited-teacher-successfully'}));
        }
    }, [loadingTeacherUpdate, errorTeacherUpdate, dataTeacherUpdate])

    // ----------
    // Xử lý submit form
    // ----------
    const submitForm = (values) => {
        let input = {
            campuses: {
                sync: values.selCampuses.map(campus => parseInt(campus))
            },
            gradeIds: values.selGrades.map(grade => parseInt(grade)),
            subjects: {
                create: values.selSubjects.map(subject => ({
                    subjectId: parseInt(subject)
                })),
                // delete: []
            },
            workExperience: values.selWorkExperience ? values.selWorkExperience : null,
            name: values.txtName,
            gender: values.selGender,
            phone: values.txtPhone,
            email: values.txtEmail,
            code: values.txtCode,
            startedDate: parseInt(moment(values.dateStarted).format('YYYY')),
            status: values.selStatus,
        };
        if(values.dateBirthday){
            input.birthday = moment(values.dateBirthday).format('YYYY-MM-DD');
        }
        if(values.txtAddress){
            input.address = values.txtAddress;
        }
        if(values.txtTrainingDegree){
            input.trainingDegree = values.txtTrainingDegree;
        }
        if(values.txtTrainingPlace){
            input.trainingPlace = values.txtTrainingPlace;
        }
        if(values.txtNote){
            input.note = values.txtNote;
        }
        if(avatar){
            input.avatar = avatar;
        }

        teacherUpdate({
            variables: {
                "id": parseInt(dataTeacher.teacher.key),
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };

    return (
        <div className="teacher-edit-page">
            <PageHeader title={<FormattedMessage id="teacher.teacher-info-form.edit-title" />} />
            <Row>
                <Col span={24} align="right">
                    <div className="wrapper-button-tool">
                        <Space>
                            <Button
                                type="default"
                                icon={<EditOutlined />}
                                disabled={loadingTeacher || isEdit}
                                onClick={() => setIsEdit(true)}
                            >
                                <FormattedMessage id="teacher.edit-profile" />
                            </Button>
                            <Button
                                type="default"
                                icon={<CalendarOutlined />}
                                disabled={loadingTeacher}
                                onClick={() => setVisibleModalAssignment(true)}
                            >
                                <FormattedMessage id="teacher.assign-class" />
                            </Button>
                        </Space>
                    </div>
                </Col>
            </Row>
            <Block
                title={<FormattedMessage id="teacher.teacher-info-form.teacher-info" />}
            >
                {dataTeacher ? (
                    <>
                        <FormTeacherInfo
                            setAvatar={setAvatar}
                            isOnlyRead={!isEdit}
                            dataTeacher={dataTeacher.teacher}
                            onCancel={() => setIsEdit(false)}
                            onOk={submitForm}
                            error={errorTeacherUpdate}
                        />
                        <div className="wrapper-teaching-infor">
                            <div className="title">
                                <FormattedMessage id="teacher.teacher-info-form.teaching-info" />
                            </div>
                            <Row gutter={10}>
                                <Col sm={5}>
                                    <div className="wrapper-schoolyear">
                                        <SelectSchoolYear
                                            label="teacher.teacher-info-teaching.select-school-year.label"
                                            onChange={(value) => setActiveSchoolYearId(value)}
                                        />
                                    </div>
                                    <ul className="list-select-type-template">
                                        <li className="homeroom-teacher">
                                            <FormattedMessage id="teacher.teaching-info.homeroom-class" />
                                        </li>
                                        <li>
                                            <FormattedMessage id="teacher.teaching-info.subject-teacher" />
                                        </li>
                                    </ul>
                                </Col>
                                <Col sm={19}>
                                    <div className={"wrapper-campuses" + ((!classroomsHasHomeroomTeacher || classroomsHasHomeroomTeacher.length === 0) && (!classroomsHasSubjectTeacher || classroomsHasSubjectTeacher.length === 0) ? " empty-classroom" : "")}>
                                        {(!classroomsHasHomeroomTeacher || classroomsHasHomeroomTeacher.length === 0) && (!classroomsHasSubjectTeacher || classroomsHasSubjectTeacher.length === 0) ? (
                                            <div className="wrapper-empty-classroom">Giáo viên chưa được xếp lớp</div>
                                        ) : (
                                            <Collapse defaultActiveKey={['1']} accordion ghost>
                                                {dataTeacher.teacher.campuses.map(campus => (
                                                    <Panel header={campus.name} key={campus.id}>
                                                        <div className="wrapper-grades">
                                                            {campus.grades.map(grade => (
                                                                <div key={grade.id} className="wrapper-grade">
                                                                    <Space>
                                                                        <div className="grade-title">
                                                                            <FormattedMessage id={`grade.${grade.name}`} />
                                                                        </div>
                                                                        <div className="wrapper-classrooms">
                                                                        <span className="classrooms">
                                                                            {grade.classroom
                                                                                .filter(classroom => classroom.schoolYearId === parseInt(activeSchoolYearId))
                                                                                .map(classroom => {
                                                                                    // console.log(classroom.id, classroom.teacher?.id === dataTeacher.teacher.key)
                                                                                    // console.log('classroomsHasHomeroomTeacher', classroomsHasHomeroomTeacher)
                                                                                    return (
                                                                                        <span
                                                                                            key={classroom.id}
                                                                                            className={"classroom " + (classroom.teacher?.id === dataTeacher.teacher.key ? "homeroom-teacher" : "") + " " + (classroomsHasSubjectTeacher.includes(classroom.id) ? "subject-teacher" : "")}
                                                                                        >
                                                                                        {classroom.name} | 24
                                                                                    </span>
                                                                                    );
                                                                                })}
                                                                        </span>
                                                                        </div>
                                                                    </Space>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Panel>
                                                ))}
                                            </Collapse>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {visibleModalAssignment && (
                            <ModalAssignment
                                dataTeacher={dataTeacher.teacher}
                                onCancel={() => setVisibleModalAssignment(false)}
                                onOk={() => {
                                    setVisibleModalAssignment(false);
                                    refetchTeacher();
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
