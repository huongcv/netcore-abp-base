import * as React from 'react';
import {Card, Col, Row} from 'antd';
import DocumentTitle from "react-document-title";
import {Outlet} from "react-router-dom";
import './AuthLayout.scss';
import ThemeUtil from "@ord-core/theme/ord-theme.config";


class AuthLayout extends React.Component<any> {

    render() {
        const logo = ThemeUtil.getLogoUrl;
        const bgLoginUnder = ThemeUtil.bgLoginUnder;
        const bgLoginLeft = ThemeUtil.bgLoginLeft;
        return <DocumentTitle title={'vPos - Đăng nhập'}>
            <div className="main-content grid grid-cols-2 max-md:grid-cols-1" style={{
                background: `url('${bgLoginUnder}') no-repeat bottom`,
                backgroundSize: 'cover'
            }}>
                <div className="max-md:hidden flex items-center justify-end">
                    <img className="max-h-[90vh]" src={bgLoginLeft} alt="image"/>
                </div>
                <div className="bg-w container-fluid">
                    <div
                        className="relative md:pt-[22vh] bg-top bg-no-repeat bg-contain">
                        <div className="admin">
                            <Row className="justify-center auth-container mt-3">
                                <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={12}>
                                    <Card className="py-3 border-0 rounded-2xl">
                                        <div className="text-center mb-[20px]">
                                            <a href="/auth/login">
                                                <img className="inline w-[160px]" src={logo}
                                                     alt="image"/>
                                            </a>
                                        </div>
                                        <Outlet/>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                {/*<div className="max-md:hidden">*/}
                {/*    <img className="size-full object-cover h-[100vh]" src="/images/bg-login2.png" alt="image" />*/}
                {/*</div>*/}
            </div>


        </DocumentTitle>
    }
}

export default AuthLayout;
