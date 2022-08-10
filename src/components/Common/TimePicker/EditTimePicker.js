
import React, { useState, useCallback } from 'react';
import { useIntl } from "react-intl";
import { Button } from 'antd';

import TimePicker from '.';

import './EditTimePicker.scss';

const EditTimePicker = ({ id, onChange, format, ...rest }) => {
    const intl = useIntl();
    const [isOpen, setIsOpen] = useState(false);
    const [selectingValue, setSelectingValue] = useState(null);

    const handleOpenChange = useCallback(open => {
        setIsOpen(open);
    }, []);
    
    const handleClose = useCallback(() => {
        if (typeof onChange === 'function') {
            if (selectingValue) {
                onChange.apply(null, [selectingValue, selectingValue.format(format)]);
            }
        }
        setIsOpen(false);
    }, [onChange, selectingValue, format]);

    const handleOnChange = useCallback((d) => {
        setSelectingValue(d);
    }, []);

    return (
        <TimePicker
            {...rest}
            open={isOpen}
            format={format}
            onOpenChange={handleOpenChange}
            className="edit-time-picker"
            popupClassName="edit-popup-time-picker"
            onSelect={handleOnChange}
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
                            onClick={handleClose}
                        >
                            {intl.formatMessage({
                                id: `general.select`,
                            })}
                        </Button>
                    </div>
                )
            }}
        />
    )
}

export default EditTimePicker;