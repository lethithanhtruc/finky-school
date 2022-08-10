import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormScheduleInfo from "./FormScheduleInfo";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {SCHEDULE_CREATE} from "./gql";
import {message} from "antd";
import {useHistory} from "react-router-dom";
import './Create.scss';
import {FormattedMessage, useIntl} from "react-intl";

const Create = () => {
    const intl = useIntl();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const [scheduleCreate, { loading: loadingScheduleCreate, error: errorScheduleCreate, data: dataScheduleCreate }] = useMutation(SCHEDULE_CREATE);
    useEffect(() => {
        if(!loadingScheduleCreate && errorScheduleCreate){
            // ...
        }else if(!loadingScheduleCreate && dataScheduleCreate){
            history.push('/schedule');
            message.success(intl.formatMessage({id: 'schedule.message.added-schedule-successfully'}));
        }
    }, [loadingScheduleCreate, errorScheduleCreate, dataScheduleCreate])

    const submitForm = (values) => {
        let input = {
            name: values.txtName,
            code: values.txtCode,
            campusId: values.selCampus,
        };
        if(values.selTurnAwayVehicle){
            input.turnAwayVehicleId = values.selTurnAwayVehicle;
        }
        if(values.selTurnAwayDriver){
            input.turnAwayDriverId = values.selTurnAwayDriver;
        }
        if(values.selTurnAwayNanny){
            input.turnAwayNannyId = values.selTurnAwayNanny;
        }
        if(values.txtTurnAwayDescription){
            input.turnAwayDescription = values.txtTurnAwayDescription;
        }
        if(values.selTurnBackVehicle){
            input.turnBackVehicleId = values.selTurnBackVehicle;
        }
        if(values.selTurnBackDriver){
            input.turnBackDriverId = values.selTurnBackDriver;
        }
        if(values.selTurnBackNanny){
            input.turnBackNannyId = values.selTurnBackNanny;
        }
        if(values.txtTurnBackDescription){
            input.turnBackDescription = values.txtTurnBackDescription;
        }
        if(values.stationsInSchoolYearForTurnAway || values.stationsInSchoolYearForTurnBack){
            let stationsInSchoolYear = [];
            stationsInSchoolYear = values.stationsInSchoolYearForTurnAway
                .map((station, index) => ({
                    // stationId: station.selStation ? parseInt(station.selStation.value) : null,
                    stationId: station.selStation ? parseInt(station.selStation) : null,
                    turn: 'TURN_AWAY',
                    sort: index + 1,
                    morningAt: station.pickerMorning ? station.pickerMorning.format('HH:mm') : null,
                    afternoonAt: station.pickerAfternoon ? station.pickerAfternoon.format('HH:mm') : null,
                }))
                .filter(station => station.stationId);
            stationsInSchoolYear = [
                ...stationsInSchoolYear,
                ...values.stationsInSchoolYearForTurnBack
                    .map((station, index) => ({
                        // stationId: station.selStation ? parseInt(station.selStation.value) : null,
                        stationId: station.selStation ? parseInt(station.selStation) : null,
                        turn: 'TURN_BACK',
                        sort: index + 1,
                        morningAt: station.pickerMorning ? station.pickerMorning.format('HH:mm') : null,
                        afternoonAt: station.pickerAfternoon ? station.pickerAfternoon.format('HH:mm') : null,
                    }))
                    .filter(station => station.stationId)
            ];
            // console.log('stationsInSchoolYearstationsInSchoolYearstationsInSchoolYear', values.stationsInSchoolYearForTurnAway, stationsInSchoolYear)
            input.stationsInSchoolYear = stationsInSchoolYear;
        }
        scheduleCreate({
            variables: {
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };

    return (
        <div className="schedule-create-page">
            <PageHeader title={<FormattedMessage id="schedule.schedule-info-form.add-title" />} />
            <div>
                <FormScheduleInfo
                    setAvatar={setAvatar}
                    onCancel={() => history.push('/schedule')}
                    onOk={submitForm}
                    error={errorScheduleCreate}
                />
            </div>
        </div>
    );
}

export default Create;
