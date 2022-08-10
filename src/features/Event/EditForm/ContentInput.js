import React, { useState } from 'react';
import { LANGUAGE_OPTIONS } from '../constants';

import Form from "../../../components/Common/Form";
import Input from "../../../components/Common/Input";
import LanguageButtons from './LanguageButtons';

const ContentInput  = ({
  getFieldValidateStatus,
  getHelpField,
  languages = [],
  input,
  form,
  ...rest
}) => {
  const contentViError = form.getFieldError('contentVi')?.length === 1;
  const contentEnError = form.getFieldError('contentEn')?.length === 1;
  const [languageSelected, setLanguageSelected] = useState((LANGUAGE_OPTIONS.VIETNAMESE).toUpperCase())
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
            name="contentVi"
            validateStatus={getFieldValidateStatus('contentVi')}
            help={getHelpField('contentVi') || (contentEnError ? form.getFieldError('contentEn')[0] : null)}
          >
            <LanguageButtons
              languages={languages}
              languageSelected={languageSelected}
              setLanguageSelected={setLanguageSelected}
              error={{
                vi: contentViError,
                en: contentEnError,
              }}
            >
              <Input.TextArea
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
            name="contentEn"
            validateStatus={getFieldValidateStatus('contentEn')}
            help={getHelpField('contentEn') || (contentViError ? form.getFieldError('contentVi')[0] : null)}
          >
            <LanguageButtons
              languages={languages}
              languageSelected={languageSelected}
              setLanguageSelected={setLanguageSelected}
              error={{
                vi: contentViError,
                en: contentEnError,
              }}
            >
              <Input.TextArea
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
          name="contentEn"
          validateStatus={getFieldValidateStatus('contentEn')}
          help={getHelpField('contentEn')}
        >
          <LanguageButtons
            languages={languages}
            languageSelected={languageSelected}
            setLanguageSelected={setLanguageSelected}
            error={{
              vi: contentViError,
              en: contentEnError,
            }}
          >
            <Input.TextArea
              {...input}
            />
          </LanguageButtons>
        </Form.Item>
      </div>
    );
  }
  return (
    <div>
      <Form.Item
        {...rest}
        name="contentVi"
        validateStatus={getFieldValidateStatus('contentVi')}
        help={getHelpField('contentVi')}
      >
        <LanguageButtons
          languages={languages}
          languageSelected={languageSelected}
          setLanguageSelected={setLanguageSelected}
          error={{
            vi: contentViError,
            en: contentEnError,
          }}
        >
          <Input.TextArea
            {...input}
          />
        </LanguageButtons>
      </Form.Item>
    </div>
  );
}

export default ContentInput;
