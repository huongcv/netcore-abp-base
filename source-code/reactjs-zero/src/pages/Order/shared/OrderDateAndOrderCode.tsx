import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import { Col, Form, Space } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export const OrderDateAndOrderCode = () => {
    const [t] = useTranslation('order');
    const form = Form.useFormInstance();
    const today = new Date();

    return (<>
        <Col span={24}>
            <FloatLabel label={t('orderCode')}>
                <Form.Item name={'orderCode'}>
                    <OrdInputRegexText regex={RegexUtil.CodeRegex} />
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={24}>
            <FloatLabel label={t('orderDate')}>
                <Space.Compact style={{ width: "100%" }}>
                    <Form.Item
                        style={{ flex: 1 }}
                        name={"orderCode"}
                    >
                        <OrdDateTimeInput
                            rootClassName='date-stock'
                            format={{
                                format: 'DD/MM/YYYY HH:mm',
                                type: 'mask',
                            }}
                            disabledDate={(current) => {
                                return current && current.second(0) > dayjs(today).second(0);
                            }}
                        />
                    </Form.Item>
                </Space.Compact>
            </FloatLabel>
        </Col>
    </>)
}
