import {ImportStockService} from "@api/ImportStockService";
import {StockMoveExportService} from "@api/StockMoveExportService";
import {StockMovePagedOutputDto} from "@api/index.defs";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import PrintBarcodeProductModal from "@pages/ProductManagement/Product/Tools/PrintBarcodeProductModal";
import {ImportStockAddNewActionBtn} from "@pages/StockManagement/ImportStock/AddNewAction";
import ImportStockSearchBox from "@pages/StockManagement/ImportStock/SearchBox";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {StockMoveExportExcelDropDownBtn} from "@pages/StockManagement/Shared/DataTable/ExportExcelDropDownBtn";
import {MoveStatusSegmented} from "@pages/StockManagement/Shared/DataTable/SearchForm/MoveStatusSegmented";
import {StockMoveActionCell} from "@pages/StockManagement/Shared/DataTable/cell/ActionCell";
import {MoveCodeCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveCodeCell";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import {PaymentAmountCol, PaymentDebtAmountCol,} from "@pages/StockManagement/Shared/DataTable/cell/PaymentAmountCol";
import DetailStockMove from "@pages/StockManagement/Shared/Detail/DetailStockMove";
import {HotKeyMoveStockWrapper} from "@pages/StockManagement/Shared/components/HotKeyMoveStockWrapper";
import {Space, TableColumnsType} from "antd";
import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Utils from "@ord-core/utils/utils";

const ImportStock = () => {
    const [t] = useTranslation("importStock");
    const [tCommon] = useTranslation();
    const {
        stockMoveStore,
        importStockStore: mainStore,
        detailStockStore,
        productListPrintBarCode,
    } = useStore();
    const navigate = useNavigate();
    const [isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen] = useState(false);
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "moveCode",
                dataIndex: "moveCode",
                width: 150,
                // sorter: true,
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
                // sorter: true,
                // render: (value, dto) => {
                //   // return <PartnerSupplierCell record={dto} />;
                // },
            },

            {
                title: "import.totalAmountCol",
                dataIndex: "totalAmountRound",
                width: 120,
                align: "end",
                render: (value) => {
                    return <PriceCell value={value} fixed={0}/>;
                },
            },
            {
                title: "import.paymentAmountCol",
                dataIndex: "paymentAmount",
                width: 120,
                align: "end",
                render: (value, dto) => {
                    return (
                        <>
                            <PaymentAmountCol record={dto}/>
                        </>
                    );
                },
            },
            {
                title: "import.debt",
                dataIndex: "paymentAmount",
                width: 120,
                align: "end",
                render: (value, dto) => {
                    return (
                        <>
                            <PaymentDebtAmountCol record={dto}/>
                        </>
                    );
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
                fixed: "right",
                align: "center",
                render: (value, dto) => {
                    return (
                        <>
                            <StockMoveActionCell
                                reloadGridAndTabCounter={reloadGridAndTabCounter}
                                record={dto}
                                apiService={ImportStockService}
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
            const result = await ImportStockService.getById({
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
                navigate("update/" + data.idHash);
            }
            if (actionName === "clone") {
                const {moveType, idHash} = data;
                if (moveType == MoveType.PhieuNhapNhaCungCap || moveType == MoveType.PhieuNhapTon) {
                    navigate(
                        pathNameRef.current + "/import/clone/" + idHash
                    );
                }
            }
            if (actionName === "printBarCode") {
                productListPrintBarCode.loadStockMove(data?.idHash);
                setIsPrintBarcodeModalOpen(true);
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

    return (
        <HotKeyMoveStockWrapper>
            <PageTopTitleAndAction>
                <Space wrap>
                    <StockMoveExportExcelDropDownBtn
                        stored={mainStore}
                        fileName={"import"}
                        exportMoveApi={StockMoveExportService.exportMoveTypeImport}
                        exportMoveDetailApi={
                            StockMoveExportService.exportMoveDetailTypeImport
                        }
                    />
                    <ImportStockAddNewActionBtn/>
                </Space>
            </PageTopTitleAndAction>
            <OrdCrudPage
                stored={mainStore}
                hiddenTopAction={true}
                columns={columns}
                searchForm={(f) => <ImportStockSearchBox/>}
                contentTopTable={
                    <>
                        <MoveStatusSegmented getCountApi={ImportStockService.getCount}/>
                    </>
                }
            ></OrdCrudPage>
            <DetailStockMove/>
            <PrintBarcodeProductModal
                isModalOpen={isPrintBarcodeModalOpen}
                onCloseModal={() => {
                    setIsPrintBarcodeModalOpen(false);
                }}
            />
        </HotKeyMoveStockWrapper>
    );
};
export default observer(ImportStock);
