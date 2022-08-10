import React, { useCallback, useState, useMemo } from 'react';
import { Space, Row, Col, Menu, Dropdown } from 'antd';
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UpOutlined } from '@ant-design/icons';

import Form from "../../../components/Common/Form";
import Button from "../../../components/Common/Button";
import { useForceUpdate } from '../../../hooks';
import PageHeader from "../../../components/Layout/PageHeader";

import EditForm from "../EditForm";

import { CREATE_CSS_PREFIX, LANGUAGE_OPTIONS, LANGUAGE_VI_EN, STATUS_OPTIONS, RECEIVER_OPTIONS } from '../constants';
import { formatFormDate } from '../../../utils';
import { CREATE_EVENT, EDIT_EVENT } from '../gql';
import { DATE_TIME_FORMAT } from '../../../constants/datetime';

import { mappingErrors } from '../helpers';

import './style.scss';

const CreateEvent = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    const [saveDraft, setSaveDraft] = useState(null);
    const [validateErrors, setValidateErrors] = useState({});
    const [typeOfSend, setTypeOfSend] = useState('scheduled');
    const { forceUpdate } = useForceUpdate();

    const intl = useIntl();
    const [createEvent, { loading }] = useMutation(CREATE_EVENT);

    const [updateEvent, { loading: updateLoading }] = useMutation(EDIT_EVENT);
    const getText = useCallback((suffix) => {
        return intl.formatMessage({
            id: `event.create.${suffix}`,
        });
    }, [intl]);

    const handleFormSubmit = useCallback((values) => {
        // convert input
        const input = {
            ...values,
            sendAt: formatFormDate(values.sendAt, DATE_TIME_FORMAT),
        }
        delete input.languages;
        if (values?.languages?.length === 2) {
            input.languageType = LANGUAGE_VI_EN;
        } else {
            input.languageType = values.languages[0];
        }
        if (typeOfSend === 'scheduled') {
            input.status = STATUS_OPTIONS.SCHEDULE;
        } else if (typeOfSend === 'draft') {
            input.status = STATUS_OPTIONS.SAVE_DRAFT;
        }
        if (!input.receiveType === RECEIVER_OPTIONS.PARENTS) {
            delete input.campusId;
            delete input.classrooms;
        }
        input.campusId = Number(input.campusId);

        if (saveDraft) {
            updateEvent({
                variables: {
                    id: saveDraft.id,
                    input: input,
                },
            }).then((response) => {
                if (typeOfSend === 'scheduled') {
                    history.push(`/event`);
                } else if (typeOfSend === 'draft') {
                    setSaveDraft(response.data.notificationScheduleUpdate);
                }
            }).catch(({ graphQLErrors }) => {
                if (graphQLErrors[0]?.extensions?.validation) {
                    setValidateErrors(mappingErrors(graphQLErrors[0]?.extensions?.validation, intl.locale));
                }
            });
        } else {
            createEvent({
                variables: {
                    input: input,
                },
            }).then((response) => {
                if (typeOfSend === 'scheduled') {
                    history.push(`/event`);
                } else if (typeOfSend === 'draft') {
                    setSaveDraft(response.data.notificationScheduleCreate);
                }
            }).catch(({ graphQLErrors }) => {
                if (graphQLErrors[0]?.extensions?.validation) {
                    setValidateErrors(mappingErrors(graphQLErrors[0]?.extensions?.validation, intl.locale));
                }
            });
        }
    }, [createEvent, intl, history, typeOfSend, saveDraft, updateEvent]);


    const handleButtonClick = useCallback((e) => {
        form.submit();
        forceUpdate();
    }, [form, forceUpdate]);

    const handleMenuClick = useCallback(({key}) => {
        setTypeOfSend(key);
    }, [])

    const menu = (
        <Menu onClick={handleMenuClick} style={{width: 136}}>
          <Menu.Item key="scheduled">
            {getText('actions.scheduled')}
          </Menu.Item>
          <Menu.Item key="draft">
            {getText('actions.draft')}
          </Menu.Item>
        </Menu>
    );

    const initialValues = useMemo(() => {
        return {
            languages: [LANGUAGE_OPTIONS.VIETNAMESE],
            receiveType: RECEIVER_OPTIONS.PARENTS
        }
    }, []);

    return (
        <div className={CREATE_CSS_PREFIX}>
            <PageHeader title={getText('title')} />
            <EditForm
                loading={loading || updateLoading}
                onSubmit={handleFormSubmit}
                validateErrors={validateErrors}
                setValidateErrors={setValidateErrors}
                initialValues={initialValues}
                saveDraft={saveDraft}
                form={form}
            >
                <Row>
                    <Col flex="100%">
                        <Form.Item
                            label=""
                            labelCol={{
                                offset: 2,
                                span: 3,
                            }}
                            wrapperCol={{
                                span: 17,
                            }}
                            className="event-edit-form__note"
                        >
                            <Space>
                                <Button
                                    style={{ width: 126, justifyContent: 'center' }}
                                    onClick={() => history.push('/event')}
                                >
                                    {getText('actions.cancel')}
                                </Button>
                                <Dropdown.Button
                                    className="event-create__action-save"
                                    onClick={handleButtonClick}
                                    overlay={menu}
                                    type="primary"
                                    icon={<UpOutlined />}
                                >
                                    {getText(`actions.${typeOfSend}`)}
                                </Dropdown.Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </EditForm>
        </div>
    );
}

export default CreateEvent;
