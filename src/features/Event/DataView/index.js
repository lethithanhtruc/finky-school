import React, { useState, useMemo, useCallback } from 'react';
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { CSS_PREFIX } from '../constants';
import { columns } from './columns';

import Table from "../../../components/Common/Table";
import Panel from "../../../components/Common/Panel";
import PaginationTable from "../../../components/Common/PaginationTable";

import ModalDetailView from '../ModalDetailView';
import ModalDelete from '../ModalDelete';
import ModalCancel from '../ModalCancel';

import './style.scss';

const DataView = ({ data, loading, fetchMore, handleRefetch }) => {
    const intl = useIntl();
    const history = useHistory();
    const [rowHover, setRowHover] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [deleteRow, setDeleteRow] = useState(null);
    const [cancelRow, setCancelRow] = useState(null);

    const viewItem = useCallback((record) => {
        return () => {
            setSelectedRow(record);
        }
    }, []);

    const editItem = useCallback((record) => {
        return () => {
            history.push(`/event/${record.id}`);
        }
    }, [history]);

    const deleteItem = useCallback((record) => {
        return () => {
            setDeleteRow(record);
        }
    }, []);

    const cancelItem = useCallback((record) => {
        return () => {
            setCancelRow(record);
        }
    }, []);

    const columnData = useMemo(() => {
        return columns(intl, rowHover, viewItem, editItem, deleteItem, cancelItem);
    }, [rowHover, intl, viewItem, editItem, deleteItem, cancelItem]);

    const handleOnCancelDetail = () => {
        setSelectedRow(null);
    }

    const handleOnCancelDelete = () => {
        setDeleteRow(null);
    }

    const handleOnCancelPause = () => {
        setCancelRow(null);
    }

    return (
        <Panel className={`${CSS_PREFIX}__data-view`}>
            <div className="data-body">
                <Table
                    scroll={{
                        y: 'calc(100vh - 370px)'
                    }}
                    loading={loading}
                    columns={columnData}
                    dataSource={data?.notificationSchedules?.data}
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
                    total={data?.notificationSchedules?.paginatorInfo?.total}
                    onChange={(page) => {
                        console.log(page)
                        fetchMore({
                            variables: {
                                page: page,
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;

                                return Object.assign({}, {
                                    notificationSchedules: {
                                        ...fetchMoreResult.notificationSchedules
                                    }
                                });
                            }
                        })
                    }}
                />
            </div>
            {
                !!selectedRow && (
                    <ModalDetailView
                        visible={!!selectedRow}
                        onCancel={handleOnCancelDetail}
                        rowData={selectedRow}
                        maskClosable={false}
                        key={selectedRow?.id}
                    />
                )
            }
            {
                !!deleteRow && (
                    <ModalDelete
                        visible={!!deleteRow}
                        onCancel={handleOnCancelDelete}
                        rowData={deleteRow}
                        maskClosable={false}
                        handleRefetch={handleRefetch}
                        key={deleteRow?.id}
                    />
                )
            }
            {
                !!cancelRow && (
                    <ModalCancel
                        visible={!!cancelRow}
                        onCancel={handleOnCancelPause}
                        rowData={cancelRow}
                        maskClosable={false}
                        handleRefetch={handleRefetch}
                        key={cancelRow?.id}
                    />
                )
            }
            
        </Panel>
    );
}

export default DataView;
