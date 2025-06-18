import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {Space, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {useStore} from "@ord-store/index";
import React, {useEffect, useRef} from "react";
import {MoveCodeCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveCodeCell";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import {StockMoveActionCell} from "@pages/StockManagement/Shared/DataTable/cell/ActionCell";
import {StockMovePagedOutputDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import AddNewEntity from "@ord-components/btn-action/AddNewEntity";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import DetailStockMove from "@pages/StockManagement/Shared/Detail/DetailStockMove";
import CheckStockSearchBox from "@pages/StockManagement/CheckStock/SearchBox";
import {CheckStockService} from "@api/CheckStockService";
import {StockMoveExportExcelDropDownBtn} from "@pages/StockManagement/Shared/DataTable/ExportExcelDropDownBtn";
import {StockMoveExportService} from "@api/StockMoveExportService";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {HotKeyMoveStockWrapper} from "@pages/StockManagement/Shared/components/HotKeyMoveStockWrapper";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {MoveStatusSegmented} from "@pages/StockManagement/Shared/DataTable/SearchForm/MoveStatusSegmented";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import Utils from "@ord-core/utils/utils";

const CheckStock = () => {
    const [t] = useTranslation('checkStock');
    const [tCommon] = useTranslation();
    const {stockMoveStore, checkStockListStore: mainStore, detailStockStore} = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: 'moveCode',
                dataIndex: 'moveCode',
                width: 120,
                render: (_, dto) => {
                    return <MoveCodeCell record={dto} viewDetail={handlerView} hiddenMoveType/>
                }
            },
            {
                title: 'notes',
                dataIndex: 'note',
                width: 500,
                render: (value: string) => {
                    return <TextLineClampDisplay content={value}/>
                }
            },
            {
                title: 'status',
                dataIndex: 'status',
                width: 80,
                align: 'center',
                render: (_, dto) => {
                    return <>
                        <MoveStatusCell record={dto}/>
                    </>
                }
            },
            {
                title: tCommon('action'),
                width: 80,
                align: 'center',
                render: (_, dto) => {
                    return <>
                        <StockMoveActionCell reloadGridAndTabCounter={reloadGridAndTabCounter}
                                             record={dto}
                                             apiService={CheckStockService}
                        />
                    </>
                }
            },
        ], {
            ns: mainStore.getNamespaceLocale(),
            widthRowIndexCol: 40
        });
    const addNew = () => {
        stockMoveStore.initMoveStock('check');
        navigate('add-new');
    }
    const handlerView = async (record: StockMovePagedOutputDto) => {
        const {idHash} = record;
        UiUtils.setBusy();
        try {
            const result = await CheckStockService.getById({
                idHash: idHash as string
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
    }

    useEffect(() => {
        if (stockMoveStore.onActionGrid?.data) {
            const {actionName, data} = stockMoveStore.onActionGrid;
            if (actionName === 'detail') {
                handlerView(data).then();
            }
            if (actionName === 'edit') {
                navigate(pathNameRef.current + '/check/update/' + data.idHash);
            }
            if (actionName === 'clone') {
                const {idHash} = data;
                navigate(pathNameRef.current + '/check/add-new?cloneMove=' + idHash);
            }
        }
    }, [stockMoveStore.onActionGrid]);
    const reloadTabCounter = () => {
        mainStore.searchFormRef?.setFieldValue('onSearchBeginning', Number(new Date()));
    }
    const reloadGridAndTabCounter = () => {
        mainStore.refreshGridData().then();
        reloadTabCounter();
    }
    useHotkeys('F2', (event) => {
        addNew();
        event.preventDefault();
    }, {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true});
    return (
        <HotKeyMoveStockWrapper>
            <PageTopTitleAndAction>
                <Space wrap>
                    <StockMoveExportExcelDropDownBtn stored={mainStore}
                                                     fileName={'check'}
                                                     exportMoveApi={StockMoveExportService.exportMoveTypeCheck}
                                                     exportMoveDetailApi={StockMoveExportService.exportMoveTypeDetailCheck}
                    />
                    <AddNewEntity onClick={addNew}/>
                </Space>
            </PageTopTitleAndAction>
            <OrdCrudPage stored={mainStore}
                         hiddenTopAction={true}
                         columns={columns}
                         searchForm={(f) => <CheckStockSearchBox/>}
                         contentTopTable={<>
                             <MoveStatusSegmented getCountApi={CheckStockService.getCount}/>
                         </>}
            ></OrdCrudPage>
            <DetailStockMove/>
        </HotKeyMoveStockWrapper>
    );
}
export default observer(CheckStock);
