// ModalContext.js
import React, {createContext, useCallback, useContext, useState} from 'react';

// @ts-ignore
const ModalContext = createContext();

// @ts-ignore
export const ModalProvider = ({children}) => {
    const [modals, setModals] = useState<Record<string, boolean>>({});

    const closeAllModals = () => {
        for (let modalsKey in modals) {
            modals[modalsKey] = false;
        }
        setModals(modals);
    };

    const updateModal = useCallback((modalKey: any, value: boolean) => {
        setModals((prevDictionary) => ({
            ...prevDictionary,
            [modalKey]: value,
        }));
    }, [modals])

    const openModal = (modalKey: any) => {
        // @ts-ignore
        updateModal(modalKey, true)
    };

    // @ts-ignore
    const closeModal = (modalKey) => {
        updateModal(modalKey, false)
    };

    return (
        <ModalContext.Provider value={{modals, updateModal, openModal, closeModal, closeAllModals}}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};
