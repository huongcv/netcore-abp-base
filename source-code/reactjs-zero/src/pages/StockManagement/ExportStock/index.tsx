import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Space, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {useStore} from "@ord-store/index";
import {MoveCodeCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveCodeCell";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import {StockMoveActionCell} from "@pages/StockManagement/Shared/DataTable/cell/ActionCell";
import {StockMovePagedOutputDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {ExportStockService} from "@api/ExportStockService";
import React, {useEffect, useRef} from "react";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import DetailStockMove from "@pages/StockManagement/Shared/Detail/DetailStockMove";
import ExportStockSearchBox from "@pages/StockManagement/ExportStock/SearchBox";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {StockMoveExportService} from "@api/StockMoveExportService";
import {StockMoveExportExcelDropDownBtn} from "@pages/StockManagement/Shared/DataTable/ExportExcelDropDownBtn";
import {ExportStockAddNewActionBtn} from "@pages/StockManagement/ExportStock/AddNewAction";
import {HotKeyMoveStockWrapper} from "@pages/StockManagement/Shared/components/HotKeyMoveStockWrapper";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {MoveStatusSegmented} from "@pages/StockManagement/Shared/DataTable/SearchForm/MoveStatusSegmented";
import Utils from "@ord-core/utils/utils";

const ExportStock = () => {
    const [t] = useTranslation("exportStock");
    const [tImportStock] = useTranslation("importStock");
    const [tCommon] = useTranslation();
    const {
        stockMoveStore,
        exportStockStore: mainStore,
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
                title: "import.PartnerId",
                dataIndex: "partnerName",
                width: 250,
                // render: (value, dto) => {
                //     return <PartnerSupplierCell record={dto}/>;
                // },
            },
            {
                title: "export.totalAmount",
                dataIndex: "totalAmountRound",
                width: 100,
                align: "end",
                render: (value) => {
                    return <PriceCell value={value} fixed={0}/>;
                },
            },
            {
                title: "status",
                dataIndex: "status",
                width: 100,
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
                                apiService={ExportStockService}
                                reloadGridAndTabCounter={reloadGridAndTabCounter}
                                record={dto}
                            />
                        </>
                    );
                },
            },
        ],
        {
            ns: mainStore.getNamespaceLocale(),
            widthRowIndexCol: 50,
        }
    );

    const handlerView = async (record: StockMovePagedOutputDto) => {
        const {idHash} = record;
        UiUtils.setBusy();
        try {
            const result = await ExportStockService.getById({
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
                if (data?.moveType == MoveType.PhieuXuatTraNhaCungCap) {
                    navigate(pathNameRef.current + '/export-supplier/update/' + data.idHash);
                }
            }

            if (actionName === "clone") {
                const {moveType, idHash} = data;
                if (moveType == MoveType.PhieuXuatTraNhaCungCap) {
                    if (idHash) {
                        checkReturnQtyItem(idHash);
                    }
                }
            }
        }
    }, [stockMoveStore.onActionGrid]);
    const reloadGridAndTabCounter = () => {
        mainStore.refreshGridData().then();
        reloadTabCounter();
    };
    const reloadTabCounter = () => {
        mainStore.searchFormRef?.setFieldValue(
            "onSearchBeginning",
            Number(new Date())
        );
    };
    const checkReturnQtyItem = async (idHash: string) => {
        UiUtils.setBusy();
        try {
            const result = await ExportStockService.cloneById({
                idHash: idHash,
            });

            if (result.isSuccessful) {
                navigate(pathNameRef.current + "/export-supplier/add-new-supplier?cloneMove=" + idHash);
            } else {
                UiUtils.showError(result.message);
            }
        } catch (errors) {
            UiUtils.showError(tImportStock("fetchApiImportStockServiceError"));
        } finally {
            UiUtils.clearBusy();
        }
    };

    return (
        <HotKeyMoveStockWrapper>
            <PageTopTitleAndAction>
                <Space wrap>
                    <StockMoveExportExcelDropDownBtn
                        stored={mainStore}
                        fileName={"export"}
                        exportMoveApi={StockMoveExportService.exportMoveTypeExport}
                        exportMoveDetailApi={
                            StockMoveExportService.exportMoveDetailTypeExport
                        }
                    />
                    <ExportStockAddNewActionBtn/>
                </Space>
            </PageTopTitleAndAction>
            <OrdCrudPage
                stored={mainStore}
                hiddenTopAction={true}
                columns={columns}
                searchForm={(f) => <ExportStockSearchBox/>}
                contentTopTable={
                    <MoveStatusSegmented getCountApi={ExportStockService.getCount}/>
                }
            ></OrdCrudPage>
            <DetailStockMove/>
        </HotKeyMoveStockWrapper>
    );
};
export default observer(ExportStock);
