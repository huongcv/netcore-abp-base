import {create} from 'zustand';

export interface ModalFormState<T = any> {
    open: boolean;
    dataItem: T | null;
    openModal: (item: T) => void;
    close: () => void;
}

export const createModalStore = <TDetail>() =>
    create<ModalFormState<TDetail>>((set, get) => ({
        open: false,
        dataItem: null,
        openModal: (item) => set({open: true, dataItem: {...item}}),
        close: () => set({open: false, dataItem: null})
    }));
