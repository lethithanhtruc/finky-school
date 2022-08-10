/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Select } from "antd";

import { ReactComponent as IconCalandar } from "../../../../svg/icon-calandar.svg";

const SelectSchoolYear = ({ className, onChange, loading, data }) => {
  const [selectedSchoolyearId, setSelectedSchoolyearId] = useState(null);

  useEffect(() => {
    if (!loading && data) {
      const schoolyearCurrent = data.schoolyears.data.filter(
        (schoolyear) =>
          parseInt(schoolyear.endAt.substring(0, 4)) ===
          new Date().getFullYear()
      );
      setSelectedSchoolyearId(schoolyearCurrent[0].id);
    }
  }, [loading, data]);

  const handleOnChangeShoolYear = (selectedSchoolyearId) => {
    const itemSeleted = data?.schoolyears?.data.filter(
      (item) => item.id === selectedSchoolyearId
    );
    onChange(itemSeleted);
  };

  useEffect(() => {
    handleOnChangeShoolYear(selectedSchoolyearId);
  }, [selectedSchoolyearId]);

  return (
    <Select
      className={className}
      suffixIcon={<IconCalandar />}
      value={selectedSchoolyearId}
      options={data?.schoolyears.data.map((schoolyear) => ({
        value: schoolyear.id,
        label: schoolyear.name,
        disabled:
          parseInt(schoolyear.endAt.substring(0, 4)) > new Date().getFullYear(),
      }))}
      onChange={setSelectedSchoolyearId}
      dropdownClassName="school-year-wrapper"
      loading={loading}
    />
  );
};

export default SelectSchoolYear;
