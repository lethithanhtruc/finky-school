import React, { useMemo, useCallback } from 'react';
import { useIntl } from "react-intl";
import { LeftOutlined } from '@ant-design/icons';

import { getLanguageOptions } from '../helpers';
import Select from "../../../components/Common/Select";
import Checkbox from "../../../components/Common/Checkbox";

import { LANGUAGE_OPTIONS } from '../constants';

const LanguageSelect = ({ value, ...rest }) => {
  const intl = useIntl();
  const languageOptions = useMemo(() => {
    return getLanguageOptions(intl)
  }, [intl]);

  const tagRender = useCallback((props) => {
    if (value?.length === 2) {
      if (props.value !== LANGUAGE_OPTIONS.VIETNAMESE) return '';
      return intl.formatMessage({
        id: `event.forms.languages.both`,
      });
    }
    return props.label;
  }, [intl, value]);

  return (
    <Select
      mode="multiple"
      showArrow
      value={value}
      menuItemSelectedIcon={({ isSelected }) => <Checkbox checked={isSelected} />}
      suffixIcon={<LeftOutlined />}
      tagRender={tagRender}
      {...rest}
    >
      {languageOptions.map(type => (
        <Select.Option value={type.value}>
          {type.label}
        </Select.Option>
      ))}
    </Select>
  );
}

export default LanguageSelect;
