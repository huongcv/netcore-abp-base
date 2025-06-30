import React from 'react';
import {OrdModalSaveButton} from "@ord-components/modal/footer/buttons/OrdModalSaveButton";

export const SaveButton: React.FC<{
    loading: boolean;
    onSubmit: () => void;
}> = React.memo(({loading, onSubmit}) => (
    <OrdModalSaveButton
        loading={loading}
        onSubmit={onSubmit}
    />
));