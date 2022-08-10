import React, {useEffect, useState} from 'react';
import {Button, Image, Upload, message, Modal} from "antd";
import { CameraOutlined } from '@ant-design/icons';
import './UploadMutilImages.scss';
import UpcomingFeature from "./UpcomingFeature";
import {useIntl} from "react-intl";

const UploadMutilImages = ({srcsInitial=null, onChange}) => {
    const intl = useIntl();
    
    /*const [image, setImage] = useState({
        file: null,
        thumb: null,
    });

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ cho phép định dạng ảnh là JPG hoặc PNG.');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Dung lượng hình phải nhỏ hơn 5MB! Khuyến khích nhỏ hơn 1 MB.');
        }

        if(!isJpgOrPng || !isLt5M){
            return false;
        }

        const reader = new FileReader();
        reader.onloadend = e => {
            setImage({
                file: file,
                thumb: e.target.result,
            });
            onChange(file);
        };
        reader.readAsDataURL(file);

        return false;
    };*/

    return (
        <div className="wrapper-upload-multi-images">
            {srcsInitial ? (
                <div>aaa</div>
            ) : (
                <>
                    <Image
                        preview={false}
                        src={'data:image/jpeg;base64,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iZ0+/BINjeAgkEG2mBBHBBBTIIPUUAJ9gvv+fK7/APAab/4igA+wX3/Pld/+A03/AMRQAfYL7/nyu/8AwGm/+IoAPsF9/wA+V3/4DTf/ABFAB9gvv+fK7/8AAab/AOIoAPsF9/z5Xf8A4DTf/EUAH2C+/wCfK7/8Bpv/AIigA+wX3/Pld/8AgNN/8RQAfYL7/nyu/wDwGm/+IoAPsF9/z5Xf/gNN/wDEUAbWheGdS1a+hia0nhtFkRrq4mikijSEMC6qzqu+V1ysaLk7iC21AzAA+i6ACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAVlKsVYEMpKsD1BBwQfcHigBKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAkSGWQbo43cA4JVSRng4yB1wR+dAHcy21u7lnt4WY8lmijZieeSSpJP1oAi+yWv/Ptb/wDfmP8A+JoAPslr/wA+1v8A9+Y//iaAD7Ja/wDPtb/9+Y//AImgA+yWv/Ptb/8AfmP/AOJoAPslr/z7W/8A35j/APiaAD7Ja/8APtb/APfmP/4mgA+yWv8Az7W//fmP/wCJoAPslr/z7W//AH5j/wDiaAD7Ja/8+1v/AN+Y/wD4mgA+yWv/AD7W/wD35j/+JoAPslr/AM+1v/35j/8AiaAD7Ja/8+1v/wB+Y/8A4mgA+yWv/Ptb/wDfmP8A+JoAPslr/wA+1v8A9+Y//iaAD7Ja/wDPtb/9+Y//AImgA+yWv/Ptb/8AfmP/AOJoAPslr/z7W/8A35j/APiaAD7Ja/8APtb/APfmP/4mgA+yWv8Az7W//fmP/wCJoAPslr/z7W//AH5j/wDiaAD7Ja/8+1v/AN+Y/wD4mgA+yWv/AD7W/wD35j/+JoAPslr/AM+1v/35j/8AiaAD7Ja/8+1v/wB+Y/8A4mgA+yWv/Ptb/wDfmP8A+JoAPslr/wA+1v8A9+Y//iaAD7Ja/wDPtb/9+Y//AImgA+yWv/Ptb/8AfmP/AOJoAPslr/z7W/8A35j/APiaAD7Ja/8APtb/APfmP/4mgA+yWv8Az7W//fmP/wCJoAPslr/z7W//AH5j/wDiaAD7Ja/8+1v/AN+Y/wD4mgA+yWv/AD7W/wD35j/+JoAPslr/AM+1v/35j/8AiaAD7Ja/8+1v/wB+Y/8A4mgC3AiRxKsaKi9dqKFGT1OFAGT3oAD/2Q=='}
                    />
                    <div className="wrapper-btn-add-image">
                        <Button
                            className="btn-add-image"
                            type="primary"
                            size="small"
                            icon={<CameraOutlined />}
                            onClick={() => {
                                Modal.confirm({
                                    className: 'modal-upcoming-feature',
                                    maskClosable: true,
                                    title: null,
                                    icon: null,
                                    content: (
                                        <UpcomingFeature
                                            title={intl.formatMessage({id: 'upcoming-feature.title'})}
                                            description={intl.formatMessage({id: 'upcoming-feature.description'})}
                                        />
                                    ),
                                    width: 580,
                                });
                            }}
                        >
                            Nhấn để thêm hình
                        </Button>
                    </div>
                    <div className="wrapper-text-help">
                        <label className="text-help" htmlFor="">Thêm tối đa 4 hình</label>
                    </div>
                </>
            )}


            {/*{allowChange && (
                <Upload
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    listType="picture"
                >
                    <Button
                        className="btn-select-image"
                        shape="circle"
                        icon={<CameraOutlined />}
                    />
                </Upload>
            )}*/}
        </div>
    );
}

export default UploadMutilImages;
