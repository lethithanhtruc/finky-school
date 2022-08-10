import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Select } from "antd";
import { useIntl } from "react-intl";

import { useFactilityContext } from './context';

const FacilitiesSelect = ({
  placeholder,
  defaultActiveFirstOption,
  defaultMainCampus,
  onChange,
  style,
  value,
  allLabel = true,
  ...rest
}) => {
  const intl = useIntl();
  const { loading, facilities, refetch } = useFactilityContext();
  const [firstActive, setFirstActive] = useState(false);
  const [defaultActiveFirst] = useState(defaultActiveFirstOption);
  const [defaultActiveMainCampus] = useState(defaultMainCampus);

  useEffect(() => {
    refetch();

    // didmount
  }, []);

  const options = useMemo(() => {
    const ops = facilities.map((campus) => ({
      value: campus.id,
      label: campus.name,
    }))
    if (allLabel) {
      return [
        {
          value: '',
          label: intl.formatMessage({ id: "general.all" }),
        },
        ...(ops || []),
      ]
    }
    return ops;
  }, [allLabel, facilities, intl])

  useEffect(() => {
    if (!firstActive && facilities?.length) {
      if (defaultActiveFirst) {
        if (typeof onChange === "function") {
          onChange(facilities[0].id, facilities);
        }
      } else if (defaultActiveMainCampus) {
        const mainCampus = facilities.find(c => c.isMain);
        if (typeof onChange === "function" && mainCampus) {
          onChange(mainCampus.id, facilities);
        }
      } else if (!value) {
        onChange('');
      }
      setFirstActive(true);
    }
  }, [
    value,
    defaultActiveFirst,
    facilities,
    firstActive,
    onChange,
    allLabel,
    defaultActiveMainCampus
  ]);

  const handleOnChange = useCallback(
    (...rest) => {
      if (typeof onChange === "function") {
        onChange(...rest);
      }
    },
    [onChange]
  );

  return (
    <Select
      value={`${value || ''}`}
      getPopupContainer={(trigger) => trigger.parentElement}
      style={{ ...style, minWidth: 160 }}
      loading={loading}
      placeholder={
        placeholder ||
        intl.formatMessage({ id: "components.facilities.placeholder" })
      }
      options={options}
      onChange={handleOnChange}
      {...rest}
    />
  );
};

export default FacilitiesSelect;
