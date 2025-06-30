import {create} from 'zustand';
import {v4 as uuidv4} from "uuid";
import type {FormInstance, ModalProps} from 'antd';

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
    form?: FormInstance;
    modalData?: ModalData | null;
    formRender?: (modalData?: ModalData | null) => React.ReactNode;
    modalContentRender?: (modalData?: ModalData | null) => React.ReactNode;
    onSubmit?: (formValues: any, modalData?: ModalData | null, modalId?: string) => Promise<boolean> | boolean;
    mustLoadingPageWhenSaving?: boolean;
    footerButtons?: IFooterButtonProps;
    ignoreHotKeys?: string[];
}

interface ModalStore {
    modals: ModalConfig[];
    topModalId: string | null;
    openModal: (config: Omit<ModalConfig, 'viewId' | 'loading'> & { id?: string }) => string;
    closeModal: (modalId: string) => void;
    closeAllModals: () => void;
    setLoading: (modalId: string, loading: boolean) => void;
    updateModalData: (modalId: string, data: Partial<ModalData>) => void;
    getModal: (modalId: string) => ModalConfig | undefined;
    getTopModalId: () => string | null;
}

export const useGlobalModalStore = create<ModalStore>((set, get) => ({
    modals: [],
    topModalId: null,
    openModal: (config) => {
        const modalId = uuidv4();
        const newModal: ModalConfig = {
            ...config,
            viewId: modalId
        };

        set((state) => ({
            modals: [...state.modals, newModal],
            topModalId: modalId,
        }));
        return modalId;
    },

    closeModal: (modalId) => {
        set((state) => {
            const newModals = state.modals.filter((modal) => modal.viewId !== modalId);
            const lastVisible = [...newModals].reverse().find(modal => modal.visible);
            return {
                modals: newModals,
                topModalId: lastVisible?.viewId || null,
            };
        });
    },

    closeAllModals: () => {
        set({
            modals: [],
            topModalId: null,
        });
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
    getTopModalId: () => {
        const modals = get().modals;
        const lastVisible = [...modals].reverse().find(modal => modal.visible);
        return lastVisible?.viewId || null;
    },
}));
