import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {useTranslation} from "react-i18next";
import FileSaver from "file-saver";
import {observer} from "mobx-react-lite";
import {ImportExcelButton} from "@ord-components/excel/ImportExcelButton";
import {OrderStockService} from "@api/OrderStockService";
import {Alert, Form} from "antd";
import useReadExcelToDataOrderStock from "@pages/StockManagement/OrderStock/ImportExcel/useReadExcelToData";
import {InvalidModal} from "@pages/StockManagement/OrderStock/ImportExcel/InvalidModal";
import {ExcelProductStockMoveDto} from "@api/index.defs";
import {StockValidateExcelService} from "@api/StockValidateExcelService";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";

const ImportExcelOrderStock = (props: {
    inventoryId: number
}) => {
    const {t} = useTranslation('OrderStock');
    const form = Form.useFormInstance();
    const [binaryStrExcel, setBinaryStrExcel] = useState('');
    const dataExcel = useReadExcelToDataOrderStock(binaryStrExcel);
    const handlerDownloadTemplate = async () => {
        try {
            UiUtils.setBusy();
            const [blobResult] = await Promise.all([OrderStockService.getImportExcelTemplate({
                body: {}
            }, {
                responseType: 'blob'
            })]);
            const fileName = t('fileNameExcelTemplate');
            FileSaver.saveAs(blobResult, fileName);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    const [validList, setValidList] = useState<ExcelProductStockMoveDto[]>([]);
    const [invalidList, setInvalidList] = useState<ExcelProductStockMoveDto[]>([]);
    const validateData = async (items: any[]) => {
        UiUtils.setBusy();
        const allValues = form.getFieldsValue(); // Lấy tất cả giá trị trong form
        console.log("Current Form Values:", allValues);
        try {
            const validateData = await StockValidateExcelService.transferStock({
                inventoryId: props.inventoryId,
                body: items
            });
            const invalidList = validateData.filter(x => x.isError == true);
            const validList = validateData.filter(x => x.isError != true);
            setValidList(validList);
            setInvalidList(invalidList);
            if (invalidList.length === 0) {
                addValidItem(validList);
            }
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    useEffect(() => {
        setValidList([]);
        setInvalidList([]);
        if (dataExcel.data.length > 0) {
            validateData(dataExcel.data).then();
        }
    }, [dataExcel.data]);
    const addValidItem = (_validList?: ExcelProductStockMoveDto[]) => {
        const products = (_validList ? _validList : validList).map(it => ({
            ...it.moveDetail,
            ...it,
            ...it.product,
            lotItemFromExcel: {
                lotNumber: it?.lotNumber,
                expiryDate: it?.expiryDate
            }
        }));
        form.setFieldValue(StockMoveFormName.ProductItems, products);
    }
    return (
        <>

            <div className={'text-center'}>
                <h3 className={'font-bold text-xl mb-2'}>
                    {t('addNewFromExcel')}
                </h3>

                <ImportExcelButton onChangeBinaryStr={setBinaryStrExcel}
                                   onClickDownloadTemplate={handlerDownloadTemplate}></ImportExcelButton>
                {
                    !!binaryStrExcel && !(dataExcel.data.length > 0) &&
                    <Alert style={{margin: "10px auto", width: 680}}
                           message={t('notDataOrIncorrectFile', {ns: 'excel'})}
                           type="error" showIcon/>
                }{
                <InvalidModal onAddListValid={addValidItem} invalidList={invalidList}
                              validList={validList}></InvalidModal>
            }
            </div>
        </>

    );
}
export default observer(ImportExcelOrderStock);
