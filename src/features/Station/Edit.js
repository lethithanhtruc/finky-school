import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormStationInfo from "./FormStationInfo";
import moment from "moment";
import {useMutation, useQuery} from "@apollo/client";
import {STATION_UPDATE, LOAD_STATION} from "./gql";
import {message} from "antd";
import {useHistory, useParams} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";

const Edit = () => {
    const intl = useIntl();
    let { stationId } = useParams();
    if(stationId){
        stationId = parseInt(stationId);
    }

    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const { loading: loadingStation, error: errorStation, data: dataStation, refetch: refetchStation } = useQuery(LOAD_STATION, {
        variables: {
            id: stationId
        }
    });

    const [stationUpdate, { loading: loadingStationUpdate, error: errorStationUpdate, data: dataStationUpdate }] = useMutation(STATION_UPDATE);
    useEffect(() => {
        if(!loadingStationUpdate && errorStationUpdate){
            // ...
        }else if(!loadingStationUpdate && dataStationUpdate){
            history.push('/station');
            message.success(intl.formatMessage({id: 'station.message.edited-station-successfully'}));
        }
    }, [loadingStationUpdate, errorStationUpdate, dataStationUpdate])

    const submitForm = (values, registerStudentIds) => {
        let input = {
            name: values.txtName,
            code: values.txtCode,
            // address: values.txtAddress,
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
        stationUpdate({
            variables: {
                "id": dataStation.station.key,
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="station-create-page">
            <PageHeader title={<FormattedMessage id="station.station-info-form.edit-title" />} />
            <Block>
                {dataStation && (
                    <FormStationInfo
                        setAvatar={setAvatar}
                        dataStation={dataStation.station}
                        onCancel={() => history.push('/station')}
                        onOk={submitForm}
                        error={errorStationUpdate}
                    />
                )}
            </Block>
        </div>
    );
}

export default Edit;
