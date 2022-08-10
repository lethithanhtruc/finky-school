import React, { useCallback, useState } from 'react';
import { Space, Row, Col } from 'antd';
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";

import Form from "../../../components/Common/Form";
import Button from "../../../components/Common/Button";

import PageHeader from "../../../components/Layout/PageHeader";

import EditForm from "../EditForm";

import { CREATE_CSS_PREFIX } from '../constants';
import { formatFormDate } from '../../../utils';
// import { generateDeviceName } from '../helpers';
import { CREATE_DEVICE } from '../gql';

import { useQueryString } from '../../../hooks';

import { mappingErrors } from '../helpers';

import './style.scss';

const CreateDevice = () => {
    const history = useHistory();
    const queryString = useQueryString();
    const [defaultCampusId, setDefaultCampusId] = useState(queryString.campusId);
    const [validateErrors, setValidateErrors] = useState({});
    const intl = useIntl();
    const [createDevice, { loading }] = useMutation(CREATE_DEVICE);
    const getText = useCallback((suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.create.${suffix}`,
        });
    }, [intl]);

    const handleFormSubmit = useCallback((values) => {
        const input = {
            ...values,
            // re-format installedAt
            installedAt: formatFormDate(values.installedAt),
        }
        // if (!input.name) {
        //     // generate name
        //     input.name = generateDeviceName(intl, values.type, values.location);
        // }
        // change location to device
        setDefaultCampusId(values.campusId);

        input.location = Number(input.location.id);
        input.campusId = Number(input.campusId);

        createDevice({
            variables: {
                input: input,
            },
        }).then((response) => {
            history.push(`/device`);
        }).catch(({ graphQLErrors }) => {
            if (graphQLErrors[0]?.extensions?.validation) {
                setValidateErrors(mappingErrors(graphQLErrors[0]?.extensions?.validation, intl.locale));
            }
        });
    }, [createDevice, intl, history]);

    return (
        <div className={CREATE_CSS_PREFIX}>
            <PageHeader title={getText('title')} />
            <EditForm
                key={queryString.campusId}
                formType="ADD"
                loading={loading}
                onSubmit={handleFormSubmit}
                validateErrors={validateErrors}
                setValidateErrors={setValidateErrors}
                initialValues={{
                    campusId: defaultCampusId
                }}
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
                            className="device-edit-form__note"
                        >
                            <Space>
                                <Button
                                    style={{ width: 126, justifyContent: 'center' }}
                                    onClick={() => history.push('/device')}
                                >
                                    {getText('actions.cancel')}
                                </Button>
                                <Button
                                    style={{ width: 126, marginLeft: 10, justifyContent: 'center' }}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {getText('actions.add')}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </EditForm>
        </div>
    );
}

export default CreateDevice;
