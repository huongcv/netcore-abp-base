import React from 'react';
import {Button, Dropdown, Space} from 'antd';
import type {MenuProps} from 'antd';
import {
    FileExcelOutlined,
    ImportOutlined,
    ExportOutlined,
    DownOutlined
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

/**
 * Props interface cho ExcelDropdown component
 */
export interface ExcelDropdownProps {
    /** Function xử lý khi click import. Nếu không có sẽ navigate theo importRoute */
    onImport?: () => void | Promise<void>;

    /** Function xử lý khi click export (bắt buộc) */
    onExport?: () => void | Promise<void>;

    /** Route để navigate khi import (chỉ dùng khi không có onImport) */
    importRoute?: string;

    /** CSS class name cho dropdown */
    className?: string;

    /** Trigger events cho dropdown */
    trigger?: ('click' | 'hover' | 'contextMenu')[];

    /** Vô hiệu hóa toàn bộ dropdown */
    disabled?: boolean;

    /** Custom label cho import option */
    importLabel?: string;

    /** Custom label cho export option */
    exportLabel?: string;

    /** Custom label cho button chính */
    buttonLabel?: string;

    /** Vô hiệu hóa riêng import option */
    disableImport?: boolean;

    /** Vô hiệu hóa riêng export option */
    disableExport?: boolean;

    /** Loading state cho import */
    importLoading?: boolean;

    /** Loading state cho export */
    exportLoading?: boolean;

    /** Custom style cho button */
    style?: React.CSSProperties;

    /** Size của button */
    size?: 'small' | 'middle' | 'large';

    /** Type của button */
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
}

/**
 * Component dropdown chung cho các thao tác Excel (Import/Export)
 */
const ExcelDropdown: React.FC<ExcelDropdownProps> = ({
                                                         onImport,
                                                         onExport,
                                                         importRoute = "import-excel",
                                                         className = "btn-secondary",
                                                         trigger = ["hover"],
                                                         disabled = false,
                                                         importLabel,
                                                         exportLabel,
                                                         buttonLabel,
                                                         disableImport = false,
                                                         disableExport = false,
                                                         importLoading = false,
                                                         exportLoading = false,
                                                         style,
                                                         size = 'middle',
                                                         type = 'default'
                                                     }) => {
    const navigate = useNavigate();
    const {t} = useTranslation('action');

    const handleImport = async (): Promise<void> => {
        if (importLoading) return;

        try {
            if (onImport) {
                await onImport();
            } else if (importRoute) {
                navigate(importRoute);
            }
        } catch (error) {
            console.error('Error during import:', error);
        }
    };

    const handleExport = async (): Promise<void> => {
        if (exportLoading) return;

        try {
            if (onExport) {
                await onExport();
            }
        } catch (error) {
            console.error('Error during export:', error);
        }
    };

    const items: MenuProps['items'] = [
        {
            label: (
                <a
                    onClick={handleImport}
                    style={{
                        pointerEvents: (disableImport || importLoading) ? 'none' : 'auto',
                        opacity: (disableImport || importLoading) ? 0.5 : 1
                    }}
                >
                    <Space>
                        <ImportOutlined spin={importLoading}/>
                        {importLabel || t("importExcel")}
                        {importLoading && t("loading")}
                    </Space>
                </a>
            ),
            key: "import",
            disabled: disableImport || (!onImport && !importRoute) || importLoading,
        },
        {
            label: (
                <a
                    onClick={handleExport}
                    style={{
                        pointerEvents: (disableExport || exportLoading) ? 'none' : 'auto',
                        opacity: (disableExport || exportLoading) ? 0.5 : 1
                    }}
                >
                    <Space>
                        <ExportOutlined spin={exportLoading}/>
                        {exportLabel || t("exportExcel")}
                        {exportLoading && t("loading")}
                    </Space>
                </a>
            ),
            key: "export",
            disabled: disableExport || !onExport || exportLoading,
        },
    ];

    return (
        <Dropdown
            className={className}
            menu={{items}}
            trigger={trigger}
            disabled={disabled}
        >
            <Button
                disabled={disabled}
                style={style}
                size={size}
                type={type}
                loading={importLoading || exportLoading}
            >
                <Space>
                    <FileExcelOutlined/>
                    {buttonLabel || t("actionExcel")}
                    <DownOutlined/>
                </Space>
            </Button>
        </Dropdown>
    );
};

export default ExcelDropdown;