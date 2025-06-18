import { Col, DatePicker, Flex, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import { InvoiceDateInput } from "@pages/SalesInvoice/Form/invoiceDateInput";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import { useSelectStock } from "@ord-components/forms/select/selectDataSource/useSelectStock";
import { EditIcon } from "@ord-components/icon/EditIcon";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import { ChannelForm } from "@pages/SalesInvoice/Invoice/channelSelect";
import { DateIcon } from "@ord-components/icon/DateIcon";
import dayjs from "dayjs";
import { TabItemType } from "../Utils/saleCommon";
import OrdDateInput from "@ord-components/forms/OrdDateInput";

export const InvoiceInfoForm = () => {
  const form = Form.useFormInstance();
  const { t } = useTranslation("sale-invoice");
  // const [isShow, setIsShow] = useState(false);
  const notes = Form.useWatch("notes", form);
  const date = Form.useWatch("invoiceDate", form);
  const timeStr = Form.useWatch("invoiceTimeStr", form);
  const salePartnerId = Form.useWatch("salePartnerId", form);
  const creatorEmployeeId = Form.useWatch("creatorEmployeeId", form);
  const tabItemType_w = Form.useWatch("tabItemType", form);
  const stockList = useSelectStock();
  useEffect(() => {
    if (stockList && !!stockList.data && stockList.data.length > 0) {
      form.setFieldValue("inventoryId", stockList.data[0].value);
    }
  }, [stockList]);

  return (
    <div>
      <div className="flex justify-between items-center">
        {tabItemType_w && tabItemType_w == TabItemType.INVOICE_RETURN ? (
          <>
            <div>{t("ReturnInvoiceDate")}</div>
            <Flex className="items-center cs-input">
              <Form.Item name="invoiceDate">
                <OrdDateTimeInput
                  placeholder={t("ReturnInvoiceDate")}
                  //   disabledDate={(current) => {
                  //     return current && current.isAfter(dayjs(), "minutes");
                  //   }}
                  variant="borderless"
                ></OrdDateTimeInput>
              </Form.Item>
            </Flex>
            {/* phiếu trả: mục đích lưu lại giá trị ngày tạo phiếu, so sánh giá trị invoiceDate (mang ý nghĩ là ngày trả ) với invoiceDate (ngày tạo hoá đơn) */}
            <Form.Item name="invoiceDateHidden" noStyle></Form.Item>
          </>
        ) : (
          <>
            <div>{t("invoiceDate")}</div>
            <Flex className="items-center cs-input">
              <Form.Item name="invoiceDate">
                <OrdDateTimeInput
                  placeholder={t("invoiceDate")}
                  disabledDate={(current) => {
                    return current && current.isAfter(dayjs(), "minutes");
                  }}
                  variant="borderless"
                ></OrdDateTimeInput>
              </Form.Item>
            </Flex>
          </>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div>Ghi chú</div>
        <Flex className="items-center cs-input">
          <Form.Item name="notes">
            <TextArea variant="borderless" rows={1} maxLength={200} />
          </Form.Item>
        </Flex>
      </div>
      <Row gutter={16}>
        <Col lg={12} md={24} sm={24}>
          <div className={`grid grid-cols-1`}>
            <div hidden>
              <span className="mr-1 w-[110px] inline-block">
                {t("createEmployee")}:{" "}
              </span>
              {creatorEmployeeId}
              <DisplayTextFormSelectDataSource
                value={creatorEmployeeId}
                datasource={useSelectEmployee()}
              />
            </div>
            <div hidden>
              <span className="mr-1 w-[110px] inline-block">
                {t("referralPartner")}:
              </span>
              {!salePartnerId ? "--" : ""}
              <DisplayTextFormSelectDataSource
                value={salePartnerId}
                datasource={useSelectEmployee()}
              />
            </div>
          </div>
        </Col>
        <Col lg={12} md={24} sm={24}>
          <Form.Item hidden name="inventoryId">
            <OrdSelect datasource={useSelectStock()} allowClear></OrdSelect>
          </Form.Item>
          <Form.Item
            hidden
            labelCol={{ span: 12 }}
            labelAlign={"left"}
            label={t("createEmployee")}
            name="creatorEmployeeId"
            rules={[ValidateUtils.required]}
          >
            <OrdSelect datasource={useSelectEmployee()}></OrdSelect>
          </Form.Item>
          <Form.Item
            hidden
            labelCol={{ span: 12 }}
            labelAlign={"left"}
            label={t("referralPartner")}
            name="salePartnerId"
          >
            <OrdSelect allowClear datasource={useSelectEmployee()}></OrdSelect>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
