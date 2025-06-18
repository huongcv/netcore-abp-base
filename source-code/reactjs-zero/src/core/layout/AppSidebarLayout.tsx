import './AppSidebarLayout.scss';
import React, {useEffect, useState} from 'react';
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import {Button, Layout, Menu, theme} from 'antd';
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useStore} from "@ord-store/index";
import MenuUtils from "@ord-core/layout/menu.utils";
import HeaderRight from "@ord-core/layout/Header/HeaderRight";
import {BrowserView, MobileView} from 'react-device-detect';
import MobileLayout from "@ord-core/layout/MobileLayout";
import HeaderOperations from './Header/HeaderOperations';
import ThemeUtil from "@ord-core/theme/ord-theme.config";

const {Header, Sider, Content, Footer} = Layout;
const AppSidebarLayout: React.FC = () => {
    // const selectedKeys = [location.pathname];
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 920);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>();
    const [canHoverSider, setCanHoverSider] = useState(false);
    const [prePath, setPrePath] = useState(false);
    const navigate = useNavigate();
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const {sessionStore} = useStore();

    useEffect(() => {
        const data = MenuUtils.getMenuItems(sessionStore.appSession, sessionStore.systemCode);
        setMenuItems(data);
    }, [sessionStore]);
    useEffect(() => {
        const selectedKey = MenuUtils.removePrefixDefault(location.pathname)
        setSelectedKeys([selectedKey]);
        setDefaultOpenKeys(MenuUtils.getOpenKeys([selectedKey]));
    }, [location.pathname]);

    const changeCollapse = (val: boolean) => {
        if (canHoverSider)
            setCollapsed(val);
    }

    const toggleMenuClicked = () => {
        setCollapsed(!collapsed);
        setCanHoverSider(!collapsed)
    }
    const [width, setWidth] = useState(window.innerWidth > 1400 ? 250 : 190);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1400) {
                setWidth(250);
            } else {
                setWidth(200);
            }
            if (window.innerWidth <= 920) {
                setCollapsed(true);
            }
        };

        // Lắng nghe sự kiện resize
        window.addEventListener('resize', handleResize);

        // Cleanup sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <BrowserView>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider trigger={null} collapsible collapsed={collapsed}
                           width={width}
                           onMouseOver={() => changeCollapse(false)} onMouseLeave={() => changeCollapse(true)}>
                        <div className="logo-vertical">
                            <Link to={''}>
                                {collapsed ? <img id="logo-img"
                                                  className="h-[100%] mt-[14px]"
                                                  onClick={() => navigate("/")}
                                                  src={ThemeUtil.getLogoSimpleUrl}
                                                  alt="Logo"/> :
                                    <img id="logo-img" className="ps-[0px] h-[100%]" src={ThemeUtil.getLogoUrl}
                                         alt="Logo"/>}
                            </Link>
                        </div>
                        {
                            defaultOpenKeys && <Menu
                                inlineIndent={16}
                                mode="inline"
                                className={'ord-sidebar-menu'}
                                items={menuItems}
                                selectedKeys={selectedKeys}
                                defaultOpenKeys={defaultOpenKeys}
                            />
                        }

                    </Sider>
                    <Layout>
                        <Header style={{
                            background: 'white',
                            color: '#505050',
                            padding: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: 80
                        }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                onClick={() => toggleMenuClicked()}
                                style={{
                                    marginLeft: '-10px',
                                    marginRight: '10px',
                                    fontSize: '16px',
                                    color: '#323232'
                                }}
                            />
                            <HeaderOperations/>
                            <div className='flex flex-grow-[2]'></div>
                            <HeaderRight/>
                        </Header>
                        <Content
                            style={{
                                margin: '0px 6px',
                                padding: '8px 16px',
                                minHeight: 280,
                                background: '#f1f1f1',
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Outlet/>
                        </Content>
                        <Footer style={{textAlign: 'center', padding: '6px'}}>
                            <b>{ThemeUtil.copyright}</b>
                        </Footer>
                    </Layout>
                </Layout>
            </BrowserView>
            <MobileView>
                <MobileLayout>
                    <Outlet/>
                </MobileLayout>
            </MobileView>
        </>


    );
};

export default AppSidebarLayout;
