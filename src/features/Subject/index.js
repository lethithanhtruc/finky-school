import React, {useEffect} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import {Modal} from "antd";
import UpcomingFeature from "../../components/Common/UpcomingFeature";
import {FormattedMessage, useIntl} from "react-intl";

const Subject = () => {
    const intl = useIntl();

    useEffect(() => {
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
    }, []);

    return (
        <div className="subject-page">
            <PageHeader title={<FormattedMessage id="subject.index.title" />} />
        </div>
    );
}

export default Subject;
