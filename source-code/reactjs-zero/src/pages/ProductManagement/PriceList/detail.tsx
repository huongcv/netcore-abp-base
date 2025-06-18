import {ArrowLeftOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ProductPriceListDetailDto, ProductPriceListDto, ProductSearchWithUnitDto} from "@api/index.defs";
import {ProductPriceListDetailService} from "@api/ProductPriceListDetailService";
import {ProductPriceListService} from "@api/ProductPriceListService";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {TopAction} from "@ord-components/crud/TopAction";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {fetchSyncDataProductPriceLists} from "@ord-core/db/services/syncDataProductPriceLists";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import CreateOrUpdateForm from "@pages/ProductManagement/PriceList/forms/createOrUpdateForm";
import {EditDetailForm} from "@pages/ProductManagement/PriceList/forms/editDetailForm";
import PriceListDetailFormSearch from "@pages/ProductManagement/PriceList/forms/priceListDetailFormSearch";
import SearchProductTableModal
    from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/search-table-modal/SearchProductTableModal";
import {Button, Form, Popover, Spin, TableColumnsType} from "antd";
import {TableRowSelection} from "antd/es/table/interface";
import {observer} from "mobx-react-lite";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate, useParams} from "react-router-dom";
import {SearchProductPriceList} from "./forms/searchProductPriceList";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import { useParentPath } from "@ord-core/hooks/useParentPath";
import Utils from "@ord-core/utils/utils";

const ProductPriceListDetail: React.FC = () => {
    const {
        productPriceListDetailStore: mainStore,
        productPriceListStore: priceListStore,
        stockSearchProductStore,
        customerApplyInDetailStore
    } = useStore();
    const {t: tCommon} = useTranslation("common");
    const {t} = useTranslation("price-list-detail");
    const navigate = useNavigate();
    let {id} = useParams();
    const [item, setItem] = useState<ProductPriceListDto>();
    const [formAdd] = Form.useForm();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('/product'));

    const getPriceList = () => {
        ProductPriceListService.getById({findId: id || ""}).then((rsp) => {
            if (rsp) setItem(rsp);
        });
    };

    const [popoverIdx, setPopoverIdx] = useState<number>(-1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedDetails, setSelectedDetails] = useState<
        ProductPriceListDetailDto[]
    >([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[], records: any) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedDetails(records);
    };
    const rowSelection: TableRowSelection<ProductPriceListDto> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const removeManyDetail = () => {
        UiUtils.showConfirm({
            title: tCommon("confirmDelete"),
            icon: "remove",
            content: (
                <>
                    {t("confirmRemoveMany").replace(
                        "{{num}}",
                        `${selectedDetails.length}`
                    )}
                </>
            ),
            onOk: (d) => {
                const removeIds = selectedDetails.map((it) => {
                    return it.id + "";
                });
                UiUtils.setBusy();
                ProductPriceListDetailService.removeMany({body: removeIds}).then(
                    (rsp) => {
                        mainStore.refreshGridData();
                        fetchSyncDataProductPriceLists().then();
                        setSelectedRowKeys([]);
                        setSelectedDetails([]);
                        UiUtils.clearBusy();
                    }
                );
            },
            onCancel: () => {
            },
        });
    };

    const openFormAdd = () => {
        stockSearchProductStore.searchData({});
        stockSearchProductStore.onlyGetProductUsingInventory = false;
        stockSearchProductStore.extraParams = {
            excludeProductPriceListId: item?.id
        }
        stockSearchProductStore.showModal();
    }

    useEffect(() => {
        mainStore.priceListPublishViewId = id || "";
        getPriceList();
    }, []);


    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "productCode",
                dataIndex: "productCode",
                align: "left",
                render: (value, record) => {
                    return (
                        <>
                            {value}
                        </>
                    );
                },
                width: 180,
            },
            {
                title: "productName",
                dataIndex: "productName",
                align: "left",
                width: 250,
                render: (data: string) => {
                    return (
                        <>
                            <TextLineClampDisplay content={data}/>{" "}
                        </>
                    );
                },
            },
            {
                dataIndex: 'unitName',
                title: 'productUnit',
                align: 'center',
                width: 120
            },
            {
                dataIndex: "costPrice",
                title: "costPrice",
                align: "end",
                render: (v) => <PriceCell value={v}/>,
                width: 150,
            },
            {
                dataIndex: "generalPrice",
                title: "generalPrice",
                align: "end",
                render: (v) => <PriceCell value={v}/>,
                width: 150,
            },
            {
                dataIndex: "priceFormula",
                title: "priceFormula",
                align: "center",
                hidden: item?.isMain || !item?.isAutoUpdatePrice,
                render: (_, record) => (
                    record.calculatePriceMethod > 0 ? (
                        <div>
                            Giá chung
                            <strong
                                className={record.calculatePriceMethod === 2 ? "text-red-500" : "text-green-500"}
                            >
                                {record.calculatePriceMethod === 2 ? " - " : " + "}
                                <PriceCell value={record.calculatePriceValue}/>
                                {record.calculatePriceType === 2 ? "VNĐ" : "%"}
                            </strong>
                        </div>
                    ) : (
                        "-"
                    )
                ),
                width: 150,
            },
            {
                hidden: item?.isMain,
                dataIndex: "productPrice",
                title: "priceList",
                align: "end",
                width: 150,

                render: (v, record, index) => (
                    <>
                        <Popover
                            trigger="click"
                            open={popoverIdx === index}
                            onOpenChange={() => setPopoverIdx(index)}
                            content={<EditDetailForm detailItem={record} dataItem={item}
                                                     onSuccess={() => onUpdateSuccess()}
                                                     onCancel={() => setPopoverIdx(-1)}/>}
                        >
                            <Button type={"link"} size={"small"}>
                                <EditOutlined/>
                            </Button>
                        </Popover>
                        <PriceCell value={v}/>
                    </>
                ),
            },
            {
                dataIndex: "numberOfPartnerGroup",
                title: "partnerGroup",
                width: 200,
                hidden: !item?.isApplyPriceByPartnerGroup,
                render: (v: number, d: ProductPriceListDetailDto) => {
                    return <a className="text-blue-500" onClick={() => {
                        customerApplyInDetailStore.openUpdateModal(d);
                    }}>{t('groupCount', {
                        count: v ?? 0
                    })}</a>
                }
            },
            {
                hidden: item?.isMain,
                title: "action",
                align: "center",
                width: 80,
                render: (v, record) => (
                    <>
                        <Button
                            size={"small"}
                            onClick={() => mainStore.openRemoveById(record)}
                            danger
                        >
                            <DeleteOutlined/>
                        </Button>
                    </>
                ),
            },
        ],
        {
            ns: mainStore.getNamespaceLocale(),
        }
    );

    const topActions: IActionBtn[] = [
        {
            content: (
                <Link to={useParentPath()}>
                    <Button><ArrowLeftOutlined></ArrowLeftOutlined>{t('returnList', {
                        ns: 'common'
                    })}</Button>
                </Link>
            ),
        },
        {
            content: selectedRowKeys.length > 0 && !item?.isMain && !item?.isAutoCreateProduct && (
                <Button onClick={removeManyDetail} danger>
                    <DeleteOutlined/> Xóa SP đã chọn
                </Button>
            ),
        },
    ];

    const openPLUpdateModal = () => {
        priceListStore.isOpenViaDetail = true;
        priceListStore.openUpdateModal(item);
    }

    const priceListDetailFormSearch = () => {
        return <PriceListDetailFormSearch item={item} openEditHandler={openPLUpdateModal}
                                          openFormAdd={() => openFormAdd()}/>
    }

    const priceCreateOrUpdateForm = () => {
        return <CreateOrUpdateForm/>
    }

    const onUpdateSuccess = () => {
        getPriceList();
        mainStore.currentPageResult = {};
        mainStore.searchData({})
        mainStore.refreshGridData();
    }

    const onProductSelected = (selectedItems: ProductSearchWithUnitDto[]) => {
        const insertItems: ProductPriceListDetailDto[] = selectedItems.map(item => ({
            ...item,
            id: "0",
            generalPrice: item.price,
            key: `${item.productId}-${item.productUnitId}`
        }));

        const body = formAdd.getFieldsValue();
        body.productPriceListDetailDtos = insertItems;
        UiUtils.setBusy();
        ProductPriceListDetailService.addDetail({
            body: {
                idHash: id,
                productPriceListDetailDtos: insertItems,
            }
        }).then(
            (rsp) => {
                UiUtils.clearBusy();
                if (rsp.isSuccessful) {
                    mainStore.refreshGridData();
                } else {
                    UiUtils.showError(rsp.message);
                }
            },
            (error) => {
                UiUtils.showError(error.message);
                UiUtils.clearBusy();
            }
        ).finally(() => {
            UiUtils.clearBusy();
        });
    }

    const LazyModalSelectCustomerGroup = React.lazy(() => import('@pages/ProductManagement/PriceList/forms/modalSelectCustomerGroup'));
	const LazyModalCustomerGroupInDetail = React.lazy(() => import('@pages/ProductManagement/PriceList/forms/modalCustomerGroupInDetail'));

    return (
        <div>
            <PageTopTitleAndAction
                usingCustom={true}
                mainTitle={t("titlePage")}
                items={[t("titlePageLvl1")]}
            >
                <TopAction topActions={topActions}/>
            </PageTopTitleAndAction>
            <OrdCrudPage stored={mainStore}
                         tableRowKey="key"
                         hiddenTopAction={true}
                         columns={columns}
                         searchForm={priceListDetailFormSearch}
                         entityForm={form => null}
                         rowSelection={rowSelection}
                         contentTopTable={<SearchProductPriceList/>}
            ></OrdCrudPage>
            <OrdCreateOrUpdateModal stored={priceListStore}
                                    entityForm={priceCreateOrUpdateForm} onSavedSuccess={onUpdateSuccess}/>

            <SearchProductTableModal onItemsSelected={(selecteds) => onProductSelected(selecteds)}/>

            <React.Suspense fallback={<Spin/>}>
                {customerApplyInDetailStore.createOrUpdateModal.visible &&
                    <>
                        <LazyModalCustomerGroupInDetail></LazyModalCustomerGroupInDetail>
                    </>}
            </React.Suspense>

            <React.Suspense fallback={<Spin/>}>
                {customerApplyInDetailStore.isShowSelectCustomerGroupModal &&
                    <>
                        <LazyModalSelectCustomerGroup></LazyModalSelectCustomerGroup>
                    </>}
            </React.Suspense>
        </div>
    );
};

export default observer(ProductPriceListDetail);
