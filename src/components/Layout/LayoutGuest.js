import React, {useEffect, useState} from 'react';
import './LayoutGuest.scss';
import {Col, Image, Row, Space} from "antd";
import logoFooter from '../../logo-footer.svg';
import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";
import SpinPage from "./SpinPage";
import {Helmet} from "react-helmet";
import {useQuery} from "@apollo/client";
import {SCHOOL_PUBLIC} from "../../features/Login/gql";

const LayoutGuest = () => {
    const [routeGuests, setRouteGuests] = useState([]);

    // ----------
    // Lấy thông tin trường học
    // ----------
    const { loading: loadingSchool, data: dataSchool } = useQuery(SCHOOL_PUBLIC, {
        variables: {
            domain: window.location.hostname
        }
    });
    useEffect(() => {
        if(!loadingSchool && dataSchool){
            console.log('dataSchool', dataSchool.schoolPublic)
        }
    }, [loadingSchool, dataSchool])

    useEffect(() => {
        setRouteGuests(routeGuests => {
            routeGuests = [];

            routeGuests.push({
                path: "/",
                title: "",
                exact: true,
                main: () => (
                    <Redirect to="/login" />
                )
            });

            const Login = loadable(() => import("../../features/Login"), {
                fallback: <SpinPage />
            });
            routeGuests.push({
                path: "/login",
                title: "Đăng nhập",
                exact: true,
                main: () => (
                    <Login dataSchool={dataSchool?.schoolPublic} />
                )
            });

            /*const Forgotpassword = loadable(() => import("../../features/Forgotpassword"), {
                fallback: <SpinPage />
            });
            routeGuests.push({
                path: "/forgot-password",
                title: "Quên mật khẩu",
                exact: true,
                main: () => (
                    <Forgotpassword />
                )
            });*/

            /*const Newpassword = loadable(() => import("../../features/Newpassword"), {
                fallback: <SpinPage />
            });
            routeGuests.push({
                path: "/new-password/:token",
                title: "Mật khẩu mới",
                exact: true,
                main: () => (
                    <Newpassword />
                )
            });

            routeGuests.push({
                path: "",
                title: "",
                exact: false,
                main: () => (
                    <Redirect to="/login" />
                )
            });*/

            return routeGuests;
        });
    }, [dataSchool]);

    let logo = dataSchool?.schoolPublic.avatar && dataSchool?.schoolPublic.avatar != "" ? `${dataSchool?.schoolPublic.avatar}` : `${process.env.PUBLIC_URL}/assets/img/logo-default.png`;
    let bannerLarge = dataSchool?.schoolPublic.bannerLarge && dataSchool?.schoolPublic.bannerLarge != "" ? `${dataSchool?.schoolPublic.bannerLarge}` : '';

    return loadingSchool ? (
        <SpinPage />
    ) : (
        dataSchool?.schoolPublic ? (
            <div className="wrapper-content">
                <Row gutter={0}>
                    <Col flex="auto">
                        <div
                            className="wrapper-banner"
                            style={{
                                backgroundImage: `url(${bannerLarge})`
                            }}
                        ></div>
                    </Col>
                    <Col flex="651px">
                        <div className="content">
                            <div className="content-top">
                                <Space size={16}>
                                    <div
                                        className="logo"
                                        style={{
                                            backgroundImage: `url(${logo})`
                                        }}
                                    ></div>
                                    <div className="info">
                                        <div className="sub">Hệ thống trường học quốc tế</div>
                                        <div className="main">{dataSchool?.schoolPublic.name}</div>
                                    </div>
                                </Space>
                            </div>
                            <div className="content-content">
                                <Switch>
                                    {routeGuests.map((route, index) => (
                                        <Route
                                            key={index}
                                            path={route.path}
                                            exact={route.exact}
                                            children={
                                                <>
                                                    {route.title && (
                                                        <Helmet>
                                                            <title>{route.title + (route.title != "" ? " - " : "")}Finki</title>
                                                        </Helmet>
                                                    )}
                                                    <route.main />
                                                </>
                                            }
                                        />
                                    ))}
                                </Switch>
                            </div>
                            <div className="content-bottom">
                                <Space>
                                    <div className="logo-footer">
                                        <Image src={logoFooter} preview={false} />
                                    </div>
                                </Space>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        ) : (
            <div>Not found.</div>
        )
    );
};

export default LayoutGuest;
