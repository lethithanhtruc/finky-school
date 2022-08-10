import React, { useCallback, useMemo, useState } from 'react';
import { Space, Row, Col } from 'antd';
import { useIntl } from "react-intl";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import moment from "moment";

import Form from "../../../components/Common/Form";
import Button from "../../../components/Common/Button";

import PageHeader from "../../../components/Layout/PageHeader";

import EditForm from "../EditForm";

import { EDIT_CSS_PREFIX } from '../constants';
import { LOAD_DEVICE_DETAIL, EDIT_DEVICE } from '../gql';
import { formatFormDate } from '../../../utils';
// import { generateDeviceName } from '../helpers';

import { mappingErrors } from '../helpers';

import './style.scss';

const EditDevice = () => {
    const { id } = useParams();
    const [validateErrors, setValidateErrors] = useState({});
    const intl = useIntl();
    const history = useHistory();

    const [editDevice, { loading: updateLoading }] = useMutation(EDIT_DEVICE);

    const { loading, data } = useQuery(LOAD_DEVICE_DETAIL, {
        variables: {
            id: Number(id),
        }
    });

    const getText = useCallback((suffix) => {
        return intl.formatMessage({
            id: `deviceManagement.edit.${suffix}`,
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
        input.location = Number(input.location.id);
        input.campusId = Number(input.campusId);

        editDevice({
            variables: {
                id: Number(id),
                input: input,
            },
        }).then((response) => {
            // console.log(response);
            history.push(`/device`);
        }).catch(({ graphQLErrors }) => {
            if (graphQLErrors[0]?.extensions?.validation) {
                setValidateErrors(mappingErrors(graphQLErrors[0]?.extensions?.validation, intl.locale));
            }
        });
    }, [editDevice, intl, id, history]);

    const initialValues = useMemo(() => {
        return {
            ...data?.camera,
            installedAt: data?.camera?.installedAt ? moment(data?.camera?.installedAt) : null,
        }
    }, [data?.camera]);

    if (!loading && !data) {
        history.push('/device')
        return null;
    }

    return (
        <div className={EDIT_CSS_PREFIX}>
            <PageHeader title={getText('title')} />
            <EditForm
                initialValues={initialValues}
                formType="EDIT"
                loading={loading || updateLoading}
                onSubmit={handleFormSubmit}
                validateErrors={validateErrors}
                setValidateErrors={setValidateErrors}
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

export default EditDevice;
