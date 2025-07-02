import {ModalProps} from 'antd';
import {useGlobalModalStore} from "@ord-components/modal/GlobalModalManager/hook/useGlobalModalStore";
import {SearchablePagedTableProps} from "@ord-components/paged-table/components/SearchablePagedTable";
import {RowSelectionConfig} from "@ord-components/paged-table/hooks/useRowSelectionStore";
import {
    TableSearchModalContent
} from "@ord-components/modal/GlobalModalManager/components/TableSearchModal/ModalContent";
import {TableSearchModalFooter} from "@ord-components/modal/GlobalModalManager/components/TableSearchModal/ModalFooter";

export interface UseTableSearchModalConfig<T = any> {
    title?: React.ReactNode;
    tableProps: SearchablePagedTableProps<T>;
    modalProps?: Omit<ModalProps, 'onOk' | 'open' | 'onCancel'>;
    rowSelectionConfig?: RowSelectionConfig;
}

export interface RenderBulkActionInput {
    selectedRowKeys: any[];
    selectedRows: any[];
    onCloseModal: () => void;
    clearSelection: () => void;
    onReloadTableModal: () => void;
}

export interface OpenModalInput {
    modalData?: any;
    title?: React.ReactNode;
    renderBulkActions?: (input: RenderBulkActionInput) => React.ReactNode;
}

export const useTableSearchModal = <T extends object>(config: UseTableSearchModalConfig) => {
    const {openModal, closeModal} = useGlobalModalStore();
    const {
        title,
        modalProps = {width: 1200},
        tableProps,
        rowSelectionConfig
    } = config;

    const openTableModal = (input?: OpenModalInput) => {
        const {
            modalData = {},
            renderBulkActions
        } = input || {};
        return openModal({
            title: input?.title || title,
            modalData: modalData,
            modalProps,
            renderModalContent: (inputRender) => {
                return (
                    <TableSearchModalContent tableProps={tableProps}
                                             modalData={modalData}
                                             rowSelectionConfig={rowSelectionConfig}
                                             renderInput={inputRender}
                                             isHasSelectionRow={!!renderBulkActions}
                    />
                );
            },
            renderModalFooter: (renderInput) => {
                return <TableSearchModalFooter renderInput={renderInput} renderBulkActions={renderBulkActions}/>;
            },
            rowSelectionConfig
        });
    };
    return {
        openTableModal,
    }
}