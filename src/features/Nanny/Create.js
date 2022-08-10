import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormNannyInfo from "./FormNannyInfo";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {NANNY_CREATE} from "./gql";
import {message} from "antd";
import {useHistory} from "react-router-dom";
import './Create.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Create = () => {
    const intl = useIntl();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const [nannyCreate, { loading: loadingNannyCreate, error: errorNannyCreate, data: dataNannyCreate }] = useMutation(NANNY_CREATE);
    useEffect(() => {
        if(!loadingNannyCreate && errorNannyCreate){
            // ...
        }else if(!loadingNannyCreate && dataNannyCreate){
            history.push('/nanny');
            message.success(intl.formatMessage({id: 'nanny.message.added-nanny-successfully'}));
        }
    }, [loadingNannyCreate, errorNannyCreate, dataNannyCreate])

    const submitForm = (values) => {
        let input = {
            campusId: values.selCampus,
            name: values.txtName,
            code: values.txtCode,
            gender: values.radGender,
            phone: values.txtPhone,
            address: values.txtAddress,
            status: values.selStatus,
        };
        if(values.dateBirthday){
            input.birthday = moment(values.dateBirthday).format('YYYY-MM-DD');
        }
        if(values.selProvinceOfBirth){
            input.provinceIdOfBirth = parseInt(values.selProvinceOfBirth);
        }
        if(values.txtProvider){
            input.provider = values.txtProvider;
        }
        if(values.txtNote){
            input.note = values.txtNote;
        }
        if(avatar){
            input.avatar = avatar;
        }
        nannyCreate({
            variables: {
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="nanny-create-page">
            <PageHeader title={<FormattedMessage id="nanny.nanny-info-form.add-title" />} />
            <Block>
                <FormNannyInfo
                    setAvatar={setAvatar}
                    onCancel={() => history.push('/nanny')}
                    onOk={submitForm}
                    error={errorNannyCreate}
                />
            </Block>
        </div>
    );
}

export default Create;
