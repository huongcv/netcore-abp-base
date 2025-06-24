import React, {useCallback, useMemo} from "react";
import {Button, Dropdown, MenuProps} from "antd";
import {LogoutOutlined, RedoOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import jwtUtils from "@ord-core/utils/jwt.utils";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import authApiService from "@ord-core/service-proxies/auth/authApiService";
import {UserImpersonationService} from "@api/base/UserImpersonationService";
import UiUtils from "@ord-core/utils/ui.utils";

const UserTopBar: React.FC = () => {
    const {sessionStore} = useStore();
    const {t} = useTranslation(['common']);

    // Memoized user data to prevent unnecessary re-renders
    const userData = useMemo(() => ({
        tenantName: sessionStore.appSession.user?.tenantDto?.name,
        userName: sessionStore.appSession.user?.name,
        isLoginImpersonation: sessionStore.appSession.userCurrent?.isLoginImpersonation
    }), [sessionStore.appSession.user]);

    // Memoized logout handler
    const handleLogout = useCallback(async () => {
        UiUtils.setBusy();
        try {
            await authApiService.logout();
        } catch (error) {
        } finally {
            jwtUtils.signOut();
            UiUtils.clearBusy();
        }
    }, []);

    // Memoized return admin handler (placeholder)
    const handleReturnAdmin = useCallback(async () => {
        UiUtils.setBusy();
        try {
            const result = await UserImpersonationService.returnToAdmin();
            if (result.isSuccessful) {
                location.href = '';
            }
        } catch (error) {
        } finally {
            UiUtils.clearBusy();
        }
    }, []);

    // Memoized dropdown items
    const dropdownItems = useMemo(() => {
        const items: MenuProps['items'] = [];

        const {tenantName, userName, isLoginImpersonation} = userData;

        // Add tenant name if exists
        if (tenantName) {
            items.push({
                label: (
                    <span className="font-bold">
                        {tenantName}
                    </span>
                ),
                key: 'tenant-name',
            });
        }

        // Add user name
        items.push({
            label: (
                <span className="text-blue-500 font-bold">
                    {userName}
                </span>
            ),
            key: 'user-name',
        });

        // Add divider
        items.push({
            type: 'divider',
        });
        if (isLoginImpersonation === true) {
            // Add return admin option
            items.push({
                label: (
                    <span>
                    <RedoOutlined className="me-1"/>
                        {t('returnAdminAccountLoginImpersonation')}
                </span>
                ),
                key: 'return-admin',
                onClick: handleReturnAdmin,
            });
        }


        // Add logout option
        items.push({
            label: (
                <span>
                    <LogoutOutlined className="me-1"/>
                    {t('logout')}
                </span>
            ),
            key: 'logout',
            onClick: handleLogout,
        });

        return items;
    }, [userData]);

    return (
        <Dropdown
            menu={{items: dropdownItems}}
            placement="bottomRight"
            trigger={['click']}
        >
            <Button
                className="btn-other border-0"
                icon={<IconlyLight type="Profile.svg"/>}
                aria-label="User menu"
            />
            {/*{/<Space className="cursor-pointer">/}*/}
            {/*    <Avatar size="large" src ='/images/user-avatar.png'/>/}
            {/    <b>{sessionStore.appSession?.user?.userName}</b>/}
            {/    <DownOutlined/>/}
            {/</Space>*/}
        </Dropdown>
    );
};

export default React.memo(UserTopBar);