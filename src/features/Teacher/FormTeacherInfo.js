import React, {useState, useEffect} from 'react';
import {Col, Form, Input, Row, Select, DatePicker, Space, Button, message, Image} from "antd";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_RELEVANT_DATA_FOR_FORM_TEACHER_INFO, SUBJECTS, TEACHER_CODE_GENERATE} from "./gql";
import moment from "moment";
import {
    TEACHER_GENDER,
    TEACHER_WORK_EXPERIENCE,
    TEACHER_STATUS,
} from '../../constants';
import './FormTeacherInfo.scss';
import {FormattedMessage, useIntl} from "react-intl";
import UploadImage from "../../components/Common/UploadImage";

const FormTeacherInfo = ({setAvatar, isOnlyRead, dataTeacher, onCancel, onOk, error}) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [optionGrades, setOptionGrades] = useState([]);
    const [optionSubjects, setOptionSubjects] = useState([]);
    const [isDisabledButtonSubmit, setIsDisabledButtonSubmit] = useState(false);

    // ----------
    // Đổ dữ liệu edit vào form (nếu có)
    // ----------
    useEffect(() => {
        if(dataTeacher){
            form.setFieldsValue({
                selCampuses: dataTeacher.campuses.map(campus => campus.id + ""),
                selGrades: dataTeacher.gradeIds.map(grade => grade + ""),
                selSubjects: dataTeacher.subjects.map(subject => subject.id + ""),
                selStatus: dataTeacher.status,
                selGender: dataTeacher.gender,
                txtName: dataTeacher.name,
                dateBirthday: dataTeacher.birthday ? moment(dataTeacher.birthday) : null,
                txtPhone: dataTeacher.phone,
                txtEmail: dataTeacher.email,
                txtAddress: dataTeacher.address,
                txtCode: dataTeacher.code,
                selWorkExperience: dataTeacher.workExperience,
                dateStarted: dataTeacher.startedDate ? moment(dataTeacher.startedDate + "-01-01") : null,
                txtTrainingDegree: dataTeacher.trainingDegree,
                txtTrainingPlace: dataTeacher.trainingPlace,
                txtNote: dataTeacher.note,
            });
        }
    }, [dataTeacher]);

    // ----------
    // Lấy các data liên quan
    // ----------
    const { loading: loadingRelevantDataForFormTeacherInfo, data: dataRelevantDataForFormTeacherInfo } = useQuery(GET_RELEVANT_DATA_FOR_FORM_TEACHER_INFO);
    useEffect(() => {
        if(loadingRelevantDataForFormTeacherInfo === false && dataRelevantDataForFormTeacherInfo){
            // console.log(dataRelevantDataForFormTeacherInfo)
            updateOptionGrades();
            uploadOptionSubjects();
        }
    }, [loadingRelevantDataForFormTeacherInfo, dataRelevantDataForFormTeacherInfo]);

    // ----------
    // Query sinh mã giáo viên tự động
    // ----------
    const [loadTeacherCodeGenerate, { loading: loadingTeacherCodeGenerate, error: errorTeacherCodeGenerate, data: dataTeacherCodeGenerate }] = useLazyQuery(TEACHER_CODE_GENERATE);
    useEffect(() => {
        if(loadingTeacherCodeGenerate === false && dataTeacherCodeGenerate){
            form.setFieldsValue({ txtCode: dataTeacherCodeGenerate.teacherCodeGenerate });
        }
    }, [loadingTeacherCodeGenerate, dataTeacherCodeGenerate]);

    // ----------
    // Cập nhật danh sách option cho select cơ sở làm việc
    // ----------
    const updateOptionGrades = () => {
        setOptionGrades(optionGrades => {
            let optionGradesTmp = [];
            dataRelevantDataForFormTeacherInfo?.campuses.data.filter(campus => {
                    return form.getFieldValue("selCampuses")?.includes(campus.id + "")
                })
                .map(campus => {
                    optionGradesTmp = [
                        ...optionGradesTmp,
                        ...campus.grades.map(grade => {
                            return {
                                value: grade.id,
                                label: intl.formatMessage({
                                    id: `grade.${grade.name.toLowerCase()}`,
                                }),
                            };
                        })
                    ];
                });

            let optionGradesTmp2 = [];
            optionGradesTmp = optionGradesTmp.filter(option => {
                if(!optionGradesTmp2.some(option2 => option2.value === option.value)){
                    optionGradesTmp2.push(option)
                }
            });

            return optionGradesTmp2;
        })
    }

    // ----------
    // Cập nhật danh sách option cho select bộ môn giảng dạy
    // ----------
    const uploadOptionSubjects = () => {
        setOptionSubjects(optionSubjects => {
            return dataRelevantDataForFormTeacherInfo?.subjects.data
                .filter(subject => {

                    if(!form.getFieldValue('selGrades') || form.getFieldValue('selGrades').length == 0){
                        return false;
                    }

                    let ret = false;
                    subject.gradeIds.map(gradeId => {
                        if(ret || form.getFieldValue('selGrades').includes(gradeId + "") === true){
                            ret = true;
                        }
                    })

                    return ret;
                })
                .map(subject => {
                    return {
                        value: subject.id,
                        label: subject.name,
                    };
                });
        })
    }

    // ----------
    // Xử lý lỗi trả về từ mutation create hoặc update
    // ----------
    useEffect(() => {
        if(error){
            let errorFields = [];
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.phone){
                errorFields.push({
                    name: 'txtPhone',
                    errors: ['Số điện thoại đã tồn tại']
                });
            }
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.email){
                errorFields.push({
                    name: 'txtEmail',
                    errors: ['Email đã tồn tại']
                });
            }
            if(error.graphQLErrors[0]?.extensions?.validation && error.graphQLErrors[0].extensions.validation?.code){
                errorFields.push({
                    name: 'txtCode',
                    errors: ['Mã giáo viên đã tồn tại']
                });
            }

            if(errorFields.length){
                form.setFields(errorFields);
            }

            message.error('Đã có lỗi xảy ra.');
            setIsDisabledButtonSubmit(false);
        }
    }, [error])

    return (
        <div className="form-teacher-info">
            <Form
                form={form}
                colon={false}
                initialValues={{
                    selGender: TEACHER_GENDER[0].value,
                    selStatus: TEACHER_STATUS[0].value,
                }}
                onFinish={(values) => {
                    setIsDisabledButtonSubmit(true);
                    onOk(values);
                }}
            >
                <Row gutter={24}>
                    <Col sm={4}>
                        <UploadImage
                            allowChange={!isOnlyRead}
                            srcInitial={dataTeacher?.avatar || null}
                            onChange={file => {
                                setAvatar(file);
                            }}
                        />
                        <Form.Item
                            className="wrapper-item-status"
                            name="selStatus"
                            label={<FormattedMessage id="teacher.teacher-info-form.select-status.label" />}
                        >
                            <Select
                                placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.select-status.placeholder'})}
                                options={TEACHER_STATUS.map(status => ({
                                    value: status.value,
                                    label: intl.formatMessage({
                                        id: `teacher.status.${status.label.toLowerCase()}`,
                                    }),
                                }))}
                                disabled={isOnlyRead}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={20}>
                        <Row gutter={24}>
                            <Col sm={12}>
                                <Form.Item
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-fullname.label" />}
                                >
                                    <Space align="start">
                                        <Form.Item
                                            name="selGender"
                                            label=""
                                        >
                                            <Select
                                                options={TEACHER_GENDER.map(gender => ({
                                                    value: gender.value,
                                                    label: intl.formatMessage({
                                                        id: `teacher.gender.${gender.label.toLowerCase()}`,
                                                    }),
                                                }))}
                                                disabled={isOnlyRead}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="txtName"
                                            label=""
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
                                                    pattern: /^[\s\p{L}]+$/u,
                                                    message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                                }
                                            ]}
                                        >
                                            <Input placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-fullname.placeholder'})} disabled={isOnlyRead} />
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="dateBirthday"
                                    label={<FormattedMessage id="teacher.teacher-info-form.picker-birthday.label" />}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.picker-birthday.placeholder'})}
                                        style={{width: '100%'}}
                                        showToday={false}
                                        disabledDate={current => {
                                            return current && current >= moment().startOf('day');
                                        }}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtPhone"
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-phone.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                        {
                                            min: 10,
                                            message: 'Thông tin này không được ngắn hơn 10 kí tự'
                                        },
                                        {
                                            max: 30,
                                            message: 'Thông tin này không được dài hơn 30 kí tự'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                let phone = value;
                                                if(phone && phone.length >= 10){
                                                    if(phone.indexOf('+84') === 0){
                                                        phone = "0" + phone.substring(3);
                                                    }
                                                    phone = phone.replaceAll(/[\W]/ig, '');
                                                    if (phone.length < 10) {
                                                        return Promise.reject('Thông tin này không được ngắn hơn 10 kí tự (Không tính các kí tự đặc biệt)');
                                                    }
                                                }

                                                return Promise.resolve();
                                            },
                                        }),
                                        {
                                            pattern: /^[\s0-9\+\.\(\)]+$/u,
                                            message: 'Thông tin này không được chứa chữ cái và các kí tự đặc biệt, ngoại trừ kí tự + . ( )'
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-phone.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtEmail"
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-email.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                        {
                                            type: 'email',
                                            message: 'Thông tin này không đúng định dạng email',
                                        },
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-email.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="txtAddress"
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-address.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                        {
                                            pattern: /^[-\.\s0-9,\/\p{L}]+$/u,
                                            message: 'Thông tin này không được chứa các kí tự đặc biệt, ngoại trừ kí tự - , và /'
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-address.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-code.label" />}
                                >
                                    <Row gutter={10}>
                                        <Col flex="auto">
                                            <Form.Item
                                                name="txtCode"
                                                label=""
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: intl.formatMessage({id: 'validate.required-input'})
                                                    },
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
                                                <Input placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-code.placeholder'})} disabled={isOnlyRead} />
                                            </Form.Item>
                                        </Col>
                                        {!isOnlyRead && (
                                            <Col>
                                                <Form.Item
                                                    className="wrapper-item-code-generate"
                                                    name=""
                                                    label=""
                                                >
                                                    <Button
                                                        type="primary"
                                                        ghost
                                                        loading={loadingTeacherCodeGenerate}
                                                        onClick={() => {
                                                            loadTeacherCodeGenerate();
                                                        }}
                                                    >
                                                        <FormattedMessage id="teacher.teacher-info-form.button-auto-create.label" />
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        )}
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="dateStarted"
                                    label={<FormattedMessage id="teacher.teacher-info-form.picker-date-started.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.picker-date-started.placeholder'})}
                                        style={{width: '100%'}}
                                        picker="year"
                                        disabledDate={current => {
                                            return current && (current >= moment().add(5, 'years').endOf('day') || current <= moment().subtract(45, 'years').startOf('day'));
                                        }}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selCampuses"
                                    label={<FormattedMessage id="teacher.teacher-info-form.select-campus-working.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.select-campus-working.placeholder'})}
                                        options={dataRelevantDataForFormTeacherInfo?.campuses.data.map(campus => {
                                            return {
                                                label: campus.name,
                                                value: campus.id,
                                            }
                                        })}
                                        onChange={updateOptionGrades}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selGrades"
                                    label={<FormattedMessage id="teacher.teacher-info-form.select-grade-teaching.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.select-grade-teaching.placeholder'})}
                                        options={optionGrades}
                                        onChange={(value) => {
                                            uploadOptionSubjects();
                                        }}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selSubjects"
                                    label={<FormattedMessage id="teacher.teacher-info-form.select-subjects-taught.label" />}
                                    rules={[
                                        {
                                            required: true,
                                            message: intl.formatMessage({id: 'validate.required-input'})
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.select-subjects-taught.placeholder'})}
                                        options={optionSubjects}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="selWorkExperience"
                                    label={<FormattedMessage id="teacher.teacher-info-form.select-work-experience.label" />}
                                >
                                    <Select
                                        placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.select-work-experience.placeholder'})}
                                        options={TEACHER_WORK_EXPERIENCE.map(experience => ({
                                            value: experience.value,
                                            label: intl.formatMessage({
                                                id: `teacher.work-experience.${experience.label.toLowerCase()}`,
                                            }),
                                        }))}
                                        disabled={isOnlyRead}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtTrainingDegree"
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-training-degree.label" />}
                                    rules={[
                                        {
                                            max: 30,
                                            message: 'Thông tin này không được dài hơn 30 kí tự'
                                        },
                                        {
                                            pattern: /^[\s0-9\p{L}]+$/u,
                                            message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-training-degree.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={12}>
                                <Form.Item
                                    name="txtTrainingPlace"
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-training-place.label" />}
                                    rules={[
                                        {
                                            max: 30,
                                            message: 'Thông tin này không được dài hơn 30 kí tự'
                                        },
                                        {
                                            pattern: /^[\s0-9\p{L}]+$/u,
                                            message: 'Thông tin này không được chứa số và các kí tự đặc biệt'
                                        }
                                    ]}
                                >
                                    <Input placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-training-place.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="txtNote"
                                    label={<FormattedMessage id="teacher.teacher-info-form.input-note.label" />}
                                    rules={[
                                        {
                                            max: 255,
                                            message: 'Thông tin này không được dài hơn 255 kí tự'
                                        },
                                    ]}
                                >
                                    <Input.TextArea placeholder={intl.formatMessage({id: 'teacher.teacher-info-form.input-note.placeholder'})} disabled={isOnlyRead} />
                                </Form.Item>
                            </Col>
                        </Row>
                        {!isOnlyRead && (
                            <Row>
                                <Col>
                                    <Form.Item
                                        className="wrapper-item-buttons"
                                        label="&nbsp;"
                                    >
                                        <Space>
                                            <Button
                                                type="primary"
                                                ghost
                                                size="large"
                                                onClick={onCancel}
                                            >
                                                <FormattedMessage id="general.cancel" />
                                            </Button>
                                            <Button
                                                htmlType="submit"
                                                type="primary"
                                                size="large"
                                                disabled={isDisabledButtonSubmit}
                                            >
                                                <FormattedMessage id="general.save" />
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default FormTeacherInfo;
