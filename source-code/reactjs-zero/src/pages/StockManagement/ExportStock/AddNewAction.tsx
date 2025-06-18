import {Button, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React from "react";
import {useTranslation} from "react-i18next";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {useStore} from "@ord-store/index";
import ModalTableImportStockMain from "./ModalTableImportStockMain";

export const ExportStockAddNewActionBtn = () => {
    const [t] = useTranslation("exportStock");
    const {exportStockMoveStore} = useStore();
    useHotkeys(
        "F2",
        (event) => {
            handlerAddNew();
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );

    const handlerAddNew = () => {
        exportStockMoveStore.openDetail();
    };
    return (
        <>
            <Button type="primary" onClick={handlerAddNew}>
                <Space>
                    <PlusOutlined/>
                </Space>
                {t("actionBtn.addNew")} (F2)
            </Button>
            <ModalTableImportStockMain/>
        </>
    );
};
