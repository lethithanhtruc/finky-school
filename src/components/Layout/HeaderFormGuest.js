import React, {useEffect, useState} from 'react';
import './HeaderFormGuest.scss';

const HeaderFormGuest = ({title, description}) => {
    return (
        <div className="header-form">
            <div className="title">{title}</div>
            <div className="desc">{description}</div>
        </div>
    );
};

export default HeaderFormGuest;
