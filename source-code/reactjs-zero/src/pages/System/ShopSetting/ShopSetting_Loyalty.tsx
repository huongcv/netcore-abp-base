import FloatLabel from "@ord-components/forms/FloatLabel";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import UiUtils from "@ord-core/utils/ui.utils";
import { Checkbox, Col, Form, Input, InputNumber, Row, Table } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { SystemShopLoyaltyDto, SystemShopLoyaltyTierDto } from "@api/index.defs";
import { SystemShopLoyaltyService } from "@api/SystemShopLoyaltyService";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import tableUtil from "@ord-core/utils/table.util";
import "./index.scss";
import validateUtils from "@ord-core/utils/validate.utils";

const {TextArea} = Input;

export type ShopSettingLoyaltyRef = {
    saveData: () => Promise<void>;
};

interface SystemShopLoyaltyTierExtendDto extends SystemShopLoyaltyTierDto {
    ordRowIndex: number;
}

const FormContent = () => {
    const { t } = useTranslation("shop-setting");
    const form = Form.useFormInstance();
    const [dataSource, setDataSource] = useState<SystemShopLoyaltyTierExtendDto[]>([]);
    const isUsePointAfterNumberOfInvoice_w = Form.useWatch("isUsePointAfterNumberOfInvoice", form);

    useEffect(() => {
        const listTier: SystemShopLoyaltyTierDto[] = form.getFieldValue("listTier") || [];
        setDataSource(listTier.map((tier, idx) => ({ ...tier, ordRowIndex: idx + 1 })));

    }, [Form.useWatch("listTier", form)]);

    useEffect(() => {
        if (!isUsePointAfterNumberOfInvoice_w) {
            form.setFieldValue('usePointAfterNumberOfInvoice', 0);
        }
    }, [isUsePointAfterNumberOfInvoice_w])


    const columns = tableUtil.getColumns([
        {
            title: t("tierName"),
            key: "name",
            dataIndex: "name",
            width: 400,
            render: (value, _, index) => (
                <>
                    <Form.Item hidden name={["listTier", index, "code"]} />
                    <Form.Item name={["listTier", index, "name"]} rules={[validateUtils.required]}>
                        <Input placeholder="Nhập tên hạng..." style={{ width: '100%' }} className={"not-handler-wrap "} />
                    </Form.Item>
                </>
            ),
        },
        {
            title: t("upgradeThreshold"),
            key: "upgradeValue",
            dataIndex: "upgradeValue",
            width: 300,
            render: (value, _, index) => (
                <Form.Item name={["listTier", index, "upgradeValue"]} rules={[validateUtils.required]}>
                    <PriceNumberInput placeholder="Nhập mức nâng hạng..." className={"not-handler-wrap"} />
                </Form.Item>
            ),
        },
        {
            title: t("upgradeNotes"),
            key: "notes",
            dataIndex: "notes",
            render: (value, _, index) => (
                <Form.Item name={["listTier", index, "notes"]} >
                    <TextArea placeholder="Nhập ghi chú..." className={"not-handler-wrap"} />
                </Form.Item>
            ),
        },
    ]);

    return (
        <>
            <Row gutter={16} className="items-center mb-4">
                <Col span={4}>
                    <FloatLabel label={t("accumulateValue")}>
                        <Form.Item name="accumulateValue" className="w-full" initialValue={100000}>
                            <PriceNumberInput className="w-full" step={1000} min={0} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={2} className="flex justify-center">
                    <div className="text-2xl font-bold text-gray-600">=</div>
                </Col>
                <Col span={2}>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-1 flex items-center justify-center">
                        <span className="text-lg font-medium text-blue-600">1 {t("point")}</span>
                    </div>
                </Col>
            </Row>
            <Row gutter={16} className="items-center mb-4">
                <Col span={2}>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-1 flex items-center justify-center">
                        <span className="text-lg font-medium text-blue-600">1 {t("point")}</span>
                    </div>
                </Col>
                <Col span={2} className="flex justify-center">
                    <div className="text-2xl font-bold text-gray-600">=</div>
                </Col>
                <Col span={4}>
                    <FloatLabel label={t("redeemValue")}>
                        <Form.Item name="redeemValue" className="w-full" initialValue={10000}>
                            <PriceNumberInput className="w-full" step={1000} min={0} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Row gutter={16} className="mb-4">
                <Col span={8}>
                    <Form.Item name="isConvertPointWithInvoiceDiscount" valuePropName="checked" initialValue={true}>
                        <Checkbox>{t("isConvertPointWithInvoiceDiscount")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} className="mb-4">
                <Col span={8}>
                    <Form.Item name="isConvertPointWithInvoiceUsePoint" valuePropName="checked" initialValue={true}>
                        <Checkbox>{t("isConvertPointWithInvoiceUsePoint")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} className="mb-4">
                <Col span={8}>
                    <Form.Item name="isUsePointAfterNumberOfInvoice" valuePropName="checked" initialValue={true}>
                        <Checkbox>{t("isUsePointAfterNumberOfInvoice")}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
            {isUsePointAfterNumberOfInvoice_w && (
                <Row gutter={16} className="mb-4">
                    <Col span={8}>
                        <FloatLabel label={t("usePointAfterNumberOfInvoice")}>
                            <Form.Item name="usePointAfterNumberOfInvoice">
                                <InputNumber style={{ width: "100%" }} min={0} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
            )}
            <h3 className="mb-3 font-bold uppercase">{t("membershipTiers")}</h3>
            <Table columns={columns} dataSource={dataSource} pagination={false} rowKey={'ordRowIndex'} />
        </>)
        ;
};

const ShopSettingLoyalty = forwardRef<ShopSettingLoyaltyRef>((_, ref) => {
    const { t } = useTranslation("shop-setting");
    const [form] = Form.useForm<SystemShopLoyaltyDto>();
    const [info, setInfo] = useState<SystemShopLoyaltyDto>({});

    const callRequest = async <T,>(action: () => Promise<T>): Promise<T> => {
        UiUtils.setBusy();
        try {
            return await action();
        } finally {
            UiUtils.clearBusy();
        }
    };

    useEffect(() => {
        callRequest(async () => {
            const res = await SystemShopLoyaltyService.getInfo();
            if (res.isSuccessful) {
                if(res.data) {
                    form.setFieldsValue(res.data);
                    setInfo(res.data);
                }
            } else {
                UiUtils.showError(res.message || t("fetchError"));
            }
        });
    }, [form]);

    const saveData = async () => {
        try {
            const input = await form.validateFields();
            const res = await callRequest(() =>
                SystemShopLoyaltyService.updateInfo({
                    body: { ...info, ...input },
                })
            );
            if (res.isSuccessful) {
                UiUtils.showSuccess(t("updateSuccess"));
                setTimeout(() => window.location.reload(), 5000);
            } else {
                UiUtils.showError(res.message || t("updateError"));
            }
        } catch (error) {
            UiUtils.showCommonValidateForm();
        }
    };

    useImperativeHandle(ref, () => ({ saveData }));

    return (
        <div className="loyalty">
            <Form form={form} layout="vertical" disabled={!Form.useWatch("isActive", form)}>
                <h3 className="mb-3 font-bold uppercase">{t("generalInfo")}</h3>
                <Row gutter={16} className="mb-4">
                    <Col {...useResponsiveSpan(6)}>
                        <Form.Item name="isActive" valuePropName="checked" initialValue={false}>
                            <Checkbox disabled={false}>{t("isUsingLoyalty")}</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <FormContent />
                <Form.Item hidden name='listTier' />
            </Form>
        </div>
    );
});

export default ShopSettingLoyalty;
