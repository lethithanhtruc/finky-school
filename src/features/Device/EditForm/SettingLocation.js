import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Select,Divider } from 'antd';
import { useLazyQuery } from "@apollo/client";
import { SearchOutlined } from '@ant-design/icons';

import { CAMERA_TYPES } from '../constants';

import Input from "../../../components/Common/Input";

import { LOAD_CLASSROOMS, LOAD_VEHICLES, LOAD_GATES } from '../gql';

const SettingLocation = ({ campusId, value, type, getText, onChange, ...rest }) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchInputId] = useState(Math.random().toString(36))
    const [loadVehicles, { loading: vehicleLoading, data: vehicleData }] = useLazyQuery(LOAD_VEHICLES);
    const [loadClasses, { loading: classLoading, data: classData }] = useLazyQuery(LOAD_CLASSROOMS);
    const [loadGates, { loading: gateLoading, data: gateData }] = useLazyQuery(LOAD_GATES);

    useEffect(() => {
        if (campusId) {
            switch (type) {
                case CAMERA_TYPES.IN_VEHICLE:
                    loadVehicles({
                        variables: {
                            filter: {
                                campusId: Number(campusId),
                            }
                        }
                    });
                    break;
                case CAMERA_TYPES.IN_CLASSROOM:
                    loadClasses({
                        variables: {
                            filter: {
                                campusId: Number(campusId),
                            }
                        }
                    });
                    break;
                case CAMERA_TYPES.IN_CAMPUS:
                    loadGates({
                        variables: {
                            filter: {
                                campusId: Number(campusId),
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
        }
    }, [campusId, loadClasses, loadVehicles, loadGates, type]);

    useEffect(() => {
        setSearchValue("");
    }, [type, campusId]);

    useEffect(() => {
        if (value) {
            if (typeof onChange === 'function') {
                let findItem;
                if (type === CAMERA_TYPES.IN_VEHICLE && vehicleData?.vehiclesWithoutPaginatiton) {
                    findItem = vehicleData?.vehiclesWithoutPaginatiton?.find(item => item.id === value.id);
                    if (!findItem) {
                        onChange();
                    }
                } else if (type === CAMERA_TYPES.IN_CLASSROOM && classData?.classroomsWithoutPaginatitonInCurrentSchoolYear) {
                    findItem = classData?.classroomsWithoutPaginatitonInCurrentSchoolYear?.find(item => item.id === value.id);
                    if (!findItem) {
                        onChange();
                    }
                } else if (gateData?.gatesWithoutPaginatiton) {
                    findItem = gateData?.gatesWithoutPaginatiton?.find(item => item.id === value.id);
                    if (!findItem) {
                        onChange();
                    }
                }
            }
        }
    }, [value, type, campusId, onChange, vehicleData, classData, gateData]);

    const placeHolder = useMemo(() => {
        switch (type) {
            case CAMERA_TYPES.IN_VEHICLE:
                return getText('settingLocation.placeholder.onCar');
            case CAMERA_TYPES.IN_CLASSROOM:
                return getText('settingLocation.placeholder.onClass');
            case CAMERA_TYPES.IN_CAMPUS:
                return getText('settingLocation.placeholder.onCampus');
            default:
                return getText('settingLocation.placeholder');
        }
    }, [getText, type]);

    const searchPlaceHolder = useMemo(() => {
        switch (type) {
            case CAMERA_TYPES.IN_VEHICLE:
                return getText('settingLocation.search.placeholder.onCar');
            case CAMERA_TYPES.IN_CLASSROOM:
                return getText('settingLocation.search.placeholder.onClass');
            case CAMERA_TYPES.IN_CAMPUS:
            default:
                return '';
        }
    }, [getText, type]);

    const generateOptions = useCallback(() => {
        const searchValueLowerCase = (searchValue || '').toLowerCase();
        if (type === CAMERA_TYPES.IN_VEHICLE) {
            return vehicleData?.vehiclesWithoutPaginatiton?.filter(item => {
                if (searchValue) {
                    return (item.licensePlate || '').toLowerCase().includes(searchValueLowerCase);
                }
                return true;
            }).map(item => 
                <Select.Option key={item?.id} value={item?.id}>{item?.licensePlate}</Select.Option>
            );
        }
        if (type === CAMERA_TYPES.IN_CLASSROOM) {
            return classData?.classroomsWithoutPaginatitonInCurrentSchoolYear?.filter(item => {
                if (searchValue) {
                    return (item.name || '').toLowerCase().includes(searchValueLowerCase) || (item.code || '').toLowerCase().includes(searchValueLowerCase);
                }
                return true;
            }).map(item =>
                <Select.Option key={item?.id} value={item?.id}>{item?.name}</Select.Option>
            );
        }

        return gateData?.gatesWithoutPaginatiton?.map(item =>
            <Select.Option key={item?.id} value={item?.id}>{item?.name}</Select.Option>
        );
    }, [type, vehicleData, classData, searchValue, gateData]);


    const loading = useMemo(() => {
        switch (type) {
            case CAMERA_TYPES.IN_VEHICLE:
                return vehicleLoading;
            case CAMERA_TYPES.IN_CLASSROOM:
                return classLoading;
            case CAMERA_TYPES.IN_CAMPUS:
                return gateLoading;
            default:
                return false;
        }
    }, [type, vehicleLoading, classLoading, gateLoading]);

    const handleOnChange = useCallback((e) => {
        if (typeof onChange === 'function') {
            if (type === CAMERA_TYPES.IN_VEHICLE) {
                const findItem = vehicleData?.vehiclesWithoutPaginatiton?.find(item => item.id === e);
                onChange(findItem);
            } else if (type === CAMERA_TYPES.IN_CLASSROOM) {
                const findItem = classData?.classroomsWithoutPaginatitonInCurrentSchoolYear?.find(item => item.id === e);
                onChange(findItem);
            } else {
                const findItem = gateData?.gatesWithoutPaginatiton?.find(item => item.id === e);
                onChange(findItem);
            }
        }
    }, [onChange, type, vehicleData, classData, gateData]);

    return (
        <Select
            value={value?.id}
            placeholder={placeHolder}
            loading={loading}
            onChange={handleOnChange}
            onFocus={() => {
                // Workaround while cannot use useRef
                setTimeout(() => {
                    const searchInputEl = document.getElementById(searchInputId);
                    searchInputEl && searchInputEl.focus();
                }, 50);
            }}
            dropdownRender={menu => (
                <div>
                    {!(type === CAMERA_TYPES.IN_CAMPUS) && (
                        <>
                            <div>
                                <Input
                                    id={searchInputId}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                    }}
                                    autoFocus
                                    prefix={
                                        <SearchOutlined
                                            style={{
                                                fontSize: 16,
                                                color: '#818181',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    }
                                    placeholder={searchPlaceHolder}
                                />
                            </div>
                            <Divider style={{ margin: '0' }} />
                        </>
                    )}
                    {menu}
                </div>
              )}
            {...rest}
        >
            {generateOptions()}
        </Select>
    );
}

export default SettingLocation;