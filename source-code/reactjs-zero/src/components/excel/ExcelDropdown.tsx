import React from 'react';
import type {MenuProps} from 'antd';
import {Button, Dropdown, Space} from 'antd';
import {DownOutlined, ExportOutlined, FileExcelOutlined, ImportOutlined} from '@ant-design/icons';
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
 * Tự động hiển thị button đơn khi chỉ có 1 thao tác, dropdown khi có cả 2
 */
const ExcelDropdown: React.FC<ExcelDropdownProps> = (props: ExcelDropdownProps) => {
    const navigate = useNavigate();
    const {t} = useTranslation('action');
    const {
        onImport,
        onExport,
        importRoute,
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
    } = props;

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

    // Kiểm tra thao tác nào có thể thực hiện
    const canImport = !disableImport && (!!onImport || !!importRoute);
    const canExport = !disableExport && !!onExport;

    // Đếm số thao tác có thể thực hiện
    const availableActions = [canImport, canExport].filter(Boolean).length;

    // Nếu chỉ có 1 thao tác, hiển thị button đơn
    if (availableActions === 1) {
        if (canImport) {
            // Chỉ có Import
            return (
                <Button
                    className={className}
                    disabled={disabled || importLoading}
                    onClick={handleImport}
                    style={style}
                    size={size}
                    type={type}
                    loading={importLoading}
                >
                    <Space>
                        <ImportOutlined/>
                        {importLabel || t('importExcel')}
                    </Space>
                </Button>
            );
        } else if (canExport) {
            // Chỉ có Export
            return (
                <Button
                    className={className}
                    disabled={disabled || exportLoading}
                    onClick={handleExport}
                    style={style}
                    size={size}
                    type={type}
                    loading={exportLoading}
                >
                    <Space>
                        <FileExcelOutlined/>
                        {exportLabel || t("exportExcel")}
                    </Space>
                </Button>
            );
        }
    }

    // Nếu không có thao tác nào hoặc có cả 2, hiển thị dropdown
    if (availableActions === 0) {
        // Không có thao tác nào - hiển thị button disabled
        return (
            <Button
                className={className}
                disabled={true}
                style={style}
                size={size}
                type={type}
            >
                <Space>
                    <FileExcelOutlined/>
                    {buttonLabel || t("actionExcel")}
                </Space>
            </Button>
        );
    }

    // Có cả 2 thao tác - hiển thị dropdown
    const items: MenuProps['items'] = [
        canImport && {
            label: (
                <a
                    onClick={handleImport}
                    style={{
                        pointerEvents: importLoading ? 'none' : 'auto',
                        opacity: importLoading ? 0.5 : 1
                    }}
                >
                    <Space>
                        <ImportOutlined spin={importLoading}/>
                        {importLabel || t('importExcel')}
                        {importLoading && t('loading')}
                    </Space>
                </a>
            ),
            key: "import",
            disabled: importLoading,
        },
        canExport && {
            label: (
                <a
                    onClick={handleExport}
                    style={{
                        pointerEvents: exportLoading ? 'none' : 'auto',
                        opacity: exportLoading ? 0.5 : 1
                    }}
                >
                    <Space>
                        <ExportOutlined spin={exportLoading}/>
                        {exportLabel || t("exportExcel")}
                        {exportLoading && t('loading')}
                    </Space>
                </a>
            ),
            key: "export",
            disabled: exportLoading,
        },
    ].filter(Boolean);

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