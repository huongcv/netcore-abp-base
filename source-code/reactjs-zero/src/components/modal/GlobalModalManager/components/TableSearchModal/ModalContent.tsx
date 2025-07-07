import {
    SearchablePagedTable,
    SearchablePagedTableProps
} from "@ord-components/paged-table/components/SearchablePagedTable";
import {RenderGlobalContentModalInput} from "@ord-components/modal/GlobalModalManager/types";
import {useCallback} from "react";

export const TableSearchModalContent = (props: {
    modalData?: any;
    tableProps: SearchablePagedTableProps<any>;
    renderInput: RenderGlobalContentModalInput;
    isHasSelectionRow: boolean
}) => {
    const {
        modalData,
        tableProps,
        renderInput,
        isHasSelectionRow
    } = props;
    const {internalForm, rowSelectionStore} = renderInput;
    const {
        rowSelection,
        onChangeTableData
    } = rowSelectionStore;
    return <>
        <SearchablePagedTable
            initialSearchParams={modalData}
            {...tableProps}
            searchForm={internalForm}
            rowSelection={isHasSelectionRow ? rowSelection : undefined}
            onChangeDataTable={onChangeTableData}
        />
    </>
}