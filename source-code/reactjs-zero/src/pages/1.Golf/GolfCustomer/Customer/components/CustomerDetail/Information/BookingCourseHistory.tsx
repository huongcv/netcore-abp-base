import { Collapse, Typography, TableColumnsType } from "antd";
import arrowdown from "./icons/Arrow_Down_Detail.svg";
import "./style.scss";
import { GolfCustomerHelperService } from "@api/GolfCustomerHelperService";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { GolfHistoryBookingCourseOfCustomer } from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import dateUtil from "@ord-core/utils/date.util";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;
const { Title } = Typography;

const BookingCourseHistory = ({ id }: { id: string | undefined }) => {
  const { t } = useTranslation("golf-customer");
  const columns: TableColumnsType<GolfHistoryBookingCourseOfCustomer> =
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
          title: t("courseName"),
          dataIndex: "courseName",
          width: 150,
          align: "left",
        },
        {
          title: t("numberOfGolf"),
          dataIndex: "numberOfGolf",
          width: 50,
          align: "center",
        },
        {
          title: t("caddyName"),
          dataIndex: "caddyName",
          align: "left",
          width: 150,
        },
        {
          title: "Ghi chú",
          dataIndex: "notes",
          align: "left",
          width: 150,
        },
      ],
      {
        widthRowIndexCol: 30,
      }
    );

  // const fetchDataParter = (data?: any) => {
  //   if (id) {
  //     GolfCustomerHelperService.getHistoryBookingCourseOfCustomer({
  //       body: { partnerId: id },
  //     }).then((res) => {});
  //   }
  // };

  // useEffect(() => {
  //   fetchDataParter();
  // }, [id]);

  return (
    <div className="bookinghistory">
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
                {t("bookingCourseHistory")}
              </Title>
            </div>
          }
        >
          <AntTableWithDataPaged
            getPageResult={(d) => {
              return GolfCustomerHelperService.getHistoryBookingCourseOfCustomer(
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

export default BookingCourseHistory;
