import {useTranslation} from "react-i18next";
import {Checkbox, Form, Input} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import React from "react";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";

export const EntityForm = () => {
    const {t} = useTranslation('country');
    const {t: tCommon} = useTranslation('common');
    const focusRef = useAutoFocus();
    return (<>
        <Form.Item label={t('ma')} name='code' rules={[ValidateUtils.required]}>
            <Input maxLength={10} ref={focusRef}/>
        </Form.Item>
        <Form.Item label={t('ten')} name='name' rules={[ValidateUtils.required]}>
            <Input maxLength={100}/>
        </Form.Item>
        <div className="flex gap-4">
            <Form.Item className="w-6/12" label={t('phoneCode')} name='phoneCode'>
                <Input maxLength={50}/>
            </Form.Item>
            <Form.Item className="w-6/12" label={t('currencyCode')} name='currencyCode'>
                <Input maxLength={50} type="tel"/>
            </Form.Item>
        </div>
        <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
            <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
        </Form.Item>
    </>)
}