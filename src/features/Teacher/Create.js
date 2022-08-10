import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormTeacherInfo from "./FormTeacherInfo";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {TEACHER_CREATE} from "./gql";
import {message} from "antd";
import {useHistory} from "react-router-dom";
import './Create.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Create = () => {
    const intl = useIntl();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    // ----------
    // Mutation thêm Giáo viên và xử lý kết quả trả về từ API
    // ----------
    const [teacherCreate, { loading: loadingTeacherCreate, error: errorTeacherCreate, data: dataTeacherCreate }] = useMutation(TEACHER_CREATE);
    useEffect(() => {
        if(!loadingTeacherCreate && dataTeacherCreate){
            history.push('/teacher');
            message.success(intl.formatMessage({id: 'teacher.message.added-teacher-successfully'}));
        }
    }, [loadingTeacherCreate, errorTeacherCreate, dataTeacherCreate])

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
                }))
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

        teacherCreate({
            variables: {
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="teacher-create-page">
            <PageHeader title={<FormattedMessage id="teacher.teacher-info-form.add-title" />} />
            <Block
                title={<FormattedMessage id="teacher.teacher-info-form.teacher-info" />}
            >
                <FormTeacherInfo
                    setAvatar={setAvatar}
                    onCancel={() => history.push('/teacher')}
                    onOk={submitForm}
                    error={errorTeacherCreate}
                />
            </Block>
        </div>
    );
}

export default Create;
