import { ProductInventoryAvailableDto } from "@api/index.defs";
import { ProductService } from "@api/ProductService";
import { ProductUnitAutoComplete } from "@ord-components/forms/autocomplete/ProductUnitAutoComplete";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import dayjs from "dayjs";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import { useSelectPartnerCustomer } from "@ord-components/forms/select/selectDataSource/useSelectPartnerCustomer";
import { useHotkeys } from "react-hotkeys-hook";
import { useStore } from "@ord-store/index";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";

export const CreateOrUpdateFormComplaintLog = (props: {
  form: FormInstance;
}) => {
  const { t } = useTranslation("report_pharmacyLogComplaintLog");
  const { t: tCommon } = useTranslation("common");
  const { reportPharmacyLogComplaintLogStore: mainStore } = useStore();
  const [productInventoryAvailable, setProductInventoryAvailable] = useState<
    ProductInventoryAvailableDto[]
  >([]);

  useHotkeys(
    "F10",
    () => {
      mainStore.closeModal();
    },
    {
      preventDefault: true,
    }
  );
  useHotkeys(
    "F8",
    () => {
      props.form.submit();
    },
    {
      preventDefault: true,
    }
  );

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
          <FloatLabel label={t("informationRecipientName")} required>
            <Form.Item
              name="informationRecipient"
              rules={[ValidateUtils.required]}
            >
              <OrdSelect
                datasource={useSelectEmployee()}
                allowClear
              ></OrdSelect>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("productName")} required>
            <Form.Item
              name="productRecalledId"
              rules={[ValidateUtils.required]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder={t("productNamePlaceHolder")}
                optionLabelProp="label"
                showSearch
                filterOption={(input, option) => {
                  const product = option?.value as string;
                  return product.toLowerCase().includes(input.toLowerCase());
                }}
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
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <FloatLabel label={t("patientName")}>
            <Form.Item name="patientId">
              <OrdSelect
                datasource={{
                  ...useSelectPartnerCustomer(),
                  data: useSelectPartnerCustomer().data?.filter(
                    (d) => d?.data?.type == 1
                  ),
                }}
                allowClear
              ></OrdSelect>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("email")}>
            <Form.Item name="email" rules={[ValidateUtils.email]}>
              <Input maxLength={50} placeholder={t("email")} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("phoneNumber")}>
            <Form.Item
              name="phoneNumber"
              rules={[ValidateUtils.phoneNumberVietNam]}
            >
              <Input maxLength={50} placeholder={t("phoneNumber")} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <FloatLabel label={t("address")}>
        <Form.Item name="address">
          <Input maxLength={100} />
        </Form.Item>
      </FloatLabel>
      <Row gutter={16}>
        <Col span={8}>
          <FloatLabel label={t("lotNumber")}>
            <Form.Item name="lotNumber">
              <Input placeholder={t("lotNumber")} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("qty")}>
            <Form.Item name="qty">
              <PriceNumberInput placeholder={t("qty")}/>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("basicUnitName")}>
            <Form.Item name="basicUnitName">
              <ProductUnitAutoComplete placeholder={t("basicUnitName")} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <FloatLabel label={t("complaintContent")} required>
        <Form.Item name="complaintContent" rules={[ValidateUtils.required]}>
          <Input maxLength={100} />
        </Form.Item>
      </FloatLabel>
      <FloatLabel label={t("processingDirection")} required>
        <Form.Item name="processingDirection" rules={[ValidateUtils.required]}>
          <Input maxLength={100} />
        </Form.Item>
      </FloatLabel>
      <FloatLabel label={t("notes")}>
        <Form.Item name="notes">
          <TextArea maxLength={100} />
        </Form.Item>
      </FloatLabel>
    </>
  );
};
