import React, {useState} from 'react';
import PageHeader from "../../components/Layout/PageHeader";
import {Layout as LayoutAnt, Button, Col, Row} from "antd";
import CampusBlocks from "./CampusBlocks";
import Charts from "./Charts";
import { PlusOutlined, CameraOutlined } from '@ant-design/icons';
import './index.scss';

const { Header } = LayoutAnt;

const School = () => {
    const [activeSchoolYearId, setActiveSchoolYearId] = useState(null);

    return (
        <div className="school-page">
            <Header className="site-layout-background">
                <div className="img-background" style={{backgroundImage: "url('" + process.env.PUBLIC_URL + '/assets/img/banner-default.png' + "')"}}></div>
                <div className="wrapper-text-title">
                    <div className="text-title">
                        <div className="title1">HỆ THỐNG TRƯỜNG QUỐC TẾ</div>
                        <div className="title2">INTERNATIONAL SCHOOL OF SAIGON</div>
                    </div>
                </div>
                <Button
                    className="btn-select-image"
                    shape="circle"
                    icon={<CameraOutlined />}
                />
            </Header>
            <PageHeader title="Dashboard" />
            <Row gutter={24}>
                <Col sm={12}>
                    <Charts
                        setActiveSchoolYearId={setActiveSchoolYearId}
                    />
                </Col>
                <Col sm={12}>
                    <CampusBlocks
                        activeSchoolYearId={activeSchoolYearId}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default School;
