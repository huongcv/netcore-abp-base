import {Checkbox, Col, Form, Input, InputNumber, Popover, Row} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectProductType} from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import {useStore} from "@ord-store/index";
import {SelectAddNewProductGroup} from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";
import OrdCheckBoxText from "@ord-components/forms/OrdCheckBoxText";
import {ProductUnitAutoComplete} from "@ord-components/forms/autocomplete/ProductUnitAutoComplete";
import {InitNumberInput} from "@ord-components/forms/InitNumberInput";
import {InfoCircleOutlined} from "@ant-design/icons";
import {useSelectProductDrugCategory} from "@ord-components/forms/select/selectDataSource/useSelectProductDrugCategory";
import {useSelectShop} from "@ord-components/forms/select/selectDataSource/useSelectShop";
import ProductMedicineNameSelect from "@ord-components/forms/select/common/ProductMedicineNameSelect";
import {ProductDetailDto, ProductUnitDto} from "@api/index.defs";

interface Props {
    mode: "add" | "edit" | "detail";
}

export enum ProductTypeEnum {
    HangHoa = 1,
    DichVu = 2,
    DuocPham = 4,
    VatTuYTe = 5
}

export const productExt = (attName: string) => {
    return ["productDrug", attName];
};
export const ProductBaseInformationGroup = (props: Props) => {
    const {t} = useTranslation("product");
    const {t: tCommon} = useTranslation("common");
    const productTypeId_w = Form.useWatch("productTypeId");
    const isProductChain_w = Form.useWatch("isProductChain");

    const form = Form.useFormInstance();
    const {sessionStore, productStore} = useStore();
    const firstFocusRef = useAutoFocus();
    const isProductUseInventory_w = Form.useWatch("isProductUseInventory", form);
    const isProductUseLotNumber_w = Form.useWatch("isProductUseLotNumber", form);

    const productDrugDataSource = useSelectProductDrugCategory();
    const shopDataSource = useSelectShop(undefined, undefined, [])

    const [disable, setDisable] = useState<boolean>();
    useEffect(() => {
        if (isProductUseInventory_w == false) {
            form.setFieldValue("isProductUseLotNumber", false);
        }
    }, [isProductUseInventory_w]);

    useEffect(() => {
        if (productTypeId_w === ProductTypeEnum.DichVu) {
            form.setFieldsValue({
                isProductUseLotNumber: false,
                isProductUseInventory: false,
            });
            setDisable(true);
        } else if (productTypeId_w === ProductTypeEnum.DuocPham) {
            form.setFieldsValue({
                isProductUseLotNumber: true,
                isProductUseInventory: true,
            });
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [productTypeId_w]);

    const productPriceWithTax_w = Form.useWatch("productPriceWithTax");
    const isProductPriceIncludeTax_w = Form.useWatch("isProductPriceIncludeTax");
    const taxPercent_w = Form.useWatch("taxPercent");
    useEffect(() => {
        if (isProductPriceIncludeTax_w) {
            const val = productPriceWithTax_w / (1 + taxPercent_w / 100);
            form.setFieldValue("productPrice", isNaN(val) ? null : val.toFixed(5));
        } else {
            form.setFieldValue("productPrice", productPriceWithTax_w);
        }
    }, [isProductPriceIncludeTax_w, productPriceWithTax_w, taxPercent_w]);

    const isDrugItem = () => {
        return productTypeId_w == ProductTypeEnum.DuocPham || productTypeId_w == ProductTypeEnum.VatTuYTe;
    }

    const onProductSelected = (value?: ProductDetailDto) => {
        if (!value) {
            return;
        }

        const {productDto, listProductUnit} = value;
        const unitItems: ProductUnitDto[] = listProductUnit?.filter(x => !x.isBasicUnit)
            .map(x => ({
                ...x,
                productUnitId: x.id
            })) || [];

        const editData = {
            ...productDto,
            isProductUseLotNumber: true,
            isProductUseInventory: true,
            unitItems: unitItems,
        };
        form.setFieldsValue(editData);
    }

    return (
        <>
            <Row gutter={16}>
                <Col lg={18} sm={24}>
                    <Row gutter={16}>
                        <ColSpanResponsive span={8}>
                            <FloatLabel label={t("code")} required={props.mode === "edit"}>
                                <Form.Item
                                    name="productCode"
                                    rules={props.mode === "edit" ? [ValidateUtils.required] : []}
                                >
                                    <OrdInputRegexText
                                        maxLength={50}
                                        regex={RegexUtil.CodeRegex}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>

                        <ColSpanResponsive span={16}>
                            <FloatLabel label={t("name")} required>
                                <Form.Item
                                    name="productName"
                                    rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}
                                >
                                    {
                                        !isDrugItem() && <Input ref={firstFocusRef}/>
                                    }
                                    {
                                        isDrugItem() &&
                                        <ProductMedicineNameSelect onProductSelected={onProductSelected}/>
                                    }
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={8}>
                            <FloatLabel label={t("type")} required>
                                <Form.Item
                                    name="productTypeId"
                                    rules={[ValidateUtils.required]}
                                    initialValue={ProductTypeEnum.HangHoa}
                                >
                                    <OrdSelect
                                        disabled={props.mode === "edit"}
                                        datasource={useSelectProductType(
                                            sessionStore.currentShopType
                                        )}
                                        allowClear={false}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>

                        <ColSpanResponsive span={8}>
                            <FloatLabel
                                label={t("BasicUnitName")}
                                required={!!isProductUseInventory_w}
                            >
                                <Form.Item
                                    name="basicUnitName"
                                    rules={
                                        isProductUseInventory_w ? [ValidateUtils.required] : []
                                    }
                                >
                                    <ProductUnitAutoComplete/>
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>

                        <ColSpanResponsive span={8}>
                            <FloatLabel label={t("barcode")}>
                                <Form.Item name="barcode" rules={[ValidateUtils.maxLength(30)]}>
                                    {/* <Input></Input> */}
                                    <OrdInputRegexText
                                        maxLength={31}
                                        regex={RegexUtil.CodeRegex}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>


                        <ColSpanResponsive span={8}>
                            <FloatLabel label={t("costPrice")}>
                                <Form.Item name="costPrice">
                                    <PriceNumberInput
                                        disabled={productStore.createOrUpdateModal.mode == "update" && !!isProductUseInventory_w}
                                        step={1000}
                                        min={0}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={8}>
                            <FloatLabel
                                label={isProductPriceIncludeTax_w ? t("productPriceWithTax") : t("ProductPrice")}>
                                <Form.Item name="productPriceWithTax">
                                    <PriceNumberInput step={1000} min={0}/>
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        {isProductPriceIncludeTax_w &&
                            <ColSpanResponsive span={4}>
                                <FloatLabel label={t("ProductPrice")}>
                                    <Form.Item name="productPrice">
                                        <PriceNumberInput disabled step={1000} min={0}/>
                                    </Form.Item>
                                </FloatLabel>
                            </ColSpanResponsive>
                        }
                        <ColSpanResponsive span={isProductPriceIncludeTax_w ? 4 : 8}>
                            <FloatLabel label={t("TaxPercent")}>
                                <Form.Item name="taxCode" initialValue={"-"}>
                                    <OrdSelect allowClear={false}
                                               onChange={(data, option: IOrdSelectOption) => {
                                                   form.setFieldValue("taxPercent", option.data?.taxPercent);
                                               }}
                                               datasource={useSelectTaxCode()}/>
                                </Form.Item>
                                <Form.Item hidden noStyle name="taxPercent" initialValue={0}>
                                </Form.Item>
                            </FloatLabel>

                        </ColSpanResponsive>
                        {isDrugItem() && <ColSpanResponsive span={8}>
                            <FloatLabel label={t("productDrugCategoryId")}>
                                <Form.Item
                                    name={'productCategoryId'}
                                >
                                    <OrdSelect
                                        datasource={productDrugDataSource}
                                        allowClear={false}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>}
                        <ColSpanResponsive span={isDrugItem() ? 16 : 24}>
                            <FloatLabel label={t("ProductGroup")}>
                                <Form.Item name="listProductGroupId">
                                    <SelectAddNewProductGroup/>
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        {isProductUseInventory_w && (
                            <>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("currentStockInventory")}>
                                        <Form.Item name={"inventoryCurrentQty"}>
                                            <InitNumberInput
                                                disabled={
                                                    productStore.createOrUpdateModal.mode == "update" ||
                                                    !!isProductUseLotNumber_w
                                                }
                                                min={0}
                                            />
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("inventoryQtyMin")}>
                                        <Form.Item name="inventoryQtyMin">
                                            <InputNumber
                                                style={{width: "100%"}}
                                                min={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        !/[\d]/.test(e.key) &&
                                                        e.key !== "Backspace" &&
                                                        e.key !== "ArrowLeft" &&
                                                        e.key !== "ArrowRight"
                                                    ) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("inventoryQtyMax")}>
                                        <Form.Item name="inventoryQtyMax">
                                            <InputNumber
                                                style={{width: "100%"}}
                                                min={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        !/[\d]/.test(e.key) &&
                                                        e.key !== "Backspace" &&
                                                        e.key !== "ArrowLeft" &&
                                                        e.key !== "ArrowRight"
                                                    ) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                            </>
                        )}
                        {!isProductChain_w && <ColSpanResponsive span={24}>
                            <FloatLabel label={t("listShopId")}>
                                <Form.Item name="listShopId" initialValue={[sessionStore.currentShopId]}>
                                    <OrdSelect mode={"multiple"}
                                               datasource={shopDataSource}></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>}


                        {isDrugItem() && (
                            <>

                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("registrationNumber")} required>
                                        <Form.Item
                                            name={productExt("registrationNumber")}
                                            rules={[
                                                ValidateUtils.required,
                                                ValidateUtils.maxLength(50),
                                            ]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("mainIngredient")}>
                                        <Form.Item
                                            name={productExt("mainIngredient")}
                                            rules={[ValidateUtils.maxLength(200)]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("concentration")}>
                                        <Form.Item
                                            name={productExt("concentration")}
                                            rules={[ValidateUtils.maxLength(200)]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("packagingSpecifications")}>
                                        <Form.Item
                                            name={productExt("packagingSpecifications")}
                                            rules={[ValidateUtils.maxLength(200)]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("manufacturer")}>
                                        <Form.Item
                                            name={productExt("manufacturer")}
                                            rules={[ValidateUtils.maxLength(200)]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("countryOfManufacturer")}>
                                        <Form.Item
                                            name={productExt("countryOfManufacturer")}
                                            rules={[ValidateUtils.maxLength(200)]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={8}>
                                    <FloatLabel label={t("usage")}>
                                        <Form.Item
                                            name={productExt("usage")}
                                            rules={[ValidateUtils.maxLength(200)]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                            </>
                        )}
                        <ColSpanResponsive
                            span={isDrugItem() ? 16 : 24}
                        >
                            <FloatLabel label={t("Description")}>
                                <Form.Item
                                    name="description"
                                    rules={[ValidateUtils.maxLength(300)]}
                                >
                                    <Input></Input>
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>

                        <div hidden>
                            <Form.Item name={"idHash"} noStyle></Form.Item>
                            <Form.Item name={"templateProductId"} noStyle></Form.Item>
                            <Form.Item name={productExt("nationalDrugCode")}> </Form.Item>
                            {/* <Form.Item name={'isActived'} noStyle initialValue={true}></Form.Item> */}
                        </div>
                    </Row>
                </Col>
                <Col lg={6} sm={24}>
                    <Row gutter={[16, 8]}>
                        <ColSpanResponsive span={24}>
                            <Form.Item
                                noStyle
                                name="isActived"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
                            </Form.Item>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={24}>
                            <Form.Item
                                noStyle
                                name="isAllowSale"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Checkbox>{t("isAllowSale")}</Checkbox>
                            </Form.Item>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={24}>
                            <Form.Item
                                noStyle
                                name="isProductChain"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Checkbox>
                                    {t("isProductChain")}
                                </Checkbox>
                            </Form.Item>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={24}>
                            <Form.Item
                                noStyle
                                name="isProductPriceIncludeTax"
                                valuePropName="checked"
                            >
                                <Checkbox>{t("isProductPriceIncludeTax")}</Checkbox>
                            </Form.Item>
                        </ColSpanResponsive>

                        {
                            productTypeId_w !== ProductTypeEnum.DichVu &&
                            <>
                                <ColSpanResponsive span={24}>
                                    <Form.Item
                                        noStyle
                                        name="isProductUseInventory"
                                        valuePropName="checked"
                                    >
                                        <Checkbox disabled={disable || props.mode === "edit"}>
                                            {t("IsProductUseInventory")}
                                        </Checkbox>
                                    </Form.Item>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={24}>
                                    <Form.Item
                                        noStyle
                                        name="isProductUseLotNumber"
                                        valuePropName="checked"
                                    >
                                        <Checkbox
                                            onChange={($event) => {
                                                form.setFieldValue(
                                                    "isProductUseLotNumber",
                                                    $event.target.checked
                                                );
                                                form.setFieldValue("inventoryCurrentQty", null);
                                            }}
                                            disabled={
                                                isProductUseInventory_w != true ||
                                                disable ||
                                                props.mode === "edit"
                                            }
                                        >
                                            {t("IsProductUseLotNumber")}
                                        </Checkbox>
                                    </Form.Item>
                                </ColSpanResponsive>
                            </>
                        }

                        {isDrugItem() && (
                            <ColSpanResponsive span={24}>
                                <div style={{display: "flex", alignItems: "baseline"}}>
                                    <Form.Item
                                        className="-mt-1"
                                        name={productExt("isConnectNationalDrugSystem")}
                                    >
                                        <Checkbox disabled={props.mode === "edit"}>{t("isConnectNationalDrugSystem")}</Checkbox>
                                    </Form.Item>
                                    <Popover
                                        className="cursor-pointer hover:text-primary"
                                        content={form.getFieldValue(
                                            productExt("nationalDrugCode") ?? ""
                                        )}
                                        title={t("nationalDrugCode")}
                                    >
                                        <InfoCircleOutlined/>
                                    </Popover>
                                </div>
                            </ColSpanResponsive>
                        )}
                    </Row>

                </Col>
            </Row>
        </>
    );
};
