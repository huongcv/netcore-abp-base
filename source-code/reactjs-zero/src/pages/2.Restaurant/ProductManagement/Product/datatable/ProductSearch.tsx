import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import React, {useEffect} from "react";
import {Form, Select} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useTranslation} from "react-i18next";
import {SelectAddNewProductGroup} from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import {useSelectProductType} from "@ord-components/forms/select/selectDataSource/useSelectProductType";

export const ProductSearch = () => {
    const {t} = useTranslation("product");
    const form = Form.useFormInstance();
    const isShowAdvanceSearch_w = Form.useWatch("isShowAdvanceSearch", form);
    const isProductUseInventory_w = Form.useWatch("isProductUseInventory", form);
    const productTypeCombo = useSelectProductType();

    useEffect(() => {
        if (!isProductUseInventory_w) {
            form.setFieldValue('isOutOfStock', null);
        }
    }, [isProductUseInventory_w]);

    return (
        <>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t("ProductGroup")}>
                    <Form.Item name="listProductGroupId">
                        <SelectAddNewProductGroup hiddenAddNew={true}/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <SearchFilterText
                hasAdvanceSearchBtn
                span={18}
                placeHolder={t("searchPlaceHolder")}
            />
            {isShowAdvanceSearch_w && (
                <>
                    <ColSpanResponsive span={6}>
                        <FloatLabel label={t("type")}>
                            <Form.Item name="productTypeId">
                                <OrdSelect allowClear datasource={productTypeCombo}/>
                            </Form.Item>
                        </FloatLabel>
                    </ColSpanResponsive>
                    <ColSpanResponsive span={6}>
                        <FloatLabel label={t("ProductUseInventory")}>
                            <Form.Item name="isProductUseInventory">
                                <Select
                                    allowClear
                                    style={{width: "100%"}}
                                    options={[
                                        {value: true, label: t("ProductUseInventory")},
                                        {value: false, label: t("NotProductUseInventory")},
                                    ]}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </ColSpanResponsive>
                    <ColSpanResponsive span={6}>
                        <FloatLabel label={t("stockInventory")}>
                            <Form.Item name="isOutOfStock">
                                <Select
                                    allowClear
                                    disabled={!isProductUseInventory_w}
                                    style={{width: "100%"}}
                                    options={[
                                        {value: true, label: t("isOutOfStock")},
                                        {value: false, label: t("isNotOutOfStock")},
                                    ]}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </ColSpanResponsive>
                </>
            )}
        </>
    );
};
