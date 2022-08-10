import React, {useEffect, useState} from 'react';
import './index.scss';
import {Col, Image, Row, Form, Input, Checkbox, Button, message} from "antd";
import HeaderFormGuest from "../../components/Layout/HeaderFormGuest";
import {useMutation, useQuery} from "@apollo/client";
import {LOGIN, SCHOOL_PUBLIC} from "./gql";
import {useHistory} from "react-router-dom";

const Login = ({dataSchool}) => {
    const [form] = Form.useForm();

    const [login, { loading: loadingLogin, error: errorLogin, data: dataLogin }] = useMutation(LOGIN);
    useEffect(() => {
        if(!loadingLogin && errorLogin){
            message.error('Tài khoản hoặc mật khẩu không đúng');
            form.setFieldsValue({
                txtPassword: ""
            });
        }else if(!loadingLogin && dataLogin){
            localStorage.setItem('token', dataLogin.login.accessToken);
            window.location.href = "/school";
        }
    }, [loadingLogin, errorLogin, dataLogin])

    const onFinish = (values) => {
        login({
            variables:{
                schoolId: parseInt(dataSchool.id),
                username: values.txtUsername,
                password: values.txtPassword,
            }
        }).catch ((e) => {
            // console.log(e.graphQLErrors)
        });
    };

    return (
        <>
            <HeaderFormGuest
                title="Đăng nhập"
                description={`Chào mừng bạn đến với trang quản trị của ${dataSchool?.name}`}
            />
            <Form
                layout="vertical"
                form={form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Tài khoản hoặc email"
                    name="txtUsername"
                    rules={[{ required: true, message: 'Hãy nhập tên tài khoản hoặc Email' }]}
                    hasFeedback
                >
                    <Input size="large" placeholder="Nhập tài khoản hoặc email của bạn" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="txtPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập mật khẩu'
                        },
                        {
                            min: 6,
                            message: 'Mật khẩu phải có ít nhất 6 kí tự'
                        },
                    ]}
                >
                    <Input.Password size="large" placeholder="Nhập mật khẩu của bạn" />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Lưu mật khẩu</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button
                        className="btn-full-width"
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={loadingLogin}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default Login;
