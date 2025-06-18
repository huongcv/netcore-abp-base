import {Button, Col, Form, FormListFieldData, Input,} from "antd";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {DecimalNumberInput} from "@ord-components/forms/DecimalNumberInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {ProductUnitAutoComplete} from "@ord-components/forms/autocomplete/ProductUnitAutoComplete";
import {MAX_VALUE_PRICE} from "@pages/ProductManagement/Product";
import "./index.scss";
import Utils from "@ord-core/utils/utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {round} from "lodash";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";

export interface ModeProps {
    mode: "create" | "update";
}

const MAX_VALUE_CONVERT_RATE = 99_999_999.99;

export const ProductUnitTableFormList = (props: ModeProps) => {
    const {t} = useTranslation("product");
    const form = Form.useFormInstance();
    const basicUnitName_w = Form.useWatch("basicUnitName", form);

    return (
        <>
            <Form.List name="unitItems">
                {(fields, {add, remove}) => (
                    <>
                        <Col span={6}>
                            <Button
                                onClick={() => {
                                    if (
                                        basicUnitName_w === undefined ||
                                        basicUnitName_w.trim() === ""
                                    ) {
                                        UiUtils.showError(t("pleaseSelectBasicUnit"));
                                        return;
                                    } // đoạn code này thêm nhằm mục đích nếu người dùng chưa chọn đơn vị cơ bản thì không thể thêm đơn vị chuyển đổi
                                    add();
                                }}
                                block
                                icon={<PlusOutlined/>}
                            >
                                {t("addUnitBtn")}
                            </Button>
                        </Col>
                        <Col span={18}></Col>
                        {fields.map((field) => (
                            <FormListItem key={field.key} field={field} remove={remove} mode={props.mode}/>
                        ))}
                    </>
                )}
            </Form.List>
        </>
    );
};

const FormListItem = (props: {
    field: FormListFieldData;
    remove: (index: number | number[]) => void;
    mode: "create" | "update";
}) => {
    const {t} = useTranslation("product");
    const {t: tCommon} = useTranslation("common");
    const {field, remove, mode} = props;
    const form = Form.useFormInstance();
    const basicUnitName_w = Form.useWatch("basicUnitName", form);
    const productPriceWithTax_w = Form.useWatch("productPriceWithTax", form);
    // Sử dụng Form.useWatch để theo dõi unitName cụ thể của phần tử trong form list
    const unitName_w = Form.useWatch(["unitItems", field.name, "unitName"], form);
    const convertRate_w = Form.useWatch(["unitItems", field.name, "convertRate"], form);
    const unitItems = Form.useWatch("unitItems", form) || [];
    const selectedUnits = unitItems
        .map((item: any) => item?.unitName)
        .filter(
            (unit: string | undefined) => unit !== undefined && unit.trim() !== ""
        );
    const disabledOptions = basicUnitName_w
        ? [...selectedUnits, basicUnitName_w].filter(Boolean)
        : selectedUnits;

    const checkDuplicateUnitName = (_: any, value: string) => {
        if (!value || value.trim() === "") return Promise.resolve();

        const trimmedValue = Utils.toLowerCaseNonAccentVietnamese(value.trim());
        const allUnitNames = unitItems
            .map((item: any, index: number) => {
                if (index !== field.name && item?.unitName) {
                    return Utils.toLowerCaseNonAccentVietnamese(item.unitName.trim());
                }
                return null;
            })
            .filter(Boolean); // Lọc bỏ các giá trị null/undefined

        // Kiểm tra trùng với đơn vị cơ bản hoặc các đơn vị khác
        if (
            allUnitNames.includes(trimmedValue) ||
            (basicUnitName_w &&
                Utils.toLowerCaseNonAccentVietnamese(basicUnitName_w.trim()) ===
                trimmedValue)
        ) {
            return Promise.reject(new Error(t("duplicateUnitNameError")));
        }
        return Promise.resolve();
    };

    // Khi giá trị thay đổi, validate lại toàn bộ form
    const handleUnitNameChange = () => {
        setTimeout(() => {
            // Validate current field
            form
                .validateFields([["unitItems", field.name, "unitName"]])
                .catch(() => {
                });

            // kiểm tra các trường khác trong unitName
            unitItems.forEach((_: any, index: number) => {
                if (index !== field.name) {
                    form
                        .validateFields([["unitItems", index, "unitName"]])
                        .catch(() => {
                        });
                }
            });
        }, 100);
    };

    useEffect(() => {
        if (unitName_w) {
            form
                .validateFields([["unitItems", field.name, "unitName"]])
                .catch(() => {
                }); // Bỏ qua lỗi validate
        }
    }, [basicUnitName_w, unitName_w, field.name, form]);

    const isProductPriceIncludeTax_w = Form.useWatch("isProductPriceIncludeTax");
    const taxPercent_w = Form.useWatch("taxPercent");
    useEffect(() => {
        const lsValue: any[] = form.getFieldValue("unitItems");
        lsValue.forEach((item: any, index: number) => {
            if (item.priceWithTax === null) {
                form.setFieldValue(['unitItems', index, "price"], null);
            }
            if (isProductPriceIncludeTax_w) {
                const val = (item.priceWithTax ?? 0) / (1 + taxPercent_w / 100);
                form.setFieldValue(['unitItems', index, "price"], val ? round(val, 2) : null);
            } else {
                form.setFieldValue(['unitItems', index, "price"], item.priceWithTax);
            }
        });


    }, [isProductPriceIncludeTax_w, taxPercent_w]);

    function changeValuePriceWithTax(name: number, value: number | null) {
        if (value === null) {
            form.setFieldValue(['unitItems', name, "price"], null);
        }
        if (isProductPriceIncludeTax_w) {
            const val = (value ?? 0) / (1 + taxPercent_w / 100);
            form.setFieldValue(['unitItems', name, "price"], round(val, 2));
        } else {
            form.setFieldValue(['unitItems', name, "price"], value);
        }
    }

    useEffect(() => {
        if(mode === 'create') {
            const productPriceWithTax = productPriceWithTax_w || 0;
            unitItems?.forEach((unit: any, index: number) => {
                const convertRate = unit.convertRate || 0;
                const priceWithTax = (convertRate * productPriceWithTax) || 0;
                form.setFieldValue(['unitItems', index, "priceWithTax"], priceWithTax);
                changeValuePriceWithTax(field.name, priceWithTax);
            });
        }
    }, [productPriceWithTax_w]);

    useEffect(() => {
        if(mode === 'create') {
            const productPriceWithTax = productPriceWithTax_w || 0;
            const priceWithTax = (convertRate_w * productPriceWithTax) || 0;
            form.setFieldValue(['unitItems', field.name, "priceWithTax"], priceWithTax);
            changeValuePriceWithTax(field.name, priceWithTax);
        }
    }, [convertRate_w]);

    return (
        <>
            <Col span={5}>
                <FloatLabel label={tCommon("unitNameConvert")} required>
                    <Form.Item
                        name={[field.name, "unitName"]}
                        rules={[
                            ValidateUtils.required,
                            ValidateUtils.maxLength(100),
                            {validator: checkDuplicateUnitName},
                        ]}
                    >
                        <ProductUnitAutoComplete
                            allowClear
                            disabledOptions={disabledOptions}
                            onChange={handleUnitNameChange}
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={4}>
                <FloatLabel label={t("convertRate")} required>
                    <Form.Item
                        name={[field.name, "convertRate"]}
                        rules={[ValidateUtils.required]}
                    >
                        <DecimalNumberInput
                            className="w-full"
                            max={MAX_VALUE_CONVERT_RATE}
                            min={0}
                            integerLimit={8}
                            decimalLimit={2}
                            addonAfter={basicUnitName_w}
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={5}>
                <FloatLabel label={isProductPriceIncludeTax_w ? t("productPriceWithTax") : t("ProductPrice")}>
                    <Form.Item name={[field.name, "priceWithTax"]}>
                        <PriceNumberInput
                            onChange={(val) => {
                                changeValuePriceWithTax(field.name, val);
                            }}
                            max={MAX_VALUE_PRICE}
                            min={0}
                            step={1000}
                            integerLimit={10}
                            decimalLimit={5}
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>
            {
                isProductPriceIncludeTax_w &&
                <Col span={4}>
                    <FloatLabel label={t("ProductPrice")}>
                        <Form.Item name={[field.name, "price"]}>
                            <PriceNumberInput
                                max={MAX_VALUE_PRICE}
                                min={0}
                                disabled
                                step={1000}
                                integerLimit={10}
                                decimalLimit={2}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            }
            <Col span={4}>
                <FloatLabel label={t('barCode')}>
                    <Form.Item name={[field.name, 'barcode']} rules={[ValidateUtils.maxLength(50)]}>
                        <OrdInputRegexText regex={RegexUtil.CodeRegex} onKeyDown={ValidateUtils.disableSpace} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={2}>
                <div className="flex">
                    <CloseOutlined
                        className="text-red-500 block mt-2 ms-3"
                        onClick={() => {
                            remove(field.name);
                        }}
                    />
                </div>
            </Col>
            <Form.Item hidden name={[field.name, "id"]} initialValue={0}>
                <Input />
            </Form.Item>
        </>
    );
};
