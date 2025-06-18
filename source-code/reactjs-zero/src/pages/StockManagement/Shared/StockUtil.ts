import {l} from "@ord-core/language/lang.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import _ from "lodash";
import {ExportStockMoveDetailDto, ImportStockMoveDetailDto, MOVE_TYPE} from "@api/index.defs";
import {StockMoveHelperService} from "@api/StockMoveHelperService";
import {AppExtendCode} from "@ord-core/AppConst";

export namespace StockUtil {
    export const HandlerError = (result: {
        isSuccessful?: boolean,
        errorDetail?: {
            code?: string,
            message?: string,
            data?: {
                Product?: {
                    productName: ''
                },
                LotNumber?: string,
                ProductName?: string
            }
        }
    }) => {
        if (result?.isSuccessful == true) {
            return false;
        }

        if (!!result.errorDetail && !!result.errorDetail.code && result.errorDetail.code.toLowerCase() == 'movestockerr' ) {
            const error = result.errorDetail;
            if (error && !!error.data) {
                let prms = {
                    ...error.data
                }
                if (error?.data?.Product) {
                    prms = {
                        ...error?.data?.Product,
                        ...prms,
                    }
                }
                const errorMess = l.transCommon(error?.message || '', prms);
                UiUtils.showError(errorMess);
                return true;
            }
        }

        if(result.errorDetail?.message) {
            UiUtils.showError(result.errorDetail?.message || result.errorDetail?.code);
            return true;
        }

        return false;
    }

    export const bindProductValueIntoForm = (it: ImportStockMoveDetailDto) => {
        const productDetail = _.pickBy({...it?.productDetail}, _.identity);
        return {
            ...productDetail,
            ...it,
        }
    }
    export const bindProductValueRelatedIntoForm = (relatedIt: ImportStockMoveDetailDto) => {
        // @ts-ignore
        return {
            ...bindProductValueIntoForm(relatedIt),
            relatedMoveId: relatedIt.moveId,
            relatedMoveRootDetailId: relatedIt.moveRootDetailId,
            relatedMoveLineDetailId: relatedIt.moveLineDetailId,
            qty: relatedIt.maxQtyEnable,
            discountType: relatedIt.discountType,
            discountValue: relatedIt.discountValue,
            discountPercent: relatedIt.discountPercent,
            discountAmount: relatedIt.discountAmount,
            moveLineDetailId: 0,
            moveRootDetailId: 0,
            moveId: 0
        } as ExportStockMoveDetailDto;
    }
    export const print = async (moveIdHash: string, moveType?: MOVE_TYPE) => {
        UiUtils.setBusy();
        try {
            const blob = await StockMoveHelperService.print({
                moveHashId: moveIdHash
            }, {
                responseType: 'blob'
            });

            UiUtils.showPrintWindow(blob);
        } catch (error) {
            UiUtils.showError(l.transCommon('viewPdfError'));
        } finally {
            UiUtils.clearBusy();
        }
    };

    export const omitMoveStockUpsert = (moveBody: any) => {
        if (!moveBody) {
            return moveBody;
        }
        let omitNames = [
            'disableHotKeySave',
            'moveStatus',
            'moveTime',
            'totalAmountBeforeDiscount',
            'totalAmount',
            'totalAmountAfterDiscount',
            'totalAmountBeforeTax',
            'taxAmount',
            'discountValue',
        ];
        const isUpdateMode: boolean = !!moveBody.moveHashId;

        if (moveBody.moveType == 'PhieuNhapNhaCungCap') {
            omitNames = [
                ...omitNames,
            ];
            if (isUpdateMode) {
                omitNames = [...omitNames, 'relatedMoveId'];
            }
        }
        if (moveBody.moveType == 'PhieuNhapTon') {
            omitNames = [
                ...omitNames, 'partnerId',
                'relatedMoveId', 'relatedMoveIdHash', 'relatedMoveCode', 'relatedMoveDate',
                'paymentMethod', 'paymentAmount'
            ];
        }

        if (moveBody.moveType == 'PhieuXuatTraNhaCungCap') {
            omitNames = [
                ...omitNames,
                'relatedMoveIdHash',
                'relatedMoveCode',
                'relatedMoveDate'
            ];

            if (isUpdateMode) {
                omitNames = [...omitNames, 'relatedMoveId'];
            }
        }

        if (moveBody.moveType == 'PhieuXuatHuy') {
            omitNames = [
                ...omitNames, 'partnerId',
                'relatedMoveId', 'relatedMoveIdHash', 'relatedMoveCode', 'relatedMoveDate',
                'paymentMethod', 'paymentAmount',
                'totalAmount'
            ];
        }

        if (moveBody.moveType == 'PhieuDieuChuyen') {
            omitNames = [
                ...omitNames, 'partnerId',
                'relatedMoveId', 'relatedMoveIdHash', 'relatedMoveCode', 'relatedMoveDate',
                'paymentMethod', 'paymentAmount',
                'totalAmount'
            ];
        }

        if (moveBody.moveType == 'PhieuKiemKho') {
            omitNames = [
                ...omitNames, 'partnerId',
                'relatedMoveId', 'relatedMoveIdHash', 'relatedMoveCode', 'relatedMoveDate',
                'paymentMethod', 'paymentAmount',
                'totalAmount', 'price', 'taxPercent'
            ];
        }

        return _.omit(moveBody, [...omitNames]);
    }

    export const omitMoveStockItemUpsert = (moveItem: any, moveBody: any) => {
        if (!moveItem) {
            return moveItem;
        }
        let omitNames = [
            'id', 'productCode', 'productName', 'partnerId',
            'isProductUseInventory',
            'isProductUseLotNumber',
            'inventoryRootDetailId',
            'inventoryLineDetailId',
            'moveId',
            'moveType',
            'moveCode',
            'moveDate',
            'unitName',
            'productTypeId', 'productCategoryId', 'productSubCategoryId',
            'invoiceId', 'invoiceDetailsId',
            'invoiceCode',
            'qtyConvert',
            'unitName',
            'convertRate',
            'returnQty',
            'priceBeforeTax',
            'totalAmountBeforeDiscount',
            'totalAmountAfterDiscount',
            'discountAmountAllocation',
            'totalAmountBeforeTax',
            'taxAmount',
            'totalAmount',
            'status',
            'costPrice',
            'totalCostAmount',
            'partnerType',
            'relatedMoveId',
            'productDetail',
            'maxQtyEnable',
            'checkValidateQyt',
            'productHashId',
            'publishId',
            'isNotEnoughInventoryStock',
            'isErrorEnoughStock',
            'lotNumbers',
            'units',
            'basicUnitId',
            'basicUnitName',
            'unitCode',
            'isBasicUnit',
            'latestImportPrice',
            'isProductPriceIncludeTax',
            'barCode',
            'qtyOld',
            'listLotNumber',
            "listUnit",
            'imageUrl',
            'images',
            'inventoryId',
            'inventoryQty',
            'discountValue',
            'isNewLot'
        ];

        if (moveBody.moveType == 'PhieuNhapNhaCungCap') {
            omitNames = [
                ...omitNames,
                'relatedMoveRootDetailId',
                'openingInventoryQty', 'closingInventoryQty'
            ];
        }
        if (moveBody.moveType == 'PhieuXuatTraNhaCungCap') {
            omitNames = [
                ...omitNames,
                'openingInventoryQty', 'closingInventoryQty'
            ];
        }
        if (moveBody.moveType == 'PhieuXuatHuy') {
            omitNames = [
                ...omitNames,
                'relatedMoveRootDetailId',
                'relatedMoveLineDetailId',
                'price', 'discountType', 'discountPercent',
                'openingInventoryQty', 'closingInventoryQty'
            ];
        }
        if (moveBody.moveType == 'PhieuDieuChuyen') {
            omitNames = [
                ...omitNames, 'discountType','discountPercent',
                'openingInventoryQty', 'closingInventoryQty',
                'relatedMoveRootDetailId',
                 'relatedMoveLineDetailId',
            ];
        }
        if (moveBody.moveType == 'PhieuKiemKho') {
            omitNames = [
                ...omitNames,
                'price', 'discountType', 'discountValue','discountPercent',
                'relatedMoveRootDetailId',
                'relatedMoveLineDetailId',
            ];
        }

        return _.omit(moveItem, [
            ...omitNames
        ]);
    }

    export const messageErrorNormal = 'Có lỗi xảy ra, vui lòng thử lại sau';
}
