import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import React, { useEffect } from "react";
import { Form, Select } from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useTranslation } from "react-i18next";
import { SelectAddNewProductGroup } from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import { useSelectProductTypeGolfService } from "@ord-components/forms/select/selectDataSource/useSelectProductTypeGolfService";

export const ProductSearch = () => {
  const { t } = useTranslation("golf-service-product");
  const form = Form.useFormInstance();
  const isShowAdvanceSearch_w = Form.useWatch("isShowAdvanceSearch", form);
  const isProductUseInventory_w = Form.useWatch("isProductUseInventory", form);
  const productTypeCombo = useSelectProductType();

  useEffect(() => {
    if (!isProductUseInventory_w) {
      form.setFieldValue("isOutOfStock", null);
    }
  }, [isProductUseInventory_w]);

  return (
    <>
      <ColSpanResponsive span={6}>
        <FloatLabel label={t("idsProductGroup")}>
          <Form.Item name="productGroupIds">
            <SelectAddNewProductGroup hiddenAddNew={true} />
          </Form.Item>
        </FloatLabel>
      </ColSpanResponsive>
      <ColSpanResponsive span={6}>
        <FloatLabel label={t("productCategoryId")}>
          <Form.Item name="productCategoryId">
            <OrdSelect
              datasource={useSelectProductTypeGolfService()}
              allowClear
              placeholder={t("productCategoryId")}
            />
          </Form.Item>
        </FloatLabel>
      </ColSpanResponsive>
      <SearchFilterText span={12} />
    </>
  );
};
