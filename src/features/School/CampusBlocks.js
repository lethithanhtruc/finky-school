import React, {useEffect, useState} from 'react';
import {Button, Col, Row, Skeleton} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import './CampusBlocks.scss';
import { useQuery } from "@apollo/client";
import { CAMPUSES } from "./gql";
import CustomScrollbars from "../../components/Common/CustomScrollbars";
import {FormattedMessage} from "react-intl";
import CampusCreateBlock from "./CampusCreateBlock";
import CampusEditBlock from "./CampusEditBlock";
import Block from "../../components/Common/Block";

const CampusBlocks = ({activeSchoolYearId}) => {
    const schoolYearId = activeSchoolYearId;
    const [visibleCreateCampusBlock, setVisibleCreateCampusBlock] = useState(false);
    const [dataCampusForShowClassrooms, setDataCampusForShowClassrooms] = useState(null);
    const [dataCampusEdit, setDataCampusEdit] = useState(null);
    const [toggleScrollToTop, setToggleScrollToTop] = useState(false);

    // ----------
    // Lấy danh sách các cơ sở
    // ----------
    const { loading: loadingCampuses, data: dataCampuses, refetch: refetchCampuses } = useQuery(CAMPUSES, {
        variables: {},
        notifyOnNetworkStatusChange: true
    });

    useEffect(() => {
        setDataCampusForShowClassrooms(null);
    }, [activeSchoolYearId])

    return (
        <>
            <Row gutter={24} className="wrapper-tool">
                <Col sm={24} align="right" className="wrapper-btn">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        disabled={loadingCampuses || visibleCreateCampusBlock}
                        onClick={() => {
                            setDataCampusEdit(null);
                            setVisibleCreateCampusBlock(true);
                            setToggleScrollToTop(!toggleScrollToTop);
                        }}
                    >
                        <FormattedMessage id="campus.index.action.button-add-campus.label" />
                    </Button>
                </Col>
            </Row>

            {(loadingCampuses) ? (
                <Block>
                    <Skeleton active avatar paragraph={{ rows: 8 }} />
                </Block>
            ) : (
                <Row>
                    <Col sm={24}>
                        <CustomScrollbars
                            style={{ height: 630 }}
                            toggleScrollToTop={toggleScrollToTop}
                        >
                            {visibleCreateCampusBlock && (
                                <CampusCreateBlock
                                    dataCampusMain={dataCampuses?.campuses.data.filter(campus => campus.isMain)[0]}
                                    onCancel={() => {
                                        setDataCampusEdit(null);
                                        setVisibleCreateCampusBlock(false);
                                    }}
                                    onOk={() => {
                                        setDataCampusEdit(null);
                                        setVisibleCreateCampusBlock(false);
                                        refetchCampuses();
                                    }}
                                />
                            )}

                            <div>
                                {dataCampuses?.campuses.data.map(campus => (
                                    <CampusEditBlock
                                        key={campus.id}
                                        schoolYearId={schoolYearId}
                                        setVisibleCreateCampusBlock={setVisibleCreateCampusBlock}
                                        dataCampusEdit={dataCampusEdit}
                                        setDataCampusEdit={setDataCampusEdit}
                                        dataCampusForShowClassrooms={dataCampusForShowClassrooms}
                                        setDataCampusForShowClassrooms={setDataCampusForShowClassrooms}
                                        dataCampus={campus}
                                        onCancel={() => {
                                            setDataCampusEdit(null);
                                            setVisibleCreateCampusBlock(false);
                                        }}
                                        onOk={() => {
                                            setDataCampusEdit(null);
                                            setVisibleCreateCampusBlock(false);
                                            refetchCampuses();
                                        }}
                                        onDeletedSuccess={() => {
                                            setDataCampusEdit(null);
                                            setVisibleCreateCampusBlock(false);
                                            refetchCampuses();
                                        }}
                                    />
                                ))}
                            </div>
                        </CustomScrollbars>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default CampusBlocks;
