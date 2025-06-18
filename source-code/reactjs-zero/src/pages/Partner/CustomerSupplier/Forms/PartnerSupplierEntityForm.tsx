import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectDistrict } from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import { useSelectPartnerGroup } from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";
import { useSelectProvince } from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import { useSelectWard } from "@ord-components/forms/select/selectDataSource/useSelectWard";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import validateUtils from "@ord-core/utils/validate.utils";
import { Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const PartnerSupplierEntityForm = () => {
    const { t } = useTranslation(["customer-supplier"]);
    const form = Form.useFormInstance();
    const cityCode_w = Form.useWatch("cityCode", form);
    const id_w = Form.useWatch('id', form);

    useEffect(() => {
        form.setFieldsValue({ districtCode: null, wardCode: null });
    }, [cityCode_w, form]);

    useEffect(() => {
        form.setFieldsValue({ wardCode: null });
    }, [Form.useWatch("districtCode", form), form]);

    const focusRef = useAutoFocus(); 
    return (
        <>
            <Row gutter={16}>
                <Col span={6}>
                    <FloatLabel
                        label={t("code")}
                        required={id_w}
                    >
                        <Form.Item
                            name="code"
                            rules={
                                id_w
                                    ? [validateUtils.required, validateUtils.NoSpecialCharacter]
                                    : [validateUtils.NoSpecialCharacter]
                            }
                        >
                            <Input maxLength={10} className="uppercase" />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={18}>
                    <FloatLabel label={t("name")} required>
                        <Form.Item
                            name="name"
                            rules={[
                                validateUtils.required,
                                validateUtils.mustBeSmallerThan(100),
                            ]}
                        >
                            <Input maxLength={100} ref={focusRef}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <FloatLabel label={t("phone")}>
                        <Form.Item
                            name="phone"
                            rules={[validateUtils.phoneNumberVietNam]}
                        >
                            <Input maxLength={14} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={6}>
                    <FloatLabel label={t("taxCode")}>
                        <Form.Item name="taxCode" rules={[validateUtils.taxCode]}>
                            <Input></Input>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("groupId")}>
                        <Form.Item name="groupIds">
                            <OrdSelect
                                datasource={useSelectPartnerGroup(2)}
                                mode="multiple"
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <FloatLabel label={t("cityCode")}>
                        <Form.Item name="cityCode">
                            <OrdSelect datasource={useSelectProvince()}></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={6}>
                    <FloatLabel label={t("districtCode")}>
                        <Form.Item name="districtCode">
                            <OrdSelect
                                datasource={useSelectDistrict(
                                    Form.useWatch("cityCode", form)
                                )}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("wardCode")}>
                        <Form.Item name="wardCode">
                            <OrdSelect
                                datasource={useSelectWard(
                                    Form.useWatch("districtCode", form)
                                )}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <FloatLabel label={t("address")}>
                        <Form.Item
                            name="address"
                            rules={[validateUtils.mustBeSmallerThan(200)]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <FloatLabel label={t("notes")}>
                        <Form.Item
                            name="notes"
                            rules={[validateUtils.mustBeSmallerThan(200)]}
                        >
                            <TextArea rows={2}></TextArea>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Form.Item hidden name="id"/>
            <Form.Item hidden name="isActived"/>
            <Form.Item hidden name="totalAmount"/>
            
        </>
    );
}