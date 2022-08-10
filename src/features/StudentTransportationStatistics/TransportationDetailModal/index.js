import React, { useEffect } from 'react';
import { useLazyQuery } from "@apollo/client";
import { Modal } from 'antd';
import { CSS_PREFIX } from '../constants';
import { LOAD_SCHEDULE_STATION_LOGS } from '../gql';
import isEmpty from 'lodash/isEmpty';
import { useIntl} from "react-intl";

import CarInformation from './CarInformation';
import Students from './Students';
import TransportPlaces from './TransportPlaces';

import './style.scss';

const TransportationDetailModal = ({
    rowData,
    visible,
    onCancel,
    title,
    className,
    ...rest
}) => {
    const intl = useIntl();
    const [loadScheduleStation, {loading: scheduleStationLoading, data: scheduleStationData }] = useLazyQuery(LOAD_SCHEDULE_STATION_LOGS, {
        notifyOnNetworkStatusChange: true
    });

    useEffect(() => {
        if (!isEmpty(rowData)) {
            loadScheduleStation({
                variables: {
                    filter: {
                        scheduleLogId: Number(rowData?.id),
                    }
                }
            });
        }
    }, [rowData, loadScheduleStation])
    return (
        <Modal
            {...rest}
            key={`${visible}`}
            className={`${CSS_PREFIX}__detail-modal || ${className || ''}`}
            title={`${intl.formatMessage({
                id: 'student.transportation.statistic.carDetail.vehicle',
            })}: ${rowData?.vehicle?.licensePlate}`}
            visible={visible}
            footer={null}
            onCancel={onCancel}
            width={1200}
            centered
        >

            <div className="modal-detail">
                <div className="modal-detail--left">
                    <CarInformation carInformation={rowData} />
                    <TransportPlaces loading={scheduleStationLoading} data={scheduleStationData?.scheduleStationLogs} />
                </div>
                <Students loading={scheduleStationLoading} data={scheduleStationData?.scheduleStationLogs} className="modal-detail--right" />
            </div>
        </Modal>
    );
}

export default TransportationDetailModal;
