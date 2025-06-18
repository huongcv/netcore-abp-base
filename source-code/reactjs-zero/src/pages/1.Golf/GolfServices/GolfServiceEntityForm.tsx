import FloatLabel from "@ord-components/forms/FloatLabel";
import { useStore } from "@ord-store/index";
import { Checkbox, Col, Form, Input, Row, Select, Switch } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect, {
  IOrdSelectOption,
} from "@ord-components/forms/select/OrdSelect";
import { useSelectProductTypeGolfService } from "@ord-components/forms/select/selectDataSource/useSelectProductTypeGolfService";
import React, { useEffect } from "react";
import { useSelectGolfCourse } from "@ord-components/forms/select/selectDataSource/useSelectGolfCourse";
import { useWatch } from "antd/es/form/Form";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { useSelectTaxCode } from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import { useSelectShop } from "@ord-components/forms/select/selectDataSource/useSelectShop";
import { SelectAddNewProductGroup } from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";
import { useSelectGolfGameTypeDefault } from "@ord-components/forms/select/selectDataSource/useSelectGolfGameTypeDefault";
import { ProductTypeGolfServiceEnum } from "./GolfServicesPage";
import { useAccessCardTypeEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectAccessCardTypeEnum";
import { AccessCardTypeEnum } from "@api/index.defs";
import { useSelectGolfAccessCardColor } from "@ord-components/forms/select/selectDataSource/useSelectGolfAccessCardColor";
import { GolfProductUnitAutoComplete } from "./GolfProductUnitAutoComplete";
import { useRentalBuggyType } from "@ord-components/forms/select/selectDataSource/golf/useRentalBuggyType";
import { useRentalOtherType } from "@ord-components/forms/select/selectDataSource/golf/useRentalOtherType";

const { TextArea } = Input;

const GolfServiceEntityForm = () => {
  const { golfServicesStore: mainStore, sessionStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tCommon } = useTranslation("common");

  const form = Form.useFormInstance();
  const productPriceWithTax_w = useWatch("productPriceWithTax", form);
  const isProductPriceIncludeTax_w = useWatch("isProductPriceIncludeTax", form);
  const productCategoryId_w = useWatch("productCategoryId", form);
  const taxPercent_w = useWatch("taxPercent", form);
  const isProductChain_w = Form.useWatch("isProductChain");
  const shopDataSource = useSelectShop(undefined, undefined, []);
  
  const otherTypeDS = useRentalOtherType();
  const buggyTypeDS = useRentalBuggyType();

  useEffect(() => {
    if (isProductPriceIncludeTax_w) {
      const val = productPriceWithTax_w / (1 + taxPercent_w / 100);
      form.setFieldValue("productPrice", isNaN(val) ? null : val.toFixed(5));
    } else {
      form.setFieldValue("productPrice", productPriceWithTax_w);
    }
  }, [isProductPriceIncludeTax_w, productPriceWithTax_w, taxPercent_w]);

  const renderConditionalFields = () => {
    switch (productCategoryId_w) {
      case ProductTypeGolfServiceEnum.MemberCard:
        return <GolfServiceEntityFormMemberCardChildren />;

      case ProductTypeGolfServiceEnum.RentalBuggy:
        //return <GolfServiceEntityFormBuggyChildren />;
        return null;

      case ProductTypeGolfServiceEnum.Other:
        //return <GolfServiceEntityFormOtherChildren />;
        return null;
        
      case ProductTypeGolfServiceEnum.RentalItems:
        return null;

      default:
        return null;
    }
  };
  const renderFormItemByProductTypeGolfServiceEnum = () => {
    switch (productCategoryId_w) {
      case ProductTypeGolfServiceEnum.RentalItems:
        return <Col span={isProductPriceIncludeTax_w ? 12 : 8}>
              <FloatLabel label={t("compensationFee")} required>
                <Form.Item
                  name="compensationFee"
                  rules={[ValidateUtils.required]}
                >
                  <PriceNumberInput step={1000} min={0} />
                </Form.Item>
              </FloatLabel>
            </Col>

      case ProductTypeGolfServiceEnum.RentalBuggy:
        return <>
          <Col span={isProductPriceIncludeTax_w ? 12 : 8}>
           <GolfServiceEntityFormBuggyChildren />
          </Col>
        </>

      case ProductTypeGolfServiceEnum.Other:
        return <>
          <Col span={isProductPriceIncludeTax_w ? 12 : 8}>
            <GolfServiceEntityFormOtherChildren />
          </Col>
        </>
    }
  }
  const check = productCategoryId_w === ProductTypeGolfServiceEnum.RentalItems || productCategoryId_w === ProductTypeGolfServiceEnum.Other || productCategoryId_w === ProductTypeGolfServiceEnum.RentalBuggy
  return (
    <>
      <Row className="w-full" gutter={16}>
        <Col span={18}>
          <Row gutter={16}>
            <Col span={24}>
              <FloatLabel label={t("productName")} required>
                <Form.Item name="productName" rules={[ValidateUtils.required]}>
                  <Input></Input>
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={8}>
              <FloatLabel label={t("productCode")}>
                <Form.Item name="productCode">
                  <Input></Input>
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={8}>
              <FloatLabel label={t("productCategoryId")}>
                <Form.Item name="productCategoryId">
                  <OrdSelect
                    datasource={useSelectProductTypeGolfService()}
                    allowClear
                    disabled
                    placeholder={t("productCategoryId")}
                  />
                </Form.Item>
              </FloatLabel>
            </Col>
            <ColSpanResponsive span={8}>
              <FloatLabel label={t("basicUnitName")}>
                <Form.Item name="basicUnitName">
                  <GolfProductUnitAutoComplete />
                </Form.Item>
              </FloatLabel>
            </ColSpanResponsive>
          </Row>
        </Col>
        <Col span={6}>
          <Row gutter={16}>
            <Col span={24} className="mb-[2px]">
              <Form.Item
                initialValue={true}
                noStyle
                name="isActived"
                valuePropName="checked"
              >
                <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
              </Form.Item>
            </Col>
            <Col span={24} className="mb-[2px]">
              <Form.Item
                initialValue={true}
                noStyle
                name="isAllowSale"
                valuePropName="checked"
              >
                <Checkbox>{t("isAllowSale")}</Checkbox>
              </Form.Item>
            </Col>
            <Col span={24} className="mb-[2px]">
              <Form.Item
                initialValue={false}
                noStyle
                name="isProductChain"
                valuePropName="checked"
              >
                <Checkbox>{t("isProductChain")}</Checkbox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <div></div>
              <Form.Item
                name="isProductPriceIncludeTax"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>{t("isProductPriceIncludeTax")}</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Row className="w-full" gutter={16}>
          {/* <Col span={12}>
            <FloatLabel label={t("productCategoryId")}>
              <Form.Item name="productCategoryId">
                <OrdSelect
                  datasource={useSelectProductTypeGolfService()}
                  allowClear
                  disabled
                  placeholder={t("productCategoryId")}
                />
              </Form.Item>
            </FloatLabel>
          </Col> */}
          {/* <ColSpanResponsive span={12}>
            <FloatLabel label={t("basicUnitName")}>
              <Form.Item name="basicUnitName">
                <GolfProductUnitAutoComplete />
              </Form.Item>
            </FloatLabel>
          </ColSpanResponsive> */}
          {/* <ColSpanResponsive span={12}>
            <FloatLabel label={t("idsProductGroup")}>
              <Form.Item name="idsProductGroup">
                <SelectAddNewProductGroup hiddenAddNew={true} />
              </Form.Item>
            </FloatLabel>
          </ColSpanResponsive> */}
        </Row>
        {!isProductChain_w && (
          <Row className="w-full" gutter={16}>
            <Col span={24}>
              <FloatLabel label={t("shopIds")}>
                <Form.Item
                  name="shopIds"
                  initialValue={[sessionStore.currentShopId]}
                >
                  <OrdSelect
                    mode={"multiple"}
                    datasource={shopDataSource}
                  ></OrdSelect>
                </Form.Item>
              </FloatLabel>
            </Col>
          </Row>
        )}
        <Row className="w-full" gutter={16}>
          {renderConditionalFields()}
        </Row>

        <Row className="w-full" gutter={16}>
          {renderFormItemByProductTypeGolfServiceEnum()}
          <Col
            span={
              check
                ? isProductPriceIncludeTax_w
                  ? 12
                  : 8
                : isProductPriceIncludeTax_w
                ? 8
                : 12
            }
          >
            <FloatLabel
              label={
                isProductPriceIncludeTax_w
                  ? t("isProductPriceIncludeTax")
                  : t("productPrice")
              }
            >
              <Form.Item name="productPriceWithTax">
                <PriceNumberInput step={1000} min={0} />
              </Form.Item>
            </FloatLabel>
          </Col>
          {isProductPriceIncludeTax_w && (
            <ColSpanResponsive
              span={
                check
                  ? 12
                  : 8
              }
            >
              <FloatLabel label={t("productPrice")}>
                <Form.Item name="productPrice">
                  <PriceNumberInput disabled step={1000} min={0} />
                </Form.Item>
              </FloatLabel>
            </ColSpanResponsive>
          )}
          <ColSpanResponsive
            span={
              check
                ? isProductPriceIncludeTax_w
                  ? 12
                  : 8
                : isProductPriceIncludeTax_w
                ? 8
                : 12
            }
          >
            <FloatLabel label={t("taxPercent")}>
              <Form.Item name="taxCode" initialValue={"-"}>
                <OrdSelect
                  allowClear={false}
                  onChange={(data, option: IOrdSelectOption) => {
                    form.setFieldValue("taxPercent", option.data?.taxPercent);
                  }}
                  datasource={useSelectTaxCode()}
                />
              </Form.Item>
              <Form.Item
                hidden
                noStyle
                name="taxPercent"
                initialValue={0}
              ></Form.Item>
            </FloatLabel>
          </ColSpanResponsive>
        </Row>
      </Row>
      <Row className="w-full" gutter={16}>
        <Col span={24}>
          <FloatLabel label={t("description")}>
            <Form.Item name="description">
              <TextArea className="w-full" rows={2} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </>
  );
};
export default GolfServiceEntityForm;
export const GolfServiceEntityFormMemberCardChildren: React.FC = () => {
  const accessCardColorDS = useSelectGolfAccessCardColor();
  const cardTypeDS = useAccessCardTypeEnum();
  const { t } = useTranslation("golf-service-product");
  return (
    <>
      <Col span={12}>
        <FloatLabel label={t("accessCardColorId")}>
          <Form.Item name="accessCardColorId">
            <OrdSelect
              datasource={accessCardColorDS}
              allowClear
              placeholder={t("accessCardColorId")}
            />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={12}>
        <FloatLabel label={t("cardType")} required>
          <Form.Item
            name="cardType"
            initialValue={1 as AccessCardTypeEnum}
            rules={[ValidateUtils.required]}
          >
            <OrdSelect
              datasource={cardTypeDS}
              allowClear
              placeholder={t("cardType")}
            />
          </Form.Item>
        </FloatLabel>
      </Col>
    </>
  );
};
export const GolfServiceEntityFormBuggyChildren: React.FC = () => {
  const buggyTypeDS = useRentalBuggyType();
  //const golfCourseDS = useSelectGolfCourse();
  //const golfGameTypeDS = useSelectGolfGameTypeDefault();
  const { t } = useTranslation("golf-service-product");
  return (
    <>
      {/* <Col span={8}>
        <FloatLabel label={t("courseIds")}>
          <Form.Item name="courseIds">
            <OrdSelect
              datasource={golfCourseDS}
              allowClear
              mode="multiple"
              placeholder={t("courseIds")}
            />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={8}> */}
        <FloatLabel label={t("productSubCategoryId")}>
          <Form.Item name="productSubCategoryId">
            <OrdSelect
              datasource={buggyTypeDS}
              allowClear
              placeholder={t("productSubCategoryId")}
            />
          </Form.Item>
        </FloatLabel>
      {/* </Col>
      <Col span={8}>
        <FloatLabel label={t("gameType")} required>
          <Form.Item name="gameType" rules={[ValidateUtils.required]}>
            <OrdSelect
              datasource={golfGameTypeDS}
              allowClear
              placeholder={t("gameTypeDefault")}
            />
          </Form.Item>
        </FloatLabel>
      </Col> */}
    </>
  );
};
export const GolfServiceEntityFormOtherChildren: React.FC = () => {
  const otherTypeDS = useRentalOtherType();
  //const golfCourseDS = useSelectGolfCourse();
  //const golfGameTypeDS = useSelectGolfGameTypeDefault();
  const { t } = useTranslation("golf-service-product");
  return (
    <>
      {/* <Col span={8}>
        <FloatLabel label={t("courseIds")}>
          <Form.Item name="courseIds">
            <OrdSelect
              datasource={golfCourseDS}
              allowClear
              mode="multiple"
              placeholder={t("courseIds")}
            />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={8}> */}
        <FloatLabel label={t("productSubCategoryId_otherService")}>
          <Form.Item name="productSubCategoryId">
            <OrdSelect
              datasource={otherTypeDS}
              allowClear
              placeholder={t("productSubCategoryId_otherService")}
            />
          </Form.Item>
        </FloatLabel>
      {/* </Col>
      <Col span={8}>
        <FloatLabel label={t("gameType")} required>
          <Form.Item name="gameType" rules={[ValidateUtils.required]}>
            <OrdSelect
              datasource={golfGameTypeDS}
              allowClear
              placeholder={t("gameTypeDefault")}
            />
          </Form.Item>
        </FloatLabel>
      </Col> */}
    </>
  );
};
