import {ImportExcelButton} from "@ord-components/excel/ImportExcelButton";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {StockValidateExcelService} from "@api/StockValidateExcelService";
import {ImportExcelImportSuplierExcelBaseDto, MOVE_TYPE} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import {errorsMessageExcel, MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {InvalidModalImportStock} from "./InvalidModal";
import {useStore} from "@ord-store/index";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";

const ImportStockUploadExcel = (props: {
    moveType: MOVE_TYPE,
}) => {
    const {importStockUpsertStore} = useStore();
    const {moveType} = props;

    const {formMoveTicket} = useUpsertStockMove();
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
            const blobResult = await StockValidateExcelService.getStockTemplate({moveType: MoveType.PhieuNhapNhaCungCap}, {
                responseType: 'blob'
            });
            FileSaver.saveAs(blobResult, "Phieu-nhap-nha-cung-cap.xlsx");
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
            let {data, isSuccessful, message} = await StockValidateExcelService.validateDataImportStock({
                uploadFile: file,
                moveType: moveType,
            });

            if (isSuccessful || !errorsMessageExcel.includes(message || '')) {
                const dataValid = data?.filter(x => !!x.isValid) || [];
                setValidList(dataValid);

                const dataInValid = data?.filter(x => !x.isValid) || [];
                setInvalidList(dataInValid);

                if (dataValid.length > 0 && dataInValid.length === 0) {
                    addValidItem(dataValid);
                } else {
                    if (errorsMessageExcel.includes(message || '')) {
                        message = 'Dữ liệu tải lên không hợp lệ';
                    }
                    UiUtils.showError(message!)
                    setIsOpen(true);
                }
            } else {

                UiUtils.showError(message!);
                throw new Error(message);
            }
        } catch (ex) {
            // @ts-ignore
            setMessage && setMessage(ex.message);
        } finally {
            UiUtils.clearBusy();
        }
    }

    const addValidItem = (data: ImportExcelImportSuplierExcelBaseDto[]) => {
        const dataList = data.map(it => {
            if (!!it.lotNumberId) {
                return it;
            }

            return ({
                ...it,
                lotItemFromExcel: {
                    lotNumber: it?.lotNumber,
                    expiryDate: it?.expiryDate
                }
            })
        });

        const moveValues = formMoveTicket.getFieldsValue();
        const {
            products,
            move
        } = UpsertFormUtil.calculatorAllProduct(dataList, moveValues);
        importStockUpsertStore.productItems = [...products];
        formMoveTicket.setFieldsValue(move);
    }

    return (<>
        <div className={'text-center'}>
            <h3 className={'font-bold text-xl mb-2'}>
                {t('addNewFromExcel')}
            </h3>

            <ImportExcelButton onChangeFile={setFile} messageError={message} onChangeBinaryStr={setBinaryStrExcel}
                               onClickDownloadTemplate={handlerDownloadTemplate}></ImportExcelButton>

            <InvalidModalImportStock moveType={moveType} isModalOpen={isOpen} setIsModalOpen={setIsOpen}
                                     invalidList={invalidList}
                                     validList={validList}></InvalidModalImportStock>
        </div>
    </>);
}
export default ImportStockUploadExcel;


