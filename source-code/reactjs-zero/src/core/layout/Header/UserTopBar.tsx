import React from "react";
import {Button, Dropdown, MenuProps} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import jwtUtils from "@ord-core/utils/jwt.utils";
import {AuthService} from "@api/AuthService";
import {IconlyLight} from "@ord-components/icon/IconlyLight";

const UserTopBar: React.FC = () => {
    const {sessionStore} = useStore();
    const {t} = useTranslation(['common']);
    const items: MenuProps['items'] = [
        sessionStore.appSession.user?.tenantDto?.name ? {
            label: (<span className="font-bold">
                {sessionStore.appSession.user?.tenantDto?.name}
            </span>),
            key: '0',
        } : null,
        {
            label: (<span className="text-blue-500 font-bold">
                {sessionStore.appSession.user?.name}
            </span>),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: (<span><LogoutOutlined className="me-1"/> {t('logout')}</span>),
            key: '3',
            onClick: async () => {
                try {
                    await AuthService.logout();
                } catch {

                }
                jwtUtils.signOut();
            }
        },
    ];

    return (
        <Dropdown menu={{items}} placement="bottomRight">
            <Button className={'btn-other border-0'} icon={<IconlyLight type={'Profile.svg'}/>}></Button>
            {/*<Space className="cursor-pointer">*/}
            {/*    <Avatar size="large" src ='/images/user-avatar.png'/>*/}
            {/*    <b>{sessionStore.appSession?.user?.userName}</b>*/}
            {/*    <DownOutlined/>*/}
            {/*</Space>*/}
        </Dropdown>
    );
}
export default UserTopBar;
