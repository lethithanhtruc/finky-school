import { Select as AntdSelect } from 'antd';
import './style.scss';

const Select = ({ className = '', ...rest }) => {
    return (
        <AntdSelect className={`fs-select ${className}`} {...rest}/>
    );
}


Select.Option = AntdSelect.Option;
Select.OptGroup = AntdSelect.OptGroup;

export default Select;