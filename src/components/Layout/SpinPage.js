import React from 'react';
import { Spin, Row, Col, Layout } from 'antd';
import {
    LoadingOutlined
} from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;

const SpinPage = () => {
    return (
        <Layout id="components-layout-custom-trigger" style={{height: '100vh'}}>
            <Layout className="site-layout" style={{background: '#fff'}}>
                <Row align="middle" justify="center" style={{height: '100%'}}>
                    <Col>
                        <Spin indicator={antIcon} />
                    </Col>
                </Row>
            </Layout>
        </Layout>
    );
};

export default SpinPage;
