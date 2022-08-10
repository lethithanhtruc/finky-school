import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import { useLazyQuery } from "@apollo/client";

import { GET_SCHOOL_YEAR_RANGE } from '../gql';
import DatePicker from "../../../components/Common/DatePicker/EditDatePicker";

const EditDatePicker = ({id, selectText, ...rest }) => {
    const [loadSchoolYear, { loading, data }] = useLazyQuery(GET_SCHOOL_YEAR_RANGE);

    useEffect(() => {
        loadSchoolYear({
            variables: {
                numberOfYear: 1
            }
        });
    }, [loadSchoolYear]);

    const disabledTime = useCallback((current) => {
        if (data?.schoolyearTimeRange) {
            const { startAt, endAt } = data?.schoolyearTimeRange;
            if (current) {
                return current <= moment(startAt).endOf('day') || current >= moment(endAt).endOf('day');
            }
            
        }
        return null;
    }, [data]);

    console.log(rest)
    return (
        <DatePicker
            {...rest}
            disabledDate={disabledTime}
            loading={loading}
        />
    )
}

export default EditDatePicker;