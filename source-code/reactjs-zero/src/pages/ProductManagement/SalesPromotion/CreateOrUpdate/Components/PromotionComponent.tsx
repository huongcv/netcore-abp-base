import React, { useEffect, useState } from "react";
import { Button, Input, Row, Col, Form, Select, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  TYPE_PROMOTION,
  TYPE_PROMOTION_DETAIL,
} from "../../Enums/TypePromotionDetail";
import { useTranslation } from "react-i18next";
import {
  GiftItemDto,
  ProductInventoryAvailableDto,
  VoucherAvailableDto,
} from "@api/index.defs";
import { ProductService } from "@api/ProductService";
import { ModelUnitAmountPromotion, optionsUnit } from "../../Helper/Helper";
import { DiscountService } from "@api/DiscountService";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { useStore } from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { observer } from "mobx-react-lite";
import TagSelectProductInventory from "@ord-components/forms/select/selectDataSource/selectProductInventory";
import InputAmountAndUnitSelect from "./InputAmountAndUnitSelect";

const PromotionDetailsComponent: React.FC<{
  formData: any;
  disabledProp: boolean;
}> = ({ formData, disabledProp }) => {
  const { t } = useTranslation("promotion");
  const { promotionFormStore: mainStore } = useStore();
  const [selected, setSelected] = useState(null);
  const form = Form.useFormInstance();

  // const [productInventoryAvailable, setProductInventoryAvailable] = useState<
  //   ProductInventoryAvailableDto[]
  // >([]);
  const [voucherInventoryAvailable, setVoucherInventoryAvailable] = useState<
    VoucherAvailableDto[]
  >([]);
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        await mainStore.getProductInventoryAvailableDto();
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu: ", error);
      }
    };
    fetchInventory();
  }, []);
  useEffect(() => {
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const startDateParames = formatDate(mainStore.startDateTemp!);
    const endDateParames = formatDate(mainStore.endDateTemp!);

    const fetchVoucerInventory = async () => {
      try {
        const [vouchers] = await Promise.all([
          DiscountService.getListVoucherAvailable({
            startDateParames: startDateParames,
            endDateParames: endDateParames,
          }),
        ]);
        setVoucherInventoryAvailable(vouchers);
      } catch (error) {}
    };
    fetchVoucerInventory();
  }, [mainStore.startDateTemp, mainStore.endDateTemp]);

  return (
    <>
      <Form.List name="details">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }, index) => (
              <div
                className="border-container"
                key={key}
                style={{ marginBottom: "10px" }}
              >
                <div className="header-container-promotion">
                  {t("TitleDetailPromotion")} {index + 1}
                </div>
                <Row gutter={16} style={{ marginTop: "20px" }}>
                  {/* Điều kiện cho Invoice */}
                  {formData.promotionType === TYPE_PROMOTION.Invoice && (
                    <Col span={6}>
                      <FloatLabel label={t("TotalAmountFrom")}>
                        <Form.Item
                          name={[name, "condition", "totalAmountFrom"]}
                          rules={[
                            {
                              validator: (_, value) =>
                                value > 0
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error(t("requiredTotalAmountFrom"))
                                    ),
                            },
                          ]}
                        >
                          <PriceNumberInput
                            disabled={disabledProp}
                            step={1000}
                            min={0}
                            addonAfter={"VND"}
                          />
                        </Form.Item>
                      </FloatLabel>
                    </Col>
                  )}

                  {/* Điều kiện cho Product */}
                  {formData.promotionType === TYPE_PROMOTION.Product && (
                    <>
                      <Col span={4}>
                        <FloatLabel label={t("ProductID")}>
                          <Form.Item
                            name={[name, "condition", "productId"]}
                            rules={[
                              {
                                required: true,
                                message: t("requiredProductID"),
                              },
                            ]}
                          >
                            <TagSelectProductInventory
                              showSearch={true}
                              disabled={disabledProp}
                              productInventory={
                                mainStore.productInventoryAvailableDto
                              }
                            />
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col span={2}>
                        <FloatLabel label={t("QuantityFrom")}>
                          <Form.Item
                            name={[name, "condition", "quantityFrom"]}
                            rules={[
                              {
                                validator: (_, value) =>
                                  value > 0
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        new Error(t("requiredQuantityFrom"))
                                      ),
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder={t("QuantityFromPla")}
                              min={1}
                              disabled={disabledProp}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                    </>
                  )}
                  <Col span={4}>
                    <FloatLabel label={t("TypeDetailPromotion")}>
                      <Form.Item name={[name, "type"]}>
                        <Select
                          disabled={disabledProp}
                          onChange={(value) => {
                            const currentDetails =
                              form.getFieldValue("details") || [];
                            const currentCondition = form.getFieldValue([
                              "details",
                              name, // 1 change
                              "condition",
                            ]) || {
                              totalAmountFrom: 0,
                              productId: "",
                              quantityFrom: 1,
                            };

                            const updatedDetail = {
                              condition: currentCondition, // Giữ lại giá trị condition hiện tại
                              type: value,
                              value:
                                value === TYPE_PROMOTION_DETAIL.Voucher
                                  ? { voucherList: [] }
                                  : value === TYPE_PROMOTION_DETAIL.Discount
                                  ? { amount: 0, unit: "VND" }
                                  : { giftItems: [] },
                            };
                            // Cập nhật lại `details` mà không làm mất dữ liệu khác
                            const newDetails = [...currentDetails];
                            newDetails[name] = updatedDetail;

                            form.setFieldsValue({ details: newDetails });
                          }}
                        >
                          <Select.Option value={TYPE_PROMOTION_DETAIL.Voucher}>
                            Voucher
                          </Select.Option>
                          <Select.Option value={TYPE_PROMOTION_DETAIL.Discount}>
                            {t("Discount")}
                          </Select.Option>
                          <Select.Option value={TYPE_PROMOTION_DETAIL.Gift}>
                            {t("Gift")}
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                  {/* Voucher Form */}
                  {form.getFieldValue(["details", name, "type"]) ===
                    TYPE_PROMOTION_DETAIL.Voucher && (
                    <Form.List
                      name={[name, "value", "voucherList"]}
                      rules={[
                        {
                          validator: async (_, voucherList) => {
                            if (!voucherList || voucherList.length === 0) {
                              return Promise.reject(
                                new Error(t("requiredVoucherList"))
                              );
                            }
                          },
                        },
                      ]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          <Col span={4}>
                            <FloatLabel label={t("Voucher")}>
                              <Select
                                style={{ width: "100%" }}
                                className={errors?.length ? "select-error" : ""}
                                disabled={disabledProp}
                                value={selected}
                                placeholder="Tìm kiếm voucher"
                                onChange={(values) => {
                                  // Khi chọn voucher, thêm từng voucher vào Form.List
                                  const voucherList =
                                    form.getFieldValue([
                                      "details",
                                      name, // 2 change
                                      "value",
                                      "voucherList",
                                    ]) || [];

                                  // Kiểm tra voucher đã tồn tại hay chưa
                                  const existingIndex = voucherList.findIndex(
                                    (item: any) => item.code === values
                                  );
                                  if (existingIndex !== -1) {
                                    // Nếu voucher đã có, tăng quantity
                                    voucherList[existingIndex].quantity += 1;
                                    form.setFieldsValue({
                                      details: {
                                        [name]: {
                                          // 3 change
                                          value: {
                                            voucherList,
                                          },
                                        },
                                      },
                                    });
                                  } else {
                                    // Nếu chưa có, thêm mới vào Form.List
                                    add({ code: values, quantity: 1 });
                                  }
                                  setSelected(null);
                                }}
                              >
                                {voucherInventoryAvailable.map((voucher) => (
                                  <Select.Option
                                    key={voucher.id}
                                    value={voucher.code}
                                  >
                                    {voucher.code}
                                  </Select.Option>
                                ))}
                              </Select>
                              <Form.ErrorList
                                errors={errors}
                                className="styleErrorList"
                              />
                            </FloatLabel>
                          </Col>
                          <Col span={10}>
                            {fields.map(
                              ({ key: fieldKey, name: fieldName }) => (
                                <Row key={fieldKey} gutter={16} align="middle">
                                  <Col span={8}>
                                    <FloatLabel label={t("codeItem")}>
                                      <Form.Item name={[fieldName, "code"]}>
                                        <Input disabled />
                                      </Form.Item>
                                    </FloatLabel>
                                  </Col>
                                  <Col span={4}>
                                    <FloatLabel label={t("quantityItem")}>
                                      <Form.Item
                                        name={[fieldName, "quantity"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: t("requiredQuantity"),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          disabled={disabledProp}
                                          min={1}
                                          style={{ width: "100%" }}
                                        />
                                      </Form.Item>
                                    </FloatLabel>
                                  </Col>
                                  <Col span={2}>
                                    <Button
                                      disabled={disabledProp}
                                      style={{ marginBottom: "15px" }}
                                      type="link"
                                      danger
                                      icon={<MinusCircleOutlined />}
                                      onClick={() => remove(fieldName)}
                                    ></Button>
                                  </Col>
                                </Row>
                              )
                            )}
                          </Col>
                        </>
                      )}
                    </Form.List>
                  )}
                  {/* Discount Input */}
                  {form.getFieldValue(["details", name, "type"]) ===
                    TYPE_PROMOTION_DETAIL.Discount && (
                    <InputAmountAndUnitSelect
                      nameIndex={name}
                      disabledProp={disabledProp}
                    />
                  )}

                  {/* Gift Input */}
                  {form.getFieldValue(["details", name, "type"]) ===
                    TYPE_PROMOTION_DETAIL.Gift && (
                    <Form.List
                      name={[name, "value", "giftItems"]}
                      rules={[
                        {
                          validator: async (_, giftItems) => {
                            if (!giftItems || giftItems.length === 0) {
                              return Promise.reject(
                                new Error(t("requiredGiftItems"))
                              );
                            }
                          },
                        },
                      ]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          <Col span={4}>
                            <FloatLabel label={t("GiftItems")}>
                              <TagSelectProductInventory
                                className={errors?.length ? "select-error" : ""}
                                value={selected}
                                disabled={disabledProp}
                                productInventory={
                                  mainStore.productInventoryAvailableDto
                                }
                                getOptionValue={(product) =>
                                  `${product.productCode}-${product.productName}`
                                }
                                onChange={(values: string | null) => {
                                  if (values) {
                                    const [code, nameP] = values.split("-");
                                    if (!code) return;
                                    const giftItems =
                                      form.getFieldValue([
                                        "details",
                                        name, // 4 change
                                        "value",
                                        "giftItems",
                                      ]) || [];

                                    const existingIndex = giftItems.findIndex(
                                      (item: any) => item.code === code
                                    );
                                    if (existingIndex !== -1) {
                                      giftItems[existingIndex].quantity += 1;
                                      form.setFieldsValue({
                                        details: {
                                          [name]: {
                                            // 5 change
                                            value: {
                                              giftItems,
                                            },
                                          },
                                        },
                                      });
                                    } else {
                                      add({
                                        code,
                                        name: nameP,
                                        quantity: 1,
                                      } as GiftItemDto);
                                    }
                                    setSelected(null);
                                  }
                                }}
                              />
                              <Form.ErrorList
                                errors={errors}
                                className="styleErrorList"
                              />
                            </FloatLabel>
                          </Col>
                          <Col span={8}>
                            {fields.map(
                              ({ key: fieldKey, name: fieldName }) => (
                                <Row key={fieldKey} gutter={16} align="middle">
                                  <Col span={8}>
                                    <FloatLabel label={t("codeItem")}>
                                      <Form.Item name={[fieldName, "code"]}>
                                        <Input disabled />
                                      </Form.Item>
                                    </FloatLabel>
                                  </Col>
                                  <Col span={8}>
                                    <FloatLabel label={t("nameGiftItem")}>
                                      <Form.Item name={[fieldName, "name"]}>
                                        <Input disabled />
                                      </Form.Item>
                                    </FloatLabel>
                                  </Col>
                                  <Col span={4}>
                                    <FloatLabel label={t("quantityItem")}>
                                      <Form.Item
                                        name={[fieldName, "quantity"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: t("requiredQuantity"),
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          disabled={disabledProp}
                                          min={2}
                                          style={{ width: "100%" }}
                                        />
                                      </Form.Item>
                                    </FloatLabel>
                                  </Col>
                                  <Col
                                    style={{ marginBottom: "15px" }}
                                    span={4}
                                  >
                                    <Button
                                      disabled={disabledProp}
                                      type="link"
                                      danger
                                      icon={<MinusCircleOutlined />}
                                      onClick={() => remove(fieldName)}
                                    ></Button>
                                  </Col>
                                </Row>
                              )
                            )}
                          </Col>
                        </>
                      )}
                    </Form.List>
                  )}
                </Row>
                <Button
                  type="dashed"
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(name);
                    }
                  }}
                  icon={<MinusCircleOutlined />}
                  disabled={fields.length <= 1 || disabledProp} // Chặn xóa nếu chỉ còn 1 phần tử
                >
                  {t("RemoveDetail")}
                </Button>
              </div>
            ))}
            <Button
              disabled={disabledProp}
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add(mainStore.initPromotionDetailDto)}
            >
              {t("AddDetail")}
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
};
export default observer(PromotionDetailsComponent);
