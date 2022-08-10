import React from 'react';
import { Form as AntdForm } from 'antd';

const Form = ({ ...rest }) => {
    return (
        <AntdForm {...rest}/>
    );
}

Form.useForm = AntdForm.useForm;

export default Form;
