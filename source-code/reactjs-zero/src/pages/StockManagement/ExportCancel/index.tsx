import {observer} from "mobx-react-lite";
import {Trans, useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {Button, Dropdown, Space, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {useStore} from "@ord-store/index";
import {MoveCodeCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveCodeCell";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import {ExportStockTicketDto, StockMovePagedOutputDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {ExportStockService} from "@api/ExportStockService";
import React, {useRef, useState} from "react";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import {StockMoveExportService} from "@api/StockMoveExportService";
import {StockMoveExportExcelDropDownBtn} from "@pages/StockManagement/Shared/DataTable/ExportExcelDropDownBtn";
import {HotKeyMoveStockWrapper} from "@pages/StockManagement/Shared/components/HotKeyMoveStockWrapper";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {MoveStatusSegmented} from "@pages/StockManagement/Shared/DataTable/SearchForm/MoveStatusSegmented";
import {CopyOutlined, EditOutlined, EyeOutlined, PlusOutlined, PrinterOutlined, StopOutlined} from "@ant-design/icons";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import {StockMoveHelperService} from "@api/StockMoveHelperService";
import CancelStockMoveModal from "@pages/StockManagement/Shared/DataTable/CancelStockMoveModal";
import {fetchSyncDataInventoryLine} from "@ord-core/db/services/syncDataInventoryLine";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import ExportCancelSearchBox from "@pages/StockManagement/ExportCancel/SearchBox";
import {MoveStatus} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import ExportCancelDetail from "@pages/StockManagement/ExportCancel/Detail";
import Utils from "@ord-core/utils/utils";

const ExportCancel = () => {
    const [t] = useTranslation("exportStock");
    const [tCommon] = useTranslation();
    const {exportCancelListStore: mainStore} = useStore();
    const navigate = useNavigate();
    const [cancelRecord, setCancelRecord] = useState<any>();
    const [editableRecord, setEditableRecord] = useState<any>();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    useHotkeys(
        "F2",
        (event) => {
            navigate(pathNameRef.current + "/export-cancel/add-new-cancel");
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );

    const columns: TableColumnsType<StockMovePagedOutputDto> = TableUtil.getColumns(
        [
            {
                title: "moveCode",
                dataIndex: "moveCode",
                width: 300,
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
                title: "export.totalAmount",
                dataIndex: "totalAmountRound",
                width: 300,
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
                render: (value, dto: StockMovePagedOutputDto) => {
                    let items = [
                        {
                            key: 'print',
                            label: (
                                <Space wrap>
                                    <PrinterOutlined style={{fontSize: 20}}/>
                                    {t('actionStock.print')}
                                </Space>
                            ),
                            onClick: () => {
                                handlerPrint(dto);
                            }
                        },
                        {
                            key: 'clone',
                            label: (
                                <Space wrap>
                                    <CopyOutlined style={{fontSize: 20}}/>
                                    {t('actionStock.clone')}
                                </Space>
                            ),
                            onClick: () => {
                                if (!dto.idHash) {
                                    return;
                                }

                                navigate(pathNameRef.current + "/export-cancel/add-new-cancel?cloneMove=" + dto.idHash);
                            }
                        },
                        {
                            key: 'edit',
                            label: (
                                <Space wrap>
                                    <EditOutlined style={{fontSize: 20}}/>
                                    {t('actionStock.edit')}
                                </Space>
                            ),
                            onClick: () => {
                                if (!dto.idHash) {
                                    return;
                                }

                                navigate(pathNameRef.current + '/export-cancel/update/' + dto.idHash);
                            }
                        },
                        {
                            key: 'cancel',
                            label: (
                                <Space wrap>
                                    <StopOutlined className={'text-red'} style={{fontSize: 20}}/>
                                    {t('actionStock.cancel')}
                                </Space>
                            ),
                            onClick: () => {
                                setCancelRecord(dto);
                            }
                        },
                        {
                            key: 'delete',
                            label: (
                                <Space wrap className={'text-red'}>
                                    <Delete2Icon style={{fontSize: 20}}/>
                                    {t('actionStock.delete')}
                                </Space>
                            ),
                            onClick: () => {
                                handlerDelete(dto);
                            }
                        }];

                    let keysAccept: string[] = [];
                    if (dto.moveStatus === MoveStatus.DANG_SOAN) {
                        keysAccept = ['clone', 'print', 'edit', 'delete'];
                    }

                    if (dto.moveStatus === MoveStatus.DA_HUY) {
                        keysAccept = ['clone', 'delete'];
                    }

                    if (dto.moveStatus === MoveStatus.DA_HOAN_THANH) {
                        keysAccept = ['clone', 'print', 'edit', 'cancel'];
                    }

                    items = items.filter(x => keysAccept.includes(x.key));

                    return (
                        <>
                            <Space wrap>
                                <Button icon={<EyeOutlined/>} onClick={() => {
                                    handlerView(dto).then();
                                }}/>
                                <Dropdown menu={{items}} placement="bottomLeft">
                                    <Button icon={<IconlyLight type={'Group.svg'}/>}></Button>
                                </Dropdown>
                            </Space>
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

            setEditableRecord(result.data);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };

    const handlerPrint = async (record: StockMovePagedOutputDto) => {
        UiUtils.setBusy();
        try {
            const blob = await StockMoveHelperService.print({moveHashId: record.idHash!}, {
                responseType: 'blob'
            });
            UiUtils.showPrintWindow(blob);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    const handlerDelete = (record: StockMovePagedOutputDto) => {
        UiUtils.showConfirm({
            title: tCommon('confirmDelete'),
            icon: "remove",
            content: (<Trans ns={'stock'}
                             i18nKey="confirmRemoveMove"
                             values={record}
                             components={{italic: <i/>, bold: <strong/>}}></Trans>),
            onOk: async () => {
                UiUtils.setBusy();
                try {
                    const result = await ExportStockService.deleteMove({moveHashId: record.idHash!});
                    if (result.isSuccessful) {
                        reloadGridAndTabCounter();
                        UiUtils.showSuccess(t('deleteMoveSuccess', record as any) as any);
                        fetchSyncDataInventoryLine().then();
                    } else {
                        ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
                            ...record
                        });
                    }
                } catch {

                } finally {
                    UiUtils.clearBusy();
                }
            },
            onCancel: () => {
            }
        });
    }

    const handlerEdit = (record: ExportStockTicketDto) => {
        navigate(pathNameRef.current + "/export-cancel/update/" + record.moveDto?.moveHashId);
    }

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
                    <Link to={"add-new-cancel"}>
                        <Button type="primary">
                            <Space>
                                <PlusOutlined/>
                            </Space>
                            {t("actionBtn.addNew")} (F2)
                        </Button>
                    </Link>
                </Space>
            </PageTopTitleAndAction>
            <OrdCrudPage
                stored={mainStore}
                hiddenTopAction={true}
                columns={columns}
                searchForm={(f) => <ExportCancelSearchBox/>}
                contentTopTable={
                    <MoveStatusSegmented getCountApi={ExportStockService.getCount}/>
                }
            ></OrdCrudPage>
            <ExportCancelDetail record={editableRecord} handleOk={handlerEdit}/>
            <CancelStockMoveModal record={cancelRecord}
                                  apiCancelMove={ExportStockService.cancelMove}
                                  onCancelDone={reloadGridAndTabCounter}/>
        </HotKeyMoveStockWrapper>
    );
};
export default observer(ExportCancel);
