import { STATUS_OPTIONS, LANGUAGE_OPTIONS, RECEIVER_OPTIONS } from './constants';

export const getStatusOptions = (intl) => {
  const mappingTranslate = {
    SAVE_DRAFT: 'saveDraft',
    SCHEDULE: 'schedule',
    SENDING: 'sending',
    SEND: 'send',
    STOP_SEND: 'stopSend',
  }
  const getText = (suffix) => {
      return intl.formatMessage({
          id: `event.view.status.${suffix}`,
      });
  };

  return Object.keys(STATUS_OPTIONS).map(key => {
      return {
          label: getText(mappingTranslate[key]),
          value: STATUS_OPTIONS[key],
      }
  })
};

export const getLanguageOptions = (intl) => {
    const mappingTranslate = {
        VIETNAMESE: 'vietnamese',
        ENGLISH: 'english'
    }
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `event.forms.languages.${suffix}`,
        });
    };

    return Object.keys(LANGUAGE_OPTIONS).map(key => {
        return {
            label: getText(mappingTranslate[key]),
            value: LANGUAGE_OPTIONS[key],
        }
    });
};

export const getReceiverOptions = (intl) => {
    const mappingTranslate = {
        PARENTS: 'parents',
        TEACHER: 'teacher',
        DRIVER: 'driver',
        NANNY: 'nanny'
    }
    const getText = (suffix) => {
        return intl.formatMessage({
            id: `event.forms.receiver.${suffix}`,
        });
    };

    return Object.keys(RECEIVER_OPTIONS).map(key => {
        return {
            label: getText(mappingTranslate[key]),
            value: RECEIVER_OPTIONS[key],
        }
    });
};

export const mappingErrors = (errors = {}, locale) => {
  // transform the field key has uppercase characters
    if (errors.send_at) {
        errors.sendAt = errors.send_at;
    }
    if (errors.title_vi) {
        errors.titleVi = errors.title_vi;
    }
    if (errors.content_vi) {
        errors.contentVi = errors.content_vi;
    }
    if (errors.title_en) {
        errors.titliEn = errors.title_en;
    }
    if (errors.content_en) {
        errors.contentEn = errors.content_en;
    }
    if (errors.language_type) {
        errors.languageType = errors.language_type;
    }
    if (errors.receive_type) {
        errors.receiveType = errors.receive_type;
    }

    return errors;
}