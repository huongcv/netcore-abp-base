import { ProductInventoryAvailableDto } from "@api/index.defs";
import { ProductService } from "@api/ProductService";
import { ProductUnitAutoComplete } from "@ord-components/forms/autocomplete/ProductUnitAutoComplete";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPartnerSupplier } from "@ord-components/forms/select/selectDataSource/useSelectPartnerSupplier";
import { Checkbox, Col, Form, FormInstance, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import dayjs from "dayjs";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";

export const CreateOrUpdateFormDrugRecall = (props: { form: FormInstance }) => {
  const { t } = useTranslation("drugrecall");
  const { t: tCommon } = useTranslation("common");
  const [productInventoryAvailable, setProductInventoryAvailable] = useState<
    ProductInventoryAvailableDto[]
  >([]);
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const [products] = await Promise.all([
          ProductService.getProductInventoryAvailable(),
        ]);
        setProductInventoryAvailable(products);
      } catch (error) {}
    };
    fetchInventory();
  }, []);
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <FloatLabel label={t("validDate")} required>
            <Form.Item name="createdTime" rules={[ValidateUtils.required]}>
              <OrdDateInput />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("ProductId")} required>
            <Form.Item name="productId" rules={[ValidateUtils.required]}>
              <Select
                style={{ width: "100%" }}
                placeholder={t("ProductId")}
                optionLabelProp="label"
                showSearch
                filterOption={(input, option) => {
                  const product = option?.value as string;
                  return product.toLowerCase().includes(input.toLowerCase());
                }}
                allowClear
              >
                {productInventoryAvailable.map(
                  (product: ProductInventoryAvailableDto) => (
                    <Select.Option
                      key={product.id}
                      value={product.id}
                      label={`${product.productName}-${product.productCode}`}
                    >
                      {product.productName} - {product.productCode}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("PartnerId")}>
            <Form.Item name="partnerId">
              <OrdSelect
                datasource={useSelectPartnerSupplier()}
                allowClear
              ></OrdSelect>
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <FloatLabel label={t("placeRequestRecall")} required>
            <Form.Item
              name="placeRequestRecall"
              rules={[ValidateUtils.required]}
            >
              <Input
                maxLength={50}
                placeholder={t("placeholderPlaceRequestRecall")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={12}>
          <FloatLabel label={t("placeRecovery")}>
            <Form.Item name="placeRecovery">
              <Input
                maxLength={50}
                placeholder={t("placeholderPlaceRecovery")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <FloatLabel label={t("soldQty")}>
            <Form.Item name="soldQty">
              <PriceNumberInput step={10} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <FloatLabel label={t("soldUnitName")}>
            <Form.Item name="soldUnitName">
              <ProductUnitAutoComplete placeholder={t("placeholderUnitName")} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <FloatLabel label={t("recalledQty")} required>
            <Form.Item name="recalledQty" rules={[ValidateUtils.required]}>
              <PriceNumberInput step={10} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <FloatLabel label={t("recalledUnitName")} required>
            <Form.Item name="recalledUnitName" rules={[ValidateUtils.required]}>
              <ProductUnitAutoComplete placeholder={t("placeholderUnitName")} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <FloatLabel label={t("reasonRecall")} required>
        <Form.Item name="reasonRecall" rules={[ValidateUtils.required]}>
          <Input maxLength={100} />
        </Form.Item>
      </FloatLabel>
      <FloatLabel label={t("expectedTreatment")}>
        <Form.Item name="expectedTreatment">
          <Input maxLength={100} />
        </Form.Item>
      </FloatLabel>
      <FloatLabel label={t("notes")}>
        <Form.Item name="notes">
          <TextArea maxLength={100} />
        </Form.Item>
      </FloatLabel>
      {/* <Form.Item name="isActived" valuePropName="checked">
        <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
      </Form.Item> */}
    </>
  );
};
