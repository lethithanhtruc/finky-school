import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormStudentInfo from "./FormStudentInfo";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {STUDENT_CREATE} from "./gql";
import {message} from "antd";
import {useHistory} from "react-router-dom";
import './Create.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Create = () => {
    const intl = useIntl();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    // ----------
    // Mutation thêm Học sinh và xử lý kết quả trả về từ API
    // ----------
    const [studentCreate, { loading: loadingStudentCreate, error: errorStudentCreate, data: dataStudentCreate }] = useMutation(STUDENT_CREATE);
    useEffect(() => {
        if(!loadingStudentCreate && errorStudentCreate){
            // ...
        }else if(!loadingStudentCreate && dataStudentCreate){
            history.push('/student');
            message.success(intl.formatMessage({id: 'student.message.added-student-successfully'}));
        }
    }, [loadingStudentCreate, errorStudentCreate, dataStudentCreate])

    // ----------
    // Xử lý submit form
    // ----------
    const submitForm = (values) => {
        // console.log(values)
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

        if(parentages.length){
            let input = {
                parentages:{
                    create: parentages
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
            studentCreate({
                variables: {
                    "input": input
                },
            }).catch ((e) => {
                // console.log(e.graphQLErrors)
            });
        }
    };
    return (
        <div className="student-create-page">
            <PageHeader title={<FormattedMessage id="student.profile" />} />
            <Block
                title={<FormattedMessage id="student.student-info-form.title" />}
            >
                <FormStudentInfo
                    setAvatar={setAvatar}
                    onCancel={() => history.push('/student')}
                    onOk={submitForm}
                    error={errorStudentCreate}
                />
            </Block>
        </div>
    );
}

export default Create;
