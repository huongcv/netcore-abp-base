import {Button, Dropdown, Space} from "antd";
import {DownOutlined, FileExcelOutlined} from "@ant-design/icons";
import React from "react";
import {useTranslation} from "react-i18next";
import {CommonListStore} from "@ord-core/base/CommonListStore";
import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import DateUtil from "@ord-core/utils/date.util";
import {IRequestOptions, StockMovePagedRequestDto} from "@api/index.defs";

type API = (params: { body?: StockMovePagedRequestDto; }, options: IRequestOptions) => Promise<any>

export const StockMoveExportExcelDropDownBtn = (props: {
    stored: CommonListStore<any>,
    exportMoveApi: API,
    exportMoveDetailApi: API,
    fileName: string
}) => {
    const {exportMoveApi, exportMoveDetailApi} = props;
    const {t} = useTranslation();

    const exportMove = async () => {
        UiUtils.setBusy();
        try {
            const blobResult = await exportMoveApi({
                body: getSearchValue()
            }, {
                responseType: 'blob'
            });
            const fileName = t('fileExcelNameMoveStock.' + props.fileName, {
                ns: 'stock',
                date: DateUtil.getToDayString()
            });
            FileSaver.saveAs(blobResult, fileName);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    const exportMoveDetail = async () => {
        UiUtils.setBusy();
        try {
            const blobResult = await exportMoveDetailApi({
                body: getSearchValue()
            }, {
                responseType: 'blob'
            });
            const fileName = t('fileExcelNameMoveDetailStock.' + props.fileName, {
                ns: 'stock',
                date: DateUtil.getToDayString()
            });
            FileSaver.saveAs(blobResult, fileName);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    const getSearchValue = () => {
        const {searchFormRef} = props.stored;
        if (searchFormRef) {
            return searchFormRef.getFieldsValue();
        }
        return null;
    }

    return (<Dropdown menu={{
        items: [
            {
                key: '1',
                label: (
                    <a onClick={exportMove}>
                        <FileExcelOutlined/> {t('exportExcelMove')}
                    </a>
                ),
            },
            {
                key: '2',
                label: (
                    <a onClick={exportMoveDetail}>
                        <FileExcelOutlined/> {t('exportExcelMoveDetail')}
                    </a>
                ),
            },
        ]
    }}>
        <Button className={'btn-secondary'} onClick={(e) => e.preventDefault()}>
            <Space>
                <FileExcelOutlined/>
            </Space>
            {t('actionBtn.exportExcel')}
            <DownOutlined style={{fontSize: 16}}/>
        </Button>
    </Dropdown>);
}
