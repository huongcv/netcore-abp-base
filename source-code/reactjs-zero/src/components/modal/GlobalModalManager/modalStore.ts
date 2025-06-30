import {ModalProps} from 'antd/es/modal';
import {create} from 'zustand';
import {v4 as uuidv4} from "uuid";
import {IButtonModal} from "@ord-components/modal/footer/buttons/useButtonRender";

export interface ModalData {
    id?: string;
    encodedId?: string;

    [key: string]: any;
}


export type IButtonModal = 'save' | React.ReactNode;

export interface IFooterButtonProps {
    left?: IButtonModal[];
    right?: IButtonModal[];
    leftClose?: IButtonModal[];
}

export interface ModalConfig extends ModalProps {
    viewId: string;
    modalData?: ModalData | null;
    formRender?: (modalData?: ModalData | null) => React.ReactNode;
    modalContentRender?: (modalData?: ModalData | null) => React.ReactNode;
    onSubmit?: (formValues: any, modalData?: ModalData | null, modalId?: string) => Promise<boolean> | boolean;
    mustLoadingPageWhenSaving?: boolean;
    footerButtons?: IFooterButtonProps;
}

interface ModalStore {
    modals: ModalConfig[];
    openModal: (config: Omit<ModalConfig, 'viewId' | 'loading'> & { id?: string }) => string;
    closeModal: (modalId: string) => void;
    closeAllModals: () => void;
    setLoading: (modalId: string, loading: boolean) => void;
    updateModalData: (modalId: string, data: Partial<ModalData>) => void;
    getModal: (modalId: string) => ModalConfig | undefined;
}

export const useGlobalModalStore = create<ModalStore>((set, get) => ({
    modals: [],

    openModal: (config) => {
        const modalId = uuidv4();
        const newModal: ModalConfig = {
            ...config,
            viewId: modalId
        };

        set((state) => ({
            modals: [...state.modals, newModal],
        }));

        return modalId;
    },

    closeModal: (modalId) => {
        set((state) => ({
            modals: state.modals.filter((modal) => modal.viewId !== modalId),
        }));
    },

    closeAllModals: () => {
        set({modals: []});
    },

    setLoading: (modalId, loading) => {
        set((state) => ({
            modals: state.modals.map((modal) =>
                modal.viewId === modalId ? {...modal, loading} : modal
            ),
        }));
    },

    updateModalData: (modalId, newData) => {
        set((state) => ({
            modals: state.modals.map((modal) =>
                modal.viewId === modalId
                    ? {
                        ...modal,
                        data: modal.modalData ? {...modal.modalData, ...newData} : newData,
                    }
                    : modal
            ),
        }));
    },

    getModal: (modalId) => {
        return get().modals.find((modal) => modal.viewId === modalId);
    },
}));
