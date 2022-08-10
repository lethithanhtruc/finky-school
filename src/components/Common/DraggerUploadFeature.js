import React from 'react';
import {Modal, Button, Image, Upload, message} from 'antd';
import './DraggerUploadFeature.scss';
import {ReactComponent as IconUpload} from "../../svg/icon-upload.svg";
import {FormattedMessage} from "react-intl";

const { Dragger } = Upload;

const DraggerUploadFeature = ({description, accept, customRequest, onChange}) => {
    return (
        <div className="wrapper-upload">
            <Dragger
                accept={accept}
                name="file"
                showUploadList={false}
                // multiple
                customRequest={customRequest}
                onChange={onChange}
            >
                <p className="ant-upload-drag-icon">
                    <IconUpload />
                </p>
                <p className="ant-upload-text">
                    {description}
                </p>
            </Dragger>
        </div>
    );
}

export default DraggerUploadFeature;
