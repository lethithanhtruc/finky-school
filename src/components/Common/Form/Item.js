import React from 'react';
import { Form as AntdForm } from 'antd';

const RequiredLabel = ({ label }) => {
    return <div>{label}: <span className="item-label-required-asterisk">*</span></div>
}

const Label = ({ label }) => {
    if (label) {
        return <div>{label}: </div>;
    }
    return null;
}

const Item = ({ hideLabel = false, label, rules, ...rest }) => {
    const isRequired = (rules || []).find(item => item.required);
    if (!hideLabel && isRequired) {
        return (
            <AntdForm.Item
                label={<RequiredLabel label={label} />}
                rules={rules}
                {...rest}
            />
        );
    }
    return (
        <AntdForm.Item label={<Label label={hideLabel ? "" : label} />} rules={rules} {...rest}/>
    );
}

export default Item;
