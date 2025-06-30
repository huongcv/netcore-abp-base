import React from 'react';
import {Checkbox} from 'antd';
import {l} from "@ord-core/language/lang.utils";

export const ContinueCheckbox: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = React.memo(({checked, onChange}) => (
    <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
    >
        {l.transCommon('addNewContinue')}
    </Checkbox>
));
