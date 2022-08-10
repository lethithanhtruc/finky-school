import React, {useState, useEffect} from 'react';
import {Col, Row, Input, Radio, Checkbox, Button, Select, Modal, Form, message} from "antd";
import {useMutation, useQuery} from "@apollo/client";
import './ModalAssignment.scss';
import {TEACHER_ASSIGN_CLASSROOMS, TEACHER_ASSIGN_SUBJECT_OF_CLASSROOMS, GET_RELEVANT_DATA_FOR_TEACHER_ASSIGNMENT} from "./gql";
import {FormattedMessage, useIntl} from "react-intl";

const ModalAssignment = ({dataTeacher, onCancel, onOk}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [isClassroomPrimary, setIsClassroomPrimary] = useState(true);
    const [optionSubjects, setOptionSubjects] = useState([]);
    const [classroomsSelected, setClassroomsSelected] = useState({
        'homeroomTeacher': {},
        'subjectTeacher': {}
    });

    const [teacherAssignClassrooms, { loading: loadingTeacherAssignClassrooms }] = useMutation(TEACHER_ASSIGN_CLASSROOMS);
    const [teacherAssignSubjectOfClassrooms, { loading: loadingTeacherAssignSubjectOfClassrooms }] = useMutation(TEACHER_ASSIGN_SUBJECT_OF_CLASSROOMS);

    useEffect(() => {
        if(dataTeacher){
            console.log('modal', dataTeacher)

            form.setFieldsValue({
                selCampus: dataTeacher.campuses[0].id,
            });

            let homeroomTeacherDefault = {};
            let subjectTeacherDefault = {};

            // load danh sách các lớp đang là giáo viên chủ nhiệm
            dataTeacher.campuses
                .map(campus => {
                    campus.grades
                        .map(grade => {
                            grade.classroom
                                .map(classroom => {
                                    // console.log('aaaa', classroom)
                                    if(classroom.teacher?.id === dataTeacher.key){
                                        // console.log(classroom, classroom.teacher?.id)
                                        if(!(`grade_${grade.id}` in homeroomTeacherDefault)){
                                            homeroomTeacherDefault[`grade_${grade.id}`] = {};
                                        }
                                        if(!(`schoolyear_${classroom.schoolYearId}` in homeroomTeacherDefault[`grade_${grade.id}`])){
                                            homeroomTeacherDefault[`grade_${grade.id}`][`schoolyear_${classroom.schoolYearId}`] = [];
                                        }
                                        homeroomTeacherDefault[`grade_${grade.id}`][`schoolyear_${classroom.schoolYearId}`].push(classroom.id);
                                    }
                                })
                        });
                });

            // load danh sách các lớp đang là giáo viên bộ môn
            dataTeacher.subjects
                .map(subjectTmp => {
                    subjectTmp.classrooms
                        .map(classroomTmp => {
                            if(!(`grade_${classroomTmp.gradeId}` in subjectTeacherDefault)){
                                subjectTeacherDefault[`grade_${classroomTmp.gradeId}`] = {};
                            }
                            if(!(`schoolyear_${classroomTmp.schoolYearId}` in subjectTeacherDefault[`grade_${classroomTmp.gradeId}`])){
                                subjectTeacherDefault[`grade_${classroomTmp.gradeId}`][`schoolyear_${classroomTmp.schoolYearId}`] = [];
                            }
                            // console.log('ssssss', classroomTmp.id, classroomTmp.gradeId, classroomTmp.schoolYearId);

                            subjectTeacherDefault[`grade_${classroomTmp.gradeId}`][`schoolyear_${classroomTmp.schoolYearId}`].push({
                                classroomId: classroomTmp.id,
                                subjectId: subjectTmp.id,
                            });
                        })
                });
            // console.log('bbbbbb', subjectTeacherDefault)
            setClassroomsSelected({
                'homeroomTeacher': homeroomTeacherDefault,
                'subjectTeacher': subjectTeacherDefault,
            });
        }
    }, [dataTeacher])

    const { loading: loadingRelevantDataForTeacherAssignment, error: errorRelevantDataForTeacherAssignment, data: dataRelevantDataForTeacherAssignment } = useQuery(GET_RELEVANT_DATA_FOR_TEACHER_ASSIGNMENT);
    useEffect(() => {
        if(loadingRelevantDataForTeacherAssignment === false && dataRelevantDataForTeacherAssignment){
            // console.log('dataRelevantDataForTeacherAssignment.schoolyears', dataRelevantDataForTeacherAssignment.schoolyears)
            const schoolyearCurrent = dataRelevantDataForTeacherAssignment.schoolyears.data.filter(schoolyear => parseInt(schoolyear.endAt.substring(0, 4)) === new Date().getFullYear());
            form.setFieldsValue({ selSchoolYear: schoolyearCurrent[0].id });

            /*setClassroomsSelected(classroomsSelected => {
                let ret = {};
                dataRelevantDataForTeacherAssignment.schoolyears.data.map(schoolyear => {
                    let classrooms = dataTeacher.classrooms.filter(classroom => classroom.schoolYearId === parseInt(schoolyear.id));
                    ret[`schoolyear_${schoolyear.id}`] = classrooms.length ? parseInt(classrooms[0].id) : null;
                });

                return ret;
            });*/
        }
    }, [loadingRelevantDataForTeacherAssignment, dataRelevantDataForTeacherAssignment]);

    const submitForm = () => {
        form
            .validateFields()
            .then(values => {
                // console.log('valuesvaluesvaluesvalues', values)
                // console.log('valuesvaluesvaluesvalues', classroomsSelected.homeroomTeacher)

                let classroomsForHomeroomTeacher = [];
                let classroomsForSubjectTeacher = [];
                for (const gradeOfHomeroomTeacher in classroomsSelected.homeroomTeacher){
                    for (const schoolyearOfHomeroomTeacher in classroomsSelected.homeroomTeacher[gradeOfHomeroomTeacher]){
                        // console.log('zzzzzz',classroomsSelected.homeroomTeacher[gradeOfHomeroomTeacher][schoolyearOfHomeroomTeacher])

                        classroomsForHomeroomTeacher = [
                            ...classroomsForHomeroomTeacher,
                            ...classroomsSelected.homeroomTeacher[gradeOfHomeroomTeacher][schoolyearOfHomeroomTeacher]
                        ]
                    }
                    // console.log('yyyyyy',classroomsSelected.homeroomTeacher[gradeOfHomeroomTeacher])
                }
                for (const gradeOfSubjectTeacher in classroomsSelected.subjectTeacher){
                    for (const schoolyearOfSubjectTeacher in classroomsSelected.subjectTeacher[gradeOfSubjectTeacher]){
                        classroomsForSubjectTeacher = [
                            ...classroomsForSubjectTeacher,
                            ...classroomsSelected.subjectTeacher[gradeOfSubjectTeacher][schoolyearOfSubjectTeacher]
                        ]
                    }
                }
                classroomsForHomeroomTeacher = classroomsForHomeroomTeacher.map(classroomId => parseInt(classroomId));
                classroomsForSubjectTeacher = classroomsForSubjectTeacher.map(subjectOfClassroom => ({
                    classroomId: parseInt(subjectOfClassroom.classroomId),
                    subjectId: parseInt(subjectOfClassroom.subjectId),
                }));
                // console.log('yyyyyyyy', classroomsForSubjectTeacher)
                // if(classroomsForHomeroomTeacher.length || classroomsForSubjectTeacher.length){
                    Promise.all([
                        teacherAssignClassrooms({
                            variables: {
                                "id": parseInt(dataTeacher.key),
                                "input": {
                                    classrooms: classroomsForHomeroomTeacher
                                }
                            },
                        }),
                        teacherAssignSubjectOfClassrooms({
                            variables: {
                                "id": parseInt(dataTeacher.key),
                                "input": {
                                    subjectOfClassroom: classroomsForSubjectTeacher
                                }
                            },
                        }),
                    ]).then((res) => {
                        // console.log('tadaaaaaaaaaaa', res)
                        message.success(intl.formatMessage({id: 'teacher.message.assigned-class-successfully'}));
                        onOk();
                    }).catch(e => {
                        message.error(intl.formatMessage({id: 'teacher.message.assigned-class-failure'}));
                    });
                // }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    return (
        <Modal
            className="modal-assignment"
            title={`${intl.formatMessage({id: "teacher.modal-assignment.title"})}: ${dataTeacher.name}`}
            width={990}
            visible={true}
            closable={false}
            keyboard={false}
            maskClosable={false}
            // confirmLoading={loading}
            cancelText={<FormattedMessage id="general.cancel" />}
            cancelButtonProps={{
                type: "primary",
                ghost: "ghost"
            }}
            okText={<FormattedMessage id="general.save" />}
            okButtonProps={{
                type: "primary",
                loading: loadingTeacherAssignClassrooms || loadingTeacherAssignSubjectOfClassrooms
            }}
            onCancel={onCancel}
            onOk={submitForm}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    radSelectClassroom: 'homeroomTeacher',
                }}
            >
                <Row gutter={18}>
                    <Col sm={6}>
                        <Form.Item
                            name="selSchoolYear"
                            label={<FormattedMessage id="teacher.modal-assignment.select-school-year.label" />}
                        >
                            <Select
                                size="large"
                                placeholder={intl.formatMessage({id: 'teacher.modal-assignment.select-school-year.placeholder'})}
                                options={dataRelevantDataForTeacherAssignment?.schoolyears.data.map(schoolyear => ({
                                    value: schoolyear.id,
                                    label: schoolyear.name,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={6}>
                        <Form.Item
                            name="selCampus"
                            label={<FormattedMessage id="teacher.modal-assignment.select-campus.label" />}
                        >
                            <Select
                                size="large"
                                placeholder={intl.formatMessage({id: 'teacher.modal-assignment.select-campus.placeholder'})}
                                options={dataTeacher.campuses.map(campus => {
                                    return {
                                        value: campus.id,
                                        label: campus.name,
                                    }
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={6}>
                        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.selCampus !== curValues.selCampus}>
                            {({getFieldValue, setFieldsValue}) => {
                                let options = dataTeacher.campuses
                                    .filter(campus => campus.id === getFieldValue('selCampus'))
                                    .map(campus => {
                                        return campus.grades
                                            .filter(grade => dataTeacher.gradeIds.includes(parseInt(grade.id)))
                                            .map(grade => ({
                                                value: grade.id,
                                                label: intl.formatMessage({
                                                    id: `grade.${grade.name.toLowerCase()}`,
                                                }),
                                            }));
                                    })
                                    .flat();

                                setFieldsValue({
                                    selGrade: options.length ? options[0].value : null
                                });

                                return (
                                    <Form.Item
                                        name="selGrade"
                                        label={<FormattedMessage id="teacher.modal-assignment.select-grade.label" />}
                                    >
                                        <Select
                                            size="large"
                                            placeholder={intl.formatMessage({id: 'teacher.modal-assignment.select-grade.placeholder'})}
                                            options={options}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col sm={6}>
                        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.selGrade !== curValues.selGrade}>
                            {({getFieldValue, setFieldsValue}) => {
                                let options = dataTeacher.subjects
                                    .filter(subject => {
                                        return subject.gradeIds.includes(parseInt(getFieldValue('selGrade')))
                                    })
                                    .map(subject => ({
                                        value: subject.id,
                                        label: subject.name,
                                    }));

                                setFieldsValue({
                                    selSubject: options.length ? options[0].value : null
                                });

                                return (
                                    <Form.Item
                                        name="selSubject"
                                        label={<FormattedMessage id="teacher.modal-assignment.select-subject.label" />}
                                    >
                                        <Select
                                            size="large"
                                            placeholder={intl.formatMessage({id: 'teacher.modal-assignment.select-subject.placeholder'})}
                                            options={options}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col sm={24}>
                        <Form.Item
                            className="select-classroom-wrapper"
                            name="radSelectClassroom"
                            label={<FormattedMessage id="teacher.modal-assignment.radio-class-type.label" />}
                        >
                            <Radio.Group
                                size="large"
                                optionType="button"
                                buttonStyle="solid"
                            >
                                <Radio.Button value="homeroomTeacher">{<FormattedMessage id="teacher.modal-assignment.radio-class-type.value.homeroom-teacher" />}</Radio.Button>
                                <Radio.Button value="subjectTeacher">{<FormattedMessage id="teacher.modal-assignment.radio-class-type.value.subject-teacher" />}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col sm={24}>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) => (
                                prevValues.selSchoolYear !== curValues.selSchoolYear
                                || prevValues.selCampus !== curValues.selCampus
                                || prevValues.selGrade !== curValues.selGrade
                                || prevValues.selSubject !== curValues.selSubject
                                || prevValues.radSelectClassroom !== curValues.radSelectClassroom
                            )}
                        >
                            {({getFieldValue, setFieldsValue}) => {
                                let dataClassroom = [];
                                let defaultValueClassroom = [];
                                dataTeacher.campuses
                                    .filter(campus => getFieldValue('selCampus') === campus.id)
                                    .map(campus => {
                                    campus.grades
                                        .filter(grade => getFieldValue('selGrade') === grade.id)
                                        .map(grade => {
                                            grade.classroom
                                                .filter(classroom => parseInt(getFieldValue('selSchoolYear')) === classroom.schoolYearId)
                                                .map(classroom => {
                                                    if(getFieldValue('radSelectClassroom') === 'homeroomTeacher'){
                                                        if(classroom.teacher?.id === dataTeacher.key){
                                                            // console.log(classroom, classroom.teacher?.id)
                                                            defaultValueClassroom.push(classroom.id);
                                                        }
                                                        dataClassroom.push(classroom);
                                                    }else{
                                                        dataTeacher.subjects
                                                            .filter(subjectTmp => getFieldValue('selSubject') === subjectTmp.id)
                                                            .map(subjectTmp => {
                                                                subjectTmp.classrooms
                                                                    .filter(classroomTmp => classroomTmp.gradeId === parseInt(getFieldValue('selGrade')))
                                                                    .map(classroomTmp => {
                                                                        if(!defaultValueClassroom.includes(classroomTmp.id)){
                                                                            defaultValueClassroom.push(classroomTmp.id);
                                                                        }
                                                                    })
                                                            })

                                                        classroom.subjects.map(subject => {
                                                            if(getFieldValue('selSubject') === subject.id){
                                                                // defaultValueClassroom.push(classroom.id);
                                                                dataClassroom.push(classroom);
                                                            }
                                                        });
                                                    }
                                                })
                                        });
                                    });

                                // console.log(getFieldValue('radSelectClassroom'))
                                // console.log(value)
                                // console.log('dataClassroom', dataClassroom)
                                // console.log('classroomsSelected', classroomsSelected)

                                // console.log('defaultValueClassroom', defaultValueClassroom)
                                setFieldsValue({
                                    chkClassroomSelected: defaultValueClassroom
                                })

                                console.log('dataClassroom', dataClassroom)

                                return (
                                    <Form.Item
                                        className="classroom-selected-wrapper"
                                        name="chkClassroomSelected"
                                        label={<FormattedMessage id="teacher.modal-assignment.checkbox-class-selected.label" />}
                                    >
                                        <Checkbox.Group
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={(checkedValue) => {
                                                setClassroomsSelected(classroomsSelected => {
                                                    if(getFieldValue('radSelectClassroom') === 'homeroomTeacher'){
                                                        let classroomBySchoolyear = {...classroomsSelected.homeroomTeacher};
                                                        if(!(`grade_${getFieldValue('selGrade')}` in classroomBySchoolyear)){
                                                            classroomBySchoolyear[`grade_${getFieldValue('selGrade')}`] = {};
                                                        }
                                                        classroomBySchoolyear[`grade_${getFieldValue('selGrade')}`][`schoolyear_${getFieldValue('selSchoolYear')}`] = [...checkedValue];
                                                        classroomsSelected.homeroomTeacher = classroomBySchoolyear;
                                                    }else{
                                                        let classroomSubjectBySchoolyear = {...classroomsSelected.subjectTeacher};
                                                        if(!(`grade_${getFieldValue('selGrade')}` in classroomSubjectBySchoolyear)){
                                                            classroomSubjectBySchoolyear[`grade_${getFieldValue('selGrade')}`] = {};
                                                        }
                                                        classroomSubjectBySchoolyear[`grade_${getFieldValue('selGrade')}`][`schoolyear_${getFieldValue('selSchoolYear')}`] = [...checkedValue.map(classroomId => ({
                                                            classroomId: classroomId,
                                                            subjectId: getFieldValue('selSubject'),
                                                        }))];
                                                        classroomsSelected.subjectTeacher = classroomSubjectBySchoolyear;
                                                    }
                                                    // console.log('xxxxx', classroomsSelected)
                                                    return classroomsSelected;
                                                })
                                            }}
                                        >
                                            <div>
                                                <div className="wrapper-classrooms">
                                                    <span className="classrooms">
                                                        {dataClassroom.map(classroom => (
                                                            <Checkbox
                                                                key={classroom.id}
                                                                value={classroom.id}
                                                                disabled={
                                                                    getFieldValue('radSelectClassroom') === 'homeroomTeacher' ? (
                                                                        classroom.teacher?.id && classroom.teacher.id !== dataTeacher.key
                                                                    ) : (
                                                                        classroom.teacher?.id && classroom.teacher.id !== dataTeacher.key
                                                                    )
                                                                }
                                                            >
                                                                {classroom.name + " | 24"}
                                                            </Checkbox>
                                                        ))}

                                                    </span>
                                                </div>
                                            </div>
                                        </Checkbox.Group>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col sm={24}>
                        <ul className="list-select-type-template">
                            <li className="selected">
                                {<FormattedMessage id="teacher.modal-assignment.label-selected" />}
                            </li>
                            <li className="exist">
                                {<FormattedMessage id="teacher.modal-assignment.label-fulled" />}
                            </li>
                            <li>
                                {<FormattedMessage id="teacher.modal-assignment.label-empty" />}
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default ModalAssignment;
