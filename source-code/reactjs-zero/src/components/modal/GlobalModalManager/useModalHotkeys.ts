import {useHotkeys} from 'react-hotkeys-hook';
import {useGlobalModalStore} from './modalStore';
import {useMemo} from 'react';
import debounce from 'lodash/debounce';

interface UseModalHotkeysOptions {
    modalId: string;
    ignoreHotKeys?: string[];
    onOkModal: () => void;
    onClose: () => void;
}

export const useModalHotkeys = ({
                                    modalId,
                                    onOkModal,
                                    onClose,
                                    ignoreHotKeys
                                }: UseModalHotkeysOptions) => {
    const topModalId = useGlobalModalStore(state => state.topModalId);
    const isTop = topModalId === modalId;

    // Debounce cho onOkModal (F8)
    const debouncedOnOkModal = useMemo(
        () => debounce(() => onOkModal?.(), 250, {leading: true, trailing: false}),
        [onOkModal]
    );

    useHotkeys('F8', (event) => {
        if (isTop) {
            debouncedOnOkModal();
            event.preventDefault();
        }
    }, {
        enableOnFormTags: true,
        enabled: isTop && ignoreHotKeys?.includes('F8') != true
    }, [isTop, debouncedOnOkModal, ignoreHotKeys]);

    useHotkeys('F10', (event) => {
        if (isTop) {
            onClose?.();
            event.preventDefault();
        }
    }, {
        enableOnFormTags: true,
        enabled: isTop && ignoreHotKeys?.includes('F10') != true
    }, [isTop, onClose, ignoreHotKeys]);
};
