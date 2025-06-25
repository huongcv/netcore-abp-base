import {OrdTransProps} from "@ord-components/common/translation/types";
import React from "react";
import {Trans} from "react-i18next";

export const OrdTransConfirm: React.FC<OrdTransProps> = ({
                                                             i18nKey,
                                                             values,
                                                             components = {italic: <i/>, bold: <strong/>},
                                                             ns = 'confirm',
                                                         }) => {
    return (
        <Trans
            ns={ns}
            i18nKey={i18nKey}
            values={values}
            components={components}
        />
    );
};