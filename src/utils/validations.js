import { useCallback } from 'react';
import { useIntl } from "react-intl";

export const useValidation = () => {
    const intl = useIntl();

    const required = useCallback((message) => {
        return {
            required: true,
            message: message || intl.formatMessage({ id: 'validate.required-input' })
        };
    }, [intl]);

    const maxLength = useCallback((max, message) => {
        return {
            max,
            message: message || intl.formatMessage({ id: 'validate.max-length' }, { max })
        };
    }, [intl]);

    const pattern = useCallback((regex, message) => {
        return {
            pattern: regex,
            message: message || intl.formatMessage({ id: 'validate.pattern' })
        };
    }, [intl]);

    return {
        required,
        maxLength,
        pattern,
    }
}