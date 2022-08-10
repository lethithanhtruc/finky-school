import React from 'react';
import "./PageHeader.scss";

const PageHeader = ({
    title
}) => {
    return (
        <h1 className="page-header-title">{title}</h1>
    );
};

export default PageHeader;
