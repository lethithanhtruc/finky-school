import React, { useCallback, useState, useEffect } from 'react';
import { useIntl } from "react-intl";
import { Button } from 'antd';

import DatePicker from '.';

const EditDatePicker = ({ id, value = null, onChange, ...rest }) => {
    const intl = useIntl();
    const [oldValue, setOldValue] = useState(value);
    const [uuid] = useState(Math.random().toString(36).substring(2, 15));
    const [inputId] = useState(Math.random().toString(36).substring(2, 15));
    const [isOpen, setIsOpen] = useState(false);
    const [selectingValue, setSelectingValue] = useState(null);

    const handleClickOutside = useCallback((e) => {
        const inputEls = document.getElementsByClassName(inputId);
        const popups = document.getElementsByClassName(uuid);
        let popup;
        let inputEl;
        if (inputEls.length) {
            inputEl = inputEls[0];
            const isClickInput = inputEl.contains(e.target);
            if (isClickInput) {
                return;
            }
        }
        if (popups.length) {
            popup = popups[0];
            const isClickInsideElement = popup.contains(e.target);
            if (isClickInsideElement) {
                return;
            }
        }
        if (isOpen) {
            if (typeof onChange === 'function') {
                onChange.apply(null, oldValue);
            }
            setIsOpen(false);
        }
    }, [uuid, inputId, onChange, oldValue, isOpen]);

    useEffect(() => {
        if (!oldValue && value) {
            setOldValue(value);
        }
    }, [value, oldValue]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, [handleClickOutside]);

    const handleOnChange = useCallback((...rest) => {
        setSelectingValue(rest);
    }, []);

    const handleSelectOnClick = useCallback(() => {
        if (typeof onChange === 'function') {
            onChange.apply(null, selectingValue);
            setOldValue(selectingValue[0]);
        }
        setIsOpen(false);
    }, [selectingValue, onChange]);

    const handleOnClick = (event) => {
        setIsOpen(true)
    }

    return (
        <DatePicker
            {...rest}
            value={oldValue}
            onClick={handleOnClick}
            open={isOpen}
            className={inputId}
            onChange={handleOnChange}
            dropdownClassName={uuid}
            renderExtraFooter={() => {
                return (
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button
                            style={{
                                height: '24px',
                                padding: '0px 7px',
                                fontSize: '14px',
                                borderRadius: '2px',
                                background: '#2069DF',
                                color: '#fff'
                            }}
                            onClick={handleSelectOnClick}
                        >
                            {intl.formatMessage({
                                id: `general.select`,
                            })}
                        </Button>
                    </div>
                );
            }}
        />
    )
}

export default EditDatePicker;