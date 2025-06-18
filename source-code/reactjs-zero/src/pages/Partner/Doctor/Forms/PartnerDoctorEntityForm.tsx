import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPartnerGroup } from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import validateUtils from "@ord-core/utils/validate.utils";
import { Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const PartnerDoctorEntityForm = () => {
    const form = Form.useFormInstance();
    const id_w = Form.useWatch('id', form);
    const { t } = useTranslation(["partner-doctor"]);

    const focusRef = useAutoFocus(); 

    return (
        <>
            <Row gutter={16}>
                <Col span={6}>
                    <FloatLabel
                        label={t("code")}
                        required={id_w > 0}
                    >
                        <Form.Item
                            name="code"
                            rules={
                                id_w > 0
                                    ? [validateUtils.required, validateUtils.NoSpecialCharacter]
                                    : [validateUtils.NoSpecialCharacter]
                            }
                        >
                            <Input maxLength={10} className="uppercase" />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={8}>
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
                <Col span={10}>
                    <FloatLabel label={t("workPlace")} required>
                        <Form.Item
                            name="companyName"
                            rules={[validateUtils.required, validateUtils.mustBeSmallerThan(200)]}
                        >
                            <Input />
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
                <Col span={18}>
                    <FloatLabel label={t("groupId")}>
                        <Form.Item name="groupIds">
                            <OrdSelect
                                datasource={useSelectPartnerGroup(6)}
                                mode="multiple"
                            ></OrdSelect>
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