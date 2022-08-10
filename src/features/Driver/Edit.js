import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormDriverInfo from "./FormDriverInfo";
import moment from "moment";
import {useMutation, useQuery} from "@apollo/client";
import {DRIVER_UPDATE, LOAD_DRIVER} from "./gql";
import {message} from "antd";
import {useHistory, useParams} from "react-router-dom";
import './Edit.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Edit = () => {
    const intl = useIntl();
    let { driverId } = useParams();
    if(driverId){
        driverId = parseInt(driverId);
    }

    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const { loading: loadingDriver, error: errorDriver, data: dataDriver, refetch: refetchDriver } = useQuery(LOAD_DRIVER, {
        variables: {
            id: driverId
        }
    });

    const [driverUpdate, { loading: loadingDriverUpdate, error: errorDriverUpdate, data: dataDriverUpdate }] = useMutation(DRIVER_UPDATE);
    useEffect(() => {
        if(!loadingDriverUpdate && errorDriverUpdate){
            // ...
        }else if(!loadingDriverUpdate && dataDriverUpdate){
            history.push('/driver');
            message.success(intl.formatMessage({id: 'driver.message.edited-driver-successfully'}));
        }
    }, [loadingDriverUpdate, errorDriverUpdate, dataDriverUpdate])

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
        driverUpdate({
            variables: {
                "id": dataDriver.driver.key,
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="driver-edit-page">
            <PageHeader title={<FormattedMessage id="driver.driver-info-form.edit-title" />} />
            <Block>
                {dataDriver && (
                    <FormDriverInfo
                        setAvatar={setAvatar}
                        dataDriver={dataDriver.driver}
                        onCancel={() => history.push('/driver')}
                        onOk={submitForm}
                        error={errorDriverUpdate}
                    />
                )}
            </Block>
        </div>
    );
}

export default Edit;
