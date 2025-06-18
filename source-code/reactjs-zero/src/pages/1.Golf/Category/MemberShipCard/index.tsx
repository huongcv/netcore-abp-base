import { AccessCardDto, } from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { Button, Dropdown, Form, MenuProps, Row, Space, TableColumnsType, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ModalCrudAccessCard from "./ModalCrudAccessCard";
import HistoryAccessCard from "./HistoryAccessCard";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { HistoryOutlined, RollbackOutlined } from "@ant-design/icons";
import { DownOutlined, ExportOutlined, FileExcelOutlined, ImportOutlined } from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import { AccessCardService } from "@api/AccessCardService";
import {AccessCardStatusEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useAccessCardTypeEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectAccessCardTypeEnum";
import { useAccessCardStatusEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectAccessCardStatusEnum";
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import { AccessCardSearchForm } from "./AccessCardSearchForm";

const GolfAccessCard = () => {
    const { golfAccessCardStore: mainStore } = useStore();
    const { t } = useTranslation(mainStore.getNamespaceLocale());
    const { t: tEnum } = useTranslation("enum");
    const navigate = useNavigate();

    const handleRecallCard = (d: AccessCardDto) => {
        UiUtils.showConfirm({
            title: t("confirmRecallTitle"),
            content: (
                <Trans
                    ns={mainStore.getNamespaceLocale()}
                    i18nKey="confirmRecall"
                    values={{
                        code: d.code,
                    }}
                    components={{ italic: <i />, bold: <strong /> }}
                />
            ),
            onOk: async () => {
                UiUtils.setBusy();
                try {
                    if (d.id === '' ||  d.id == undefined)
                        return;
                
                    const update = await AccessCardService.revokeCardByAccessCardId({
                        body:{
                            accessCardId: d.id,
                            note:"Thu hồi thẻ "
                        }
                    })
                
                    if (update.isSuccessful) {
                        UiUtils.showSuccess(t(`recallSuccess`));
                        mainStore.refreshGridData(true);
                    } else {
                        UiUtils.showError(t(`recallFaild`));
                    }
                } catch (err: any) {
                    UiUtils.showError(t(`updateIsActiveFaildErr500`) + err?.Message);
                } finally {
                    UiUtils.clearBusy();
                }
            },
            onCancel: () => {},
            isDanger: true,
        });
    };
    
    const columns: TableColumnsType<AccessCardDto> = TableUtil.getColumns(
        [
            {
                title: "printedNumber",
                dataIndex: "printedNumber",
                width: 200,
            },
             {
                title: "uid",
                dataIndex: "uid",
                width: 200,
            },
            {
                title: "accessCardColor",
                dataIndex: "cardColorName",
                width: 140,
                render: (text: string | null | undefined, record: AccessCardDto) => {
                    if (!text) {
                        return '-';
                    }

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: text,
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    );
                }
            },
            {
                title: "cardType",
                width: 140,
                render: (_: any, record: AccessCardDto) => (
                    <>
                        {tEnum(record.strCardType || "")}
                    </>
                ),
            },
            {
                title: "accessStatus",
                width: 140,
                render: (_: any, record: AccessCardDto) => (
                    <>
                        {tEnum(record.strAccessStatus || "")}
                    </>
                ),
            },
            {
                title: "status",
                dataIndex: "isActived",
                align: "center",
                render: (_: any, record: any) => (
                    <>
                        {record?.isActived ? (
                            <Tag className="me-0 ord-cell-actived">{t("dang_hoat_dong")}</Tag>
                        ) : (
                            <Tag className="me-0 ord-cell-inactived">
                                {t("ngung_hoat_dong")}
                            </Tag>
                        )}
                    </>
                ),
                width: 100,
            },
        ],
        {
            actions: [
                {
                    title: "edit",
                    onClick: (d) => {
                        mainStore.createOrUpdateModal.width = 800;
                        mainStore.openUpdateModal(d);
                    },
                },
                {
                    title: "recoverCard",
                    icon: <RollbackOutlined />,
                    onClick: (d) => {
                        handleRecallCard(d);
                    },
                    hiddenIf: (d: AccessCardDto) => {
                        return d.accessStatus !== AccessCardStatusEnum.Assigned
                    },
                },
                {
                    title: "view-history",
                    icon: <HistoryOutlined style={{fontSize: 20}}/>,
                    onClick: (d) => {
                        mainStore.openHistoryModal(d);
                    },
                },
                {
                    title: "remove",
                    onClick: (d: any) => {
                        mainStore.openRemoveById(d);
                    },
                },
            ] as ITableAction<AccessCardDto>[],
            ns: mainStore.getNamespaceLocale(),
            viewAction: (d) => {
                mainStore.createOrUpdateModal.width = 800;
                mainStore.openUpdateModal(d);
            },
        }
    );

    const items: MenuProps["items"] = [
        {
            label: (
                <a
                    onClick={() => {
                        navigate("import-excel");
                    }}
                >
                    <Space>
                        <ImportOutlined /> Nhập excel
                    </Space>
                </a>
            ),
            key: "0",
        },
        {
            label: (
                <a
                    onClick={() => mainStore.exportExcelPagedResult().then()}
                    type={"text"}
                >
                    <Space>
                        <ExportOutlined />
                        {t("actionBtn.exportExcel")}
                    </Space>
                </a>
            ),
            key: "1",
        },
    ];

    const topActions: IActionBtn[] = [
        {
            content: (
                <Dropdown
                    className={"btn-secondary"}
                    menu={{ items }}
                    trigger={["hover"]}
                >
                    <Button>
                        <Space>
                            <FileExcelOutlined />
                            {t("actionBtn.actionExcel")}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            ),
        },
        {
            title: "addNew",
            onClick: () => {
                mainStore.createOrUpdateModal.width = 800;
                mainStore.openCreateModal();
            },
        },
    ];


    return (
        <>
            <OrdCrudPage
                stored={mainStore}
                classNameTable="table-padding"
                topActions={topActions}
                columns={columns}
                searchForm={(f) => <AccessCardSearchForm />}
                entityForm={() => <ModalCrudAccessCard />}
            ></OrdCrudPage>
            <HistoryAccessCard />
        </>
    );
};

export default observer(GolfAccessCard);
