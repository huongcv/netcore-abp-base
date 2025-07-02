import {RenderGlobalContentModalInput} from "@ord-components/modal/GlobalModalManager/types";
import {RenderBulkActionInput} from "@ord-components/modal/GlobalModalManager/hook/useTableSearchModal";
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";
import {useMemo} from "react";
import {Form} from "antd";
import {formSignalUtils} from "@ord-components/paged-table/utils/formSignal.utils";

export const TableSearchModalFooter = (props: {
    renderInput: RenderGlobalContentModalInput;
    renderBulkActions?: (input: RenderBulkActionInput) => React.ReactNode;
}) => {
    const {
        renderInput,
        renderBulkActions
    } = props;
    const {internalForm, rowSelectionStore} = renderInput;
    const {
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection
    } = rowSelectionStore;
    const {onClose} = renderInput;
    const leftBtn = useMemo(() => {
        const nodes = [];
        if (renderBulkActions) {
            nodes.push(renderBulkActions({
                onCloseModal: onClose,
                clearSelection,
                selectedRowKeys,
                selectedRows,
                onReloadTableModal: () => {
                    formSignalUtils.reloadTableOnly(internalForm);
                }
            }));
        }
        return nodes;
    }, [renderBulkActions, selectedRowKeys, selectedRows]);

    return <>
        <OrdModalFooter left={leftBtn} onClose={onClose}/>
    </>
}