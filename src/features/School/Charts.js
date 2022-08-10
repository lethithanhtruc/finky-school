import React, {useState} from 'react';
import {Button, Col, Row} from "antd";
import { Doughnut } from 'react-chartjs-2';
import Block from "../../components/Common/Block";
import './Charts.scss';
import SelectSchoolYear from "../../components/Common/SelectSchoolYear";
import {FormattedMessage, useIntl} from "react-intl";

const Charts = ({setActiveSchoolYearId}) => {
    const intl = useIntl();

    const ChartBlock = ({title}) => (
        <>
            <div className="wrapper-chart-block">
                <div className="wrapper-info">
                    <div className="label-info">{`${title}:`}</div>
                    <div className="text-info">70</div>
                </div>
                <div className="wrapper-chart">
                    <Doughnut
                        data={{
                            labels: [
                                intl.formatMessage({id: 'grade.grade_1'}),
                                intl.formatMessage({id: 'grade.grade_2'}),
                                intl.formatMessage({id: 'grade.grade_3'}),
                                intl.formatMessage({id: 'grade.grade_4'})
                            ],
                            datasets: [{
                                backgroundColor: ['#64C4ED', '#6B48FF', '#FF5858', '#FFD058'],
                                data: [25, 35, 25, 15]
                            }],
                        }}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                display: false
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );

    return (
        <>
            <Row gutter={24} className="wrapper-tool">
                <Col sm={24}>
                    <SelectSchoolYear
                        onChange={(value) => setActiveSchoolYearId(value)}
                    />
                </Col>
            </Row>
            <Block>
                <Row gutter={24}>
                    <Col sm={12}>
                        <ChartBlock title={intl.formatMessage({id: 'school.total-class'})} />
                    </Col>
                    <Col sm={12}>
                        <ChartBlock title={intl.formatMessage({id: 'school.total-student'})} />
                    </Col>
                </Row>
                <Row gutter={24} style={{marginTop: "50px"}}>
                    <Col sm={12}>
                        <ChartBlock title={intl.formatMessage({id: 'school.total-teacher'})} />
                    </Col>
                    <Col sm={12}>
                        <ChartBlock title={intl.formatMessage({id: 'school.total-register-for-school-bus'})} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className="wrapper-label-grade">
                            <div className="label-grade">
                                <span className="box-color" style={{background: "#64C4ED"}}></span>
                                <span className="text-color">
                                    <FormattedMessage id="grade.grade_1" />
                                </span>
                            </div>
                            <div className="label-grade">
                                <span className="box-color" style={{background: "#6B48FF"}}></span>
                                <span className="text-color">
                                    <FormattedMessage id="grade.grade_2" />
                                </span>
                            </div>
                            <div className="label-grade">
                                <span className="box-color" style={{background: "#FF5858"}}></span>
                                <span className="text-color">
                                    <FormattedMessage id="grade.grade_3" />
                                </span>
                            </div>
                            <div className="label-grade">
                                <span className="box-color" style={{background: "#FFD058"}}></span>
                                <span className="text-color">
                                    <FormattedMessage id="grade.grade_4" />
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Block>
        </>
    );
}

export default Charts;
