import React from 'react';
import Table from "../../../components/Common/Table";
import { useIntl} from "react-intl";

import { transportPlaceColumns } from './columns';

const TransportPlaces = ({ data, loading }) => {
    const intl = useIntl();
    return (
        <div className="transport-places">
            <div className="transport-places__title">
                {intl.formatMessage({
                    id: 'student.transportation.statistic.transportPlaces.title',
                })}
            </div>
            <div className="transport-places__data-list">
                <Table
                    scroll={{
                        y: 310
                    }}
                    loading={loading}
                    columns={transportPlaceColumns(intl)}
                    dataSource={data}
                    pagination={false}
                />
            </div>
        </div>
    );
}

export default TransportPlaces;
