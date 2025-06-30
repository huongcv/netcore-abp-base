import React, {useCallback} from 'react';
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";

// Component riêng cho Modal Footer
export const ModalFooterRenderer: React.FC<{
    modalProps?: any;
    footerButtons?: any;
    onSubmit?: any;
    handleCancel: () => void;
    renderSaveButton: () => React.ReactNode;
    mapButtons: (buttons?: any[]) => React.ReactNode[];
}> = React.memo(({
                     modalProps,
                     footerButtons,
                     onSubmit,
                     handleCancel,
                     renderSaveButton,
                     mapButtons
                 }) => {
    // Custom footer từ modalProps
    const renderCustomFooter = useCallback(() => {
        if (modalProps?.footer) {
            return modalProps.footer;
        }
        return null;
    }, [modalProps?.footer]);

    // Footer từ footerButtons configuration
    const renderConfiguredFooter = useCallback(() => {
        if (!footerButtons) return null;

        const {right, left, leftClose} = footerButtons;
        return (
            <OrdModalFooter
                onClose={handleCancel}
                left={mapButtons(left)}
                leftClose={mapButtons(leftClose)}
                right={mapButtons(right)}
            />
        );
    }, [footerButtons, handleCancel, mapButtons]);

    // Default footer
    const renderDefaultFooter = useCallback(() => {
        if (onSubmit) {
            return (
                <OrdModalFooter
                    onClose={handleCancel}
                    right={[renderSaveButton()]}
                />
            );
        }

        return <OrdModalFooter onClose={handleCancel}/>;
    }, [onSubmit, handleCancel, renderSaveButton]);

    // Priority logic: Custom > Configured > Default
    return renderCustomFooter() || renderConfiguredFooter() || renderDefaultFooter();
});

// Component riêng cho Button Mapper
