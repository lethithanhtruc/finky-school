import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import CustomScrollbars from "../../components/Common/CustomScrollbars";
import {Button, Col, Input, Row, Form, Checkbox, Steps, Select, Space, Upload, message, Table, Modal} from "antd";
import { DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import './Create.scss';
import { ReactComponent as IconUpload } from '../../svg/icon-upload.svg';
import { ReactComponent as IconDownload } from '../../svg/icon-download.svg';
import {useQuery, useLazyQuery, useMutation} from "@apollo/client";
import {
    GET_RELEVANT_DATA_FOR_CREATE_CLASSROOM,
    CLASSROOM_CREATE,
    CLASSROOM_NAME_GENERATE, GET_TEACHERS_FOR_CREATE_CLASSROOM
} from "./gql";
import {LOAD_CLASSROOMS, STUDENTS_UPLOAD_FOR_CLASSROOM} from "./gql";
import {
    CAMPUS_REPRESENTATIVE_POSITIONS,
    SHIFT,
    TEACHER_GENDER,
    TEACHER_STATUS,
    TEACHER_WORK_EXPERIENCE
} from '../../constants';
import {FormattedMessage, useIntl} from "react-intl";
import {useHistory, useParams} from "react-router-dom";
import UpcomingFeature from "../../components/Common/UpcomingFeature";

const { Step } = Steps;
const { Dragger } = Upload;

const Create = () => {
    const history = useHistory();
    const intl = useIntl();
    let { fill } = useParams();
    const [form] = Form.useForm();
    const [stepCurrent, setStepCurrent] = useState(0);
    const [formResult, setFormResult] = useState({});
    const [optionGrades, setOptionGrades] = useState([]);
    const [isSelectedGrade, setIsSelectedGrade] = useState(false);
    const [dataStudentPreview, setDataStudentPreview] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [pathFileImportStudent, setPathFileImportStudent] = useState(null);
    const [isDisabledButtonNextStepOrFinish, setIsDisabledButtonNextStepOrFinish] = useState(false);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForCreateClassroom, error: errorRelevantDataForCreateClassroom, data: dataRelevantDataForCreateClassroom } = useQuery(GET_RELEVANT_DATA_FOR_CREATE_CLASSROOM);
    useEffect(() => {
        if(loadingRelevantDataForCreateClassroom === false && dataRelevantDataForCreateClassroom){
            // console.log(dataRelevantDataForCreateClassroom)

            let campusId = dataRelevantDataForCreateClassroom.campuses.data.filter(campus => campus.isMain)[0].id;
            let schoolYearId = dataRelevantDataForCreateClassroom.schoolyears.data.filter(schoolyear => parseInt(schoolyear.endAt.substring(0, 4)) === new Date().getFullYear())[0].id;
            if(fill) {
                let fillParse = JSON.parse(decodeURIComponent(fill));
                campusId = fillParse.campusId + "";
                schoolYearId = fillParse.schoolYearId + "";
            }
            form.setFieldsValue({ selCampus: campusId });
            form.setFieldsValue({ selSchoolyear: schoolYearId });
            updateOptionGrades();
        }
    }, [loadingRelevantDataForCreateClassroom, dataRelevantDataForCreateClassroom]);

    // ----------
    // Lấy danh sách giáo viên
    // ----------
    const [loadTeachersForCreateClassroom, { loading: loadingTeachersForCreateClassroom, error: errorTeachersForCreateClassroom, data: dataTeachersForCreateClassroom }] = useLazyQuery(GET_TEACHERS_FOR_CREATE_CLASSROOM);
    useEffect(() => {
        if(loadingTeachersForCreateClassroom === false && dataTeachersForCreateClassroom){
            console.log(dataTeachersForCreateClassroom)
        }
    }, [loadingTeachersForCreateClassroom, dataTeachersForCreateClassroom]);

    // ----------
    // Lấy dữ liệu Tên lớp được tạo tự động
    // ----------
    const [loadClassroomNameGenerate, { loading: loadingClassroomNameGenerate, error: errorClassroomNameGenerate, data: dataClassroomNameGenerate }] = useLazyQuery(CLASSROOM_NAME_GENERATE);
    useEffect(() => {
        if(loadingClassroomNameGenerate === false && dataClassroomNameGenerate){
            form.setFieldsValue({ txtClassroomName: dataClassroomNameGenerate.classroomNameGenerate });
        }
    }, [loadingClassroomNameGenerate, dataClassroomNameGenerate]);

    // ----------
    // Mutation thêm Lớp học và xử lý kết quả trả về từ API
    // ----------
    const [classroomCreate, { loading: loadingClassroomCreate, error: errorClassroomCreate, data: dataClassroomCreate }] = useMutation(CLASSROOM_CREATE);
    useEffect(() => {
        if(!loadingClassroomCreate && errorClassroomCreate){
            let errorFields = [];
            if(errorClassroomCreate.graphQLErrors[0]?.extensions?.validation?.name){
                errorFields.push({
                    name: 'txtClassroomName',
                    errors: ['Tên lớp học đã tồn tại']
                });
            }
            if(errorClassroomCreate.graphQLErrors[0]?.extensions?.validation?.code){
                errorFields.push({
                    name: 'txtClassroomCode',
                    errors: ['Mã lớp học đã tồn tại']
                });
            }

            if(errorFields.length){
                setStepCurrent(0);
                form.setFields(errorFields);
            }

            message.error('Đã có lỗi xảy ra.');
            setIsDisabledButtonNextStepOrFinish(false);
        }else if(!loadingClassroomCreate && dataClassroomCreate){
            form.resetFields();
            form.setFieldsValue({ selCampus: dataRelevantDataForCreateClassroom.campuses.data[0].id });
            form.setFieldsValue({ selSchoolyear: dataRelevantDataForCreateClassroom.schoolyears.data[0].id });
            updateOptionGrades();

            setStepCurrent(0);
            message.success('Thêm lớp học thành công.');
            history.push('/class');
        }
    }, [loadingClassroomCreate, errorClassroomCreate, dataClassroomCreate])

    // ----------
    // Mutation upload file danh sách học sinh và xử lý kết quả trả về từ API
    // ----------
    const [studentsUploadForClassroom, { loading: loadingStudentsUploadForClassroom, error: errorStudentsUploadForClassroom, data: dataStudentsUploadForClassroom }] = useMutation(STUDENTS_UPLOAD_FOR_CLASSROOM);
    useEffect(() => {
        if(!loadingStudentsUploadForClassroom && errorStudentsUploadForClassroom){
            // console.log('errorStudentsUploadForClassroom', errorStudentsUploadForClassroom.graphQLErrors[0]?.extensions?.validation.file)
            /*let errorFields = [];
            if(errorStudentsUploadForClassroom.graphQLErrors[0]?.extensions?.validation && errorStudentsUploadForClassroom.graphQLErrors[0].extensions.validation?.file){
                errorFields.push({
                    name: 'txtPhone',
                    errors: ['Số điện thoại đã tồn tại']
                });
            }*/

            message.error('Đã có lỗi xảy ra khi upload file.');
        }else if(!loadingStudentsUploadForClassroom && dataStudentsUploadForClassroom){
            // console.log(dataStudentsUploadForClassroom.studentsUploadForClassroom)
            if(dataStudentsUploadForClassroom.studentsUploadForClassroom.students.length){
                setPathFileImportStudent(dataStudentsUploadForClassroom.studentsUploadForClassroom.path);
                setDataStudentPreview(dataStudentsUploadForClassroom.studentsUploadForClassroom.students.map((student, index) => {
                    return {
                        ...student,
                        key: index + 1
                    };
                }));
                message.success('Đã upload file dữ liệu học sinh thành công.');
            }else{
                message.error('Không có dữ liệu học sinh nào.');
            }
        }
    }, [loadingStudentsUploadForClassroom, dataStudentsUploadForClassroom]);

    // ----------
    // Xử lý option default cho select Khối lớp
    // ----------
    useEffect(() => {
        let gradeId = null;
        if(fill && !isSelectedGrade) {
            let fillParse = JSON.parse(decodeURIComponent(fill));
            gradeId = fillParse.gradeId + "";
        }else{
            gradeId = optionGrades?.length ? optionGrades[0].value : null;
        }
        form.setFieldsValue({ selGrade: gradeId });
    }, [optionGrades])

    // ----------
    // Xử lý data danh sách option cho select Khối lớp
    // ----------
    const updateOptionGrades = () => {
        setOptionGrades(optionGrades => {
            return dataRelevantDataForCreateClassroom?.campuses.data
                .filter(campus => campus.id === form.getFieldValue("selCampus"))[0]?.grades
                .map(grade => {
                    return {
                        label: intl.formatMessage({
                            id: `grade.${grade.name.toLowerCase()}`,
                        }),
                        value: grade.id,
                    }
                })
        });
    }

    // ----------
    // Refresh danh sách giáo viên chủ nhiệm
    // ----------
    useEffect(() => {
        updateOptionHomeroomTeachers();
    }, [optionGrades]);

    // ----------
    // Xử lý data danh sách option cho select Giáo viên chủ nhiệm
    // ----------
    const updateOptionHomeroomTeachers = () => {
        const schoolYearId = form.getFieldValue('selSchoolyear');
        const campusId = form.getFieldValue('selCampus');
        const gradeId = form.getFieldValue('selGrade');

        if(schoolYearId && campusId && gradeId){
            form.setFieldsValue({
                selHomeroomTeacher: null
            });
            loadTeachersForCreateClassroom({
                variables:{
                    filter: {
                        schoolYearId: parseInt(schoolYearId),
                        campusId: parseInt(campusId),
                        gradeIds: [parseInt(gradeId)]
                    }
                }
            });
        }
    }

    // ----------
    // Xử lý click button Tiếp tục
    // ----------
    const handleClickStepContinue = () => {
        form
            .validateFields()
            .then(values => {
                if(stepCurrent < 2){
                    setIsDisabledButtonNextStepOrFinish(false);

                    setStepCurrent(stepCurrent < 2 ? stepCurrent + 1 : stepCurrent);
                    setFormResult({...formResult, ...values})
                }else{
                    // step 3
                    setIsDisabledButtonNextStepOrFinish(true);

                    let input = {
                        schoolYearId: parseInt(formResult.selSchoolyear),
                        campusId: parseInt(formResult.selCampus),
                        gradeId: parseInt(formResult.selGrade),
                        name: formResult.txtClassroomName,
                        shift: formResult.selShift
                    };
                    if(formResult.txtClassroomCode){
                        input.code = formResult.txtClassroomCode;
                    }
                    if(formResult.selHomeroomTeacher){
                        input.teacherId = parseInt(formResult.selHomeroomTeacher);
                    }

                    if(pathFileImportStudent){
                        input.pathFileImportStudent = pathFileImportStudent;
                    }

                    if(selectedSubjects && selectedSubjects.length){
                        input.subjects = {
                            create: selectedSubjects,
                        };
                        console.log('selectedSubjectsselectedSubjectsselectedSubjects', selectedSubjects)
                    }

                    classroomCreate({
                        variables: {
                            "input": input
                        },
                        refetchQueries: [{
                            query: LOAD_CLASSROOMS,
                            variables: {
                                filter: {
                                    schoolYearId: input.schoolYearId,
                                    campusId: input.campusId,
                                    gradeId: input.gradeId,
                                }
                            }
                        }],
                        awaitRefetchQueries: true
                    }).catch ((e) => {
                        // console.log(e.graphQLErrors)
                    });
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div className="create-classroom-page">
            <PageHeader title={intl.formatMessage({id: 'class.create.title'})} />
            <Row gutter={24}>
                <Col span={20} offset={2}>
                    <div className="wrapper-steps">
                        <Steps current={stepCurrent}>
                            <Step description={intl.formatMessage({id: 'class.class-info-form.step1'})} />
                            <Step description={intl.formatMessage({id: 'class.class-info-form.step2'})} />
                            <Step description={intl.formatMessage({id: 'class.class-info-form.step3'})} />
                        </Steps>
                    </div>

                    <Form
                        form={form}
                        colon={false}
                        onFinish={() => {}}
                    >
                        <div className="block-create-classroom-steps">
                            <div className="block-content">
                                {/*{stepCurrent === 0 && (*/}
                                    <div className="inner-block-content inner-block-content-step1" style={{display: stepCurrent === 0 ? 'block' : 'none'}}>
                                        <Form.Item
                                            name="selCampus"
                                            label={<FormattedMessage id="class.class-info-form.select-campus.label" />}
                                        >
                                            <Select
                                                size="large"
                                                placeholder={intl.formatMessage({id: 'class.class-info-form.select-campus.placeholder'})}
                                                loading={loadingRelevantDataForCreateClassroom}
                                                options={dataRelevantDataForCreateClassroom?.campuses.data.map(campus => {
                                                    return {
                                                        label: campus.name,
                                                        value: campus.id,
                                                    }
                                                })}
                                                onChange={() => {
                                                    updateOptionGrades();
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="selSchoolyear"
                                            label={<FormattedMessage id="class.class-info-form.select-school-year.label" />}
                                        >
                                            <Select
                                                size="large"
                                                placeholder={intl.formatMessage({id: 'class.class-info-form.select-school-year.placeholder'})}
                                                loading={loadingRelevantDataForCreateClassroom}
                                                options={dataRelevantDataForCreateClassroom?.schoolyears.data.map(schoolyear => {
                                                    return {
                                                        label: schoolyear.name,
                                                        value: schoolyear.id,
                                                    }
                                                })}
                                                onChange={() => {
                                                    updateOptionHomeroomTeachers();
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="selGrade"
                                            placeholder={intl.formatMessage({id: 'class.class-info-form.select-grade.placeholder'})}
                                            label={<FormattedMessage id="class.class-info-form.select-grade.label" />}
                                            dependencies={['selCampus']}
                                        >
                                            <Select
                                                size="large"
                                                loading={loadingRelevantDataForCreateClassroom}
                                                options={optionGrades}
                                                onChange={() => {
                                                    if(!isSelectedGrade){
                                                        setIsSelectedGrade(true);
                                                    }
                                                    updateOptionHomeroomTeachers();
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={<FormattedMessage id="class.class-info-form.input-name.label" />}
                                        >
                                            <Row gutter={14}>
                                                <Col span={14}>
                                                    <Form.Item
                                                        noStyle
                                                        name="txtClassroomName"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: intl.formatMessage({id: 'validate.required-input'})
                                                            },
                                                            {
                                                                max: 35,
                                                                message: 'Thông tin này không được dài hơn 35 kí tự'
                                                            },
                                                            {
                                                                pattern: /^[\s0-9\p{L}]+$/u,
                                                                message: 'Thông tin này không được chứa các kí tự đặc biệt'
                                                            }
                                                        ]}
                                                    >
                                                        <Input placeholder={intl.formatMessage({id: 'class.class-info-form.input-name.placeholder'})} size="large" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10} align="right">
                                                    <Button
                                                        className="btn-password-generator"
                                                        type="primary"
                                                        ghost
                                                        size="large"
                                                        disabled={loadingRelevantDataForCreateClassroom || loadingClassroomNameGenerate}
                                                        onClick={() => {
                                                            loadClassroomNameGenerate({
                                                                variables: {
                                                                    filter: {
                                                                        schoolYearId: parseInt(form.getFieldValue('selSchoolyear')),
                                                                        campusId: parseInt(form.getFieldValue("selCampus")),
                                                                        gradeId: parseInt(form.getFieldValue("selGrade")),
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <FormattedMessage id="general.button.auto-create" />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                        <Form.Item
                                            name="txtClassroomCode"
                                            label={<FormattedMessage id="class.class-info-form.input-code.label" />}
                                            rules={[
                                                {
                                                    max: 20,
                                                    message: 'Thông tin này không được dài hơn 20 kí tự'
                                                },
                                                {
                                                    pattern: /^[a-zA-Z0-9]+$/,
                                                    message: 'Thông tin này chỉ được bao gồm chữ và số'
                                                }
                                            ]}
                                        >
                                            <Input placeholder={intl.formatMessage({id: 'class.class-info-form.input-code.placeholder'})} size="large" />
                                        </Form.Item>
                                        <Form.Item
                                            name="selShift"
                                            label={<FormattedMessage id="class.class-info-form.select-school-time.label" />}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: intl.formatMessage({id: 'validate.required-input'})
                                                },
                                            ]}
                                        >
                                            <Select
                                                size="large"
                                                placeholder={intl.formatMessage({id: 'class.class-info-form.select-school-time.placeholder'})}
                                                options={SHIFT.map(shift => ({
                                                    value: shift.value,
                                                    label: intl.formatMessage({
                                                        id: `class.school-time.${shift.label.toLowerCase()}`,
                                                    }),
                                                }))}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="selHomeroomTeacher"
                                            label={<FormattedMessage id="class.class-info-form.select-homeroom-teacher.label" />}
                                        >
                                            <Select
                                                size="large"
                                                placeholder={intl.formatMessage({id: 'class.class-info-form.select-homeroom-teacher.placeholder'})}
                                                loading={loadingTeachersForCreateClassroom}
                                                options={dataTeachersForCreateClassroom?.teachers.data.map(teacher => {
                                                    return {
                                                        label: teacher.name,
                                                        value: teacher.id,
                                                    }
                                                })}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="chkSubjects"
                                            label={<FormattedMessage id="class.class-info-form.checkbox-subject.label" />}
                                        >
                                            <div>
                                                <Checkbox.Group
                                                    style={{ width: '100%' }}
                                                    defaultValue={selectedSubjects.map(subjectTeacher => subjectTeacher.subjectId)}
                                                    onChange={(subjectIds) => setSelectedSubjects(subjectIds.filter(subjectId => subjectId != null).map(subjectId => {
                                                        let ret = {
                                                            subjectId: subjectId,
                                                        };
                                                        /*if(teacherId != null){
                                                            ret.teacherId = teacherId;
                                                        }*/
                                                        return ret;
                                                    }))}
                                                >
                                                    <Row>
                                                        {dataRelevantDataForCreateClassroom?.subjects.data.map(subject => {
                                                            return (
                                                                <Col span={12} key={subject.id}>
                                                                    <Checkbox value={subject.id}>{subject.name}</Checkbox>
                                                                </Col>
                                                            );
                                                        })}
                                                    </Row>
                                                </Checkbox.Group>
                                                <div align="right">
                                                    <Button
                                                        className="btn-subject-more"
                                                        type="link"
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
                                                        {`${intl.formatMessage({id: 'general.add'})}...`}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form.Item>
                                    </div>
                                {/*)}*/}

                                {/*{stepCurrent === 1 && (*/}
                                    <div className="inner-block-content inner-block-content-step2" style={{display: stepCurrent === 1 ? 'block' : 'none'}}>
                                        <Form.List name="pairSubjectTeacher">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    <div className="wrapper-ignore">
                                                        <Button
                                                            type="link"
                                                            size="large"
                                                            onClick={handleClickStepContinue}
                                                        >
                                                            <FormattedMessage id="general.ignore" />
                                                        </Button>
                                                    </div>
                                                    {selectedSubjects.map((subjectTeacher, index) => {
                                                        // console.log(subjectTeacher)
                                                        const subjectFinded = dataRelevantDataForCreateClassroom.subjects.data.find(subject => subject.id === subjectTeacher.subjectId);
                                                        return (
                                                            <div className="wrapper-item-subject-teacher" key={subjectTeacher.subjectId}>
                                                                <div className="wrapper-no">
                                                                    <label className="label-key">{index + 1}</label>
                                                                </div>
                                                                <Row gutter={13}>
                                                                    <Col span={12}>
                                                                        <Form.Item
                                                                            // name={[field.name, 'txtSubject']}
                                                                        >
                                                                            <Input size="large" placeholder={intl.formatMessage({id: 'class.class-info-form.select-subject.placeholder'})} value={subjectFinded.name} disabled />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={12}>
                                                                        <Form.Item
                                                                            // name={[field.name, 'txtTeacher']}
                                                                        >
                                                                            <Select
                                                                                size="large"
                                                                                placeholder={intl.formatMessage({id: 'class.class-info-form.select-subject-teacher.placeholder'})}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        );
                                                    })}
                                                    {fields.map((field, index) => (
                                                        <div className="wrapper-item-subject-teacher" key={index}>
                                                            <div className="wrapper-no">
                                                                <label className="label-key">{selectedSubjects.length + index + 1}</label>
                                                            </div>
                                                            <Row gutter={13}>
                                                                <Col span={12}>
                                                                    <Form.Item
                                                                        {...field}
                                                                        name={[field.name, 'txtSubject']}
                                                                        fieldKey={[field.fieldKey, 'txtSubject']}
                                                                        // rules={[{ required: true, message: 'Missing first name' }]}
                                                                    >
                                                                        <Input size="large" placeholder={intl.formatMessage({id: 'class.class-info-form.select-subject.placeholder'})} />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={12}>
                                                                    <Form.Item
                                                                        {...field}
                                                                        name={[field.name, 'txtTeacher']}
                                                                        fieldKey={[field.fieldKey, 'txtTeacher']}
                                                                        // rules={[{ required: true, message: 'Missing last name' }]}
                                                                    >
                                                                        <Select
                                                                            size="large"
                                                                            placeholder={intl.formatMessage({id: 'class.class-info-form.select-subject-teacher.placeholder'})}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                            <div className="wrapper-actions">
                                                                <DeleteOutlined onClick={() => remove(field.name)} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <Form.Item>
                                                        <Button className="btn-add" type="dashed" size="large" onClick={() => add()} block>
                                                            <FormattedMessage id="general.add" />
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                {/*)}*/}

                                {/*{stepCurrent === 2 && (*/}
                                    <div className="inner-block-content inner-block-content-step3" style={{display: stepCurrent === 2 ? 'block' : 'none'}}>
                                        <Row gutter={39}>
                                            <Col sm={11}>
                                                <div className="wrapper-download-upload">
                                                    <div className="wrapper-download-example">
                                                        <Space>
                                                            <IconDownload />
                                                            <div className="download-example">
                                                                <div>
                                                                    <FormattedMessage id="class.class-info-form.link-download-file-sample.placeholder" />
                                                                </div>
                                                                <a className="link-download" href={`${process.env.REACT_APP_BACKEND_URL}/download/students-template-for-classroom`} target="_blank">
                                                                    <PaperClipOutlined /> <span><FormattedMessage id="class.class-info-form.link-download-file-sample.label" /></span>
                                                                </a>
                                                            </div>
                                                        </Space>
                                                    </div>
                                                    <div className="upload-title">
                                                        <FormattedMessage id="class.class-info-form.input-upload-student-list.label" />
                                                    </div>
                                                    <div className="wrapper-upload">
                                                        <Dragger
                                                            accept=".xlsx,.xls"
                                                            name="file"
                                                            showUploadList={false}
                                                            // multiple
                                                            customRequest={({file, onSuccess}) => {
                                                                // console.log('filexxxxxxxx', file)
                                                                if(file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                                                                    setIsDisabledButtonNextStepOrFinish(true);
                                                                    studentsUploadForClassroom({
                                                                        variables: {
                                                                            "input": {
                                                                                file: file
                                                                            }
                                                                        },
                                                                    }).catch ((e) => {
                                                                        // console.log(e.graphQLErrors)
                                                                    });

                                                                    onSuccess("ok");
                                                                }else{
                                                                    message.error('File không hợp lệ.');
                                                                }

                                                                return;
                                                            }}
                                                            onChange={(info) => {
                                                                const { status } = info.file;
                                                                if (status !== 'uploading') {
                                                                    console.log(info.file, info.fileList);
                                                                }
                                                                if (status === 'done') {
                                                                    // message.success(`Tải lên ${info.file.name} thành công.`);
                                                                    setIsDisabledButtonNextStepOrFinish(false);
                                                                } else if (status === 'error') {
                                                                    message.error(`Tải lên ${info.file.name} thất bại.`);
                                                                }
                                                            }}
                                                        >
                                                            <p className="ant-upload-drag-icon">
                                                                <IconUpload />
                                                            </p>
                                                            <p className="ant-upload-text">
                                                                <FormattedMessage id="class.class-info-form.input-upload-student-list.placeholder" />
                                                            </p>
                                                        </Dragger>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={13}>
                                                <div className="list-title">
                                                    <FormattedMessage id="class.class-info-form.preview-upload-student-list.label" />
                                                </div>
                                                <div className="wrapper-table-student">
                                                    <CustomScrollbars style={{ height: 442 }}>
                                                        <div>
                                                            <Table
                                                                columns={[
                                                                    {
                                                                        title: <FormattedMessage id="class.class-info-form.preview-upload-student-list.column.no" />,
                                                                        dataIndex: 'key',
                                                                        width: '60px'
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="class.class-info-form.preview-upload-student-list.column.fullname" />,
                                                                        dataIndex: 'name',
                                                                    },
                                                                    {
                                                                        title: <FormattedMessage id="class.class-info-form.preview-upload-student-list.column.birthday" />,
                                                                        dataIndex: 'birthday',
                                                                    },
                                                                ]}
                                                                dataSource={dataStudentPreview}
                                                                pagination={false}
                                                                bordered
                                                                locale={{
                                                                    emptyText: intl.formatMessage({id: 'table.empty-text'})
                                                                }}
                                                            />
                                                        </div>
                                                    </CustomScrollbars>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                {/*)}*/}
                            </div>
                            <div className="block-footer">
                                <div className="inner-block-footer">
                                    <Space>
                                        {stepCurrent > 0 && (
                                            <Button type="default" size="large" onClick={() => setStepCurrent(stepCurrent > 0 ? stepCurrent - 1 : stepCurrent)}>
                                                <FormattedMessage id="general.previous-step" />
                                            </Button>
                                        )}
                                        <Button
                                            type="primary"
                                            size="large"
                                            disabled={loadingRelevantDataForCreateClassroom || isDisabledButtonNextStepOrFinish}
                                            onClick={handleClickStepContinue}
                                        >
                                            {stepCurrent < 2 ? <FormattedMessage id="general.next-step" /> : <FormattedMessage id="general.finish" />}
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default Create;
