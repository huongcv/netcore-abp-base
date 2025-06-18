import { useStore } from "@ord-store/index";
import { Checkbox, Col, Form, Input, Row, Spin } from "antd";
import { useTranslation } from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import React, { useEffect, useState } from "react";
import { ProductBarcodeService } from "@api/ProductBarcodeService";
import { useDebounce } from "use-debounce";

export const SettingBarcodeItemLayoutForm = (props: { index: number }) => {
  const { sessionStore } = useStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPreview, setLoadingPreview] = useState(true);
  const [debounceLoadingPreview, setDebounceLoadingPreview] = useState(0);
  const [debounceLoadingPreviewValue] = useDebounce(
    debounceLoadingPreview,
    1000
  );
  const { index } = props;
  const form = Form.useFormInstance();
  const [t] = useTranslation("product");
  const isShowPrice_w = Form.useWatch(["items", index, "isShowPrice"]);
  const isShowShop_w = Form.useWatch(["items", index, "isShowShop"]);
  const loadPreview = async () => {
    console.log(form.getFieldValue(["items", index]));

    try {
      const resultBlob = await ProductBarcodeService.previewBarCode(
        {
          body: form.getFieldValue(["items", index]),
        },
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(resultBlob);
      setPdfUrl(url);
    } catch {
    } finally {
      setLoadingPreview(false);
    }
  };
  useEffect(() => {
    setLoadingPreview(true);
    setDebounceLoadingPreview(Number(new Date()));
  }, [Form.useWatch(["items", index]), form]);
  useEffect(() => {
    loadPreview();
  }, [debounceLoadingPreviewValue]);

  return (
    <>
      <div hidden>
        <Form.Item noStyle name={["items", index, "layoutType"]}></Form.Item>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <Row gutter={12}>
            <Col span={10}>
              <Row>
                <Col span={24}>
                  <div>
                    <Form.Item
                      noStyle
                      name={["items", index, "isShowShop"]}
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Checkbox>{t("barCodeSetting.IsShowShop")}</Checkbox>
                    </Form.Item>
                  </div>
                  <div className="mt-1">
                    <Form.Item
                      noStyle
                      name={["items", index, "isShowProductName"]}
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Checkbox>
                        {t("barCodeSetting.IsShowProductName")}
                      </Checkbox>
                    </Form.Item>
                  </div>
                  <div className="mt-1">
                    <Form.Item
                      noStyle
                      name={["items", index, "isShowPrice"]}
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Checkbox>{t("barCodeSetting.IsShowPrice")}</Checkbox>
                    </Form.Item>
                  </div>

                  {isShowPrice_w == true && (
                    <>
                      <div className="mt-1">
                        <Form.Item
                          noStyle
                          name={["items", index, "isShowCurrencyName"]}
                          valuePropName="checked"
                          initialValue={true}
                        >
                          <Checkbox>
                            {t("barCodeSetting.IsShowCurrencyName")}
                          </Checkbox>
                        </Form.Item>
                      </div>
                      <div className="mt-1">
                        <Form.Item
                          noStyle
                          name={["items", index, "isShowUnitName"]}
                          valuePropName="checked"
                          initialValue={true}
                        >
                          <Checkbox>
                            {t("barCodeSetting.IsShowUnitName")}
                          </Checkbox>
                        </Form.Item>
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={14}>
              {isShowShop_w == true && (
                <FloatLabel label={t("shopName")}>
                  <Form.Item
                    name={["items", index, "shopName"]}
                    initialValue={sessionStore.currentShopName}
                  >
                    <Input />
                  </Form.Item>
                </FloatLabel>
              )}

              {isShowPrice_w == true && (
                <FloatLabel label={t("currencyName")}>
                  <Form.Item
                    name={["items", index, "currencyName"]}
                    initialValue={"VNĐ"}
                  >
                    <Input />
                  </Form.Item>
                </FloatLabel>
              )}
            </Col>
          </Row>
          <Row gutter={12} className={"mt-4"}>
            <Col span={10}>
              <FloatLabel label={t("barCodeSetting.Width")}>
                <Form.Item name={["items", index, "pageWidthMm"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
              <FloatLabel label={t("barCodeSetting.Height")}>
                <Form.Item name={["items", index, "pageHeightMn"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
              <FloatLabel label={t("barCodeSetting.RowCount")}>
                <Form.Item name={["items", index, "rowCount"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
              <FloatLabel label={t("barCodeSetting.ColumnCount")}>
                <Form.Item name={["items", index, "columnCount"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col span={14}>
              <FloatLabel label={t("barCodeSetting.PaddingTop")}>
                <Form.Item name={["items", index, "paddingTop"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
              <FloatLabel label={t("barCodeSetting.PaddingBottom")}>
                <Form.Item name={["items", index, "paddingBottom"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
              <FloatLabel label={t("barCodeSetting.PaddingLeft")}>
                <Form.Item name={["items", index, "paddingLeft"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
              <FloatLabel label={t("barCodeSetting.PaddingRight")}>
                <Form.Item name={["items", index, "paddingRight"]}>
                  <PriceNumberInput isOnlyNumberInput></PriceNumberInput>
                </Form.Item>
              </FloatLabel>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          {pdfUrl && (
            <Spin spinning={isLoadingPreview}>
              <iframe
                src={pdfUrl}
                width="100%"
                height="600px"
                title="PDF Viewer"
                style={{ border: "none" }}
              />
            </Spin>
          )}
        </Col>
      </Row>
    </>
  );
};
