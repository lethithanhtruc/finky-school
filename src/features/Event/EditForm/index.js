import React, { useCallback, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useIntl } from "react-intl";

import Form from "../../../components/Common/Form";
import Panel from "../../../components/Common/Panel";
import Input from "../../../components/Common/Input";
import { useForceUpdate } from '../../../hooks';
import FacilitiesSelect from '../../../components/Common/FacilitiesSelect';

import { useValidation } from '../../../utils/validations';
import { RECEIVER_OPTIONS, LANGUAGE_OPTIONS } from '../constants';

import LanguageSelect from './LanguageSelect';
import TitleInput from './TitleInput';
import ContentInput from './ContentInput';
import Receiver from './Receiver';
import SendAt from './SendAt';
import Grades from './Grades';

import './style.scss';

const LAYOUT_6_10 = {
  labelCol: {
    offset: 4,
    span: 6,
  },
  wrapperCol: {
    offset: 0,
    span: 10,
  },
};

const LAYOUT_3_17 = {
  labelCol: {
    offset: 2,
    span: 3,
  },
  wrapperCol: {
    span: 17,
  },
};

const EditForm = ({
  loading,
  children,
  initialValues = {},
  onSubmit,
  validateErrors = {},
  form,
  saveDraft,
  setValidateErrors,
}) => {
  const intl = useIntl();
  const { required, maxLength, pattern } = useValidation();
  const { forceUpdate } = useForceUpdate();

  const formValues = form.getFieldsValue();

  useEffect(() => {
    const dataFields = Object.keys(initialValues)
        .map(key => ({ name: key, value: initialValues[key] }));
    form.setFields(dataFields);
    forceUpdate();
  }, [initialValues, form, forceUpdate]);
  
  useEffect(() => {
    if (saveDraft?.code) {
      const dataFields = Object.entries({
        ...formValues,
        code: saveDraft.code,
      }).map(([key, value]) => ({
        name: key,
        value: value
      }));
      form.setFields(dataFields);
    }
  }, [saveDraft, form, formValues])

  const getText = useCallback((suffix) => {
    return intl.formatMessage({
      id: `event.forms.${suffix}`,
    });
  }, [intl]);

  const getFieldValidateStatus = useCallback((fieldName) => {
    if (validateErrors && validateErrors[fieldName]) {
      return 'error';
    }
    return null;
  }, [validateErrors])

  const getHelpField = useCallback((fieldName) => {
    if (validateErrors && validateErrors[fieldName] && validateErrors[fieldName][0]) {
      return validateErrors[fieldName][0];
    }
    return null;
  }, [validateErrors]);

  const handleOnFieldsChange = useCallback((changedFields, allFields) => {
    if (
      ['receiveType', 'languages', 'campusId']
        .includes(changedFields[0]?.name[0])
    ) {
      if (changedFields[0]?.name[0] === 'languages') {
        const objData = allFields.reduce((accm, field) => {
          if (['titleEn', 'contentEn', 'titleVi', 'contentVi'].includes(field.name[0])) {
            return {
              ...accm,
              [field.name]: field.value,
            }
          }
          return accm;
        }, {});
        if (changedFields[0]?.value?.length === 2) {
          const newAllField = allFields.filter(field => {
            return !['titleEn', 'contentEn', 'titleVi', 'contentVi'].includes(field.name[0]);
          }).map(field => {
            return {
              name: field.name,
              value: field.value,
            }
          });

          // vi
          newAllField.push({
            name: 'contentVi',
            value: objData.contentVi || '',
          });
          newAllField.push({
            name: 'titleVi',
            value: objData.titleVi || '',
          });
          //en
          newAllField.push({
            name: 'contentEn',
            value: objData.contentEn || '',
          });
          newAllField.push({
            name: 'titleEn',
            value: objData.titleEn || '',
          });
          form.setFields(newAllField)
        } else if (changedFields[0]?.value[0] === LANGUAGE_OPTIONS.VIETNAMESE) {
          const newAllField = allFields.filter(field => {
            return !['titleEn', 'contentEn'].includes(field.name[0]);
          }).map(field => {
            return {
              name: field.name,
              value: field.value,
            }
          });
          newAllField.push({
            name: 'contentVi',
            value: objData.contentVi || '',
          });
          newAllField.push({
            name: 'titleVi',
            value: objData.titleVi || '',
          });
          form.setFields(newAllField)
        } else if (changedFields[0]?.value[0] === LANGUAGE_OPTIONS.ENGLISH) {
          const newAllField = allFields.filter(field => {
            return !['titleVi', 'contentVi'].includes(field.name[0]);
          }).map(field => {
            return {
              name: field.name,
              value: field.value,
            }
          });
          newAllField.push({
            name: 'contentEn',
            value: objData.contentEn || '',
          });
          newAllField.push({
            name: 'titleEn',
            value: objData.titleEn || '',
          });
          form.setFields(newAllField)
        }
      }
      forceUpdate();
    }

    if (Object.keys(validateErrors).includes(changedFields[0]?.name[0])) {
      const updateValidateErrors = { ...validateErrors };
      delete updateValidateErrors[changedFields[0]?.name[0]];
      setValidateErrors({
        ...updateValidateErrors
      });
    }
  }, [forceUpdate, form, setValidateErrors, validateErrors]);

  const renderClassRoom = () => {
    return (
      <>
        <Row
          gutter={24}
          style={{
            marginTop: 10,
            display: formValues?.receiveType === RECEIVER_OPTIONS.PARENTS ? 'block' : 'none'
          }}
        >
          <Col flex="100%">
            <Form.Item
              labelAlign="left"
              label={getText('campus')}
              name="campusId"
              className="event-edit-form__note"
              {...LAYOUT_3_17}
              rules={[required()]}
              validateStatus={getFieldValidateStatus('campusId')}
              help={getHelpField('campusId')}
            >
              <FacilitiesSelect
                key={initialValues.campusId}
                allLabel={false}
                defaultMainCampus
                dropdownMatchSelectWidth={false}
                style={{
                  width: 'auto'
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={24}
          style={{
            display: formValues?.receiveType === RECEIVER_OPTIONS.PARENTS ? 'block' : 'none'
          }}
        >
          <Col flex="100%">
            <Form.Item
              labelAlign="left"
              label="Test"
              hideLabel
              name="classrooms"
              className="event-edit-form__note"
              {...LAYOUT_3_17}
              rules={[required(getText('grades.warning'))]}
              validateStatus={getFieldValidateStatus('classrooms')}
              help={getHelpField('classrooms')}
            >
              <Grades key={formValues?.campusId} campusId={formValues?.campusId} />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <div className="event-edit-form">
        <Panel className="edit-form__panel" loading={loading} loadingIcon>
          <Form
            colon={false}
            form={form}
            onFinish={onSubmit}
            // initialValues={initialValues}
            onFieldsChange={handleOnFieldsChange}
          >
            <Row gutter={24} style={{marginTop: 10}}>
              <Col flex="50%">
                <Form.Item
                  labelAlign="left"
                  label={getText('languages')}
                  name="languages"
                  {...LAYOUT_6_10}
                  rules={[required()]}
                  validateStatus={getFieldValidateStatus('languages')}
                  help={getHelpField('languages')}
                >
                  <LanguageSelect />
                </Form.Item>
              </Col>
              <Col flex="50%">
                <Form.Item
                  labelAlign="left"
                  label={getText('eventCode')}
                  name="code"
                  {...LAYOUT_6_10}
                  rules={[maxLength(10), pattern(/^[0-9a-zA-Z]+$/)]}
                  validateStatus={getFieldValidateStatus('code')}
                  help={getHelpField('code')}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} style={{marginTop: 10}}>
              <Col flex="100%">
                <TitleInput
                  form={form}
                  labelAlign="left"
                  label={getText('subject')}
                  {...LAYOUT_3_17}
                  rules={[required(formValues.languages?.length === 2 ? getText('subject.warning') : null), maxLength(40)]}
                  getFieldValidateStatus={getFieldValidateStatus}
                  getHelpField={getHelpField}
                  className="event-edit-form__note"
                  languages={formValues.languages}
                  input={{
                    maxLength: 40,
                    placeholder: getText('subject.placeholder'),
                  }}
                />
              </Col>
            </Row>
            <Row gutter={24} style={{marginTop: 10}}>
                <Col flex="100%">
                  <ContentInput
                    form={form}
                    labelAlign="left"
                    label={getText('content')}
                    // name="content"
                    className="event-edit-form__note"
                    {...LAYOUT_3_17}
                    rules={[required(formValues.languages?.length === 2 ? getText('content.warning') : null), maxLength(300)]}
                    getFieldValidateStatus={getFieldValidateStatus}
                    getHelpField={getHelpField}
                    languages={formValues.languages}
                    input={{
                      placeholder: getText('content.placeholder'),
                      rows: 8,
                      maxLength: 300,
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={24} style={{marginTop: 10}}>
                <Col flex="100%">
                  <Form.Item
                    labelAlign="left"
                    label={getText('receiver')}
                    name="receiveType"
                    className="event-edit-form__note event-edit-form__receiver"
                    {...LAYOUT_3_17}
                    rules={[required()]}
                    validateStatus={getFieldValidateStatus('receiveType')}
                    help={getHelpField('receiveType')}
                  >
                    <Receiver />
                  </Form.Item>
                </Col>
              </Row>
              {renderClassRoom()}
              <Row gutter={24} style={{marginTop: 10}}>
                <Col flex="100%">
                    <Form.Item
                      // key={formValues?.SendAt?.format()}
                      labelAlign="left"
                      label={getText('sendAt')}
                      name="sendAt"
                      className="event-edit-form__note"
                      {...LAYOUT_3_17}
                      rules={[required(getText('sendAt.warning'))]}
                      validateStatus={getFieldValidateStatus('sendAt')}
                      help={getHelpField('sendAt')}
                    >
                      <SendAt />
                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={24} style={{marginTop: 10}}>
                <Col flex="100%">
                  <Form.Item
                    labelAlign="left"
                    label={getText('note')}
                    name="note"
                    className="event-edit-form__note"
                    {...LAYOUT_3_17}
                    rules={[maxLength(100)]}
                    validateStatus={getFieldValidateStatus('note')}
                    help={getHelpField('note')}
                  >
                    <Input.TextArea
                      placeholder={getText('note.placeholder')}
                      rows={4}
                    />
                  </Form.Item>
                </Col>
              </Row>
            {children}
          </Form>
        </Panel>
    </div>
  )
}

export default EditForm;