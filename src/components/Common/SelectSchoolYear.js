import React, {useState, useEffect} from 'react';
import {Button, Select} from "antd";
import './SelectSchoolYear.scss';
import {useQuery} from "@apollo/client";
import {LOAD_SCHOOLYEARS} from "./gql";
import {FormattedMessage} from "react-intl";
import {
    CalendarOutlined,
} from '@ant-design/icons';

const SelectSchoolYear = ({label, onChange}) => {
    const [selectedSchoolyearId, setSelectedSchoolyearId] = useState(null);

    const { loading, error, data } = useQuery(LOAD_SCHOOLYEARS);
    useEffect(() => {
        if(loading === false && data){
            // console.log(data)
            const schoolyearCurrent = data.schoolyears.data.filter(schoolyear => parseInt(schoolyear.endAt.substring(0, 4)) === new Date().getFullYear());
            setSelectedSchoolyearId(schoolyearCurrent[0].id);
        }
    }, [loading, data]);

    useEffect(() => {
        onChange(selectedSchoolyearId);
    }, [selectedSchoolyearId]);

    return (
        <div className="wrapper-select-schoolyear">
            <label><FormattedMessage id={label ? label : "school-year"} />: </label>
            <Select
                suffixIcon={<CalendarOutlined style={{fontSize: 17}} />}
                value={selectedSchoolyearId}
                options={data?.schoolyears.data.map(schoolyear => ({
                    value: schoolyear.id,
                    label: schoolyear.name,
                }))}
                onChange={(value) => {
                    setSelectedSchoolyearId(value);
                }}
            />
        </div>
    );
}

export default SelectSchoolYear;
