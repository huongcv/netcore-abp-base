import { Checkbox, Col, Form, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { ProductStockService } from "@api/ProductStockService";
import { productExt } from "@pages/ProductManagement/Product/forms/BaseInforGroup";
import { useStore } from "@ord-store/index";

export const EditProductStockBox = () => {
  const [t] = useTranslation("product");
  const form = Form.useFormInstance();
  const [disable, setDisable] = useState<boolean>();
  const isProductUseInventory_w = Form.useWatch("isProductUseInventory");
  const drugSys_w = Form.useWatch(productExt("isConnectNationalDrugSystem"));

  const { productStore: mainStore } = useStore();

  useEffect(() => {
    if (isProductUseInventory_w == false) {
      form.setFieldValue("isProductUseLotNumber", false);
    }
  }, [isProductUseInventory_w]);
  useEffect(() => {
    if (drugSys_w == "true") {
      form.setFieldsValue({
        isProductUseLotNumber: true,
        isProductUseInventory: true,
      });
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [drugSys_w]);

  // const idHash_w = Form.useWatch("idHash");
  // const loadStock = async (idHash: any) => {
  //   try {
  //     const ret = await ProductStockService.getInventoryStockPaged({
  //       body: {
  //         productHashId: idHash,
  //       },
  //     });
  //     if (ret.items && ret.items.length > 0) {
  //     }
  //   } catch {}
  // };
  // useEffect(() => {
  //   if (idHash_w) {
  //     loadStock(idHash_w).then();
  //   }
  // }, [idHash_w]);

  return (
    <>
      <Col span={24} hidden>
        <div
          className={
            "title-stock-product-box flex flex-wrap items-center justify-between"
          }
        >
          <h3 className={""}>{t("productUsingStockManagement")}</h3>
          <div className={"flex items-center"}>
            <Space wrap>
              <Form.Item
                noStyle
                name="isProductUseInventory"
                valuePropName="checked"
              >
                <Checkbox
                  disabled={
                    disable ||
                    mainStore.createOrUpdateModal.mode == "viewDetail"
                  }
                >
                  {t("IsProductUseInventory")}
                </Checkbox>
              </Form.Item>
              <Form.Item
                noStyle
                name="isProductUseLotNumber"
                valuePropName="checked"
              >
                <Checkbox
                  disabled={
                    isProductUseInventory_w != true ||
                    disable ||
                    mainStore.createOrUpdateModal.mode == "viewDetail"
                  }
                >
                  {t("IsProductUseLotNumber")}
                </Checkbox>
              </Form.Item>
            </Space>
          </div>
        </div>
      </Col>
    </>
  );
};
