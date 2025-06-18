import { DiscountBarCodeService } from "@api/DiscountBarCodeService";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { useStore } from "@ord-store/index";
import { Checkbox, Col, Form, Input, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

export const SettingDiscountBarCodeForm = (props: { index: number }) => {
  const { index } = props;
  const { sessionStore } = useStore();
  const form = Form.useFormInstance();
  const [t] = useTranslation("discount");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPreview, setLoadingPreview] = useState(true);
  const [debounceLoadingPreview, setDebounceLoadingPreview] = useState(0);
  const [debounceLoadingPreviewValue] = useDebounce(
    debounceLoadingPreview,
    1000
  );
  const isShowShop_w = Form.useWatch(["items", index, "isShowShop"]);

  const isShowDiscountValue_w = Form.useWatch([
    "items",
    index,
    "isShowDiscountValue",
  ]);

  const loadPreview = async () => {
    console.log(form.getFieldValue(["items", index]));

    try {
      const resultBlob = await DiscountBarCodeService.previewBarCode(
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
      <Row>
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
                  <div>
                    <Form.Item
                      noStyle
                      name={["items", index, "isShowDiscountCode"]}
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Checkbox>
                        {t("barCodeSetting.IsShowDiscountCode")}
                      </Checkbox>
                    </Form.Item>
                  </div>
                  <Form.Item
                    noStyle
                    name={["items", index, "isShowDiscountUseType"]}
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Checkbox>
                      {t("barCodeSetting.IsShowDiscountUseType")}
                    </Checkbox>
                  </Form.Item>
                  <div>
                    <Form.Item
                      noStyle
                      name={["items", index, "isShowDiscountValue"]}
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Checkbox>
                        {t("barCodeSetting.IsShowDiscountValue")}
                      </Checkbox>
                    </Form.Item>
                  </div>

                  {isShowDiscountValue_w == true && (
                    <>
                      <Form.Item
                        noStyle
                        name={["items", index, "isShowDiscountType"]}
                        valuePropName="checked"
                        initialValue={true}
                      >
                        <Checkbox>
                          {t("barCodeSetting.IsShowDiscountType")}
                        </Checkbox>
                      </Form.Item>
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
            </Col>
          </Row>
          <Row gutter={12} className={"mt-2"}>
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
