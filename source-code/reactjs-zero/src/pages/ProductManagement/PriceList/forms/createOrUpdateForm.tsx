import { Button, Checkbox, Col, Flex, Form, Input, Row, Space } from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { useCallback, useEffect, useState } from "react";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { useStore } from "@ord-store/index";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import dayjs from 'dayjs';
import { observer } from "mobx-react-lite";

const CreateOrUpdateForm = () => {
    const { t } = useTranslation("price-list");
    const form = Form.useFormInstance();
    const { productPriceListStore: mainStore } = useStore();
    const [calculatePriceMethod, setCalculatePriceMethod] = useState<number>(1);
    const [calculatePriceType, setCalculatePriceType] = useState<number>(1);
    const { isOpenViaDetail } = mainStore;

    const focusRef = useAutoFocus();

    const idw = Form.useWatch("id", form);
    const isMain_w = Form.useWatch("isMain", form);
    const startDate_w = Form.useWatch("startDate", form);

    const updatePriceMethod = useCallback(
        (value: number) => {
            setCalculatePriceMethod(value);
            form.setFieldValue("calculatePriceMethod", value);
        },
        [calculatePriceMethod]
    );

    const updatePriceType = useCallback(
        (value: number) => {
            setCalculatePriceType(value);
            form.setFieldValue("calculatePriceType", value);
        },
        [calculatePriceType]
    );
    useEffect(() => {
        const formValues = form.getFieldsValue();
        setCalculatePriceMethod(formValues.calculatePriceMethod || 1);
        setCalculatePriceType(formValues.calculatePriceType || 1);
    }, []);

    useEffect(() => {
        if (isMain_w) {
            mainStore.createOrUpdateModal.mode = "viewDetail";
        }
    }, [isMain_w])

    return (
        <>
            <Row gutter={8}>
                <Col span={16}>
                    <FloatLabel label={t("name")} required>
                        <Form.Item name="name" rules={[ValidateUtils.required, ValidateUtils.maxLength(100)]}>
                            <Input ref={focusRef} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col lg={8}>
                    <Form.Item name="isActive" valuePropName="checked" initialValue={true}>
                        <Checkbox>{t("isActive")}</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Flex className="gap-3">
                        <FloatLabel style={{ width: "100%" }} label={t("startDate")}>
                            <Form.Item name="startDate">
                                <OrdDateInput></OrdDateInput>
                            </Form.Item>
                        </FloatLabel>
                        <FloatLabel style={{ width: "100%" }} label={t("endDate")}>
                            <Form.Item name="endDate">
                                <OrdDateInput disabledDate={(current) => startDate_w && current.isBefore(dayjs(startDate_w))}></OrdDateInput>
                            </Form.Item>
                        </FloatLabel>
                    </Flex>
                </Col>
                <Col span={24}>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex">
                            <Button type={"text"}>Giá bán =</Button>
                            <Button style={{ flex: 1 }} type={"dashed"}>
                                Bảng giá chung
                            </Button>
                        </div>
                        <Flex className="gap-3">
                            <Space.Compact>
                                <Button
                                    onClick={() => updatePriceMethod(1)}
                                    type={calculatePriceMethod == 1 ? "primary" : "default"}
                                >
                                    <PlusOutlined></PlusOutlined>
                                </Button>
                                <Button
                                    onClick={() => updatePriceMethod(2)}
                                    type={calculatePriceMethod == 2 ? "primary" : "default"}
                                >
                                    <MinusOutlined></MinusOutlined>
                                </Button>
                                <Form.Item initialValue={1} name="calculatePriceMethod" hidden>
                                    <Input />
                                </Form.Item>
                            </Space.Compact>
                            <FloatLabel style={{ flex: 1 }} label={t("calculatePriceValue")} required>
                                <Form.Item name="calculatePriceValue" rules={[ValidateUtils.required]}>
                                    <PriceNumberInput />
                                </Form.Item>
                            </FloatLabel>
                            <Space.Compact>
                                <Button
                                    onClick={() => updatePriceType(1)}
                                    type={calculatePriceType == 1 ? "primary" : "default"}
                                >
                                    %
                                </Button>
                                <Button
                                    onClick={() => updatePriceType(2)}
                                    type={calculatePriceType == 2 ? "primary" : "default"}
                                >
                                    VNĐ
                                </Button>
                                <Form.Item initialValue={1} name="calculatePriceType" hidden>
                                    <Input />
                                </Form.Item>
                            </Space.Compact>
                        </Flex>
                    </div>
                </Col>
                <Col span={24}>
                    <Form.Item name="isAutoUpdatePrice" valuePropName="checked" initialValue={true}>
                        <Checkbox disabled={idw}>{t("isAutoUpdatePrice")}</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="isAutoCreateProduct"
                        valuePropName="checked"
                    >
                        <Checkbox disabled={idw}>{t("isAutoCreateProduct")}</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="isApplyPriceByPartnerGroup"
                        valuePropName="checked"
                    >
                        <Checkbox disabled={idw}>{t("isApplyPriceByPartnerGroup")}</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="isOnlySelectProductInPriceList"
                        valuePropName="checked"
                    >
                        <Checkbox disabled={idw}>{t("isOnlySelectProductInPriceList")}</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={24} hidden={!isOpenViaDetail}>
                    <Form.Item
                        name="IsEnableUpdateDetail"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Checkbox>{t("isAutoUpdateDetail")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>

            <div hidden>
                <Form.Item name="id" />
                <Form.Item name="isMain" />
            </div>

        </>
    );
};

export default observer(CreateOrUpdateForm);