import * as React from "react";
import { useEffect, useState } from "react";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useStore } from "@ord-store/index";
import { TableColumnsType, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TableUtil from "@ord-core/utils/table.util";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { ProductDto, ProductPriceListDto } from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import { PriceListFormSearch } from "@pages/ProductManagement/PriceList/forms/priceListFormSearch";
import CreateOrUpdateForm from "./forms/createOrUpdateForm";
import { StatusCell } from "@ord-components/table/cells/StatusCell";
import { fetchSyncDataProductPriceLists } from "@ord-core/db/services/syncDataProductPriceLists";
import { useProductPriceListUtils } from "../utils/product.utils";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { ProductPriceListService } from "@api/ProductPriceListService";
import { observer } from "mobx-react-lite";
import uiUtils from "@ord-core/utils/ui.utils";

const ProductPriceList: React.FC = () => {
    const { productPriceListStore: mainStore, selectDataSourceStore } =
        useStore();
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("price-list");
    const [priceListItem, setPriceListItem] = useState<ProductPriceListDto>();
    const navigate = useNavigate();

    const onChangePriceList = (item: ProductPriceListDto) => {
        setPriceListItem(item);
    };

    const { clearDatasource } = useProductPriceListUtils();

    useEffect(() => {
        mainStore.isOpenViaDetail = false;

        reloadData();

        return () => {
            mainStore.removeRecord = null;
        };
    }, []);

    const reloadData = () => {
        mainStore.searchData({});
    };

    const handleChangeActive = async (id: number, isActived: boolean) => {
        ProductPriceListService.updateStatus({
            id,
            isActived,
        }).then((res) => {
            if (res.isSuccessful) {
                uiUtils.showSuccess(t("updateIsActiveSuccessfully"));
            } else {
                uiUtils.showError(res.message);
            }
        });
        reloadData();
    };

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "name",
                dataIndex: "name",
                width: 180,
                align: "left",
                render: (value, record) => {
                    return (
                        <>
                            <div>
                                <strong className="text-base">{value}</strong>{" "}
                                {record.isMain && (
                                    <div>
                                        <Tag
                                            bordered={false}
                                            className="text-sm leading-4 font-semibold text-red bg-[#FFEAEE]"
                                        >
                                            Mặc định
                                        </Tag>
                                    </div>
                                )}
                            </div>
                            {record.isAutoUpdatePrice && !record.isMain && (
                                <Tag
                                    bordered={false}
                                    className="bg-[#EEEEEE] text-[#505050] text-sm leading-4"
                                >
                                    Tự động thay đổi theo bảng giá chung
                                </Tag>
                            )}
                        </>
                    );
                },
            },
            {
                title: "validDate",
                width: 250,
                render: (value, record) => {
                    return (
                        <>
                            {record.startDate && "Từ " + DateUtil.toFormat(record.startDate)}{" "}
                            - {record.endDate && "Đến " + DateUtil.toFormat(record.endDate)}
                        </>
                    );
                },
            },
            {
                dataIndex: "calculatePriceValue",
                title: "price",
                align: "end",
                render: (value, record) => {
                    return (
                        value && (
                            <>
                                {" "}
                                Giá chung
                                <strong
                                    className={
                                        record.calculatePriceMethod == 2
                                            ? "text-red"
                                            : "text-green-600"
                                    }
                                >
                                    {record.calculatePriceMethod == 2 ? " - " : " + "}
                                    <PriceCell value={value} />
                                    {record.calculatePriceType == 2 ? "VNĐ" : "%"}
                                </strong>
                            </>
                        )
                    );
                },
                width: 140,
            },
            {
                dataIndex: "isActive",
                title: "status",
                align: "center",
                render: (v) => <StatusCell isActived={v} />,
                width: 100,
            },
        ],
        {
            actions: [
                {
                    title: "",
                    content: (d: any) => {
                        return d.isActive ? (
                            <div
                                style={{ color: "#f5413d" }}
                                onClick={async () => {
                                    await handleChangeActive(Number(d.id), false);
                                }}
                            >
                                <StopOutlined />{" "}
                                <span className="ml-1">{t("changeIsActive.unActive")}</span>
                            </div>
                        ) : (
                            <div
                                style={{ color: "#1AB01A" }}
                                onClick={async () => {
                                    await handleChangeActive(Number(d.id), true);
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
                    hiddenIf: (d) => d.isMain,
                    onClick: (d) => {
                        mainStore.openRemoveById(d);
                    },
                },
            ],
            viewAction: (d: any) => {
                return navigate("/product/price-list/" + d.idHash);
            },
            ns: mainStore.getNamespaceLocale(),
        }
    );

    const topActions: IActionBtn[] = [
        {
            title: "addNew",
            permission: "ProductPriceList.Create",
            onClick: () => {
                mainStore.openCreateModal();
            },
        },
    ];

    return (
        <>
            <OrdCrudPage
                stored={mainStore}
                topActions={topActions}
                columns={columns}
                onEntitySavedSuccess={() => {
                    fetchSyncDataProductPriceLists().then();
                    clearDatasource();
                    mainStore.removeRecord = null;
                }}
                searchForm={(f) => (
                    <PriceListFormSearch changeHandler={onChangePriceList} />
                )}
                entityForm={(form) => <CreateOrUpdateForm />}
            ></OrdCrudPage>
        </>
    );
};

export default observer(ProductPriceList);
