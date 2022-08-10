import React from 'react';
import Table from "../../../components/Common/Table";
import { useIntl} from "react-intl";

import { studentColumns } from './columns';

const Students = ({ className, data = [], loading }) => {
    const intl = useIntl();
    console.log(data)
    const combineData = data.reduce((accom, currentValue) => {
        const station = currentValue.station;
        const studentsDone = (currentValue.studentsDone || []).map(i => ({...i, station}))
        return [...accom, ...(studentsDone)];
    }, []).filter(d => d);
    return (
        <div className={`students ${className}`}>
            <div className="students__title">
                {intl.formatMessage({
                    id: 'student.transportation.statistic.students.title',
                })}
            </div>
            <div className="students__data-list">
                <Table
                    scroll={{
                        y: 470
                    }}
                    yScroll
                    loading={loading}
                    columns={studentColumns(intl)}
                    dataSource={combineData}
                    pagination={false}
                />
            </div>
        </div>
    );
}

export default Students;
