import { Button, Col, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import React, { useState } from "react";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./index.scss";
import { useStockMainName } from "@ord-components/hooks/useStockMain";

const ImportStockWhenCreateProductUsingLot = () => {
  const form = Form.useFormInstance();
  const [t] = useTranslation("product");
  const [lotItems, setLotItems] = useState<any[]>([]);
  const addNewItem = () => {
    const newValue = [...lotItems];
    newValue.push({});
    setLotItems(newValue);
  };
  const removeItem = (idx: number) => {
    let newValue = [...lotItems];
    newValue.splice(idx, 1);
    setLotItems(newValue);
  };
  const [mainStockName] = useStockMainName();
  return (
    <>
      <Col span={24}>
        <table
          className={"w-full lot-table-form"}
          hidden={lotItems.length <= 0}
        >
          <thead>
            <tr>
              <th className={"w-[200px]"}>{t("lotNumber")}</th>
              <th className={"w-[200px]"}>{t("expiryDate")}</th>
              <th className={"w-[200px]"}>{t("currentStockInventory")}</th>
              <th className={"w-[200px]"}>{t("currentCostPrice")}</th>
              <th className={"w-[300px]"}>{t("InventoryId")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lotItems.map((it, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <Form.Item
                      rules={[ValidateUtils.requiredShortMess]}
                      name={["listInventoryByLot", idx, "lotNumber"]}
                    >
                      <Input />
                    </Form.Item>
                  </td>
                  <td>
                    <Form.Item
                      rules={[ValidateUtils.requiredShortMess]}
                      name={["listInventoryByLot", idx, "expiryDate"]}
                    >
                      <OrdDateInput />
                    </Form.Item>
                  </td>
                  <td>
                    {/* name={['listInventoryByLot', idx, 'currentStockInventory']}> */}
                    <Form.Item
                      rules={[ValidateUtils.requiredShortMess]}
                      name={["listInventoryByLot", idx, "qty"]}
                    >
                      <PriceNumberInput
                        min={0}
                        className={"not-handler-wrap text-right"}
                      />
                    </Form.Item>
                  </td>
                  <td>
                    {/* name={['listInventoryByLot', idx, 'currentCostPrice']}>  */}
                    <Form.Item name={["listInventoryByLot", idx, "costPrice"]}>
                      <PriceNumberInput
                        min={0}
                        className={"not-handler-wrap text-right"}
                      />
                    </Form.Item>
                  </td>
                  <td className={"text-center"}>
                    <b>{mainStockName}</b>
                  </td>
                  <td className={"text-right pe-2"}>
                    <a onClick={() => removeItem(idx)} className="text-red-500">
                      <DeleteOutlined></DeleteOutlined>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Col>

      <Col span={4} className={"mt-2"}>
        <Button
          onClick={() => {
            addNewItem();
          }}
          block
        >
          <PlusOutlined /> {t("addLotNumber")}
        </Button>
      </Col>
    </>
  );
};
export default ImportStockWhenCreateProductUsingLot;
