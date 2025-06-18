import {OrderStockMoveDto} from "@api/index.defs";
import {OrderStockService} from "@api/OrderStockService";
import AddNewEntity from "@ord-components/btn-action/AddNewEntity";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import DateCell from "@ord-components/table/cells/DateCell";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {HotKeyScope} from "@ord-core/AppConst";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import {ExportStockOrderCell} from "@pages/StockManagement/OrderStock/cell/ExportStockOrderCell";
import {OrderActionCell} from "@pages/StockManagement/OrderStock/cell/OrderActionCell";
import DetailOrderStockMove from "@pages/StockManagement/OrderStock/Detail/DetailOrderStockMove";
import OrderStockSearchBox from "@pages/StockManagement/OrderStock/SearchBox";
import {HotKeyMoveStockWrapper} from "@pages/StockManagement/Shared/components/HotKeyMoveStockWrapper";
import {StockMoveExportExcelDropDownBtn} from "@pages/StockManagement/Shared/DataTable/ExportExcelDropDownBtn";
import {MoveStatusSegmented} from "@pages/StockManagement/Shared/DataTable/SearchForm/MoveStatusSegmented";
import {Space, TableColumnsType, Tag} from "antd";
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import Utils from "@ord-core/utils/utils";

const OrderStock = () => {
    const [t] = useTranslation("orderStock");
    const [tCommon] = useTranslation();
    const {
        stockMoveStore,
        orderStockListStore: mainStore,
        stockSearchProductStore,
        detailStockStore,
    } = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "orderCode",
                dataIndex: "orderCode",
                width: 150,
                sorter: true,
                render: (value, dto) => {
                    return (
                        <a className="underline font-bold" onClick={() => handlerView(dto)}>
                            {value}
                        </a>
                    );
                },
            },
            {
                title: "desiredDeliveryDate",
                dataIndex: "desiredDeliveryDate",
                width: 230,
                render: (value, dto) => {
                    return <DateCell date={value}></DateCell>;
                },
                sorter: true,
            },
            {
                title: "supplierInfo",
                render: (value, dto) => {
                    return <ExportStockOrderCell moveDto={dto}/>;
                },
            },
            {
                title: "creationUserName",
                dataIndex: "creationUserName",
                width: 130,
            },
            {
                title: "TotalAmountCol",
                dataIndex: "totalAmount",
                width: 150,
                align: "end",
                render: (value) => {
                    return <PriceCell value={value}/>;
                },
                sorter: true,
            },
            {
                title: "orderDate",
                dataIndex: "orderDate",
                width: 130,
                render: (value, dto) => {
                    return <DateCell date={value}></DateCell>;
                },
                sorter: true,
            },
            {
                title: "moveStatus",
                dataIndex: "moveStatus",
                width: 130,
                align: "center",
                render: (value, dto) => {
                    return (
                        <>
                            <Tag className={"me-0 move-status-label-" + value}>
                                {t("move_status." + value)}
                            </Tag>
                        </>
                    );
                },
            },
            {
                title: tCommon("action"),
                width: 105,
                align: "center",
                render: (value, dto) => {
                    return (
                        <>
                            <OrderActionCell
                                reloadGridAndTabCounter={reloadGridAndTabCounter}
                                record={dto}
                                ns={mainStore.getNamespaceLocale()}
                            />
                        </>
                    );
                },
                fixed: "right",
            },
        ],
        {
            ns: mainStore.getNamespaceLocale(),
        }
    );
    const addNew = () => {
        stockMoveStore.initMoveStock("order");
        navigate("add-new");
    };
    const handlerView = async (record: OrderStockMoveDto) => {
        const {idHash} = record;
        UiUtils.setBusy();
        try {
            const dto = await OrderStockService.getById({
                idHash,
            });
            detailStockStore.openDetail(dto);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };

    useEffect(() => {
        stockSearchProductStore.extraParams = null;
    }, []);

    useEffect(() => {
        if (stockMoveStore.onActionGrid?.data) {
            const {actionName, data} = stockMoveStore.onActionGrid;
            if (actionName === "detail") {
                handlerView(data as any).then();
            }
            if (actionName === "edit") {
                navigate(pathNameRef.current + "/order/update/" + data.idHash);
            }
            if (actionName === "clone") {
                const {moveType, idHash} = data;
                navigate(pathNameRef.current + "/order/add-new?cloneMove=" + idHash);
            }
        }
    }, [stockMoveStore.onActionGrid]);
    useEffect(() => {
        stockSearchProductStore.setNewSelectedRows([]);
    }, []);
    const reloadTabCounter = () => {
        mainStore.searchFormRef?.setFieldValue(
            "onSearchBeginning",
            Number(new Date())
        );
    };
    const reloadGridAndTabCounter = () => {
        mainStore.refreshGridData().then();
        reloadTabCounter();
    };
    useHotkeys(
        "F2",
        (event) => {
            addNew();
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );
    return (
        <HotKeyMoveStockWrapper>
            <PageTopTitleAndAction>
                <Space wrap>
                    <StockMoveExportExcelDropDownBtn
                        stored={mainStore}
                        fileName={"export"}
                        exportMoveApi={OrderStockService.exportDataToExcel}
                        exportMoveDetailApi={OrderStockService.exportDetailDataToExcel}
                    />
                    <AddNewEntity onClick={addNew}/>
                </Space>
            </PageTopTitleAndAction>
            <OrdCrudPage
                stored={mainStore}
                hiddenTopAction={true}
                columns={columns}
                searchForm={(f) => <OrderStockSearchBox/>}
                contentTopTable={
                    <>
                        <MoveStatusSegmented
                            ns={mainStore.getNamespaceLocale()}
                            getCountApi={OrderStockService.getCount}
                        />
                    </>
                }
            ></OrdCrudPage>
            <DetailOrderStockMove/>
        </HotKeyMoveStockWrapper>
    );
};
export default observer(OrderStock);
