import React, { useState } from 'react';
import { useIntl} from "react-intl";

import TransportationDetailModal from '../TransportationDetailModal';
import PaginationTable from "../../../components/Common/PaginationTable";
import Table from "../../../components/Common/Table";
import { CSS_PREFIX } from '../constants';
import { columns } from './columns';
import { PAGINATION_INFO } from '../../../constants';

import { MORNING_GOOUT, AFTERNOON_GOOUT, MORNING, AFTERNOON } from '../constants';

import './style.scss';

const DataView = ({ activeTab, data = [], loading, paginatorInfo=PAGINATION_INFO, fetchMore }) => {
    const intl = useIntl();
    const [selectedRow, setSelectedRow] = useState(null);

    const onRowSelect = (record) => {
        setSelectedRow(record);
    };

    const handleOnCancel = () => {
        setSelectedRow(null);
    }

    const handleRowClick = (record, rowIndex) => (event) => {
        onRowSelect(record, rowIndex, event);
    }

    return (
        <div className={`${CSS_PREFIX}__data-view`}>
            <div className="data-header">
                <div className="data-header__title">
                    {intl.formatMessage({
                        id: 'student.transportation.statistic.dataView.title',
                    })}
                </div>
                <div>
                    <PaginationTable
                        total={paginatorInfo.total}
                        onChange={(page) => {
                            fetchMore({
                                variables: {
                                    page: page,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) return prev;

                                    return Object.assign({}, {
                                        scheduleLogs: {
                                            ...fetchMoreResult.scheduleLogs
                                        }
                                    });
                                }
                            })
                        }}
                    />
                </div>
            </div>
            <div className="data-body">
                <Table
                    scroll={{
                        y: 'calc(100vh - 520px)'
                    }}
                    loading={loading}
                    columns={columns(intl, [MORNING_GOOUT, AFTERNOON_GOOUT].includes(activeTab) ? MORNING : AFTERNOON)}
                    dataSource={data}
                    pagination={false}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: handleRowClick(record, rowIndex), // click row
                        };
                    }}
                />
            </div>
            <TransportationDetailModal
                visible={!!selectedRow}
                onCancel={handleOnCancel}
                rowData={selectedRow}
                maskClosable={false}
            />
        </div>
    );
}

export default DataView;
