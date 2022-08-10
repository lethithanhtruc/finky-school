import React, { useState } from 'react';
import { LANGUAGE_OPTIONS } from '../constants';

import Form from "../../../components/Common/Form";
import Input from "../../../components/Common/Input";
import LanguageButtons from './LanguageButtons';

const TitleInput = ({
  getFieldValidateStatus,
  getHelpField,
  languages = [],
  input,
  form,
  ...rest
}) => {
  const titleViError = form.getFieldError('titleVi')?.length === 1;
  const titleEnError = form.getFieldError('titleEn')?.length === 1;
  const [languageSelected, setLanguageSelected] = useState((LANGUAGE_OPTIONS.VIETNAMESE).toUpperCase());

  if (languages?.length === 2) {
    return (
      <>
        <div
          style={{
            display: languageSelected === LANGUAGE_OPTIONS.VIETNAMESE ? 'block' : 'none',
          }}
        >
          <Form.Item
            {...rest}
            name="titleVi"
            validateStatus={getFieldValidateStatus('titleVi')}
            help={getHelpField('titleVi') || (titleEnError ? form.getFieldError('titleEn')[0] : null)}
          >
            <LanguageButtons
              languages={languages}
              languageSelected={languageSelected}
              setLanguageSelected={setLanguageSelected}
              error={{
                vi: titleViError,
                en: titleEnError,
              }}
            >
              <Input
                {...input}
              />
            </LanguageButtons>
          </Form.Item>
        </div>
        <div
          style={{
            display: languageSelected === LANGUAGE_OPTIONS.ENGLISH ? 'block' : 'none',
          }}
        >
          <Form.Item
            {...rest}
            name="titleEn"
            validateStatus={getFieldValidateStatus('titleEn')}
            help={getHelpField('titleEn') || (titleViError ? form.getFieldError('titleVi')[0] : null)}
          >
            <LanguageButtons
              languages={languages}
              languageSelected={languageSelected}
              setLanguageSelected={setLanguageSelected}
              error={{
                vi: titleViError,
                en: titleEnError,
              }}
            >
              <Input
                {...input}
              />
            </LanguageButtons>
          </Form.Item>
        </div>
      </>
    );
  }

  if (languages[0] === LANGUAGE_OPTIONS.ENGLISH || languageSelected === LANGUAGE_OPTIONS.ENGLISH) {
    return (
      <div>
        <Form.Item
          {...rest}
          name="titleEn"
          validateStatus={getFieldValidateStatus('titleEn')}
          help={getHelpField('titleEn')}
        >
          <LanguageButtons
            languages={languages}
            languageSelected={languageSelected}
            setLanguageSelected={setLanguageSelected}
            error={{
              vi: titleViError,
              en: titleEnError,
            }}
          >
            <Input
              {...input}
            />
          </LanguageButtons>
        </Form.Item>
      </div>
    )
  }
  return (
    <div>
      <Form.Item
        {...rest}
        name="titleVi"
        validateStatus={getFieldValidateStatus('titleVi')}
        help={getHelpField('titleVi')}
      >
        <LanguageButtons
          languages={languages}
          languageSelected={languageSelected}
          setLanguageSelected={setLanguageSelected}
          error={{
            vi: titleViError,
            en: titleEnError,
          }}
        >
          <Input
            {...input}
          />
        </LanguageButtons>
      </Form.Item>
    </div>
  );
}

export default TitleInput;
