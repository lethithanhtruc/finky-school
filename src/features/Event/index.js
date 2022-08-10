import React, { useCallback } from 'react';
import { FormattedMessage } from "react-intl";
import { useLazyQuery } from "@apollo/client";

import PageHeader from "../../components/Layout/PageHeader";

import { CSS_PREFIX } from './constants';

import FilterForm from './FilterForm';
import DataView from './DataView';
import { LOAD_EVENTS } from './gql';
import { SEARCH_BY } from './constants';

import { useFactilityContext } from '../../components/Common/FacilitiesSelect/context';

import './style.scss';

const Event = () => {
    const { loading: campusLoading } = useFactilityContext();
    const [loadEvents, { loading: searchLoading, data: searchData, fetchMore, refetch }] = useLazyQuery(LOAD_EVENTS, {
        notifyOnNetworkStatusChange: true,
    });

    const getVariables = useCallback((filterData) => {
        const variables = {
            filter: {}
        }
        if (filterData.status) {
            variables.filter.status = filterData.status;
        }
        if (filterData.campusId) {
            variables.filter.campusId = Number(filterData.campusId);
        }
        
        if (filterData.event) {
            if (!(filterData.type === "ALL")) {
                variables.filter.withKeyword = {
                    keyword: filterData.event,
                    targets: [filterData.type]
                };
            } else {
                variables.filter.withKeyword = {
                    keyword: filterData.event,
                    targets: SEARCH_BY
                };
            }
        }
        return variables;
    }, []);

    const handleOnSearch = useCallback((filterData) => {
        loadEvents({ variables: getVariables(filterData) });
    }, [loadEvents, getVariables]);

    const handleRefetch = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <div className={CSS_PREFIX}>
            <PageHeader title={<FormattedMessage id="event.view.title" />} />
            <FilterForm
                onSearch={handleOnSearch}
                searchLoading={searchLoading}
            />
            <DataView
                handleRefetch={handleRefetch}
                loading={searchLoading || campusLoading}
                data={searchData}
                fetchMore={fetchMore}
            />
        </div>
    );
}

export default Event;
