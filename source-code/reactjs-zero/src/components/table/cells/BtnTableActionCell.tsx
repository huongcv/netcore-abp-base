import {useTranslation} from "react-i18next";
import {Button, Dropdown, MenuProps, Space} from "antd";
import React from "react";
import {DeleteOutlined, DownOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {l} from "@ord-core/language/lang.utils";

const BtnTableActionCell = (prop: {
    permission?: string;
    record?: any;
    hiddenIf?: (record: any) => boolean;
    callBackSuccess?: (data: any) => void;
    ns?: string;

}) => {
    const {t} = useTranslation(prop.ns ?? 'common');
    const {sessionStore, entityModalStore} = useStore();


    return (<>
        {prop?.callBackSuccess && <Button
            hidden={!checkPermissionUser(sessionStore.appSession, prop?.permission) || prop.hiddenIf && prop.hiddenIf(prop?.record || {})}
            title={t("actionBtn.view")}
            icon={<EyeOutlined/>}
            onClick={() => {
                if (prop?.callBackSuccess) prop?.callBackSuccess(prop.record);
            }}
        />}
    </>);
}
export default observer(BtnTableActionCell);
