import React, { useState, useEffect } from 'react';
import { useLazyQuery } from "@apollo/client";
import { Divider } from 'antd';
import { FormattedMessage } from "react-intl";
import isEmpty from 'lodash/isEmpty';

import PageHeader from "../../components/Layout/PageHeader";
import Panel from "../../components/Common/Panel";

import { CSS_PREFIX } from './constants';

import FilterForm from './FilterForm';
import StatisticBanner from './StatisticBanner';
import DataView from './DataView';

import { MORNING_GOOUT } from './constants';

import { LOAD_SCHEDULE_LOGS, LOAD_SCHEDULE_LOGS_STATISTIC } from './gql';

import './style.scss';

const StudentTransportationStatistics = () => {
    const [activeTab, setActiveTab] = useState(MORNING_GOOUT);
    const [filterData, setFilterData] = useState({});

    const [loadScheduleLog, { loading: scheduleLogLoading, data: scheduleLogData, fetchMore: scheduleLogFetchMore }] = useLazyQuery(LOAD_SCHEDULE_LOGS, {
        notifyOnNetworkStatusChange: true
    });

    const [loadStatistic, { loading: statisticLoading, data: statisticData }] = useLazyQuery(LOAD_SCHEDULE_LOGS_STATISTIC, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    });

    useEffect(() => {
        if (!isEmpty(filterData)) {
            loadScheduleLog({
                variables: {
                    filter: filterData
                }
            });
        }
    }, [filterData, loadScheduleLog]);

    useEffect(() => {
        if (!isEmpty(filterData)) {
            loadStatistic({
                variables: {
                    filter: filterData
                }
            })
        }
    }, [filterData, loadStatistic]);

    return (
        <div className={CSS_PREFIX}>
            <PageHeader title={<FormattedMessage id="student.transportation.statistic.index.title" />} />
            <FilterForm activeTab={activeTab} setActiveTab={setActiveTab} setFilterData={setFilterData}/>
            <Panel className="data-view__panel">
                <StatisticBanner loading={statisticLoading} data={statisticData?.scheduleLogsStatistic} activeTab={activeTab} />
                <Divider style={{ marginTop: 16 }}/>
                <DataView
                    activeTab={activeTab}
                    loading={scheduleLogLoading}
                    data={scheduleLogData?.scheduleLogs?.data}
                    paginatorInfo={scheduleLogData?.scheduleLogs?.paginatorInfo}
                    fetchMore={scheduleLogFetchMore}
                />
            </Panel>
        </div>
    );
}

export default StudentTransportationStatistics;
