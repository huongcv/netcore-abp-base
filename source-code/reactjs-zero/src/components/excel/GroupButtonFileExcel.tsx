import React, {memo} from "react";
import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {handleDownloadFileByFileInfo} from "@ord-components/excel/ExcelFileHelper";
import {FileUploadDto} from "@api/index.defs";

const GroupButtonFileExcel = ({fileValid, fileInValid, countValid, countInValid, setMessage}:
                                  {
                                      fileValid: FileUploadDto,
                                      countValid: number,
                                      fileInValid: FileUploadDto,
                                      countInValid: number,
                                      setMessage?: (msg: string) => void
                                  }) => {
    const {t} = useTranslation('excel');

    const download = async (file: FileUploadDto) => {
        try {
         await   handleDownloadFileByFileInfo(file);
        }catch {
            setMessage && setMessage(t('actionError'));
        }
    }

    return <>
        <Button
            className='bg-green-500  mr-2 hover:!bg-green-500 hover:!text-white hover:!border-green-500'
            disabled={!countValid}
            onClick={() => download(fileValid)}>
            <DownloadOutlined/>
            {t('success')} ({countValid})
        </Button>
        <Button type='primary'
                className='mr-2'
                disabled={!countInValid}
                onClick={() => download(fileInValid)}>
            <DownloadOutlined/> {t('failed')} ({countInValid})
        </Button>
    </>
}

export default memo(GroupButtonFileExcel);
