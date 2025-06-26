import {create} from 'zustand';

interface IHandler {
    onAfterSuccess?: () => void;
    onAfterError?: () => void;
    onAfterClose?: () => void;
}

export interface ModalFormState<T = any> {
    open: boolean;
    dataItem: T | null;
    handler: IHandler | null;
    openModal: (item: T, handler?: IHandler) => void;
    close: () => void;

}

export const createModalStore = <TDetail extends object>() =>
    create<ModalFormState<TDetail>>((set, get) => ({
        open: false,
        dataItem: null,
        handler: null,
        openModal: (item, handler?: IHandler) => {
            set({open: true, dataItem: {...item}, handler});
        },
        close: () => set({open: false, dataItem: null, handler: null})
    }));
