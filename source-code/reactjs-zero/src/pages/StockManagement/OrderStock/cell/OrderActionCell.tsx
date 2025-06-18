import {OrderStockMoveDto, StockMovePagedOutputDto} from "@api/index.defs";
import React, {useState} from "react";
import {Button, Dropdown, Space} from "antd";
import {
    BarcodeOutlined,
    CopyOutlined,
    DashOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PrinterOutlined,
    StopOutlined
} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {useNavigate} from "react-router-dom";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import { StockMoveHelperService } from "@api/StockMoveHelperService";
import UiUtils from "@ord-core/utils/ui.utils";
import { OrderStockService } from "@api/OrderStockService";

export const OrderActionCell = (props: {
    record: OrderStockMoveDto,
    reloadGridAndTabCounter: () => void,
    ns?: string,

}) => {
    const navigate = useNavigate();
    const {record, reloadGridAndTabCounter} = props;
    const [cancelRecord, setCancelRecord] = useState<any>();
    const {stockMoveStore} = useStore();
    const [t] = useTranslation('stock');
    const [tCommon] = useTranslation();
    const items = [
        {
            key: 'print',
            label: (
                <Space wrap>
                    <PrinterOutlined style={{fontSize: 20}}/>
                    {t('actionStock.print')}
                </Space>
            ),
            onClick: () => {
                handlerPrint();
            }
        },
        {
            key: 'printBarCode',
            label: (
                <Space wrap>
                    <BarcodeOutlined style={{fontSize: 20}}/>
                    {t('actionStock.printBarCode')}
                </Space>
            ),
            onClick: () => {
                stockMoveStore.handlerClickActionGrid('printBarCode', record);
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
                stockMoveStore.handlerClickActionGrid('clone', record);
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
                stockMoveStore.handlerClickActionGrid('edit', record);
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
                setCancelRecord({
                    ...record
                });
            }
        },
        {
            key: 'delete',
            label: (
                <Space wrap className={'text-red'}>
                    <DeleteOutlined style={{fontSize: 20}}/>
                    {t('actionStock.delete')}
                </Space>
            ),
            onClick: () => {
                handlerDelete();
            }
        }
    ];
    const handlerDelete = () => {
        // UiUtils.showConfirm({
        //     title: tCommon('confirmDelete'),
        //     icon: "remove",
        //     content: (<Trans ns={'stock'}
        //                      i18nKey="confirmRemoveMove"
        //                      values={record}
        //                      components={{italic: <i/>, bold: <strong/>}}></Trans>),
        //     onOk: async () => {
        //         UiUtils.setBusy();
        //         try {
        //             const result = await apiService.deleteMove({
        //                 body: {
        //                     idHash: record.idHash
        //                 }
        //             });
        //             if (result.isSuccessful) {
        //                 reloadGridAndTabCounter();
        //                 UiUtils.showSuccess(t('deleteMoveSuccess', record as any) as any);
        //                 fetchSyncDataInventoryLine().then();
        //             } else {
        //                 ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
        //                     ...record
        //                 });
        //             }
        //         } catch {
        //
        //         } finally {
        //             UiUtils.clearBusy();
        //         }
        //     },
        //     onCancel: () => {
        //     }
        // });
    }
    const handlerPrint = async () => {
        UiUtils.setBusy();
        try {
            const blob = await OrderStockService.print({
                body: {
                    stockOrderIdHash: record.idHash,
                }
            }, {
                responseType: 'blob'
            });
            UiUtils.showPrintWindow(blob);
        } catch {
        
        } finally {
            UiUtils.clearBusy();
        }
    }


    const filterActionByStatus = (keyAction: string) => {
        let keys: string[] = [];
        const {moveStatus: status} = record;
        // nháp
        if (status === 1) {
            //DANG_SOAN
            keys = ['clone', 'print', 'edit', 'delete'];
        } else if (status === 2) {
            //CHO_XU_LY_KHO
            keys = ['clone', 'print'];
        } else if (status === 3) {
            //DA_HUY
            keys = ['clone', 'print', 'delete'];
        } else if (status === 4) {
            //DA_HOAN_THANH
            keys = ['clone', 'print', 'cancel'];
        } else if (status === 5) {
            //CHO_TIEP_NHAN
            keys = ['clone', 'print', 'delete'];
        } else if (status === 6) {
            //HUY_TIEP_NHAN
            keys = ['clone', 'print'];
        }
        return keys.includes(keyAction);
    }
    return (<>
        <Space wrap>
            <Button icon={<EyeOutlined/>} onClick={() => {
                stockMoveStore.handlerClickActionGrid('detail', record);
            }}/>
            {
                items.filter(s => filterActionByStatus(s.key)).length > 0 &&
                <Dropdown menu={{items: items.filter(s => filterActionByStatus(s.key))}} placement="bottomLeft">
                    <Button icon={<DashOutlined/>}></Button>
                </Dropdown>
            }

        </Space>
        {/*<CancelStockMoveModal record={cancelRecord}*/}
        {/*                      apiCancelMove={apiService.cancelMove}*/}
        {/*                      onCancelDone={reloadGridAndTabCounter}/>*/}
    </>);

}

