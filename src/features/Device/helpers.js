import { DEVICE_FUNCTIONS, USED_FOR_VALUES, CAMERA_TYPES, CAMERA_STATUS } from './constants';

export const getDeviceFunctionOptions = (intl) => {
    const mappingTranslate = {
        CHECKIN: 'checkin',
        CHECKOUT: 'checkout',
        CHECK_TEMPERATURE: 'temperature'
    }
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.view.dataView.columns.deviceFunction.${suffix}`,
        });
    };

    return Object.keys(DEVICE_FUNCTIONS).map(key => {
        return {
            label: getText(mappingTranslate[key]),
            value: DEVICE_FUNCTIONS[key],
        }
    })
};

export const getUsedForOptions = (intl) => {
    const mappingTranslate = {
        STUDENT: 'student',
        TEACHER: 'teacher',
        DRIVER: 'driver',
        NANNY: 'nanny'
    }
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.forms.usedFor.${suffix}`,
        });
    };

    return Object.keys(USED_FOR_VALUES).map(key => {
        return {
            label: getText(mappingTranslate[key]),
            value: USED_FOR_VALUES[key],
        }
    })
};

export const getTypeOptions = (intl) => {
    const mappingTranslate = {
        IN_CAMPUS: 'onCampus',
        IN_CLASSROOM: 'onClass',
        IN_VEHICLE: 'onCar',
    }
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.forms.deviceType.${suffix}`,
        });
    };

    return Object.keys(CAMERA_TYPES).map(key => {
        return {
            label: getText(mappingTranslate[key]),
            value: CAMERA_TYPES[key],
        }
    })
};

export const getStatusOptions = (intl) => {
    const mappingTranslate = {
        ACTIVE: 'active',
        INACTIVE: 'inActive',
    }
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.forms.deviceStatus.${suffix}`,
        });
    };

    return Object.keys(CAMERA_STATUS).map(key => {
        return {
            label: getText(mappingTranslate[key]),
            value: CAMERA_STATUS[key],
        }
    });
};


export const generateDeviceName = (intl, type, location) => {
    const mappingTranslate = {
        IN_CAMPUS: 'onCampus',
        IN_CLASSROOM: 'onClass',
        IN_VEHICLE: 'onCar',
    }
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.forms.deviceType.${suffix}`,
        });
    };
    const typeName = getText(mappingTranslate[type]);
    if (type === CAMERA_TYPES.IN_VEHICLE) {
        return `${typeName} ${location?.licensePlate}`;
    }
    return `${typeName} ${location?.name}`;
}

export const mappingErrors = (errors = {}, locale) => {
     // transform the field key has uppercase characters
    if (errors.campus_id) {
        errors.campusId = errors.campus_id;
    }
    if (errors.ip_address) {
        errors.ipAddress = errors.ip_address;
    }
    if (errors.installed_at) {
        errors.installedAt = errors.installed_at;
    }
    if (errors.used_for) {
        errors.usedFor = errors.used_for;
    }

    return errors;
}