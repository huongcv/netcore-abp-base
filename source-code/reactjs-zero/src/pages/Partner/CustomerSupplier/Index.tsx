import {
    CheckCircleOutlined,
    DownOutlined,
    ExportOutlined,
    FileExcelOutlined,
    ImportOutlined,
    MoneyCollectOutlined,
    StopOutlined
} from "@ant-design/icons";
import { PartnerDto } from "@api/index.defs";
import { PartnerDoctorService } from "@api/PartnerDoctorService";
import { SupplierService } from "@api/SupplierService";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPartnerGroup } from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { PARTNER_PER } from "@ord-core/config/permissions/partner.permission";
import { fetchSyncDataPartners } from "@ord-core/db/services/syncDataPartners";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import {
    Button,
    Col,
    Dropdown,
    Form,
    MenuProps,
    Space,
    Spin,
    TableColumnsType
} from "antd";
import { observer } from "mobx-react-lite";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GroupNamesCell } from "../Shared/GroupNamesCell";
import { PartnerGroupService } from "@api/PartnerGroupService";
import PartnerGroupBtn from "../Shared/PartnerGroup/PartnerGroupBtn";

const CustomerSupplier = () => {
    const {
        customerSupplierStore: mainStore,
        supplierDebtStore: debtStore,
        customerGroupStore: cusGroupStore,
        partnerTransactionStore: transactionStore,
        supplierGroupStore,
        selectDataSourceStore
    } = useStore();
    const { t: tEnum } = useTranslation("enum");
    const { t } = useTranslation("customer-supplier");
    const { t: tCommon } = useTranslation("common");
    const navigate = useNavigate();

    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    const handleChangeIsActivePartner = async (
        id: number,
        isActived: boolean
    ) => {
        try {
            UiUtils.setBusy();
            if (id == 0 || isActived == null || isActived == undefined) return;
            const update = await PartnerDoctorService.changePartnerStatus({
                id,
                isActived,
            });
            if (update.isSuccessful) {
                UiUtils.showSuccess(t(`updateIsActiveSuccessfully`));
                mainStore.refreshGridData(true);
            } else {
                UiUtils.showError(t(`updateIsActiveFaild`));
            }
        } catch (err: any) {
            UiUtils.showError(t(`updateIsActiveFaildErr500`) + err?.Message);
        } finally {
            UiUtils.clearBusy();
        }
    };

    const columns: TableColumnsType<PartnerDto> = TableUtil.getColumns(
        [
            {
                title: "code",
                dataIndex: "code",
                width: 150,
                render: (_, record) => {
                    return (<>
                        <a className="font-semibold underline"
                            onClick={() => mainStore.openUpdateModal(record)}>{_}</a>
                    </>)
                }
            },
            {
                dataIndex: "name",
                title: "name",
                width: 200,
            },
            {
                dataIndex: "groupNames",
                title: "groupId",
                width: 200,
                render: (groupNames: string) => (
                    <GroupNamesCell groupNames={groupNames} title={t("groupId")} />
                ),
                ellipsis: true,
            },
            {
                dataIndex: "phone",
                title: "phone",
                width: 150,
                render: (v: string, record: PartnerDto) => {
                    return <>{Utils.transformPhoneNumber(v)}</>;
                },
            },

            {
                dataIndex: "address",
                title: "address",
                width: 200,
            },
            {
                dataIndex: "debtAmount",
                title: "debtAmount",
                align: "right",
                width: 150,
                render: (v: number, record: PartnerDto) => {
                    return <>{v ? formatter.format(v) : "-"}</>;
                },
            },
            IsActivedColumn(),
        ],
        {
            actions: [
                // {
                //   title: "view",
                //   onClick: (d: PartnerDto) => {
                //     // mainStore.openViewDetailModal(d);
                //     navigate("details/" + d.idHash);
                //   },
                // },
                // {
                //   title: "edit",
                //   onClick: (d) => {
                //     mainStore.openUpdateModal(d);
                //   },
                // },

                {
                    title: "changeDebt",
                    icon: <MoneyCollectOutlined />,
                    onClick: (d) => {
                        const record = d as PartnerDto;
                        debtStore.openCreateModal({
                            partnerId: record.id,
                            formPartnerType: "supplier",
                            partnerName: record.name,
                            partnerCode: record.code,
                            debt: record.debtAmount,
                            currentDebtAmount: record.debtAmount,
                            transactionDate: new Date(),
                        });
                    },
                },
                {
                    title: "changePay",
                    icon: <MoneyCollectOutlined />,
                    onClick: (d) => {
                        const record = d as PartnerDto;
                        transactionStore.openViewChangePayModal(parseInt(record.id ?? "0"));
                    },
                },
                {
                    title: "",
                    content: (d: PartnerDto) => {
                        return d.isActived ? (
                            <div
                                style={{ color: "#f5413d" }}
                                onClick={() => {
                                    handleChangeIsActivePartner(Number(d.id), false);
                                }}
                            >
                                <StopOutlined />{" "}
                                <span className="ml-1">{t("changeIsActive.unActive")}</span>
                            </div>
                        ) : (
                            <div
                                style={{ color: "#1AB01A" }}
                                onClick={() => {
                                    handleChangeIsActivePartner(Number(d.id), true);
                                }}
                            >
                                <CheckCircleOutlined />{" "}
                                <span className="ml-1">{t("changeIsActive.active")}</span>
                            </div>
                        );
                    },
                },
                {
                    title: "remove",
                    onClick: (d) => {
                        mainStore.openRemoveById(d);
                    },
                },
            ],
            viewAction: (d) => {
                mainStore.openUpdateModal(d);
            },
            ns: "customer-supplier",
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
            title: t("actionBtn.CustomerGroup"),
            permission: PERMISSION_APP.customer.customerGroup,
            content: (
                <>
                    <PartnerGroupBtn partnerType={2} store={supplierGroupStore}></PartnerGroupBtn>
                </>
            ),
        },
        {
            permission: PARTNER_PER.customerGroup,
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
            permission: PERMISSION_APP.stock.supplier + ".Create",
            onClick: () => {
                mainStore.openCreateModal();
            },
        },
    ];
    const LazyModalCruSupplier = lazy(
        () => import("@pages/Partner/CustomerSupplier/ModalCruCustomerSupplier")
    );
    const LazyModalChangePay = lazy(
        () => import("@pages/Partner/Shared/ModalChangePay")
    );
    const LazyModalChangeDebt = lazy(
        () => import("@pages/Partner/Shared/ModalChangeDebt")
    );
    return (
        <>
            <OrdCrudPage
                stored={mainStore}
                topActions={topActions}
                columns={columns}
                contentTopTable={
                    <IsActiveStatusCounter
                        getCountApi={SupplierService.getCount}
                    />
                }
                searchForm={(f) => (
                    <>
                        <Col {...useResponsiveSpan(6)}>
                            <FloatLabel label={t("groupId")}>
                                <Form.Item name={["groupId"]}>
                                    <OrdSelect datasource={useSelectPartnerGroup(2)} allowClear></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <SearchFilterText
                            span={10}
                            placeHolder={t("customerSearchtring")}
                        />
                    </>
                )}
                onEntitySavedSuccess={() => {
                    fetchSyncDataPartners().then();
                    selectDataSourceStore.clearByName("PartnerGroup_2"),
                        selectDataSourceStore.getOptions("PartnerGroup_2", async () => {
                            const result = await PartnerGroupService.getComboOptions({
                                type: 2
                            });
                            return Utils.mapCommonSelectOption(result);
                        });
                    mainStore.refreshGridData()
                }}
            ></OrdCrudPage>
            <Suspense fallback={<Spin />}>
                {mainStore.createOrUpdateModal.visible && (
                    <LazyModalCruSupplier stored={mainStore}></LazyModalCruSupplier>
                )}
            </Suspense>

            <Suspense fallback={<Spin />}>
                {debtStore.createOrUpdateModal.visible && (
                    <LazyModalChangeDebt
                        stored={debtStore}
                        partnerType={1}
                        onCruSuccess={() => {
                            mainStore.refreshGridData(true).then();
                        }}
                    ></LazyModalChangeDebt>
                )}
            </Suspense>

            <Suspense fallback={<Spin />}>
                {transactionStore.changePayModal.visible && (
                    <LazyModalChangePay partnerType={2} onSaveSuccess={() => {
                        mainStore.refreshGridData(true).then();
                    }}></LazyModalChangePay>
                )}
            </Suspense>
        </>
    );
};

export default observer(CustomerSupplier);
