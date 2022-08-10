import { Checkbox as AntdCheckbox } from 'antd';
import './style.scss';

const Checkbox = ({ className = '', ...rest }) => {
    return (
        <AntdCheckbox className={`fs-checkbox ${className}`} {...rest}/>
    );
}

const Group = ({ className = '', ...rest }) => {
    return (
        <AntdCheckbox.Group className={`fs-group-checkbox ${className}`} {...rest}/>
    );
}

Checkbox.Group = Group;

export default Checkbox;