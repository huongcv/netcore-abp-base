import FloatLabel from "@ord-components/forms/FloatLabel";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {Checkbox, Col, Form, Input, InputNumber, Row} from "antd";
import {debounce} from "lodash";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {InitNumberInput} from "@ord-components/forms/InitNumberInput";
import { boolean } from "yup";

const CreateOrUpdateFormCusGroup = ({isCustomerGroupGolf}:{isCustomerGroupGolf?: boolean}) => {
    const {t} = useTranslation('customer-group');
    const {t: tCommon} = useTranslation("common");
    const form = Form.useFormInstance();
    const [inputValue, setInputValue] = useState("");

    const focusRef = useAutoFocus();

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
                <Col lg={16}>
                    <FloatLabel label={t("ma")}>
                        <Form.Item name="groupCode" rules={isCustomerGroupGolf ? [ValidateUtils.required, ValidateUtils.maxLength(50)] : []}>
                            <Input
                                maxLength={10}
                                value={inputValue}
                                disabled={
                                    form.getFieldValue("id") && form.getFieldValue("id") > 0
                                }
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setInputValue(value);
                                    debounceSetFieldsValue(value);
                                }}
                                ref={focusRef}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col lg={8}>
                    <Form.Item
                        name="isActived"
                        initialValue={true}
                        valuePropName="checked"
                    >
                        <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={16}>
                    <FloatLabel label={t("ten")} required>
                        <Form.Item name="groupName" rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}>
                            <Input/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={8}>
                    <FloatLabel label={t("groupDiscountPercent")}>
                        <Form.Item name="groupDiscountPercent" rules={[ValidateUtils.max(100)]}>
                            <InitNumberInput style={{width: '100%'}} min={0} suffix={'%'}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <FloatLabel label={t("notes")}>
                <Form.Item name="notes" rules={[ValidateUtils.maxLength(200)]}>
                    <Input.TextArea rows={3}/>
                </Form.Item>
            </FloatLabel>
            <Form.Item hidden noStyle name="id">
                <Input hidden/>
            </Form.Item>
            <Form.Item
                name="groupType"
                initialValue={1}
                hidden
                noStyle
            ></Form.Item>
        </>
    );
};
export default CreateOrUpdateFormCusGroup;
