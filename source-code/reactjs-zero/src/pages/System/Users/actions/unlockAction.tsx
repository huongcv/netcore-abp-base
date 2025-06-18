import {UserDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import {Trans, useTranslation} from "react-i18next";
import {UserService} from "@api/UserService";
import UiUtils from "@ord-core/utils/ui.utils";
import {Space} from "antd";
import {UnlockOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import React from "react";

const UnlockAction = (props: { user: UserDto }) => {
    const {userSystemListStore, entityModalStore} = useStore();
    const {t} = useTranslation(userSystemListStore.getNamespaceLocale());
    const handleClick = () => {
        const {user} = props;
        UiUtils.showConfirm(
            {
                data: {
                    ...user
                },
                title: t('confirmUnlockTitle'),
                content: (<Trans ns={userSystemListStore.getNamespaceLocale()}
                                 i18nKey="confirmUnlock"
                                 values={user}
                                 components={{italic: <i/>, bold: <strong/>}}></Trans>),
                onOk: (d: UserDto) => {
                    if (d.id) {
                        UserService.unLock({
                            userId: d.id
                        }).then(() => {
                            const content = t("unlockSuccess", {...user}) as string;
                            UiUtils.showSuccess(content);
                            userSystemListStore.refreshGridData();
                        });
                    }

                }
            }
        );
    }
    return (<>
        <div onClick={handleClick}>
            <Space><UnlockOutlined/>{t('action.unlockUser')}</Space>
        </div>
    </>);
}
export default observer(UnlockAction);
