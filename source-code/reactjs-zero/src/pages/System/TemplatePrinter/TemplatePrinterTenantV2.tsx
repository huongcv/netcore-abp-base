import { CheckCircleOutlined, DeleteOutlined, DownloadOutlined, StopOutlined } from "@ant-design/icons";
import { ShopTemplatePrinterDto } from "@api/index.defs";
import { ShopTemplatePrinterService } from "@api/ShopTemplatePrinterService";
import { TemplatePrinterService } from "@api/TemplatePrinterService";
import { UploadFileService } from "@api/UploadFileService";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import tableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import RoleCreateOrUpdateForm from "@pages/Admin/Roles/CreateOrUpdateForm";
import { Tag } from "antd/lib";
import FileSaver from "file-saver";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TemplatePrinterV2: React.FC = () => {
    const { t } = useTranslation("template-printer-shop");
    const { shopTemplatePrinterStore: mainStore } = useStore();
    const navigate = useNavigate();

    const downloadFile = async (item: ShopTemplatePrinterDto) => {
        UiUtils.setBusy();
        try {
            const response = item.documentId
                ? await UploadFileService.downloadFile({ fileId: item.documentId }, { responseType: "blob" })
                : await TemplatePrinterService.downloadDefaultSystemFile(
                    { enumId: item.templatePrintEnumId ?? 0 },
                    { responseType: "blob" }
                );
            if (response) {
                FileSaver.saveAs(response, item.fileName);
            } else {
                throw new Error(t("excelAlert.errorDownload"));
            }
        } catch (error) {
            console.error(error);
        } finally {
            UiUtils.clearBusy();
        }
    };

    const reloadData = () => {
        mainStore.searchData({});
    }

    const columns = tableUtil.getColumns([
        {
            title: t("name"),
            dataIndex: "name",
            width: 200,
            render: (value: string, record: ShopTemplatePrinterDto) => (
                <>
                    <div>{value}</div>
                    {record.isDefault && (
                        <Tag className="bg-[#FFEAEE]" color="#e5ffee">
                            <span className="text-[#3BB54A]">{t("default")}</span>
                        </Tag>
                    )}
                </>
                
            ),
        },
        { title: t("tplType"), dataIndex: "templatePrinterName", width: 200, },
        { title: t("notes"), dataIndex: "notes", width: 350, },
        IsActivedColumn(),
    ], {
        actions: [
            {
                title: "download",
                icon: <DownloadOutlined />,
                onClick: async (item: ShopTemplatePrinterDto) => {
                    await downloadFile(item)
                },
            },
            {
                title: "",
                content: (item: ShopTemplatePrinterDto) => {
                    return item.isActived ? (
                        <div
                            style={{ color: "#f5413d" }}
                            onClick={async () => {
                                await ShopTemplatePrinterService.changeActive({ id: Number(item.id) });
                                reloadData();
                            }}
                        >
                            <StopOutlined />{" "}
                            <span className="ml-1">{t("changeIsActive.unActive")}</span>
                        </div>
                    ) : (
                        <div
                            style={{ color: "#1AB01A" }}
                            onClick={async () => {
                                await ShopTemplatePrinterService.changeActive({ id: Number(item.id) });
                                reloadData();
                            }}
                        >
                            <CheckCircleOutlined />{" "}
                            <span className="ml-1">{t("changeIsActive.active")}</span>
                        </div>
                    )
                }
            },
            {
                title: "remove",
                icon: <DeleteOutlined />,
                onClick: (item: ShopTemplatePrinterDto) => {
                    UiUtils.showConfirm({
                        data: { name: item.name },
                        title: t("confirmDeleteItemTitle"),
                        content: (
                            <Trans
                                ns="template-printer-shop"
                                i18nKey="confirmDeleteItem"
                                values={item}
                                components={{ italic: <i />, bold: <strong /> }}
                            />
                        ),
                        onOk: async () => {
                            await ShopTemplatePrinterService.delete({ id: Number(item.id) });
                            reloadData();
                        },
                    });
                }
            },
        ],
        viewAction: (item: ShopTemplatePrinterDto) => {
            navigate(`update/${item.id}`);
        },
        ns: mainStore.getNamespaceLocale()
    });

    const topActions: IActionBtn[] = [
        {
            title: "addNew",
            onClick: () => navigate("create"),
        },
    ];

    return (
        <OrdCrudPage
            stored={mainStore}
            columns={columns}
            contentTopTable={
                <IsActiveStatusCounter getCountApi={ShopTemplatePrinterService.getCount} />
            }
            topActions={topActions}
            searchForm={(f) => <SearchFilterText />}
            entityForm={(f) => <RoleCreateOrUpdateForm form={f} />}
        />
    );
};

export default TemplatePrinterV2;
