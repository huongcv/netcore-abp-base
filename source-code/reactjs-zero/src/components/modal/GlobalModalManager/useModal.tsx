import {ModalData, useGlobalModalStore} from "@ord-components/modal/GlobalModalManager/modalStore";

interface UseModalOptions {
    onSubmit?: (formValues: any, modalData?: ModalData | null, modalId?: string) => Promise<boolean> | boolean;
    width?: number;
}

export const useGlobalModal = (options: UseModalOptions) => {
    const {openModal} = useGlobalModalStore();

    const open = (title: string, data?: ModalData) => {
        return openModal({
            title,
            modalData: data,
            onSubmit: options.onSubmit,
            width: options.width
        });
    };

    return {
        open
    };
};