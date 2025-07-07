import {TableRowSelection} from 'antd/es/table/interface';
import {create} from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';
import React, {useCallback, useMemo} from 'react';

interface RowSelectionState<T> {
    selectedRowKeys: React.Key[];
    selectedRows: T[];
    currentPageKeys: React.Key[];
    rowKey: string;

    setSelection: (keys: React.Key[], rows: T[], preserveSelection: boolean) => void;
    clearSelection: () => void;
    isSelected: (key: React.Key) => boolean;

    onChangeTableData: (rowKeys: React.Key[], rows: any[], rowKey: string) => void;
}

export interface RowSelectionConfig<T = any> {
    isRowDisabled?: (record: T) => boolean | null | undefined;
    maxSelection?: number;
    onSelectionChange?: (keys: React.Key[], rows: T[]) => void;
    preserveSelection?: boolean; // Giữ selection khi data thay đổi
}

// Store factory để tránh conflict giữa các instances
const createRowSelectionStore = <T>() =>
    create<RowSelectionState<T>>()(
        subscribeWithSelector((set, get) => ({
            selectedRowKeys: [],
            selectedRows: [],
            currentPageKeys: [],
            rowKey: '',
            setSelection: (keys, rows, preserveSelection: boolean) => {
                if (!preserveSelection) {
                    set({
                        selectedRowKeys: keys,
                        selectedRows: rows
                    });
                }
                const {
                    currentPageKeys,
                    selectedRows,
                    selectedRowKeys,
                    rowKey
                } = get();
                // Lấy các selections từ trang khác (không có trong trang hiện tại)
                const otherPageKeys = selectedRowKeys.filter(key =>
                    !currentPageKeys.includes(key)
                );
                const newAllSelectedKeys = [...otherPageKeys];
                keys.forEach(key => {
                    if (!otherPageKeys.includes(key)) {
                        newAllSelectedKeys.push(key);
                    }
                });

                const newAllSelectedRows: any[] = [];
                const includedRowKey: any[] = [];
                [...selectedRows, ...rows].forEach(row => {
                    // @ts-ignore
                    const rowKeyValue = row[rowKey] || '';
                    if (rowKeyValue && newAllSelectedKeys.includes(rowKeyValue)
                        && !includedRowKey.includes(rowKeyValue)) {
                        newAllSelectedRows.push(row);
                        includedRowKey.push(rowKeyValue);
                    }
                });

                set({
                    selectedRowKeys: newAllSelectedKeys,
                    selectedRows: newAllSelectedRows
                });
            },

            clearSelection: () => {
                set({
                    selectedRowKeys: [],
                    selectedRows: []
                });
            },

            isSelected: (key) => {
                return get().selectedRowKeys.includes(key);
            },
            onChangeTableData: (rowKeys: React.Key[], rows: any[], rowKey: string) => {
                set({
                    rowKey,
                    currentPageKeys: rowKeys
                });
            }
        }))
    );

// Improved hook factory
export function createRowSelectionHook<T>(config: RowSelectionConfig<T> = {}) {
    const {
        isRowDisabled,
        maxSelection,
        onSelectionChange,
        preserveSelection = false
    } = config;

    // Create store instance per hook instance
    const store = createRowSelectionStore<T>();

    return function useRowSelection() {
        const {
            selectedRowKeys,
            selectedRows,
            setSelection,
            clearSelection,
            isSelected,
            onChangeTableData
        } = store();

        // Memoized selection handler với validation
        const handleSelectionChange = useCallback((keys: React.Key[], rows: T[]) => {
            // Validate max selection
            if (maxSelection && keys.length > maxSelection) {
                console.warn(`Maximum ${maxSelection} items can be selected`);
                return;
            }

            // Filter disabled rows
            if (isRowDisabled) {
                const validKeys: React.Key[] = [];
                const validRows: T[] = [];

                keys.forEach((key, index) => {
                    const row = rows[index];
                    if (row && !isRowDisabled(row)) {
                        validKeys.push(key);
                        validRows.push(row);
                    }
                });

                setSelection(validKeys, validRows, preserveSelection);
                onSelectionChange?.(validKeys, validRows);
            } else {
                setSelection(keys, rows, preserveSelection);
                onSelectionChange?.(keys, rows);
            }
        }, [maxSelection, isRowDisabled, setSelection, onSelectionChange]);

        // Memoized row selection config
        const rowSelection: TableRowSelection<T> = useMemo(() => ({
            selectedRowKeys,
            onChange: handleSelectionChange,
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                if (isRowDisabled?.(record)) {
                    nativeEvent?.preventDefault();
                    return;
                }
            },
            getCheckboxProps: (record) => ({
                disabled: isRowDisabled?.(record) ?? false,
                name: 'row-selection'
            }),
            // Thêm các props hữu ích khác
            columnWidth: 48,
            fixed: true,
            hideSelectAll: maxSelection === 1, // Hide select all nếu chỉ cho phép chọn 1
        }), [selectedRowKeys, handleSelectionChange, isRowDisabled, clearSelection, maxSelection]);

        const handleChangeTableData = useCallback((rowKeys: React.Key[], rows: any[], rowKey: string) => {
            onChangeTableData(rowKeys, rows, rowKey);
            if (!preserveSelection) {
                clearSelection();
            }
        }, [onChangeTableData]);
        // Extended API
        return {
            // Core functionality
            rowSelection,
            selectedRowKeys,
            selectedRows,
            clearSelection,
            onChangeTableData: handleChangeTableData,

            // Extended functionality
            isSelected,
            hasSelection: selectedRowKeys.length > 0,
            selectionCount: selectedRowKeys.length,

            // Utility methods
            selectByCondition: (rows: T[], condition: (row: T) => boolean, getKey: (row: T) => React.Key) => {
                const matchingRows = rows.filter(row =>
                    condition(row) && !isRowDisabled?.(row)
                );
                if (maxSelection && matchingRows.length > maxSelection) {
                    matchingRows.splice(maxSelection);
                }
                const keys = matchingRows.map(getKey);
                setSelection(keys, matchingRows, preserveSelection);
            }
        };
    };
}

export const useRowSelectionStore = <T extends object>(options?: RowSelectionConfig<T>) => {
    const useStore = useMemo(() => createRowSelectionHook<T>(options), []);
    return useStore();
};