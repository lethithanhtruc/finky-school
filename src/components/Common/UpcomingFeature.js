import React from 'react';
import {Modal, Button, Image} from 'antd';
import './UpcomingFeature.scss';

const UpcomingFeature = ({title, description}) => {
    return (
        <div className="upcoming-feature">
            <Image src={process.env.PUBLIC_URL + "/assets/img/bg-upcoming.jpg"} preview={false} />
            <div className="title">
                {title}
            </div>
            <div className="desc">
                {description}
            </div>
        </div>
    );
}

export default UpcomingFeature;
