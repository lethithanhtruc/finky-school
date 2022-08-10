import React from 'react';
import { Spin } from 'antd';
import './style.scss';

const Panel = ({className, children, style, loading = false, loadingIcon = false}) => {
    return (
        <div style={style} className={`fs-panel ${className || ''}`}>
            <div className="fs-panel__content">
                {children}
            </div>
            {loading && (<div className="fs-panel__loading" >{loadingIcon && (<Spin />)}</div>)}
        </div>
    );
}

export default Panel;
