import {StockMovePagedOutputDto} from "@api/index.defs";
import {StockMoveExportService} from "@api/StockMoveExportService";
import {TransferStockService} from "@api/TransferStockService";
import AddNewEntity from "@ord-components/btn-action/AddNewEntity";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {HotKeyScope} from "@ord-core/AppConst";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import {HotKeyMoveStockWrapper} from "@pages/StockManagement/Shared/components/HotKeyMoveStockWrapper";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {StockMoveActionCell} from "@pages/StockManagement/Shared/DataTable/cell/ActionCell";
import {MoveCodeCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveCodeCell";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import {StockMoveExportExcelDropDownBtn} from "@pages/StockManagement/Shared/DataTable/ExportExcelDropDownBtn";
import {MoveStatusSegmented} from "@pages/StockManagement/Shared/DataTable/SearchForm/MoveStatusSegmented";
import DetailStockMove from "@pages/StockManagement/Shared/Detail/DetailStockMove";
import {ExportStockTransferCell} from "@pages/StockManagement/TransferStock/cell/ExportStockTransferCell";
import {ImportStockTransferCell} from "@pages/StockManagement/TransferStock/cell/ImportStockTransferCell";
import TransferStockSearchBox from "@pages/StockManagement/TransferStock/SearchBox";
import {Space, TableColumnsType, Tag} from "antd";
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import Utils from "@ord-core/utils/utils";

const TransferStock = () => {
    const [t] = useTranslation("transferStock");
    const [tCommon] = useTranslation();
    const {
        stockMoveStore,
        transferStockListStore: mainStore,
        detailStockStore,
    } = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "moveCode",
                dataIndex: "moveCode",
                width: 150,
                render: (value, dto) => {
                    return (
                        <MoveCodeCell
                            record={dto}
                            viewDetail={handlerView}
                            hiddenMoveType
                        />
                    );
                },
            },
            {
                title: "Type",
                dataIndex: "moveType",
                width: 80,
                render: (value) => {
                    if (value == MoveType.PhieuDieuChuyen) {
                        return (
                            <Tag className={"me-0 move-status-label-1"}>
                                {t("transferType.export")}{" "}
                            </Tag>
                        );
                    } else {
                        return (
                            <Tag className={"me-0 ord-cell-actived"}>
                                {t("transferType.import")}{" "}
                            </Tag>
                        );
                    }
                },
            },
            {
                title: "transferStock.exportStock",
                render: (value, dto) => {
                    return <ExportStockTransferCell moveDto={dto}/>;
                },
            },
            {
                title: "transferStock.importStock",
                render: (value, dto) => {
                    return <ImportStockTransferCell moveDto={dto}/>;
                },
            },

            {
                title: "TotalAmountCol",
                dataIndex: "totalAmountRound",
                width: 130,
                align: "end",
                render: (value) => {
                    return <PriceCell value={value}/>;
                },
            },
            {
                title: "status",
                dataIndex: "status",
                width: 130,
                align: "center",
                render: (value, dto) => {
                    return (
                        <>
                            <MoveStatusCell record={dto}/>
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
                            <StockMoveActionCell
                                reloadGridAndTabCounter={reloadGridAndTabCounter}
                                record={dto}
                                apiService={TransferStockService}
                            />
                        </>
                    );
                },
            },
        ],
        {
            ns: mainStore.getNamespaceLocale(),
        }
    );
    const addNew = () => {
        stockMoveStore.initMoveStock("transfer");
        navigate("add-new");
    };
    const handlerView = async (record: StockMovePagedOutputDto) => {
        const {idHash} = record;
        UiUtils.setBusy();
        try {
            const result = await TransferStockService.getById({
                idHash: idHash as string,
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            detailStockStore.openDetail(result.data);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };

    useEffect(() => {
        if (stockMoveStore.onActionGrid?.data) {
            const {actionName, data} = stockMoveStore.onActionGrid;
            if (actionName === "detail") {
                handlerView(data).then();
            }
            if (actionName === "edit") {
                navigate(pathNameRef.current + "/transfer/update/" + data.idHash);
            }
            if (actionName === "clone") {
                const {moveType, idHash} = data;
                navigate(pathNameRef.current + "/transfer/add-new?cloneMove=" + idHash);
            }
        }
    }, [stockMoveStore.onActionGrid]);
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
                        exportMoveApi={StockMoveExportService.exportMoveTypeTransfer}
                        exportMoveDetailApi={
                            StockMoveExportService.exportMoveTypeDetailTransfer
                        }
                    />
                    <AddNewEntity onClick={addNew}/>
                </Space>
            </PageTopTitleAndAction>
            <OrdCrudPage
                stored={mainStore}
                hiddenTopAction={true}
                columns={columns}
                searchForm={(f) => <TransferStockSearchBox/>}
                contentTopTable={
                    <>
                        <MoveStatusSegmented getCountApi={TransferStockService.getCount}/>
                    </>
                }
            ></OrdCrudPage>
            <DetailStockMove/>
        </HotKeyMoveStockWrapper>
    );
};
export default observer(TransferStock);
