import React from 'react';

export const ButtonMapper: React.FC<{
    buttons?: (React.ReactNode | 'save' | 'isContinueCheckBox')[];
    renderSaveButton: () => React.ReactNode;
    renderContinueCheckBox: () => React.ReactNode;
}> = React.memo(({buttons, renderSaveButton, renderContinueCheckBox}) => {
    if (!buttons) return null;

    return (
        <>
            {buttons.map((btn, index) => {
                const key = `btn-${index}`;

                if (btn === 'save') {
                    return <React.Fragment key={key}>{renderSaveButton()}</React.Fragment>;
                }
                if (btn === 'isContinueCheckBox') {
                    return <React.Fragment key={key}>{renderContinueCheckBox()}</React.Fragment>;
                }

                // Nếu btn là React element, clone với key
                if (React.isValidElement(btn)) {
                    return React.cloneElement(btn, {key});
                }

                return <React.Fragment key={key}>{btn}</React.Fragment>;
            })}
        </>
    );
});