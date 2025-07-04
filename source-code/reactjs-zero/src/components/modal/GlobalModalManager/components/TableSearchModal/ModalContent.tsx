import {
    SearchablePagedTable,
    SearchablePagedTableProps
} from "@ord-components/paged-table/components/SearchablePagedTable";
import {RenderGlobalContentModalInput} from "@ord-components/modal/GlobalModalManager/types";
import {RowSelectionConfig} from "@ord-components/paged-table/hooks/useRowSelectionStore";

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
    return <>
        <SearchablePagedTable
            initialSearchParams={modalData}
            {...tableProps}
            searchForm={internalForm}
            rowSelection={isHasSelectionRow ? rowSelection : undefined}
        />
    </>
}