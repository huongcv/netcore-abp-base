import React from 'react';
import {Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {BaseButtonProps} from 'antd/es/button/button';
import {debounce} from "lodash";
import {l} from "@ord-core/language/lang.utils";

export interface SaveButtonProps extends BaseButtonProps {
    onSubmit: () => void;
    label?: React.ReactNode;
    icon?: React.ReactNode;
}

export const OrdModalSaveButton: React.FC<SaveButtonProps> = (props) => {
    const {
        onSubmit,
        label = (<span>{l.trans('action.modal.save')} (F8)</span>),
        icon = <SaveOutlined/>,
        ...rest
    } = props;
    const onBtnClick = () => {
        onSubmit();
    }
    const debouncedClick = debounce(onBtnClick, 250);
    return (
        <Button
            type={'primary'}
            icon={icon}
            {...rest}
            onClick={debouncedClick}
        >
            {
                label
            }
        </Button>
    );
};
