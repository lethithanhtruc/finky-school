import React, { useState, useCallback, useEffect } from 'react';
import { useIntl } from "react-intl";
import { Input as AntdInput, Space, Dropdown } from 'antd';
import Icon, { SearchOutlined } from '@ant-design/icons';

import { ReactComponent as FilterIcon } from "./images/icon-sort-20pt.svg";

import './style.scss';

const Input = ({ value, maxLength = 0, ...rest }) => {
    const intl = useIntl();
    if (maxLength && value?.length > 0) {
        return (
            <>
                <AntdInput value={value} {...rest} />
                <div className="input-count-char">{
                    intl.formatMessage({
                        id: 'form.input.charCount',
                    }, {
                        max: maxLength,
                        current: value.length
                    })
                }</div>
            </>
        );
    }
    return (
        <AntdInput value={value} {...rest}/>
    );
}

Input.Group = ({ ...rest }) => {
    return (
        <AntdInput.Group {...rest}/>
    );
};

Input.Search = ({ className = '', ...rest }) => {
    return (
        <AntdInput.Search className={`fs-input-search ${className}`} {...rest}/>
    );
};

const TextArea = ({ value, maxLength = 0, ...rest }) => {
    const intl = useIntl();
    if (maxLength && value?.length > 0) {
        return (
            <>
                <AntdInput.TextArea value={value} {...rest} />
                <div className="input-count-char">{
                    intl.formatMessage({
                        id: 'form.input.charCount',
                    }, {
                        max: maxLength,
                        current: value.length
                    })
                }</div>
            </>
        );
    }
    return (
        <AntdInput.TextArea value={value} {...rest}/>
    );
};

Input.TextArea = TextArea;

Input.Password = ({ ...rest }) => {
    return (
        <AntdInput.SeaPasswordrch {...rest} />
    );
};

// const SearchFilter = ({ delay = true, input, onChange, ...rest }) => {
const SearchFilter = ({ input, onChange, ...rest }) => {
    const [uuid] = useState(Math.random().toString(36).substring(2, 15));
    // const [inputEvent, setInputEvent] = useState(null);
    const [visible, setVisible] = useState(false);
    const handleFilterClick = useCallback((e) => {
        setVisible(true);
        e.stopPropagation();
    }, []);

    const handleClickOutside = useCallback((e) => {
        if (!(e.target?.parentNode?.parentNode.id === uuid)) {
            setVisible(false);
        }
    }, [uuid]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, [handleClickOutside]);

    const handleOnSearch = useCallback((...rest) => {
        // if (inputEvent) {
        //     if (typeof onChange === 'function') {
        //         onChange(inputEvent);
        //     }
        // }
        if (input.onSearch && typeof input.onSearch === 'function') {
            // setTimeout(() => {
            //     input.onSearch(...rest);
            // }, 0);
            input.onSearch(...rest);
        }
    }, [input]);
    // }, [inputEvent, input, onChange]);

    // const handleInputChange = useCallback((e) => {
    //     setInputEvent(e);
    // }, [])

    return (
        <Dropdown
            visible={visible}
            {...rest}
        >
            <Input.Search
                {...input}
                // onChange={delay ? handleInputChange : onChange}
                onChange={onChange}
                onSearch={handleOnSearch}
                prefix={
                    <Space>
                        <div
                            id={uuid}
                            onClick={handleFilterClick}
                        >
                            <Icon
                                component={FilterIcon}
                                style={{ fontSize: 16, color: 'transparent', cursor: 'pointer' }}
                            />
                        </div>
                        <SearchOutlined style={{ fontSize: 16, color: '#818181', cursor: 'pointer'  }} />
                    </Space>
                }
            />
        </Dropdown>
    )
}

Input.SearchFilter = React.memo(SearchFilter);

export default Input;
