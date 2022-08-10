import React from 'react';
import { useIntl } from "react-intl";
import { Table as AntdTable } from 'antd';

import EmptyData from './EmptyData';

import './style.scss';

const Table = ({ className, evenStyle = true, hoverStyle = true, loading, scrolling, ...rest }) => {
    const intl = useIntl();
    return (
        <AntdTable
            {...rest}
            loading={loading}
            className={`${hoverStyle ? 'actions-hover-style' : 'default-hover-style'} ${evenStyle ? 'even-style' : ''} ${className || ''}`}
            locale={{
                emptyText: loading ? intl.formatMessage({id: 'table.loading-text'}) : (<EmptyData />)
            }}
        />
    )
    
}

export default Table;