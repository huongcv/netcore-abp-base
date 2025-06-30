import type {FormInstance, ModalProps} from 'antd';

export interface ModalData {
    encodedId?: string;

    [key: string]: any;
}

export interface GlobalModalConfig<TModalData = any> {
    id: string;
    title?: React.ReactNode;
    modalProps?: ModalProps;
    modalData?: TModalData | null;
    renderModalContent: (internalForm: FormInstance, modalData?: TModalData | null) => React.ReactNode;
    renderModalFooter: (onClose: () => void, internalForm: FormInstance, modalData?: TModalData | null) => React.ReactNode;
}