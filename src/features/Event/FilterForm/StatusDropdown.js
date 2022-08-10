import React, { useMemo } from 'react';
import { Select } from "antd";
import { useIntl } from "react-intl";
import StatusIcon from '../StatusIcon';

import { getStatusOptions } from '../helpers';

const StatusDropdown = ({style, ...rest}) => {
  const intl = useIntl();
  const statusOptions = useMemo(() => {
    return getStatusOptions(intl)
  }, [intl]);
  return (
    <Select {...rest} style={{ ...style, minWidth: 160 }}>
      <Select.Option value=''>
        {intl.formatMessage({
          id: `general.all`,
        })}
      </Select.Option>
      {statusOptions.map(item => {
        return (
          <Select.Option
            value={item.value}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <StatusIcon type={item.value} />
              <div>{item.label}</div>
            </div>
          </Select.Option>
        )
      })}
    </Select>
  );
}

export default StatusDropdown;
