import {
    SearchablePagedTable,
    SearchablePagedTableProps
} from "@ord-components/paged-table/components/SearchablePagedTable";
import {RenderGlobalContentModalInput} from "@ord-components/modal/GlobalModalManager/types";
import {RowSelectionConfig, useRowSelectionStore} from "@ord-components/paged-table/hooks/useRowSelectionStore";
import {Form} from "antd";
import {useEffect} from "react";

export const TableSearchModalContent = (props: {
    modalData?: any;
    tableProps: SearchablePagedTableProps<any>;
    renderInput: RenderGlobalContentModalInput;
    rowSelectionConfig?: RowSelectionConfig;
    isHasSelectionRow: boolean
}) => {
    const {
        modalData,
        tableProps,
        renderInput,
        rowSelectionConfig,
        isHasSelectionRow
    } = props;
    const {internalForm, rowSelectionStore} = renderInput;
    const {
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection
    } = rowSelectionStore;
    // useEffect(() => {
    //     internalForm.setFieldsValue({
    //         extendUi: {
    //             selectedRowKeys,
    //             selectedRows
    //         }
    //     })
    // }, [selectedRowKeys]);
    // const clearSelection_w = Form.useWatch(['extendUi', 'clearSelection'], internalForm);
    // useEffect(() => {
    //     if (clearSelection_w > 0) {
    //         clearSelection();
    //     }
    //
    // }, [clearSelection_w]);
    return <>
        <SearchablePagedTable
            initialSearchParams={modalData}
            {...tableProps}
            searchForm={internalForm}
            rowSelection={isHasSelectionRow ? rowSelection : undefined}
        />
    </>
}