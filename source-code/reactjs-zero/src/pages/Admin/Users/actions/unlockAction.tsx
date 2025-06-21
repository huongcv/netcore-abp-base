import {UserDto} from "@api/index.defs";
import {Trans, useTranslation} from "react-i18next";
import {UserService} from "@api/UserService";
import UiUtils from "@ord-core/utils/ui.utils";
import {Space} from "antd";
import {UnlockOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import React from "react";
import {useUserLogic} from "@pages/Admin/Users/useUserLogic";

const UnlockAction = (props: { user: UserDto }) => {
    const {t} = useTranslation();
    const {tableStore} = useUserLogic();
    const {onLoadData} = tableStore();
    const handleClick = () => {
        const {user} = props;
        UiUtils.showConfirm(
            {
                data: {
                    ...user
                },
                title: t('confirmUnlockTitle'),
                content: (<Trans ns={'confirm'}
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
                            onLoadData().then();
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
