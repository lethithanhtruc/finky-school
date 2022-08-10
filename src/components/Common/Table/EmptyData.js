import React from 'react';
import { useIntl } from "react-intl";

import emptyData from './images/Empty-Data.svg';

const EmptyData = ({ className, loading, scrolling, ...rest }) => {
    const intl = useIntl();
    return (<div><img src={emptyData} alt="" /><div>{intl.formatMessage({id: 'table.empty-text'})}</div></div>)
}

export default EmptyData;