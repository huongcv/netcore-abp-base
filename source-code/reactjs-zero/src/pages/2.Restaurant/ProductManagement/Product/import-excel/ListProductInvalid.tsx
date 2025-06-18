import {observer} from "mobx-react-lite";
import {Button, Table} from "antd";
import React from "react";
import {ColumnType} from "antd/es/table/interface";
import {FileUploadDto, ProductImportDto, ProductImportKiotVietDto} from "@api/index.defs";
import {BaseColumnImportProduct} from "@pages/ProductManagement/Product/import-excel/ListProductValid";
import {useTranslation} from "react-i18next";
import {handleDownloadFileByFileInfo} from "@ord-components/excel/ExcelFileHelper";
import {DownloadOutlined} from "@ant-design/icons";

export const ErrorCell = (props: {
    product: ProductImportDto | ProductImportKiotVietDto
}) => {
    const {t} = useTranslation('product-excel');
    return (<ul className={'ms-[15px] list-disc'}>
        {
            !!props.product.errors?.length &&
            props.product.errors.map((it, idx) => (<li key={idx} className={'text-red-500'}>
                {t(it as any) as any}
            </li>))
        }
    </ul>);
}

const ListProductInvalid = (props: {
    setMessage: (message: string) => void,
    data: ProductImportDto[] | ProductImportKiotVietDto[] | null | undefined
    fileInfo: FileUploadDto | undefined
}) => {
    const {setMessage, data, fileInfo} = props;
    const {t} = useTranslation('product');

    const columns: ColumnType<ProductImportDto | ProductImportKiotVietDto>[] = [
        {
            title: t('detailError'),
            width: 250,
            render: (_, dto) => {
                return <ErrorCell product={dto}/>;
            }
        },
        ...BaseColumnImportProduct.map(it => ({
            ...it,
            title: t(it.title as string)
        }))
    ];

    const downloadFileError = async () => {
        try {
            await handleDownloadFileByFileInfo(fileInfo!);
        } catch {
            setMessage && setMessage(t('actionError'));
        }
    }

    return (<>
        <Table
            bordered={true}
            columns={columns}
            dataSource={data?.map((row, index) => ({
                key: index,
                ...row
            }))}
        />
        {
            !!data?.length &&
            <div className={'mt-2 float-right'}>
                <Button onClick={downloadFileError}
                        icon={<DownloadOutlined/>}>{t('downloadListInValid', {ns: 'excel'})}</Button>
            </div>
        }
    </>)
}
export default observer(ListProductInvalid);
