import { Table, Collapse, Typography, TableColumnsType } from "antd";
import arrowdown from "./icons/Arrow_Down_Detail.svg";
import "./style.scss";
import { GolfCustomerHelperService } from "@api/GolfCustomerHelperService";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { GolfHistoryUsingServicesOfCustomer } from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import dateUtil from "@ord-core/utils/date.util";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;
const { Title } = Typography;

const HistoryUsingServices = ({ id }: { id: string | undefined }) => {
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("golf-customer");
  const columns: TableColumnsType<GolfHistoryUsingServicesOfCustomer> =
    TableUtil.getColumns(
      [
        {
          title: t("dateTime"),
          dataIndex: "dateTime",
          align: "left",
          width: 100,
          render: (v) =>
            v != null ? dateUtil.toFormat(v, "DD/MM/YYYY") : <></>,
        },
        {
          title: t("productCategoryId"),
          dataIndex: "productCategoryId",
          width: 150,
          align: "left",
          render: (v) => {
            return v ? <>{tEnum(`ProductTypeGolfServiceEnum.${v}`)}</> : <></>;
          },
        },
        {
          title: t("serviceName"),
          dataIndex: "serviceName",
          width: 150,
          align: "left",
        },
        {
          title: t("notes"),
          dataIndex: "notes",
          align: "left",
          width: 150,
        },
      ],
      {
        widthRowIndexCol: 30,
      }
    );

  return (
    <div className="serviceusagehistory">
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
                {t("historyUsingServices")}
              </Title>
            </div>
          }
        >
          <AntTableWithDataPaged
            getPageResult={(d) => {
              return GolfCustomerHelperService.getHistoryUsingServicesOfCustomer(
                {
                  body: {
                    ...d.body,
                    partnerId: id,
                  },
                },
                {}
              );
            }}
            bordered
            columns={columns}
          />
        </Panel>
      </Collapse>
    </div>
  );
};

export default HistoryUsingServices;
