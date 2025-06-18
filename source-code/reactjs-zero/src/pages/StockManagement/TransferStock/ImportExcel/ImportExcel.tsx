import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {useTranslation} from "react-i18next";
import FileSaver from "file-saver";
import {observer} from "mobx-react-lite";
import {ImportExcelButton} from "@ord-components/excel/ImportExcelButton";
import {Form} from "antd";
import {ImportExcelTransferExcelBaseDto, MOVE_TYPE} from "@api/index.defs";
import {StockValidateExcelService} from "@api/StockValidateExcelService";
import {errorsMessageExcel, MoveType, StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {InvalidModalTransferStock} from "@pages/StockManagement/TransferStock/ImportExcel/InvalidModal";

const ImportExcelCheckStock = (props: {
    moveType: MOVE_TYPE,
}) => {
    const {moveType} = props;
    const form = Form.useFormInstance();
    const [binaryStrExcel, setBinaryStrExcel] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File>();
    const [t] = useTranslation('stock');
    const [message, setMessage] = useState('');
    const [validList, setValidList] = useState<any[]>([]);
    const [invalidList, setInvalidList] = useState<any[]>([]);

    const handlerDownloadTemplate = async () => {
        try {
            UiUtils.setBusy();
            const blobResult = await StockValidateExcelService.getStockTemplate({moveType: MoveType.PhieuDieuChuyen}, {
                responseType: 'blob'
            });
            FileSaver.saveAs(blobResult, "Phieu-dieu-chuyen.xlsx");
        } catch (ex: any) {
            console.error(ex);
        } finally {
            UiUtils.clearBusy();
        }
    }

    useEffect(() => {
        setValidList([]);
        setInvalidList([]);
        if (file) {
            validateData();
        }
    }, [file]);

    const validateData = async () => {
        UiUtils.setBusy();

        try {
            const {data, isSuccessful, message} = await StockValidateExcelService.validateDataTransferStock({
                uploadFile: file,
                moveType: moveType,
            });

            if (isSuccessful || !errorsMessageExcel.includes(message || '')) {
                const dataValid = data?.filter(x => !!x.isValid) || [];
                setValidList(dataValid);

                const dataInValid = data?.filter(x => !x.isValid) || [];
                setInvalidList(dataInValid);

                if (dataInValid.length === 0) {
                    addValidItem(dataValid);
                } else {
                    UiUtils.showError(message!)
                    setIsOpen(true);
                }
            } else {
                throw new Error(message);
            }
        } catch (ex) {
            // @ts-ignore
            setMessage && setMessage(ex.message);
        } finally {
            UiUtils.clearBusy();
        }
    }

    const addValidItem = (data: ImportExcelTransferExcelBaseDto[]) => {
        const products = data.map(it => ({
            ...it,
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

                <ImportExcelButton onChangeFile={setFile} messageError={message} onChangeBinaryStr={setBinaryStrExcel}
                                   onClickDownloadTemplate={handlerDownloadTemplate}></ImportExcelButton>

                <InvalidModalTransferStock moveType={moveType} isModalOpen={isOpen} setIsModalOpen={setIsOpen}
                                           invalidList={invalidList}
                                           validList={validList}></InvalidModalTransferStock>
            </div>
        </>

    );
}
export default observer(ImportExcelCheckStock);
