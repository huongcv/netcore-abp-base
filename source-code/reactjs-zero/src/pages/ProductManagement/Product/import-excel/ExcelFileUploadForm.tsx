import React, {memo, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {useTranslation} from "react-i18next";
import ValidateProductTable from "@pages/ProductManagement/Product/import-excel/ValidateProductTable";
import {observer} from "mobx-react-lite";
import {ImportExcelButton} from "@ord-components/excel/ImportExcelButton";
import {Checkbox, Radio} from "antd";
import {ProductImportExcelService} from "@api/ProductImportExcelService";
import FileSaver from "file-saver";

export enum EXPORT_TYPE_PRODUCT {
    NORMAL = 1,
    KIOT_VIET = 2,
}

const ExcelFileUploadForm = () => {
    const {t} = useTranslation('product-excel');
    const [binaryStr, setBinaryStrExcel] = useState('');
    const [file, setFile] = useState<File | undefined>(undefined);
    const [message, setMessage] = useState('');
    const [typeExport, setTypeExport] = useState(EXPORT_TYPE_PRODUCT.NORMAL);
    const [isProductChain, setIsProductChain] = useState(false);

    const handlerDownloadTemplate = async () => {
        try {
            let api = ProductImportExcelService.getImportExcelTemplate;
            if (typeExport === EXPORT_TYPE_PRODUCT.KIOT_VIET) {
                api = ProductImportExcelService.getImportExcelKiotVietTemplate;
            }

            UiUtils.setBusy();
            const blobResult = await api({
                responseType: 'blob'
            });
            const fileName = t('fileNameExcelTemplate');
            FileSaver.saveAs(blobResult, fileName);
        } catch (ex: any) {
            console.error(ex);
        } finally {
            UiUtils.clearBusy();
        }
    }

    const RadioGroup = memo(({ disabled }: {disabled: boolean}) =>
        <Radio.Group disabled={disabled} className='mb-2' options={[
            {label: 'File mẫu hệ thống', value: EXPORT_TYPE_PRODUCT.NORMAL},
            {label: 'File mẫu Kiot Việt', value: EXPORT_TYPE_PRODUCT.KIOT_VIET},
        ]} onChange={(e) => {
            setTypeExport(e.target.value);
        }} defaultValue={typeExport}/>
    )

    return (
        <>
            <RadioGroup disabled={Boolean(file)}/>

            {
                typeExport === EXPORT_TYPE_PRODUCT.KIOT_VIET &&
                    <Checkbox className='ml-2' disabled={Boolean(file)} value={isProductChain} onChange={(v) => {
                        setIsProductChain(v.target.checked);
                    }}> {t("isProductChain")}</Checkbox>
            }

            <ImportExcelButton onChangeFile={setFile} messageError={message} onChangeBinaryStr={setBinaryStrExcel}
                               onClickDownloadTemplate={handlerDownloadTemplate}></ImportExcelButton>
            <ValidateProductTable isProductChain={isProductChain} typeExport={typeExport} file={file} setMessage={setMessage}/>
        </>

    );
}
export default observer(ExcelFileUploadForm);
