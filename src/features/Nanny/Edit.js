import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormNannyInfo from "./FormNannyInfo";
import moment from "moment";
import {useMutation, useQuery} from "@apollo/client";
import {NANNY_UPDATE, LOAD_NANNY} from "./gql";
import {message} from "antd";
import {useHistory, useParams} from "react-router-dom";
import './Edit.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Edit = () => {
    const intl = useIntl();
    let { nannyId } = useParams();
    if(nannyId){
        nannyId = parseInt(nannyId);
    }

    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const { loading: loadingNanny, error: errorNanny, data: dataNanny, refetch: refetchNanny } = useQuery(LOAD_NANNY, {
        variables: {
            id: nannyId
        }
    });

    const [nannyUpdate, { loading: loadingNannyUpdate, error: errorNannyUpdate, data: dataNannyUpdate }] = useMutation(NANNY_UPDATE);
    useEffect(() => {
        if(!loadingNannyUpdate && errorNannyUpdate){
            // ...
        }else if(!loadingNannyUpdate && dataNannyUpdate){
            history.push('/nanny');
            message.success(intl.formatMessage({id: 'nanny.message.edited-nanny-successfully'}));
        }
    }, [loadingNannyUpdate, errorNannyUpdate, dataNannyUpdate])

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
        nannyUpdate({
            variables: {
                "id": dataNanny.nanny.key,
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="nanny-edit-page">
            <PageHeader title={<FormattedMessage id="nanny.nanny-info-form.edit-title" />} />
            <Block>
                {dataNanny && (
                    <FormNannyInfo
                        setAvatar={setAvatar}
                        dataNanny={dataNanny.nanny}
                        onCancel={() => history.push('/nanny')}
                        onOk={submitForm}
                        error={errorNannyUpdate}
                    />
                )}
            </Block>
        </div>
    );
}

export default Edit;
