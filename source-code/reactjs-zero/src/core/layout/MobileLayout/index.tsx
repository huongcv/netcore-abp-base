import {observer} from "mobx-react-lite";
import {Button, Drawer, Layout, Menu} from "antd";
import React, {useEffect, useState} from "react";
import {MenuOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import MenuUtils from "@ord-core/layout/menu.utils";
import {useLocation} from "react-router-dom";
import OrdThemeConfig from "@ord-core/theme/ord-theme.config";

const {Header, Content, Footer} = Layout;
const MobileLayout = (props: {
    children: any
}) => {
    const {sessionStore} = useStore();
    const [open, setOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const url = window.location.pathname.split('/').pop();
    const location = useLocation();
    const selectedKeys = [location.pathname];
    useEffect(() => {
        onClose();
    }, [url]);
    useEffect(() => {
        setMenuItems(MenuUtils.getMenuItems(sessionStore.appSession, sessionStore.systemCode));
    }, [sessionStore]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    return (<Layout>
        <Header style={{background: '#fff', padding: '15px 10px'}}>
            <div
                className="flex flex-wrap items-center justify-between ">
                <div className="logo">
                    <img src={OrdThemeConfig.getLogoUrl} alt="logo" style={{
                        height: 36
                    }}/>
                </div>
                <div className="flex items-center">
                    <Button onClick={showDrawer}
                            icon={<MenuOutlined/>}
                            type="text"
                    />
                </div>
            </div>


        </Header>
        <Layout>
            <Content>
                {props.children}
            </Content>


            <Drawer width={500} onClose={onClose} open={open}>
                <Menu mode="inline"
                      selectedKeys={selectedKeys}
                      items={menuItems}
                />
            </Drawer>
        </Layout>
    </Layout>);
}
export default observer(MobileLayout);
