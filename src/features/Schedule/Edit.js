import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import Block from "../../components/Common/Block";
import FormScheduleInfo from "./FormScheduleInfo";
import moment from "moment";
import {useMutation, useQuery} from "@apollo/client";
import {SCHEDULE_UPDATE, LOAD_SCHEDULE} from "./gql";
import {message} from "antd";
import {useHistory, useParams} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";

const Edit = () => {
    const intl = useIntl();
    let { scheduleId } = useParams();
    if(scheduleId){
        scheduleId = parseInt(scheduleId);
    }

    const history = useHistory();
    const [avatar, setAvatar] = useState(null);

    const { loading: loadingSchedule, error: errorSchedule, data: dataSchedule, refetch: refetchSchedule } = useQuery(LOAD_SCHEDULE, {
        variables: {
            id: scheduleId
        }
    });

    const [scheduleUpdate, { loading: loadingScheduleUpdate, error: errorScheduleUpdate, data: dataScheduleUpdate }] = useMutation(SCHEDULE_UPDATE);
    useEffect(() => {
        if(!loadingScheduleUpdate && errorScheduleUpdate){
            // ...
        }else if(!loadingScheduleUpdate && dataScheduleUpdate){
            history.push('/schedule');
            message.success(intl.formatMessage({id: 'schedule.message.edited-schedule-successfully'}));
        }
    }, [loadingScheduleUpdate, errorScheduleUpdate, dataScheduleUpdate])

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
            input.stationsInSchoolYear = stationsInSchoolYear;
        }
        scheduleUpdate({
            variables: {
                "id": dataSchedule.schedule.key,
                "input": input
            },
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };
    return (
        <div className="schedule-create-page">
            <PageHeader title={<FormattedMessage id="schedule.schedule-info-form.edit-title" />} />
            <div>
                {dataSchedule && (
                    <FormScheduleInfo
                        setAvatar={setAvatar}
                        dataSchedule={dataSchedule.schedule}
                        onCancel={() => history.push('/schedule')}
                        onOk={submitForm}
                        error={errorScheduleUpdate}
                    />
                )}
            </div>
        </div>
    );
}

export default Edit;
