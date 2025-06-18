import { CheckCircleOutlined, DeleteOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";
import { GolfBookingGroupDto, } from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { Button, TableColumnsType, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CreateOrUpdateFormCusGroup from "./ModalCrudGoferGroup";
import UiUtils from "@ord-core/utils/ui.utils";
import { GolfBookingGroupService } from "@api/GolfBookingGroupService";

const CustomerGroup = () => {
    const { golfCustomerGroupStore: mainStore } = useStore();
    const { t } = useTranslation("golf-customer-group");
    const navigate = useNavigate();

    const handleChangeIsActivePartner = async (
        id: number,
        isActived: boolean
    ) => {
        try {
            UiUtils.setBusy();
            if (id == 0 || isActived == null || isActived == undefined) return;
            const update = await GolfBookingGroupService.changePartnerGroupStatus({
                groupId: id,
                isActived: isActived,
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

    const columns: TableColumnsType<GolfBookingGroupDto> = TableUtil.getColumns(
        [
            {
                title: "groupNo",
                dataIndex: "groupNo",
                width: 140,
            },
            {
                dataIndex: "groupName",
                title: "groupName",
                width: 200,
            },
            {
                dataIndex: "representative",
                title: "representative",
                width: 200,
                render: (_: string, record: GolfBookingGroupDto) => <>{record.partnerName}</>,
            },
            {
                dataIndex: "membership",
                title: "membership",
                width: 140,
            },
            {
                dataIndex: "createdDate",
                title: "createdDate",
                width: 140,
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
                    title: "",
                    content: (d: GolfBookingGroupDto) => {
                        return (
                            <div onClick={() => {
                                navigate(`/app/golf/golfer-group/customer-group-detail/${d.id}`)
                            }}>
                                <EditOutlined style={{ fontSize: 20 }} />{" "}
                                <span className="ml-1">{t("editGroupCustomer")}</span>
                            </div>
                        );
                    },
                },
                {
                    title: "",
                    content: (d: GolfBookingGroupDto) => {
                        return d.isActived ? (
                            <div
                                onClick={() => {
                                    handleChangeIsActivePartner(Number(d.id), false);
                                }}
                            >
                                <StopOutlined />{" "}
                                <span className="ml-1">{t("changeIsActive.unActive")}</span>
                            </div>
                        ) : (
                            <div
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
                    title: "",
                    content: (d: GolfBookingGroupDto) => {
                        return (
                            <div onClick={() => mainStore.openRemoveById(d)}>
                                <DeleteOutlined style={{ fontSize: 20, color: "red" }} />{" "}
                                <span className="ml-1" style={{ color: "#DD0E0E" }}>{t("removeGroupCustomer")}</span>
                            </div>
                        );
                    },
                },
            ],
            ns: mainStore.getNamespaceLocale(),
            viewAction: (d) => {
                mainStore.createOrUpdateModal.width = 800;
                mainStore.openUpdateModal(d);
            },
        }
    );

    const topActions: IActionBtn[] = [
        {
            title: t("actionBtn.CustomerGroup"),
            permission: PERMISSION_APP.customer.customerGroup,
            content: (
                <>
                    <Button onClick={()=>{mainStore.exportExcelPagedResult().then()}}
                        icon={
                            <IconlyLight
                                style={{ paddingTop: 5 }}
                                width={20}
                                type={"Excel-Golf.svg"}
                            />
                        }
                    >
                        {t("exportExcel")}
                    </Button>
                </>
            ),
        },
        {
            title: t("actionBtn.CustomerGroup"),
            permission: PERMISSION_APP.customer.customerGroup,
            content: (
                <>
                    <Button onClick={()=>{navigate("import-excel")}}
                        icon={
                            <IconlyLight
                                style={{ paddingTop: 5 }}
                                width={20}
                                type={"Excel-Golf.svg"}
                            />
                        }
                    >
                        {t("importExcel")}
                    </Button>
                </>
            ),
        },
        {
            title: "addNew",
            permission: "Partner.Customer.Create",
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
                searchForm={(f) => (
                    <>
                        {/* <Col {...useResponsiveSpan(6)}>
                            <FloatLabel label={t("groupId")}>
                                <Form.Item name={["groupId"]}>
                                    <OrdSelect
                                        datasource={useSelectPartnerGroup(1)}
                                        allowClear
                                    ></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                        </Col> */}

                        <SearchFilterText
                            span={12}
                            placeHolder={t("golferGroupSearching")}
                        />
                    </>
                )}
                entityForm={() => <CreateOrUpdateFormCusGroup />}
            ></OrdCrudPage>

        </>
    );
};

export default observer(CustomerGroup);
