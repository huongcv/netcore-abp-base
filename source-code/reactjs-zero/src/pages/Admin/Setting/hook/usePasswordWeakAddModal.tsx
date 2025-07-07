import {useFormModal} from "@ord-components/modal/GlobalModalManager/hook/useFormModal";
import {useTranslation} from "react-i18next";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {Col, Form, FormInstance, Space, Tag, Typography} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";
import {useCallback, useMemo} from "react";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import UiUtils from "@ord-core/utils/ui.utils";
import {formSignalUtils} from "@ord-components/paged-table/utils/formSignal.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";

const FormFields = () => {
    const form = Form.useFormInstance();

    const onEnter = useCallback(() => {
        const rawValue: string = form.getFieldValue('value');
        if (!rawValue) return;

        // Tách, làm sạch chuỗi
        const newItems = rawValue
            .split(' ')
            .map(str => str.trim())
            .filter(str => str); // loại bỏ chuỗi rỗng

        const currentValues: string[] = form.getFieldValue('values') || [];

        // Tránh trùng lặp
        const merged = Array.from(new Set([...currentValues, ...newItems]));

        form.setFieldsValue({
            values: merged,
            value: '' // clear input sau khi enter
        });
    }, [form]);

    const formConfig = useMemo(() => new FormBuilder()
        .addText({
            name: 'value',
            label: 'Mật khẩu yếu',
            maxLength: 5000,
            autoFocus: true,
            componentProps: {
                placeholder: 'Nhập danh sách các mật khẩu yếu cần thêm (Ấn Enter)',
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onEnter();
                    }
                }
            }
        }), [onEnter]);

    const values: string[] = Form.useWatch('values') || [];

    const handleClose = (removedValue: string) => {
        const updated = values.filter(v => v !== removedValue);
        form.setFieldsValue({values: updated});
    };

    return (
        <>
            <OrdFormBuilder config={formConfig.build()}/>
            <Form.Item name="values" noStyle/>
            <Col span={24} className="mt-2">
                {values.length > 0 && (
                    <Typography.Text type="secondary" className="mb-1 d-block">
                        Đã nhập <b>{values.length}</b> mật khẩu yếu
                    </Typography.Text>
                )}
                <Space wrap>
                    {values.map(value => (
                        <Tag
                            key={value}
                            closeIcon={<CloseCircleOutlined/>}
                            onClose={() => handleClose(value)}
                        >
                            {value}
                        </Tag>
                    ))}
                </Space>
            </Col>
        </>
    );
};

export const usePasswordWeakAddModal = () => {
    const {t} = useTranslation('modal');
    const {openFormModal} = useFormModal({
        title: t('removePasswordWeak.AddNewTitle'),
        formFields: <>
            <FormFields/>
        </>,
        modalProps: {
            width: 800,
            style: {
                top: 10,

            },
            bodyStyle: {
                minHeight: '60vh'
            }
        }
    });
    const openPasswordAddModal = (searchForm: FormInstance) => {
        openFormModal({}, async (formValues, form, modalData) => {
            const {values = []} = formValues;
            if (values.length === 0) {
                UiUtils.showError('Vui lòng nhập ít nhất một giá trị');
                return;
            }
            const apiResult = await HostSystemSettingService.insertPasswordBlacklisted({
                body: {
                    values: [...values]
                }
            });
            ServiceProxyUtils.notifyErrorResultApi(apiResult);
            if (apiResult.isSuccessful) {
                UiUtils.showErrorNs('modal', 'hostSetting.passWordWeak.success');
                formSignalUtils.reloadTableOnly(searchForm);
            }
            return {
                mustCloseModal: apiResult.isSuccessful,
            }
        });
    }
    return {
        openPasswordAddModal
    }
}