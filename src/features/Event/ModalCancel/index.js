import React, { useCallback, useState } from 'react';
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/client";
import { Modal } from 'antd';
import { MODAL_CANCEL_CSS_PREFIX } from '../constants';
import Button from "../../../components/Common/Button";

import { STOP_SENDING_EVENT } from '../gql';

import './style.scss';

const ModalCancel = ({ visible, onCancel, rowData, handleRefetch, ...rest }) => {
  const intl = useIntl();
  const [error, setError] = useState();
  const [stopSendingEvent, { loading: stopSendingLoading }] = useMutation(STOP_SENDING_EVENT);

  const getText = useCallback((suffix) => {
    return intl.formatMessage({
      id: `event.cancel.${suffix}`,
    });
  }, [intl]);

  const handleOnOk = useCallback(() => {
    setError(null);
    stopSendingEvent({
      variables: {
        id: Number(rowData.id),
      },
    }).then((response) => {
      handleRefetch();
      onCancel();
    }).catch((error) => {
      setError(error);
    });
  }, [stopSendingEvent, handleRefetch, rowData, onCancel]);

  return (
    <Modal
      {...rest}
      loading={stopSendingLoading}
      className={MODAL_CANCEL_CSS_PREFIX}
      key={`${visible}`}
      title={getText('title')}
      visible={visible}
      footer={null}
      width={500}
      centered
      onCancel={onCancel}
    >
      <div className="modal-detail">
        <div className="modal-detail__message">
          {getText('message')}
        </div>
        {
          error && (
            <div className="modal-detail__error-message">
              {getText('errorMessage')}
            </div>
          )
        }
        <div className="modal-detail__footer">
          <Button
            onClick={onCancel}
            disabled={stopSendingLoading}
          >
            {getText('actions.cancel')}
          </Button>
          <Button
            type="primary"
            className="modal-detail__footer-delete"
            onClick={handleOnOk}
            loading={stopSendingLoading}
          >
            {getText('actions.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalCancel;