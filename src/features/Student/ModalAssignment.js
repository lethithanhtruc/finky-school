import React, {useState, useEffect} from 'react';
import {Col, Row, Input, Radio, Checkbox, Button, Select, Modal, Form, message} from "antd";
import {useMutation, useQuery} from "@apollo/client";
import './ModalAssignment.scss';
import {
    GET_RELEVANT_DATA_FOR_STUDENT_ASSIGNMENT,
    STUDENT_UPDATE
} from "./gql";
import {FormattedMessage, useIntl} from "react-intl";

const ModalAssignment = ({dataStudent, onCancel, onOk}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [classroomsSelected, setClassroomsSelected] = useState({});
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    const [studentUpdate] = useMutation(STUDENT_UPDATE);

    useEffect(() => {
        if(dataStudent){
            console.log('modal', dataStudent)
        }
    }, [dataStudent])

    const { loading: loadingRelevantDataForStudentAssignment, error: errorRelevantDataForStudentAssignment, data: dataRelevantDataForStudentAssignment } = useQuery(GET_RELEVANT_DATA_FOR_STUDENT_ASSIGNMENT);
    useEffect(() => {
        if(loadingRelevantDataForStudentAssignment === false && dataRelevantDataForStudentAssignment){
            // console.log(dataRelevantDataForStudentAssignment.schoolyears)
            const schoolyearCurrent = dataRelevantDataForStudentAssignment.schoolyears.data.filter(schoolyear => parseInt(schoolyear.endAt.substring(0, 4)) === new Date().getFullYear());
            form.setFieldsValue({ selSchoolYear: schoolyearCurrent[0].id });

            setClassroomsSelected(classroomsSelected => {
                let ret = {};
                dataRelevantDataForStudentAssignment.schoolyears.data.map(schoolyear => {
                    let classrooms = dataStudent.classrooms.filter(classroom => classroom.schoolYearId === parseInt(schoolyear.id));
                    ret[`schoolyear_${schoolyear.id}`] = classrooms.length ? parseInt(classrooms[0].id) : null;
                });

                return ret;
            });
        }
    }, [loadingRelevantDataForStudentAssignment, dataRelevantDataForStudentAssignment]);

    const submitForm = () => {
        // console.log('classroomsSelected', classroomsSelected)
        form
            .validateFields()
            .then(values => {
                setIsLoadingSubmit(true);
                Promise.all([
                    studentUpdate({
                        variables: {
                            "id": parseInt(dataStudent.key),
                            "input": {
                                classrooms: {
                                    sync: Object.values(classroomsSelected)
                                        .filter(value => value)
                                        .map(value => parseInt(value))
                                }
                            }
                        },
                    })
                ]).then((res) => {
                    // console.log('tadaaaaaaaaaaa', res)
                    message.success(intl.formatMessage({id: 'student.message.assign-class-successfully'}));
                    onOk();
                }).catch(e => {
                    message.error(intl.formatMessage({id: 'student.message.assign-class-failure'}));
                    setIsLoadingSubmit(false);
                });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    return (
        <Modal
            className="modal-assignment"
            title={`${intl.formatMessage({id: 'student.modal-assignment.title'})}: ${dataStudent.name}`}
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
                loading: isLoadingSubmit,
            }}
            onCancel={onCancel}
            onOk={submitForm}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    radSelectClassroom: 'homeroomStudent',
                }}
            >
                <Row gutter={18}>
                    <Col sm={6}>
                        <Form.Item
                            name="selSchoolYear"
                            label={<FormattedMessage id="student.modal-assignment.select-school-year.label" />}
                        >
                            <Select
                                placeholder={intl.formatMessage({id: 'student.modal-assignment.select-school-year.placeholder'})}
                                size="large"
                                options={dataRelevantDataForStudentAssignment?.schoolyears.data.map(schoolyear => ({
                                    value: schoolyear.id,
                                    label: schoolyear.name,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={6}>
                        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.selSchoolYear !== curValues.selSchoolYear}>
                            {({getFieldValue, setFieldsValue}) => {
                                let options = dataStudent.campus.grades
                                    .map(grade => ({
                                        value: grade.id,
                                        label: intl.formatMessage({
                                            id: `grade.${grade.name.toLowerCase()}`,
                                        }),
                                    }));

                                setFieldsValue({
                                    selGrade: options.length ? options[0].value : null
                                });

                                return (
                                    <Form.Item
                                        name="selGrade"
                                        label={<FormattedMessage id="student.modal-assignment.select-grade.label" />}
                                    >
                                        <Select
                                            placeholder={intl.formatMessage({id: 'student.modal-assignment.select-grade.placeholder'})}
                                            size="large"
                                            options={options}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col sm={24}>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) => (
                                prevValues.selSchoolYear !== curValues.selSchoolYear
                                || prevValues.selGrade !== curValues.selGrade
                            )}
                        >
                            {({getFieldValue, setFieldsValue}) => {
                                let dataClassroom = [];
                                let defaultValueClassroom = null;
                                let defaultValueClassroomTmp = dataStudent.classrooms.map(classroom => classroom.id);
                                dataStudent.campus.grades
                                    .filter(grade => getFieldValue('selGrade') === grade.id)
                                    .map(grade => {
                                        grade.classroom
                                            .filter(classroom => parseInt(getFieldValue('selSchoolYear')) === classroom.schoolYearId)
                                            .map(classroom => {
                                            // console.log(classroom)
                                            if(defaultValueClassroomTmp.includes(classroom.id)){
                                                defaultValueClassroom = classroom.id;
                                            }
                                            dataClassroom.push(classroom);
                                        })
                                    });

                                // console.log(getFieldValue('radSelectClassroom'))
                                // console.log(value)
                                // console.log('dataClassroom', dataClassroom)
                                // console.log('classroomsSelected', classroomsSelected)

                                // console.log('defaultValueClassroom', defaultValueClassroom)
                                setFieldsValue({
                                    radClassroomSelected: defaultValueClassroom
                                })

                                console.log('dataClassroom', dataClassroom)

                                return (
                                    <Form.Item
                                        className="classroom-selected-wrapper"
                                        name="radClassroomSelected"
                                        label={<FormattedMessage id="student.modal-assignment.radio-class-selected.label" />}
                                    >
                                        <Radio.Group
                                            style={{
                                                width: '100%'
                                            }}
                                            onChange={(checkedValue) => {
                                                setClassroomsSelected(classroomsSelected => {
                                                    classroomsSelected["schoolyear_" + getFieldValue('selSchoolYear')] = checkedValue.target.value;

                                                    return classroomsSelected;
                                                })
                                            }}
                                        >
                                            <div>
                                                <div className="wrapper-classrooms">
                                                    <span className="classrooms">
                                                        {dataClassroom.map(classroom => (
                                                            <Radio
                                                                key={classroom.id}
                                                                value={classroom.id}
                                                                /*disabled={
                                                                    getFieldValue('radSelectClassroom') === 'homeroomStudent' ? (
                                                                        classroom.student?.id && classroom.student.id !== dataStudent.key
                                                                    ) : (
                                                                        classroom.student?.id && classroom.student.id !== dataStudent.key
                                                                    )
                                                                }*/
                                                            >
                                                                {classroom.name + " | 24"}
                                                            </Radio>
                                                        ))}

                                                    </span>
                                                </div>
                                            </div>
                                        </Radio.Group>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col sm={24}>
                        <ul className="list-select-type-template">
                            <li className="selected">
                                <FormattedMessage id="student.modal-assignment.label-selected" />
                            </li>
                            <li className="exist">
                                <FormattedMessage id="student.modal-assignment.label-fulled" />
                            </li>
                            <li>
                                <FormattedMessage id="student.modal-assignment.label-empty" />
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default ModalAssignment;
