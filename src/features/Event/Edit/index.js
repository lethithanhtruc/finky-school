import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Space, Row, Col, Dropdown, Menu } from 'antd';
import { useIntl } from "react-intl";
import moment from 'moment';
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { UpOutlined } from '@ant-design/icons';

import Form from "../../../components/Common/Form";
import Button from "../../../components/Common/Button";
import PageHeader from "../../../components/Layout/PageHeader";

import EditForm from "../EditForm";

import { EDIT_CSS_PREFIX, LANGUAGE_OPTIONS, LANGUAGE_VI_EN, STATUS_OPTIONS } from '../constants';
import { formatFormDate } from '../../../utils';
import { LOAD_EVENT_DETAIL, EDIT_EVENT } from '../gql';
import { DATE_TIME_FORMAT } from '../../../constants/datetime';

import { useForceUpdate } from '../../../hooks';
import { mappingErrors } from '../helpers';

import './style.scss';

const EditDevice = () => {
    const { id } = useParams();
    const intl = useIntl();
    const history = useHistory();
    const [form] = Form.useForm();
    const [validateErrors, setValidateErrors] = useState({});
    const [typeOfSend, setTypeOfSend] = useState('scheduled');
    const { forceUpdate } = useForceUpdate();

    const { loading, data } = useQuery(LOAD_EVENT_DETAIL, {
        variables: {
            id: Number(id),
        }
    });

    const [updateEvent, { loading: updateLoading }] = useMutation(EDIT_EVENT);
    const getText = useCallback((suffix) => {
        return intl.formatMessage({
            id: `event.edit.${suffix}`,
        });
    }, [intl]);

    useEffect(() => {
        if (data?.notificationSchedule) {
            const { notificationSchedule } = data;
            if (notificationSchedule.status === STATUS_OPTIONS.SAVE_DRAFT) {
                setTypeOfSend('draft');
            } else if (notificationSchedule.status === STATUS_OPTIONS.SCHEDULE) {
                setTypeOfSend('scheduled');
            }
        }
    }, [data])

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
        input.campusId = Number(input.campusId);

        updateEvent({
            variables: {
                id: Number(id),
                input: input,
            },
        }).then((response) => {
            history.push(`/event`);
        }).catch(({ graphQLErrors }) => {
            if (graphQLErrors[0]?.extensions?.validation) {
                setValidateErrors(mappingErrors(graphQLErrors[0]?.extensions?.validation, intl.locale));
            }
        });
    }, [id, intl, updateEvent, typeOfSend, history]);

    const initialValues = useMemo(() => {
        if (data?.notificationSchedule) {
            const { notificationSchedule } = data;
            const initData = {
                ...notificationSchedule,
            };
            if (notificationSchedule.sendAt) {
                initData.sendAt = moment(notificationSchedule.sendAt);
            }
            if (notificationSchedule.classrooms) {
                initData.classrooms = notificationSchedule.classrooms.map(item => item.id);
            }
            if (notificationSchedule.languageType === LANGUAGE_OPTIONS.VIETNAMESE) {
                initData.languages = [LANGUAGE_OPTIONS.VIETNAMESE];
            } else if (notificationSchedule.languageType === LANGUAGE_OPTIONS.ENGLISH) {
                initData.languages = [LANGUAGE_OPTIONS.ENGLISH];
            } else {
                initData.languages = [LANGUAGE_OPTIONS.VIETNAMESE, LANGUAGE_OPTIONS.ENGLISH];
            }
            return initData;
        }
        return {};
    }, [data]);

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

    return (
        <div className={EDIT_CSS_PREFIX}>
            <PageHeader title={getText('title')} />
            <EditForm
                key={initialValues.campusId}
                loading={loading || updateLoading}
                onSubmit={handleFormSubmit}
                validateErrors={validateErrors}
                setValidateErrors={setValidateErrors}
                initialValues={initialValues}
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
                                {
                                    [STATUS_OPTIONS.SAVE_DRAFT, STATUS_OPTIONS.SCHEDULE].includes(data?.notificationSchedule?.status) && (
                                        <Dropdown.Button
                                            className="event-create__action-save"
                                            onClick={handleButtonClick}
                                            overlay={menu}
                                            type="primary"
                                            icon={<UpOutlined />}
                                        >
                                            {getText(`actions.${typeOfSend}`)}
                                        </Dropdown.Button>
                                    )
                                }
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </EditForm>
        </div>
    );
}

export default EditDevice;
