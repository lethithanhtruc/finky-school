import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormDriverInfo from "./FormDriverInfo";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {DRIVER_CREATE} from "./gql";
import {message} from "antd";
import {useHistory} from "react-router-dom";
import './Create.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Create = () => {
    const intl = useIntl();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const [driverCreate, { loading: loadingDriverCreate, error: errorDriverCreate, data: dataDriverCreate }] = useMutation(DRIVER_CREATE);
    useEffect(() => {
        if(!loadingDriverCreate && errorDriverCreate){
            // ...
        }else if(!loadingDriverCreate && dataDriverCreate){
            history.push('/driver');
            message.success(intl.formatMessage({id: 'driver.message.added-driver-successfully'}));
        }
    }, [loadingDriverCreate, errorDriverCreate, dataDriverCreate])

    const submitForm = (values) => {
        let input = {
            campusId: values.selCampus,
            name: values.txtName,
            code: values.txtCode,
            gender: values.radGender,
            phone: values.txtPhone,
            address: values.txtAddress,
            licenseType: values.selLicenseType,
            status: values.selStatus,
        };
        if(values.dateBirthday){
            input.birthday = moment(values.dateBirthday).format('YYYY-MM-DD');
        }
        if(values.selProvinceOfBirth){
            input.provinceIdOfBirth = parseInt(values.selProvinceOfBirth);
        }
        if(values.dateIssue){
            input.dateOfIssue = moment(values.dateIssue).format('YYYY-MM-DD');
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
        driverCreate({
            variables: {
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };

    return (
        <div className="driver-create-page">
            <PageHeader title={<FormattedMessage id="driver.driver-info-form.add-title" />} />
            <Block>
                <FormDriverInfo
                    setAvatar={setAvatar}
                    onCancel={() => history.push('/driver')}
                    onOk={submitForm}
                    error={errorDriverCreate}
                />
            </Block>
        </div>
    );
}

export default Create;
