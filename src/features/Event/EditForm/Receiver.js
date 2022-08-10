import React, { useMemo, useCallback } from 'react';
import { useIntl } from "react-intl";

import { getReceiverOptions } from '../helpers';

const Receiver = ({ value, onChange, ...rest}) => {
  const intl = useIntl();

  const receiverOptions = useMemo(() => {
    // hidden the feature is not defind yet
    return getReceiverOptions(intl)
      .filter(item => item.value === 'PARENTS');
  }, [intl]);

  const handleOnClick = useCallback(
    (type) => {
      return () => {
        if (typeof onChange === 'function') {
          onChange(type);
        }
      }
    },
    [onChange],
  )

  return (
    <div className="receiver-input">
      <div className="receiver-input__type">
        {receiverOptions.map(item => (
          <div
            className={`receiver-input__type-item ${value === item.value ? 'selected' : ''}`}
            onClick={handleOnClick(item.value)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Receiver;
