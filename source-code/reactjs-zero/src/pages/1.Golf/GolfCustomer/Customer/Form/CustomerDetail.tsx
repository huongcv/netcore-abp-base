import { lazy, Suspense, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Row,
  Menu,
  Dropdown,
  Tabs,
  Badge,
  Avatar,
  Spin,
  Space,
} from "antd";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../style-customer.scss";
import Golf from "../components/CustomerDetail/diary/golf";
import Restaurant from "../components/CustomerDetail/diary/restaurant";
import Hotel from "../components/CustomerDetail/diary/hotel";
import { useStore } from "@ord-store/index";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { GolfCustomerDto } from "@api/index.defs";
import { observer } from "mobx-react-lite/src/observer";
import { GolfCustomerService } from "@api/GolfCustomerService";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import BookingCourseHistory from "../components/CustomerDetail/Information/BookingCourseHistory";
import GeneralInformation from "../components/CustomerDetail/Information/GeneralInformation";
import GolfInformation from "../components/CustomerDetail/Information/GolfInformation";
import HistoryUsingServices from "../components/CustomerDetail/Information/HistoryUsingServices";
import { PartnerAccessCardTable } from "./ModalAccessCardManage";

const { Title } = Typography;
const { TabPane } = Tabs;

const CustomerDetail = () => {
  const { golfCustomerStore: mainStore } = useStore();
  const navigate = useNavigate();
  const [xemThemContent, setXemThemContent] = useState(null);
  const { id } = useParams();
  const [cusInfo, setCusInfo] = useState<GolfCustomerDto>();
  const [activeKey, setActiveKey] = useState("1");
  const { t } = useTranslation("golf-customer");

  const fetchDataParter = () => {
    if (id) {
      GolfCustomerService.getById({ findId: parseInt(id) || 0 }).then((res) => {
        setCusInfo(res);
      });
    }
  };

  useEffect(() => {
    fetchDataParter();
  }, [id]);

  //   useEffect(() => {
  //     fetchDataParter();
  //   }, [mainStore.refreshDataState]);

  const handleMenuClick = (e: any) => {
    setXemThemContent(e.key); // Thay đổi nội dung khi chọn trong dropdown
  };

  const xemThemMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Xem thêm 1</Menu.Item>
      <Menu.Item key="2">Xem thêm 2</Menu.Item>
    </Menu>
  );

  const backWard = () => {
    mainStore.backWard();
  };
  const LazyModalCruCustomer = lazy(() => import("./ModalCruCustomer"));
  const topAction: IActionBtn[] = [
    {
      title: t("actionBtn.ReasonType"),
      content: (
        <>
          <Button onClick={() => navigate(-1)}>
            <Space>
              <ArrowLeftOutlined />
            </Space>
            {t("actionBtn.back")}
          </Button>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="customer-detail">
        <PageTopTitleAndAction
          usingCustom={true}
          mainTitle={t("pageTitle")}
          items={[t("pageTitleLvl2")]}
        >
          <TopAction topActions={topAction} />
        </PageTopTitleAndAction>
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Row
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Avatar size={64} src="/images/user-avatar.png" />
            <div style={{ marginLeft: 20 }}>
              <Title level={4} style={{ marginBottom: 2 }}>
                {cusInfo?.name}
              </Title>
              <p>{cusInfo?.phone}</p>
            </div>
          </Row>

          <Row style={{ gap: "15px" }}>
            <Button
              style={{
                backgroundColor: "#15713A",
                borderColor: "#15713A",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              icon={<EditOutlined />}
              onClick={() => {
                if (id) {
                  GolfCustomerService.getById({
                    findId: parseInt(id) || 0,
                  }).then((res) => {
                    mainStore.openUpdateModal(res);
                  });
                }
              }}
            >
              {t("editDetail")}
            </Button>
            <Button
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#163422",
                color: "#163422",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {t("booking")}
            </Button>
          </Row>
        </Row>

        {/* Tabs thông tin chi tiết */}
        <div
          className="custom-tabs"
          style={{ backgroundColor: "#fff", borderRadius: 8, marginTop: 20 }}
        >
          <Tabs activeKey={activeKey} onChange={setActiveKey}>
            <TabPane tab="Thông tin" key="1">
              {/* Thông tin chung */}
              <GeneralInformation customerData={cusInfo} />
              {/* Thông tin chơi golf  */}
              <GolfInformation id={id} />
              {/* Lịch sử đặt sân */}
              <BookingCourseHistory id={id} />
              {/* Lịch sử sử dụng dịch vụ */}
              <HistoryUsingServices id={id} />
            </TabPane>

            <TabPane tab="Nhật ký" key="2">
              {/* Golf */}
              <Golf />
              {/* Nhà hàng */}
              <Restaurant />
              {/* Khách sạn */}
              <Hotel />
            </TabPane>

            <TabPane
              tab={
                <span>
                  Hoạt động{" "}
                  <Badge count={2} style={{ backgroundColor: "#b5b4b4" }} />
                </span>
              }
              key="3"
            >
              <div>Hoạt động</div>
            </TabPane>

            <TabPane tab="Thẻ thành viên" key="4">
              <PartnerAccessCardTable
                partnerId={id}
                stored={mainStore}
                isNoAction={true}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  Lịch hẹn{" "}
                  <Badge count={2} style={{ backgroundColor: "#b5b4b4" }} />
                </span>
              }
              key="5"
            >
              <div>Lịch hẹn</div>
            </TabPane>

            <TabPane tab={<span>Lịch sử thanh toán</span>} key="6">
              <div>Lịch sử thanh toán</div>
            </TabPane>

            <TabPane tab="Công nợ" key="7">
              <div>Công nợ</div>
            </TabPane>

            <TabPane
              tab={
                <Dropdown overlay={xemThemMenu} trigger={["click"]}>
                  <span style={{ display: "flex", gap: "10px" }}>
                    Xem thêm <ArrowRightOutlined />
                  </span>
                </Dropdown>
              }
              key="xemthem"
            >
              <div>
                {xemThemContent === "1" && <div>Xem thêm 1</div>}
                {xemThemContent === "2" && <div>Xem thêm 2</div>}
                {!xemThemContent && (
                  <div>Chọn một mục từ dropdown để xem chi tiết.</div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <Suspense fallback={<Spin />}>
        {mainStore.createOrUpdateModal.visible && (
          <LazyModalCruCustomer stored={mainStore}></LazyModalCruCustomer>
        )}
      </Suspense>
    </>
  );
};

export default observer(CustomerDetail);
