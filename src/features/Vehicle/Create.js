import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormVehicleInfo from "./FormVehicleInfo";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {VEHICLE_CREATE} from "./gql";
import {message} from "antd";
import {useHistory} from "react-router-dom";
import './Create.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Create = () => {
    const intl = useIntl();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const [vehicleCreate, { loading: loadingVehicleCreate, error: errorVehicleCreate, data: dataVehicleCreate }] = useMutation(VEHICLE_CREATE);
    useEffect(() => {
        if(!loadingVehicleCreate && dataVehicleCreate){
            history.push('/vehicle');
            message.success(intl.formatMessage({id: 'vehicle.message.added-vehicle-successfully'}));
        }
    }, [loadingVehicleCreate, errorVehicleCreate, dataVehicleCreate])

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
        vehicleCreate({
            variables: {
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="vehicle-create-page">
            <PageHeader title={<FormattedMessage id="vehicle.vehicle-info-form.add-title" />} />
            <Block>
                <FormVehicleInfo
                    setAvatar={setAvatar}
                    onCancel={() => history.push('/vehicle')}
                    onOk={submitForm}
                    error={errorVehicleCreate}
                />
            </Block>
        </div>
    );
}

export default Create;
