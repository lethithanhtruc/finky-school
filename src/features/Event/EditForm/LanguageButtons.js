import React from 'react';
import { useIntl } from "react-intl";

import { LANGUAGE_OPTIONS } from '../constants';

const LanguageButtons = ({
  languages = [],
  languageSelected,
  setLanguageSelected,
  children,
  error,
  ...rest
}) => {
  const intl = useIntl();
  if (languages?.length === 2) {
    return (
      <>
        <div className="language-buttons">
          <div
            onClick={() => setLanguageSelected(LANGUAGE_OPTIONS.ENGLISH)}
            className={`language-buttons__button ${languageSelected === LANGUAGE_OPTIONS.ENGLISH ? 'active' : ''} ${error.en ? 'error' : ''}`}
          >
            {intl.formatMessage({
              id: `event.forms.languages.english`,
            })}
          </div>
          <div
            onClick={() => setLanguageSelected(LANGUAGE_OPTIONS.VIETNAMESE)}
            className={`language-buttons__button ${languageSelected === LANGUAGE_OPTIONS.VIETNAMESE ? 'active' : ''} ${error.vi ? 'error' : ''}`}
          >
            {intl.formatMessage({
              id: `event.forms.languages.vietnamese`,
            })}
          </div>
        </div>
        {React.cloneElement(children, { ...rest })}
      </>
    );
  }
  return React.cloneElement(children, { ...rest });
}

export default LanguageButtons;
