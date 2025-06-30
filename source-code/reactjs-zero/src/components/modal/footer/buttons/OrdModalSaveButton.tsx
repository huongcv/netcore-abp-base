import React, {useMemo} from 'react';
import {Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useTranslation} from "react-i18next";
import {BaseButtonProps} from 'antd/es/button/button';
import {debounce} from "lodash";

export interface SaveButtonProps extends BaseButtonProps {
    onSubmit: () => void;
    label?: React.ReactNode;
}

export const OrdModalSaveButton: React.FC<SaveButtonProps> = ({
                                                                  onSubmit,
                                                                  label,
                                                                  ...rest
                                                              }) => {
    const {t} = useTranslation('action');
    const onBtnClick = () => {
        onSubmit();
    }
    const debouncedClick = debounce(onBtnClick, 250);

    const renderLabel = useMemo(() => {
        if (label) {
            return <span>{label}</span>;
        }
        return <span>{t('modal.save')} (F8)</span>;
    }, [label]);
    return (
        <Button
            type={'primary'}
            icon={<SaveOutlined/>}
            {...rest}
            onClick={debouncedClick}
        >
            {
                renderLabel
            }

        </Button>
    );
};
