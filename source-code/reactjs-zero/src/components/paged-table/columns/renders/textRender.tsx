import React from 'react';
import {TextColumnConfig} from '../types';
import {CopyableWrapper} from '../utils/copyableWrapper';
import {StyleWrapper} from '../utils/styleWrapper';
import {EllipsisText} from "@ord-components/common/display/EllipsisText";

export class TextRender {
    static render(
        value: any,
        record: any,
        config: TextColumnConfig
    ): React.ReactNode {
        if (value === null || value === undefined) {
            return StyleWrapper.wrapWithStyle('', value, record, config);
        }

        const text = String(value);
        const {maxLines = 2} = config;


        const textContent = <EllipsisText text={text}
                                          maxLines={maxLines}/>

        const content = (
            <CopyableWrapper
                content={textContent}
                copyText={text}
                config={config}
            />
        );

        return StyleWrapper.wrapWithStyle(content, value, record, config);
    }
}