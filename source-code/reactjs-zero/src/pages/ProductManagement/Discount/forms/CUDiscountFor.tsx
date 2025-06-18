import FloatLabel from "@ord-components/forms/FloatLabel";
import {useStore} from "@ord-store/index";
import {Flex, Form, Input, InputNumber} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectVoucherType} from "@ord-components/forms/select/selectDataSource/useSelectVoucherType";
import {useSelectDiscountUseType} from "@ord-components/forms/select/selectDataSource/useSelectDiscountUseType";
import {useState} from "react";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";

export const CreateOrUpdateDiscountForm = () => {
    const {t} = useTranslation("discount");
    const {productDiscountStore: mainStore} = useStore();
    const [discountType, setDiscountType] = useState<number | null>(null);

    const handleDiscountTypeChange = (value: number) => {
        setDiscountType(value);
    };

    return (
        <>
            <FloatLabel label={t("code")}>
                <Form.Item
                    name="code"
                    rules={[
                        ValidateUtils.mustBeGreaterThan(10),
                        ValidateUtils.mustBeSmallerThan(20),
                        ValidateUtils.NoWhiteSpace,
                    ]}
                >
                    <Input/>
                </Form.Item>
            </FloatLabel>
            <FloatLabel label={t("discountUseType")} required>
                <Form.Item name="discountUseType" rules={[ValidateUtils.required]}>
                    <OrdSelect datasource={useSelectDiscountUseType()}/>
                </Form.Item>
            </FloatLabel>
            <FloatLabel label={t("discountType")} required>
                <Form.Item name="discountType" rules={[ValidateUtils.required]}>
                    <OrdSelect
                        datasource={useSelectVoucherType()}
                        onChange={handleDiscountTypeChange}
                    />
                </Form.Item>
            </FloatLabel>
            <FloatLabel label={t("discountValue")} required>
                <Form.Item name="discountValue" rules={[ValidateUtils.required]}>
                    <InputNumber
                        style={{width: "100%"}}
                        min={0}
                        addonAfter={
                            discountType === 1 ? "%" : discountType === 2 ? "VNĐ" : ""
                        }
                    />
                </Form.Item>
            </FloatLabel>
            <FloatLabel label={t("usageLimit")} required>
                <Form.Item name="usageLimit" rules={[ValidateUtils.required]}>
                    <PriceNumberInput style={{width: "100%"}} min={0}/>
                </Form.Item>
            </FloatLabel>
            <Flex className="gap-3">
                <FloatLabel style={{width: "100%"}} label={t("startDate")}>
                    <Form.Item name="startDate">
                        <OrdDateInput></OrdDateInput>
                    </Form.Item>
                </FloatLabel>
                <FloatLabel style={{width: "100%"}} label={t("endDate")}>
                    <Form.Item name="endDate">
                        <OrdDateInput></OrdDateInput>
                    </Form.Item>
                </FloatLabel>
            </Flex>
            {/* <FloatLabel label={t("discountStatus")} required>
        <Form.Item name="discountStatus" rules={[ValidateUtils.required]}>
          <OrdSelect datasource={useSelectDiscountStatusType()} />
        </Form.Item>
      </FloatLabel> */}
        </>
    );
};
