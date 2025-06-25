import {TableRowSelection} from 'antd/es/table/interface';
import {create} from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';
import React, {useMemo, useCallback} from 'react';

interface RowSelectionState<T> {
    selectedRowKeys: React.Key[];
    selectedRows: T[];
    setSelection: (keys: React.Key[], rows: T[]) => void;
    clearSelection: () => void;
    toggleRow: (key: React.Key, row: T) => void;
    selectAll: (rows: T[], getKey: (row: T) => React.Key) => void;
    isSelected: (key: React.Key) => boolean;
}

interface RowSelectionConfig<T> {
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

            setSelection: (keys, rows) => {
                set({selectedRowKeys: keys, selectedRows: rows});
            },

            clearSelection: () => {
                set({selectedRowKeys: [], selectedRows: []});
            },

            toggleRow: (key, row) => {
                const {selectedRowKeys, selectedRows} = get();
                const keyIndex = selectedRowKeys.indexOf(key);

                if (keyIndex >= 0) {
                    // Remove if exists
                    const newKeys = selectedRowKeys.filter((_, index) => index !== keyIndex);
                    const newRows = selectedRows.filter((_, index) => index !== keyIndex);
                    set({selectedRowKeys: newKeys, selectedRows: newRows});
                } else {
                    // Add if not exists
                    set({
                        selectedRowKeys: [...selectedRowKeys, key],
                        selectedRows: [...selectedRows, row]
                    });
                }
            },

            selectAll: (rows, getKey) => {
                const keys = rows.map(getKey);
                set({selectedRowKeys: keys, selectedRows: rows});
            },

            isSelected: (key) => {
                return get().selectedRowKeys.includes(key);
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
            toggleRow,
            selectAll,
            isSelected
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

                setSelection(validKeys, validRows);
                onSelectionChange?.(validKeys, validRows);
            } else {
                setSelection(keys, rows);
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
            onSelectAll: (selected, selectedRows, changeRows) => {
                if (selected) {
                    const validRows = selectedRows.filter(row => !isRowDisabled?.(row));
                    const keys = validRows.map((_, index) => index as React.Key);
                    handleSelectionChange(keys, validRows);
                } else {
                    clearSelection();
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

        // Extended API
        return {
            // Core functionality
            rowSelection,
            selectedRowKeys,
            selectedRows,
            clearSelection,

            // Extended functionality
            toggleRow,
            selectAll,
            isSelected,
            hasSelection: selectedRowKeys.length > 0,
            selectionCount: selectedRowKeys.length,

            // Utility methods
            selectFirst: (rows: T[], getKey: (row: T) => React.Key) => {
                const firstRow = rows.find(row => !isRowDisabled?.(row));
                if (firstRow) {
                    const key = getKey(firstRow);
                    setSelection([key], [firstRow]);
                }
            },

            selectByCondition: (rows: T[], condition: (row: T) => boolean, getKey: (row: T) => React.Key) => {
                const matchingRows = rows.filter(row =>
                    condition(row) && !isRowDisabled?.(row)
                );
                if (maxSelection && matchingRows.length > maxSelection) {
                    matchingRows.splice(maxSelection);
                }
                const keys = matchingRows.map(getKey);
                setSelection(keys, matchingRows);
            },

            // Bulk operations
            invertSelection: (allRows: T[], getKey: (row: T) => React.Key) => {
                const allKeys = allRows.map(getKey);
                const unselectedKeys = allKeys.filter(key => !selectedRowKeys.includes(key));
                const unselectedRows = allRows.filter((row, index) =>
                    unselectedKeys.includes(allKeys[index]) && !isRowDisabled?.(row)
                );
                setSelection(unselectedKeys, unselectedRows);
            }
        };
    };
}
