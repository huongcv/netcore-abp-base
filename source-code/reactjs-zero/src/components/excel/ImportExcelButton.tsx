import {DownloadOutlined, UploadOutlined} from "@ant-design/icons";
import {Alert, Button, Upload} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import './import-excel.scss';

const DEFAULT_MAX_FILE_SIZE_MB = 2;

interface IProps {
    onChangeBinaryStr?: (binaryStr: string) => void;
    onChangeFile?: (file: File | undefined) => void;
    onClickDownloadTemplate?: () => void;
    urlDownloadTemplate?: string,
    messageError?: string | null; //message trong các trường hợp muốn custom rồi truyền vào
    maxRows?: number;
    maxFileSize?: number; //MB
}

const readFileAsBinaryString = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            resolve(e.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsBinaryString(file);
    });
};

const inValidFileType = (fileType: string) => {
    return fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        && fileType !== "application/vnd.ms-excel";
}

const inValidFileSize = (fileSize: number, maxFileSize: number) => {
    return maxFileSize && (fileSize > 1024 * 1024 * maxFileSize);
}

export const ImportExcelButton = (props: IProps) => {
    const { t } = useTranslation('excel');
    const {
        onChangeBinaryStr,
        onChangeFile,
        onClickDownloadTemplate,
        urlDownloadTemplate,
        maxRows,
        maxFileSize,
        messageError,
    } = props;
    const [message, setMessage] = useState<string>('');
    const [fileSelected, setFileSelected] = useState(false);

    const beforeUpload = async (file: File) => {
        let binary = '';
        let statusUpload = false;
        const finalMaxFileSize = maxFileSize || DEFAULT_MAX_FILE_SIZE_MB;
        if (inValidFileType(file.type)) {
            setFileSelected(false);
            setMessage(t('error.onlyUploadExcel'));
            return statusUpload;
        }

        if (inValidFileSize(file.size, finalMaxFileSize)) {
            setFileSelected(false);
            setMessage(t('error.maxSizeUploadExcel'));
            return statusUpload;
        }

        binary = await readFileAsBinaryString(file);
        if (binary) {
            onChangeBinaryStr && onChangeBinaryStr(binary);
            onChangeFile && onChangeFile(file);
            setMessage('');
            setFileSelected(true);
            statusUpload = true;
            return statusUpload;
        }

        if (messageError) {
            setFileSelected(false);
            setMessage(messageError);
            return statusUpload;
        }

        setFileSelected(false);
        setMessage('');
        return statusUpload;
    };

    const onRemove = () => {
        setMessage('');
        setFileSelected(false);
        onChangeBinaryStr && onChangeBinaryStr("");
        onChangeFile && onChangeFile(undefined);
    };

    useEffect(() => {
        if (messageError) {
            setFileSelected(false);
            setMessage(messageError);
        } else {
            setMessage('');
        }
    }, [messageError, fileSelected]);

    return (<>
        <div className={'excel-uploaded'}>
            <Upload
                beforeUpload={beforeUpload}
                customRequest={(options) => {
                    const { onSuccess, onError, file, onProgress } = options;
                    // @ts-ignore
                    onSuccess("Ok");
                }}
                accept=".xlsx, .xls"
                maxCount={1}
                className='justify-start'
                onRemove={onRemove}
            >
                <Button icon={<UploadOutlined />}>{t('selectFileExcelPlaceholder')}</Button>
            </Upload>
            <ul className='mt-1'>
                <li className='mb-1'>{t('infoImportPlaceholder')}
                    {
                        !!(maxFileSize || DEFAULT_MAX_FILE_SIZE_MB) && t('error.maxSizeExcelPlaceholder', {
                            maxSize: maxFileSize || DEFAULT_MAX_FILE_SIZE_MB,
                        })
                    }
                </li>
                <li className='mb-1'>{t('importDownloadTemplate')}
                    <strong className='ml-1'>
                        <span className={'text-base'}>
                            {
                                onClickDownloadTemplate && <a className={'ms-2'} onClick={onClickDownloadTemplate}>
                                    <DownloadOutlined />
                                    {t('importDownloadTemplateBtn')}
                                </a>
                            }
                            {
                                urlDownloadTemplate &&
                                <a href={urlDownloadTemplate} target={'_blank'}>
                                    <DownloadOutlined />
                                    {t('importDownloadTemplateBtn')}
                                </a>
                            }
                        </span>
                    </strong>
                </li>
            </ul>
            {
                message &&
                <Alert message={message} type="error" showIcon />
            }
        </div>
    </>);
}

