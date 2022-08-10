import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormVehicleInfo from "./FormVehicleInfo";
import moment from "moment";
import {useMutation, useQuery} from "@apollo/client";
import {VEHICLE_UPDATE, LOAD_VEHICLE} from "./gql";
import {message} from "antd";
import {useHistory, useParams} from "react-router-dom";
import './Edit.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Edit = () => {
    const intl = useIntl();
    let { vehicleId } = useParams();
    if(vehicleId){
        vehicleId = parseInt(vehicleId);
    }

    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const { loading: loadingVehicle, error: errorVehicle, data: dataVehicle, refetch: refetchVehicle } = useQuery(LOAD_VEHICLE, {
        variables: {
            id: vehicleId
        }
    });

    const [vehicleUpdate, { loading: loadingVehicleUpdate, error: errorVehicleUpdate, data: dataVehicleUpdate }] = useMutation(VEHICLE_UPDATE);
    useEffect(() => {
        if(!loadingVehicleUpdate && dataVehicleUpdate){
            history.push('/vehicle');
            message.success(intl.formatMessage({id: 'vehicle.message.edited-vehicle-successfully'}));
        }
    }, [loadingVehicleUpdate, errorVehicleUpdate, dataVehicleUpdate])

    const submitForm = (values) => {
        let input = {
            campusId: values.selCampus,
            licensePlate: values.txtLicensePlate,
            seatNumber: parseInt(values.txtSeatNumber),
        };
        if(values.txtBrand){
            input.brand = values.txtBrand;
        }
        if(values.txtVersion){
            input.version = values.txtVersion;
        }
        if(values.txtColor){
            input.color = values.txtColor;
        }
        if(values.txtOwnerName){
            input.ownerName = values.txtOwnerName;
        }
        if(values.txtOwnerPhone){
            input.ownerPhone = values.txtOwnerPhone;
        }
        if(values.txtOwnerEmail){
            input.ownerEmail = values.txtOwnerEmail;
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
        vehicleUpdate({
            variables: {
                "id": dataVehicle.vehicle.key,
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="vehicle-edit-page">
            <PageHeader title={<FormattedMessage id="vehicle.vehicle-info-form.edit-title" />} />
            <Block>
                {dataVehicle && (
                    <FormVehicleInfo
                        setAvatar={setAvatar}
                        dataVehicle={dataVehicle.vehicle}
                        onCancel={() => history.push('/vehicle')}
                        onOk={submitForm}
                        error={errorVehicleUpdate}
                    />
                )}
            </Block>
        </div>
    );
}

export default Edit;
