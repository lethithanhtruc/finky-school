import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormStationInfo from "./FormStationInfo";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {STATION_CREATE} from "./gql";
import {message} from "antd";
import {useHistory} from "react-router-dom";
import './Create.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Create = () => {
    const intl = useIntl();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const [stationCreate, { loading: loadingStationCreate, error: errorStationCreate, data: dataStationCreate }] = useMutation(STATION_CREATE);
    useEffect(() => {
        if(!loadingStationCreate && errorStationCreate){
            // ...
        }else if(!loadingStationCreate && dataStationCreate){
            history.push('/station');
            message.success(intl.formatMessage({id: 'station.message.added-station-successfully'}));
        }
    }, [loadingStationCreate, errorStationCreate, dataStationCreate])

    const submitForm = (values, registerStudentIds) => {
        let input = {
            name: values.txtName,
            code: values.txtCode,
            status: values.selStatus,
            gmapAddress: values.txtGmapAddress,
            gmapPlaceId: values.txtGmapPlaceId,
            gmapRaw: values.txtGmapRaw,
        };
        if(values.dateFrom){
            input.from = moment(values.dateFrom).format('YYYY-MM-DD');
        }
        if(values.dateTo){
            input.to = moment(values.dateTo).format('YYYY-MM-DD');
        }
        if(values.txtNote){
            input.note = values.txtNote;
        }
        if(registerStudentIds){
            input.registerStudents = registerStudentIds;
        }
        /*if(avatar){
            input.avatar = avatar;
        }*/
        stationCreate({
            variables: {
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };

    return (
        <div className="station-create-page">
            <PageHeader title={<FormattedMessage id="station.station-info-form.add-title" />} />
            <Block>
                <FormStationInfo
                    setAvatar={setAvatar}
                    onCancel={() => history.push('/station')}
                    onOk={submitForm}
                    error={errorStationCreate}
                />
            </Block>
        </div>
    );
}

export default Create;
