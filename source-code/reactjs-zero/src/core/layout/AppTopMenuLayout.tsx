import React, {useEffect, useState} from 'react';
import {Layout, Menu, theme} from 'antd';
import {Outlet, useLocation} from 'react-router-dom';
import './AppTopMenuLayout.css';
import MenuUtils from "@ord-core/layout/menu.utils";
import {useStore} from "@ord-store/index";
import HeaderRight from "@ord-core/layout/Header/HeaderRight";
import OrdThemeConfig from "@ord-core/theme/ord-theme.config";

const {Header, Content, Footer} = Layout;
const AppTopMenuLayout = () => {
    const {sessionStore} = useStore();
    const location = useLocation();
    const selectedKeys = [location.pathname];
    const [menuItems, setMenuItems] = useState([]);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    useEffect(() => {
        setMenuItems(MenuUtils.getMenuItems(sessionStore.appSession, sessionStore.systemCode));
    }, [sessionStore]);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={{
                background: '#fff',
                padding: 0,
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div className="header-logo">
                    <img src={OrdThemeConfig.getLogoUrl} alt="logo"/>
                </div>
                <Menu
                    theme="light"
                    mode="horizontal"
                    items={menuItems}
                    selectedKeys={selectedKeys}
                    style={{flex: 1}}
                >

                </Menu>

                <HeaderRight/>


            </Header>
            <Layout>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet/>
                </Content>
                <Footer style={{textAlign: 'center'}}>Orenda</Footer>
            </Layout>
        </Layout>
    );
};

export default AppTopMenuLayout;
