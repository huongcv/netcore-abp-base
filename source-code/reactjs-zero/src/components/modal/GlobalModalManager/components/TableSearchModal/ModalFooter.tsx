import {RenderGlobalContentModalInput} from "@ord-components/modal/GlobalModalManager/types";
import {RenderBulkActionInput} from "@ord-components/modal/GlobalModalManager/hook/useTableSearchModal";
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";
import {useMemo} from "react";
import {formSignalUtils} from "@ord-components/paged-table/utils/formSignal.utils";
import React from "react";

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
            const node = renderBulkActions({
                onCloseModal: onClose,
                clearSelection,
                selectedRowKeys,
                selectedRows,
                onReloadTableModal: () => {
                    formSignalUtils.reloadTableOnly(internalForm);
                }
            });
            const keyNode = 'bulk-action' + Number(new Date());
            // Thêm key tại đây, dùng React.cloneElement nếu là phần tử hợp lệ
            if (node && React.isValidElement(node)) {
                nodes.push(React.cloneElement(node, {key: keyNode}));
            } else if (Array.isArray(node)) {
                // Nếu renderBulkActions trả về một mảng ReactNode
                node.forEach((child, index) => {
                    if (React.isValidElement(child)) {
                        nodes.push(React.cloneElement(child, {key: `${keyNode}-${index}`}));
                    } else {
                        nodes.push(child); // vẫn đẩy nếu không thể thêm key
                    }
                });
            } else {
                nodes.push(node); // fallback nếu không rõ
            }
        }
        return nodes;
    }, [renderBulkActions, selectedRowKeys, selectedRows]);

    return <>
        <OrdModalFooter left={leftBtn} onClose={onClose}/>
    </>
}