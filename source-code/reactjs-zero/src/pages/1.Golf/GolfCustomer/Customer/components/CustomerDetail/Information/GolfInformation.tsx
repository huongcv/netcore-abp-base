import React, { useEffect, useState } from "react";
import { Descriptions, Collapse, Typography } from "antd";
import "./style.scss";

const { Panel } = Collapse;
const { Title, Link } = Typography;

import arrowdown from "./icons/Arrow_Down_Detail.svg";
import { GolfCustomerHelperService } from "@api/GolfCustomerHelperService";
import { GolfLatestInformationOfCustomer } from "@api/index.defs";
import dateUtil from "@ord-core/utils/date.util";
import { useTranslation } from "react-i18next";
import uiUtils from "@ord-core/utils/ui.utils";

const GolfInformation = ({ id }: { id: string | undefined }) => {
  const { t } = useTranslation("golf-customer");
  const [golfInfo, setGolfInfo] = useState<GolfLatestInformationOfCustomer>();
  const fetchDataLatestGolfInformationOfCustomer = async () => {
    try {
      if (id) {
        GolfCustomerHelperService.getLatestGolfInformationOfCustomer({
          customerId: Number(id),
        }).then((res) => {
          setGolfInfo(res);
        });
      }
    } catch (err) {
      uiUtils.showError(t("errFetchLatestGolfInformationOfCustomer"));
    }
  };

  useEffect(() => {
    fetchDataLatestGolfInformationOfCustomer();
  }, [id]);
  return (
    <div className="golfinformation">
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
                {t("infoPlayedGolf")}
              </Title>
            </div>
          }
        >
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t("lastestGame")}>
              <Link href="#">
                {golfInfo?.dateTime
                  ? dateUtil.toFormat(golfInfo?.dateTime, "DD/MM/YYYY")
                  : ""}{" "}
                - {golfInfo?.courseName}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label={t("totalRoundsPlayed")}>
              {golfInfo?.totalRoundsPlayed}
            </Descriptions.Item>
            <Descriptions.Item label={t("bestAchievement")}>
              {golfInfo?.bestAchievement}
            </Descriptions.Item>
            <Descriptions.Item label={t("membership")}>
              {/* {golfInfo.membership} */} <></>
            </Descriptions.Item>
            <Descriptions.Item label={t("discount")}>
              {golfInfo?.discount}
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
    </div>
  );
};

export default GolfInformation;
