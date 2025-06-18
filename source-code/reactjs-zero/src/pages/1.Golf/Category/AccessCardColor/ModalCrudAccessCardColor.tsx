import FloatLabel from "@ord-components/forms/FloatLabel";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { Checkbox, Col, ColorPicker, Form, Input, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const ModalCrudAccessCardColor = () => {
    const { t } = useTranslation('golf-access-card-color');
    const { t: tCommon } = useTranslation("common");
    const form = Form.useFormInstance();
    const codeInputRef = useAutoFocus();

    const debounceSetFieldsValue = useMemo(
        () =>
            debounce((value) => {
                form.setFieldsValue({
                    groupCode: ValidateUtils.filterGroupCode(value),
                });
            }, 300),
        [form]
    );

    useEffect(() => {
        return () => {
            debounceSetFieldsValue.cancel();
        };
    }, [debounceSetFieldsValue]);


    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <FloatLabel label={t("code")}>
                        <Form.Item name="code" rules={[ValidateUtils.maxLength(50)]}>
                            <Input ref={codeInputRef} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("name")} required>
                        <Form.Item name="name" rules={[ValidateUtils.required]} getValueFromEvent={(color) => color.toHexString()}>
                            <ColorPicker
                                size="middle"
                                showText
                                allowClear
                                className="justify-start min-h-[38px] items-center w-full rounded-[3px]"
                                />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24}>
                    <FloatLabel label={t("description")} >
                        <Form.Item name="description" rules={[ValidateUtils.maxLength(200)]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col lg={8}>
                    <Form.Item
                        name="isActived"
                        initialValue={true}
                        valuePropName="checked">
                        <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item hidden noStyle name="id">
                <Input hidden />
            </Form.Item>
        </>
    );
};
export default ModalCrudAccessCardColor;
