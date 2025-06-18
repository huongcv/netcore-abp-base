import React, {ReactNode, useEffect, useState} from "react";
import {Badge, Tabs} from "antd";
import {useTranslation} from "react-i18next";
import ListProductValid from "@pages/ProductManagement/Product/import-excel/ListProductValid";
import ListProductInvalid from "@pages/ProductManagement/Product/import-excel/ListProductInvalid";
import {observer} from "mobx-react-lite";
import UiUtils from "@ord-core/utils/ui.utils";
import {ProductImportExcelService} from "@api/ProductImportExcelService";
import {FileUploadDto, ProductImportDto, ProductImportKiotVietDto} from "@api/index.defs";
import {EXPORT_TYPE_PRODUCT} from "@pages/ProductManagement/Product/import-excel/ExcelFileUploadForm";

interface IProps {
    file: File | undefined | any,
    setMessage: (message: string) => void,
    typeExport: EXPORT_TYPE_PRODUCT,
    isProductChain: boolean
}

const ValidateProductTable = (props: IProps) => {
    const {setMessage, file, typeExport, isProductChain} = props;

    const {t} = useTranslation('product-excel');
    const [tabBarExtra, setTabBarExtra] = useState<ReactNode | any>(null);
    const [mount, setMount] = useState<boolean | any>(false);
    const [dataValid, setDataValid] = useState<ProductImportDto[] | ProductImportKiotVietDto[]>([]);
    const [dataInValid, setDataInValid] = useState<ProductImportDto[] | ProductImportKiotVietDto[]>([]);
    const [fileInValid, setFileInValid] = useState<FileUploadDto>();

    useEffect(() => {
        !mount && setMount(true);

        if (mount && file) {
            onValidate().then();
        }
    }, [file]);

    const onValidate = async () => {
        try {
            UiUtils.setBusy();
            setMessage('');
            let response: any;
            if (typeExport === EXPORT_TYPE_PRODUCT.KIOT_VIET) {
                response = await ProductImportExcelService.validateDataKiotViet({
                    uploadFile: file,
                    isProductChain: isProductChain
                });
            } else {
                response = await ProductImportExcelService.validateData({
                    uploadFile: file,
                });
            }

            if (response.isSuccessful) {
                setDataValid(response.data?.listSuccess || []);
                setDataInValid(response.data?.listError || []);
                setFileInValid(response.data?.errorFile);
                setMessage("");
            } else {
                setDataValid([]);
                setDataInValid([]);
                setMessage(response.message || "");
            }
        } catch (ex: any) {
            console.error('errors api: ', ex);
            setDataValid([]);
            setDataInValid([]);
            setMessage(ex?.message || "");
        } finally {
            UiUtils.clearBusy()
        }
    }

    useEffect(() => {
        console.log('change')
    }, [typeExport]);

    return (<div className={'mt-2'}>
        <>
            {
                (!!file && (!!dataValid?.length || !!dataInValid?.length)) &&
                <Tabs tabBarExtraContent={tabBarExtra} defaultActiveKey="1" items={[
                    {
                        key: '1',
                        label: <>
                            {t('listProductValid')} <Badge color={'green'} className={'ms-2'}
                                                           showZero
                                                           overflowCount={999_999}
                                                           count={dataValid?.length || 0}></Badge>
                        </>,
                        children: <ListProductValid typeExport={typeExport} file={file} data={dataValid}
                                                    setTabBarExtra={setTabBarExtra}
                                                    isProductChain={isProductChain}
                                                    setMessage={setMessage}/>,
                    },
                    {
                        key: '2',
                        label: <>
                            {t('listProductInvalid')}
                            <Badge color={'red'} className={'ms-2'}
                                   showZero
                                   overflowCount={999_999}
                                   count={dataInValid?.length || 0}></Badge>
                        </>,
                        children: <ListProductInvalid fileInfo={fileInValid} data={dataInValid}
                                                      setMessage={setMessage}/>
                    }
                ]}/>
            }
        </>
    </div>);
}
export default observer(ValidateProductTable);
