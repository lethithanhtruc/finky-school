import React, { useCallback } from 'react';
import { FormattedMessage } from "react-intl";
import { useLazyQuery, useMutation } from "@apollo/client";

import PageHeader from "../../components/Layout/PageHeader";

import { CSS_PREFIX } from './constants';

import FilterForm from './FilterForm';
import DataView from './DataView';
import { LOAD_DEVICES, DOWNLOAD_MUTATION } from './gql';
import { SEARCH_BY } from './constants';

import { downloadLink } from '../../utils/http';
import { useFactilityContext } from '../../components/Common/FacilitiesSelect/context';

import './style.scss';

const Device = () => {
    const { loading: campusLoading } = useFactilityContext();
    const [loadDevices, { loading: searchLoading, data: searchData, fetchMore, refetch }] = useLazyQuery(LOAD_DEVICES, {
        notifyOnNetworkStatusChange: true
    });

    const [getDownloadLink, { loading: downloadLoading, data: downloadData }] = useMutation(DOWNLOAD_MUTATION);

    const getVariables = useCallback((filterData) => {
        const variables = {
            filter: {}
        }
        if (filterData.campusId) {
            variables.filter.campusId = Number(filterData.campusId);
        }
        if (!(filterData.type === "ALL")) {
            variables.filter.type = filterData.type;
        }
        if (filterData.device) {
            variables.filter.withKeyword = {
                keyword: filterData.device,
                targets: SEARCH_BY
            };
        }
        return variables;
    }, []);

    const handleOnSearch = useCallback((filterData) => {
        loadDevices({ variables: getVariables(filterData) });
    }, [loadDevices, getVariables]);

    const handleOnDownload = useCallback((filterData) => {
        getDownloadLink({ variables: getVariables(filterData) })
        .then((response) => {
            downloadLink(response?.data?.camerasExport?.url);
        }).catch(({ graphQLErrors }) => {
            console.error(graphQLErrors);
        });;
    }, [getDownloadLink, getVariables]);

    const handleRefetch = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <div className={CSS_PREFIX}>
            <PageHeader title={<FormattedMessage id="deviceManagement.view.title" />} />
            <FilterForm
                onSearch={handleOnSearch}
                searchLoading={searchLoading}
                onDownload={handleOnDownload}
                downloadLoading={downloadLoading}
                downloadData={downloadData}
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

export default Device;
