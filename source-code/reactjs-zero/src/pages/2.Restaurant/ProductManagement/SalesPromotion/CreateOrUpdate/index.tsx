import { Button, Col, Form, Input, Row, Select, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite";
import ApplyDaysComponent from "./Components/ApplyDaysComponent";
import PromotionDetailsComponent from "./Components/PromotionComponent";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { ACTION, TYPE_PROMOTION } from "../Enums/TypePromotionDetail";
import { mapToApiFormat, mapToFormData } from "../Helper/Helper";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import UiUtils from "@ord-core/utils/ui.utils";
import BasicInformationComponent from "./Components/BasicInformationComponent";
import FloatLabel from "@ord-components/forms/FloatLabel";
import PromotionSummary from "./Components/PromotionSummary";

const CreateOrUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const action = Number(searchParams.get("action"));
  const { t } = useTranslation("promotion");
  const [form] = Form.useForm();
  const { promotionFormStore: mainStore } = useStore();
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState(mapToFormData(mainStore.formData));

  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    const data = form.getFieldsValue();
    const formattedData = mapToApiFormat(data); // Chuyển dữ liệu sang định dạng API yêu cầu
    mainStore.updateFormData(formattedData);
    const r = await mainStore.extendCreateOrUpdateSalesPromotion();
    if (r?.isSuccessful) {
      UiUtils.showSuccess(
        id && action === ACTION.View
          ? t("notiAddNewSuccess")
          : t("notiUpdateSuccess")
      );
      redirectTo();
    } else {
      UiUtils.showError(t("notiAddNewFaild"));
    }
  };
  const redirectTo = () => {
    mainStore.clearFormData();
    navigate("/product/sales-promotion");
  };

  useEffect(() => {
    if (id) {
      if (action === ACTION.View) {
        setIsDisabled(true);
      }
      const fetchPromotion = async () => {
        try {
          await mainStore.getSalesPromotionById(Number(id));
          const mappedData = mapToFormData(mainStore.formData);
          setFormData({ ...mappedData });
          form.setFieldsValue(mappedData);
        } catch (error) {
          UiUtils.showError(t("notiAddNewFaild"));
        } finally {
          setLoading(false);
        }
      };
      fetchPromotion();
    } else {
      setIsDisabled(false);
      setLoading(false);
    }
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="loading-css">
          <Spin></Spin>
        </div>
      ) : (
        <Form
          form={form}
          initialValues={formData}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <div className="box-container-promotion">
            <span className="titleHeaderPromotion">
              {t("TitleHeaderPromotion")}
            </span>
            <div>
              <Button onClick={redirectTo} type="default">
                <ArrowLeftOutlined />
                {t("BackToIndex")}
              </Button>
              {isDisabled ? (
                <></>
              ) : (
                <Button
                  style={{ marginLeft: "10px" }}
                  type="primary"
                  htmlType="submit"
                >
                  <SaveOutlined />
                  {t("Submit")}
                </Button>
              )}
            </div>
          </div>
          <Row gutter={16}>
            <Col span={18}>
              <div
                className="ord-container-box"
                style={{ padding: "1rem 2rem" }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <BasicInformationComponent
                      disabledProp={isDisabled}
                    ></BasicInformationComponent>
                    <Row gutter={16}>
                      <Col span={6}>
                        <FloatLabel label={t("isActived")}>
                          <Form.Item name="isActived">
                            <Select disabled={isDisabled}>
                              <Select.Option value={true}>
                                {t("Active")}
                              </Select.Option>
                              <Select.Option value={false}>
                                {t("Unactive")}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col span={18}>
                        <FloatLabel label={t("PromotionType")}>
                          <Form.Item
                            name="promotionType"
                            rules={[
                              {
                                required: true,
                                message: t("RequiredPromotionType"),
                              },
                            ]}
                          >
                            <Select
                              disabled={isDisabled}
                              onChange={(value) => {
                                form.resetFields(["details"]);
                                form.setFieldsValue({
                                  promotionType: value,
                                  details: [mainStore.initPromotionDetailDto],
                                });
                                setFormData((prev) => ({
                                  ...prev,
                                  promotionType: value,
                                  details: [mainStore.initPromotionDetailDto],
                                }));
                              }}
                            >
                              <Select.Option value={TYPE_PROMOTION.Invoice}>
                                {t("PromotionTypeInvoice")}
                              </Select.Option>
                              <Select.Option value={TYPE_PROMOTION.Product}>
                                {t("PromotionTypeProduct")}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={12}>
                    <ApplyDaysComponent disabledProp={isDisabled} />
                  </Col>
                </Row>

                <PromotionDetailsComponent
                  formData={formData}
                  disabledProp={isDisabled}
                />
              </div>
            </Col>
            <Col
              span={6}
              className="ord-container-box"
              style={{ padding: "1rem 2rem" }}
            >
              <PromotionSummary />
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};
export default observer(CreateOrUpdate);
