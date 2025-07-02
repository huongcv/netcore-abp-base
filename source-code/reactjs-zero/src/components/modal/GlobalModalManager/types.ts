import type {FormInstance, ModalProps} from 'antd';

export interface ModalData {
    encodedId?: string;

    [key: string]: any;
}

export interface RenderGlobalContentModalInput<TModalData = any> {
    internalForm: FormInstance;
    modalData?: TModalData | null;
    onClose: () => void;
}

export interface GlobalModalConfig<TModalData = any> {
    id: string;
    title?: React.ReactNode;
    modalProps?: ModalProps;
    modalData?: TModalData | null;
    renderModalContent: (inputRender: RenderGlobalContentModalInput) => React.ReactNode;
    renderModalFooter: (inputRender: RenderGlobalContentModalInput) => React.ReactNode;
}