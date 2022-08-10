import React, { useCallback } from 'react';
import { Select } from 'antd';
import { useIntl} from "react-intl";
import { CAMERA_STATUS } from '../constants';
import { getStatusOptions } from '../helpers';

const DeviceStatus = ({ ...rest }) => {
    const intl = useIntl();
    const generateOptions = useCallback(() => {
        return getStatusOptions(intl).map(({ label, value }) => {
            if (value === CAMERA_STATUS.ACTIVE) {
                return (
                    <Select.Option
                        value={value}
                    >
                        <div className="device-active-option">
                            {label}
                        </div>
                    </Select.Option>
                );
            }
            return (
                <Select.Option
                    value={value}
                >
                    <div className="device-inactive-option">
                        {label}
                    </div>
                </Select.Option>
            );
        })
    }, [intl]);

    return (
        <Select
            {...rest}
        >
            {generateOptions()}
        </Select>
    );
}

export default DeviceStatus;