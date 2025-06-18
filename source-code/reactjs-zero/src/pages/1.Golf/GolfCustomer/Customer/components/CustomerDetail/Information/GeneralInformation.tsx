import React, { useEffect, useState } from "react";
import { Row, Col, Descriptions, Collapse, Typography } from "antd";
import "./style.scss";

const { Panel } = Collapse;
const { Title } = Typography;

import arrowdown from "./icons/Arrow_Down_Detail.svg";
import { GolfCustomerService } from "@api/GolfCustomerService";
import { GolfCustomerDto } from "@api/index.defs";
import dateUtil from "@ord-core/utils/date.util";
import { useTranslation } from "react-i18next";

const GeneralInformation = ({
  customerData,
}: {
  customerData: GolfCustomerDto | undefined;
}) => {
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("golf-customer");
  return (
    <div className="generalinformation">
      <Collapse
        defaultActiveKey={["1"]}
        bordered={false}
        expandIconPosition="left"
        expandIcon={({ isActive }) => (
          <img
            src={arrowdown}
            alt="arrow"
            className={`custom-collapse-icon ${isActive ? "rotate" : ""}`}
          />
        )}
      >
        <Panel
          key="1"
          header={
            <div className="custom-header">
              <Title level={4} style={{ margin: 0, color: "green" }}>
                {t("information")}
              </Title>
            </div>
          }
        >
          <Row gutter={32}>
            <Col span={12}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label={t("customerCode")}>
                  {customerData?.code}
                </Descriptions.Item>
                <Descriptions.Item label={t("customerName")}>
                  {customerData?.name}
                </Descriptions.Item>
                <Descriptions.Item label={t("customerPhone")}>
                  {customerData?.phone}
                </Descriptions.Item>
                <Descriptions.Item label={t("customerEmail")}>
                  {customerData?.email}
                </Descriptions.Item>
                <Descriptions.Item label={t("customerAddress")}>
                  {customerData?.address}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label={t("dateOfBirth")}>
                  {customerData?.dateOfBirth
                    ? dateUtil.toFormat(customerData?.dateOfBirth)
                    : ""}
                </Descriptions.Item>
                <Descriptions.Item label={t("gender")}>
                  {customerData?.gender
                    ? tEnum(`GENDER.${customerData.gender}`)
                    : ""}
                </Descriptions.Item>
                <Descriptions.Item label={t("customerType")}>
                  {/* {customerData?.customerType} */}
                  {<></>}
                </Descriptions.Item>
                <Descriptions.Item label="Handicap">
                  {/* {customerData?.handicap} */}
                  {<></>}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </div>
  );
};

export default GeneralInformation;
