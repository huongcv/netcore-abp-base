import {
    BarcodeOutlined,
    CopyOutlined,
    EditOutlined,
    EyeOutlined,
    PrinterOutlined,
    RollbackOutlined,
    StopOutlined,
} from "@ant-design/icons";
import {ImportStockService} from "@api/ImportStockService";
import {StockMoveHelperService} from "@api/StockMoveHelperService";
import {CancelMoveStockDto, CommonResultDtoOfNullableOfInt64, StockMovePagedOutputDto,} from "@api/index.defs";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {fetchSyncDataInventoryLine} from "@ord-core/db/services/syncDataInventoryLine";
import {CommonResultDto} from "@ord-core/service-proxies/dto";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import {MoveStatus, MoveType,} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import CancelStockMoveModal from "@pages/StockManagement/Shared/DataTable/CancelStockMoveModal";
import {Button, Dropdown, Space} from "antd";
import {useRef, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Utils from "@ord-core/utils/utils";

interface StockAppServiceApi {
    getById(params: { idHash: string }): Promise<any>;

    createOrUpdateMove(params: { body?: any }): Promise<CommonResultDto<any>>;

    cancelMove(params: {
        body?: CancelMoveStockDto;
    }): Promise<CommonResultDtoOfNullableOfInt64>;

    deleteMove(params: {
        moveHashId: string;
    }): Promise<CommonResultDtoOfNullableOfInt64>;
}

export const StockMoveActionCell = (props: {
    record: StockMovePagedOutputDto;
    reloadGridAndTabCounter: () => void;
    apiService: StockAppServiceApi;
    ns?: string;
}) => {
    const navigate = useNavigate();
    const {record, reloadGridAndTabCounter, apiService} = props;
    const [cancelRecord, setCancelRecord] = useState<any>();
    const {stockMoveStore} = useStore();
    const [t] = useTranslation("stock");
    const [tCommon] = useTranslation();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    const items = [
        {
            key: "print",
            label: (
                <Space wrap>
                    <PrinterOutlined style={{fontSize: 20}}/>
                    {t("actionStock.print")}
                </Space>
            ),
            onClick: () => {
                handlerPrint();
            },
        },
        {
            key: "printBarCode",
            label: (
                <Space wrap>
                    <BarcodeOutlined style={{fontSize: 20}}/>
                    {t("actionStock.printBarCode")}
                </Space>
            ),
            onClick: () => {
                stockMoveStore.handlerClickActionGrid("printBarCode", record);
            },
        },
        {
            key: "clone",
            label: (
                <Space wrap>
                    <CopyOutlined style={{fontSize: 20}}/>
                    {t("actionStock.clone")}
                </Space>
            ),
            onClick: () => {
                stockMoveStore.handlerClickActionGrid("clone", record);
            },
        },
        {
            key: "edit",
            label: (
                <Space wrap>
                    <EditOutlined style={{fontSize: 20}}/>
                    {t("actionStock.edit")}
                </Space>
            ),
            onClick: () => {
                stockMoveStore.handlerClickActionGrid("edit", record);
            },
        },
        {
            key: "cancel",
            label: (
                <Space wrap>
                    <StopOutlined className={"text-red"} style={{fontSize: 20}}/>
                    {t("actionStock.cancel")}
                </Space>
            ),
            onClick: () => {
                setCancelRecord({
                    ...record,
                });
            },
        },
        {
            key: "delete",
            label: (
                <Space wrap className={"text-red"}>
                    <Delete2Icon style={{fontSize: 20}}/>
                    {t("actionStock.delete")}
                </Space>
            ),
            onClick: () => {
                handlerDelete();
            },
        },
        {
            key: "return",
            label: (
                <Space wrap className="flex items-center">
                    <RollbackOutlined style={{fontSize: 20}}/>
                    Xuất trả NCC
                </Space>
            ),
            onClick: async () => {
                const response = await ImportStockService.getReturnById({
                    idHash: record.idHash || "",
                });

                if (!response.isSuccessful) {
                    UiUtils.showError(response.message);
                    return;
                }

                navigate(
                    pathNameRef.current +
                    "/export-supplier/add-new-supplier-from-move/" +
                    record.idHash
                );
            },
        },
    ];
    const handlerDelete = () => {
        UiUtils.showConfirm({
            title: tCommon("confirmDelete"),
            icon: "remove",
            content: (
                <Trans
                    ns={"stock"}
                    i18nKey="confirmRemoveMove"
                    values={record}
                    components={{italic: <i/>, bold: <strong/>}}
                ></Trans>
            ),
            onOk: async () => {
                UiUtils.setBusy();
                try {
                    const result = await apiService.deleteMove({
                        moveHashId: record.idHash!,
                    });
                    if (result.isSuccessful) {
                        reloadGridAndTabCounter();
                        UiUtils.showSuccess(t("deleteMoveSuccess", record as any) as any);
                        fetchSyncDataInventoryLine().then();
                    } else {
                        ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
                            ...record,
                        });
                    }
                } catch {
                } finally {
                    UiUtils.clearBusy();
                }
            },
            onCancel: () => {
            },
        });
    };
    const handlerPrint = async () => {
        UiUtils.setBusy();
        try {
            const blob = await StockMoveHelperService.print(
                {moveHashId: record.idHash!},
                {
                    responseType: "blob",
                }
            );
            UiUtils.showPrintWindow(blob);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };

    const filterActionByStatus = (keyAction: string) => {
        let keys: string[] = [];
        const {moveStatus, isReadOnly, moveType} = record;
        if (moveType == MoveType.HoaDon) {
            return [""].includes(keyAction);
        }

        // nháp
        if (moveStatus === 1) {
            //DANG_SOAN
            keys = ["clone", "print", "edit", "delete"];
        } else if (moveStatus === 2) {
            //CHO_XU_LY_KHO
            keys = ["clone", "print"];
        } else if (moveStatus === 3) {
            //DA_HUY
            keys = ["clone", "delete"];
        } else if (moveStatus === 4) {
            //DA_HOAN_THANH
            keys = ["clone", "print", "edit", "cancel"];
        } else if (moveStatus === 5) {
            //CHO_TIEP_NHAN
            keys = ["clone", "print", "edit"];
        } else if (moveStatus === 6) {
            //HUY_TIEP_NHAN
            keys = ["clone", "print"];
        }

        if (isReadOnly) {
            keys = ["print"];
            return keys.includes(keyAction);
        }

        if (
            record.moveType == MoveType.PhieuNhapTon ||
            record.moveType == MoveType.PhieuNhapNhaCungCap
        ) {
            keys.push("printBarCode");
        }

        if (
            record.moveStatus == MoveStatus.DA_HOAN_THANH &&
            record.moveType == MoveType.PhieuNhapNhaCungCap
        ) {
            keys.push("return");
        }

        if (
            record.moveStatus == MoveStatus.DA_HOAN_THANH &&
            record.moveType == MoveType.PhieuDieuChuyen
        ) {
            const index = keys.indexOf("edit");
            if (index > -1) {
                keys.splice(index, 1);
            }
        }

        return keys.includes(keyAction);
    };

    return (
        <>
            <Space wrap>
                <Button
                    icon={<EyeOutlined/>}
                    onClick={() => {
                        stockMoveStore.handlerClickActionGrid("detail", record);
                    }}
                />
                {items.filter((s) => filterActionByStatus(s.key)).length > 0 && (
                    <Dropdown
                        menu={{items: items.filter((s) => filterActionByStatus(s.key))}}
                        placement="bottomLeft"
                    >
                        <Button icon={<IconlyLight type={"Group.svg"}/>}></Button>
                    </Dropdown>
                )}
            </Space>
            <CancelStockMoveModal
                record={cancelRecord}
                apiCancelMove={apiService.cancelMove}
                onCancelDone={reloadGridAndTabCounter}
            />
        </>
    );
};
