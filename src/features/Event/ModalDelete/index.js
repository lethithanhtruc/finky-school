import React, { useCallback, useState } from 'react';
import { useIntl } from "react-intl";
import { useMutation } from "@apollo/client";
import { Modal } from 'antd';
import { MODAL_DELETE_CSS_PREFIX } from '../constants';
import Button from "../../../components/Common/Button";

import { DELETE_EVENT } from '../gql';

import './style.scss';

const ModalDelete = ({ visible, onCancel, rowData, handleRefetch, ...rest }) => {
  const intl = useIntl();
  const [error, setError] = useState();
  const [deleteEvent, { loading: deleteLoading }] = useMutation(DELETE_EVENT);

  const getText = useCallback((suffix) => {
    return intl.formatMessage({
      id: `event.delete.${suffix}`,
    });
  }, [intl]);

  const handleOnOk = useCallback(() => {
    setError(null);
    deleteEvent({
      variables: {
        id: Number(rowData.id),
      },
    }).then((response) => {
      handleRefetch();
      onCancel();
    }).catch((error) => {
      setError(error);
    });
  }, [deleteEvent, handleRefetch, rowData, onCancel]);

  return (
    <Modal
      {...rest}
      loading={deleteLoading}
      className={MODAL_DELETE_CSS_PREFIX}
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
            disabled={deleteLoading}
          >
            {getText('actions.cancel')}
          </Button>
          <Button
            type="primary"
            className="modal-detail__footer-delete"
            onClick={handleOnOk}
            loading={deleteLoading}
          >
            {getText('actions.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalDelete;