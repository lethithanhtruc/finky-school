import React from 'react';
import { useIntl} from "react-intl";

const CarInformation = ({ carInformation = {} }) => {
    const intl = useIntl();
    return (
        <div className="car-information">
            <div className="car-information__title">
                {intl.formatMessage({
                    id: 'student.transportation.statistic.carDetail.title',
                })}
            </div>
            <div className="car-information__body">
                <div className="car-information__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.carDetail.roadName',
                    })}:
                </div>
                <div className="car-information__value">{carInformation?.schedule?.name}</div>
            </div>
            <div className="car-information__body">
                <div className="car-information__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.carDetail.driverName',
                    })}:
                </div>
                <div className="car-information__value">{carInformation?.driver?.name}</div>
            </div>
            <div className="car-information__body">
                <div className="car-information__label">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.carDetail.babySisterName',
                    })}:
                </div>
                <div className="car-information__value">{carInformation?.nanny?.name}</div>
            </div>
        </div>
    );
}

export default CarInformation;
