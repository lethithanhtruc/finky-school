import React, { useState, useMemo, useCallback } from 'react';
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { CSS_PREFIX } from '../constants';
import { columns } from './columns';

import Table from "../../../components/Common/Table";
import Panel from "../../../components/Common/Panel";
import PaginationTable from "../../../components/Common/PaginationTable";

import { DELETE_DEVICE } from '../gql';

import './style.scss';

const DataView = ({ data, loading, fetchMore, handleRefetch }) => {
    const intl = useIntl();
    const history = useHistory();
    const [rowHover, setRowHover] = useState(null);

    const [deleteDevice, { loading: deleteLoading }] = useMutation(DELETE_DEVICE);

    const redirectToEdit = useCallback((record) => {
        return () => {
            history.push(`/device/${record.id}`);
        }
    }, [history]);

    const deleteItem = useCallback((record) => {
        return () => {
            deleteDevice({
                variables: {
                    id: record.id,
                },
            }).then((response) => {
                handleRefetch();
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [deleteDevice, handleRefetch]);

    const columnData = useMemo(() => {
        return columns(intl, rowHover, redirectToEdit, deleteItem);
    }, [rowHover, intl, redirectToEdit, deleteItem]);

    return (
        <Panel className={`${CSS_PREFIX}__data-view`}>
            <div className="data-body">
                <Table
                    scroll={{
                        y: 'calc(100vh - 320px)'
                    }}
                    loading={loading || deleteLoading}
                    columns={columnData}
                    dataSource={data?.cameras?.data}
                    pagination={false}
                    hoverStyle={false}
                    evenStyle={false}
                    onRow={(record) => {
                        return {
                            onMouseEnter: event => {
                                setRowHover(record)
                            }, // mouse enter row
                            onMouseLeave: event => {
                                setRowHover(null);
                            }, // mouse leave row
                        };
                    }}
                />
            </div>
            <div className="data-pagination">
                <PaginationTable
                    total={data?.cameras?.paginatorInfo?.total}
                    onChange={(page) => {
                        fetchMore({
                            variables: {
                                page: page,
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;

                                return Object.assign({}, {
                                    cameras: {
                                        ...fetchMoreResult.cameras
                                    }
                                });
                            }
                        })
                    }}
                />
            </div>
        </Panel>
    );
}

export default DataView;
