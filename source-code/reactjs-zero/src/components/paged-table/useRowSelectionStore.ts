import {TableRowSelection} from 'antd/es/table/interface';
import {create} from 'zustand';
import React from "react";

interface RowSelectionState<T> {
    selectedRowKeys: React.Key[];
    selectedRows: T[];
    setSelection: (keys: React.Key[], rows: T[]) => void;
    clearSelection: () => void;
}

// Dùng 1 global store per T
const useRowSelectionStore = <T>() =>
    create<RowSelectionState<T>>((set) => ({
        selectedRowKeys: [],
        selectedRows: [],
        setSelection: (keys, rows) => {
            set({selectedRowKeys: keys, selectedRows: rows});
        },
        clearSelection: () => {
            set({selectedRowKeys: [], selectedRows: []});
        },
    }));

// Tạo 1 instance hook reusable
export function createRowSelectionHook<T>(config: {
    isRowDisabled?: (record: T) => boolean
}) {
    const store = useRowSelectionStore<T>();
    const {isRowDisabled} = config;
    return function useRowSelection() {
        const {
            selectedRowKeys,
            selectedRows,
            setSelection,
            clearSelection,
        } = store();

        const rowSelection: TableRowSelection<T> = {
            selectedRowKeys,
            onChange: (keys, rows) => setSelection(keys, rows),
            getCheckboxProps: isRowDisabled
                ? (record) => ({disabled: isRowDisabled(record)})
                : undefined,
        };

        return {
            rowSelection,
            selectedRowKeys,
            selectedRows,
            clearSelection,
        };
    };
}
