import {ShopDiscountDto,} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import * as React from "react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {TableColumnsType,} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {StatusCell} from "@ord-components/table/cells/StatusCell";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {DiscountSearchForm} from "./forms/discountSearchForm";
import {CreateOrUpdateDiscountForm} from "./forms/CUDiscountFor";
import DiscountAction from "./DiscountAction";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {observer} from "mobx-react-lite";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const ProductDiscountList: React.FC = () => {
    const {productDiscountStore: mainStore} = useStore();
    const {t} = useTranslation("discount");
    const [discountListItem, setDiscountListItem] = useState<ShopDiscountDto>();

    const onChangePriceList = (item: ShopDiscountDto) => {
        setDiscountListItem(item);
    };

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: t("code"),
                dataIndex: "code",
                align: "left",
                width: 200,
            },
            {
                title: t("discountUseType"),
                dataIndex: "discountUseType",
                align: "left",
                width: 100,
                render(value) {
                    return t(`discountUseType.${value}`);
                },
            },
            {
                title: t("discountType"),
                dataIndex: "discountType",
                align: "left",
                width: 150,
                render(value) {
                    return t(`discountType.${value}`);
                },
            },
            {
                title: t("discountValue"),
                dataIndex: "discountValue",
                align: "left",
                width: 100,
                render: (value, record) => {
                    return (
                        <>
                            <strong className={"text-red"}>
                                <PriceCell value={value}/>
                                {record.discountType == DiscountTypeEnum.Percent ? "%" : "VNĐ"}
                            </strong>
                        </>
                    );
                },
            },
            {
                title: t("validDate"),
                width: 300,
                dataIndex: "startDate",
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
                title: t("usageLimit"),
                dataIndex: "usageLimit",
                align: "left",
                width: 100,
            },
            {
                title: t("usageCount"),
                dataIndex: "usageCount",
                align: "left",
                width: 100,
            },
            {
                dataIndex: "discountStatus",
                title: "status",
                align: "center",
                render: (v) => <StatusCell isActived={v}/>,
                width: 100,
            },
        ],
        {
            actions: [
                // {
                //     title: "view",
                //     onClick: (d) => {
                //         mainStore.openViewDetailModal(d);
                //     },
                // },
                {
                    title: "edit",
                    hiddenIf: (d: any) => {
                        return d?.isDefault;
                    },
                    onClick: (d) => {
                        mainStore.openUpdateModal(d);
                    },
                },
                {
                    title: "remove",
                    hiddenIf: (d: ShopDiscountDto) => {
                        return d.discountStatus == 1;
                    },
                    onClick: (d: ShopDiscountDto) => {
                        const removeByHash = {
                            ...d,
                            id: d.id,
                        };
                        mainStore.openRemoveById(removeByHash);
                    },
                },
            ] as ITableAction<ShopDiscountDto>[],
            viewAction: (d) => {
                mainStore.openUpdateModal(d);
            },
            ns: mainStore.getNamespaceLocale(),
        }
    );

    const topActions: IActionBtn[] = [
        {
            title: "tool",
            permission: "Product.Create",
            content: <DiscountAction/>,
        },
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
                searchForm={(f) => (
                    <DiscountSearchForm changeHandler={onChangePriceList}/>
                )}
                entityForm={(form) => <CreateOrUpdateDiscountForm/>}
            ></OrdCrudPage>
        </>
    );
};

export default observer(ProductDiscountList);
