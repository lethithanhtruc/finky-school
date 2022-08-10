import React from 'react';
import { Button as AntdButton } from 'antd';
import './style.scss';

const Button = ({ className = '', icon, suffix, children, ...rest }) => {
    return (
        <AntdButton className={`fs-button ${className}`} {...rest}>
            {icon && <div className="fs-button__icon">{icon}</div>}
            <div className="fs-button__children">{children}</div>
            {suffix && <div className="fs-button__suffix">{suffix}</div>}
        </AntdButton>
    );
}

export default Button;
