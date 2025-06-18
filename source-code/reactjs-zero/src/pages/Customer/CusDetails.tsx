import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { CustomerService } from "@api/CustomerService";
import { PartnerDto, SpendingInformationOutputDto } from "@api/index.defs";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import { Discount2Icon } from "@ord-components/icon/Discount2Icon";
import { ProfileIcon } from "@ord-components/icon/ProfileIcon";
import { Wallet2Icon } from "@ord-components/icon/Wallet2Icon";
import { WorkIcon } from "@ord-components/icon/WorkIcon";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import PartnerClassWithAvatar from "@pages/Partner/Shared/PartnerClassWithAvatar";
import { CustomerPayinfo } from "@pages/Partner/Shared/customer-payinfo";
import { DebtInfo } from "@pages/Partner/Shared/debtInfo";
import { MembershipVoucher } from "@pages/Partner/Shared/membershipVoucher";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Tabs,
  TabsProps,
  Tag,
} from "antd";
import { parseInt } from "lodash";
import { observer } from "mobx-react-lite";
import { TabBarExtraContent } from "rc-tabs/lib/interface";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import "./CusDetails.scss";

const { TextArea } = Input;

function CusDetails() {
  const { customerStore: mainStore, customerDebtStore: debtStore, partnerTransactionStore: transactionStore } = useStore();
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("customer");
  const navigate = useNavigate();
  const { partnerHashId } = useParams();
  const [partnerId, setPartnerId] = useState<number>();
  const [cusInfo, setCusInfo] = useState<PartnerDto>();
  const [spendingInfo, setSpendingInfo] =
    useState<SpendingInformationOutputDto>();

  const [isEdit, setIsEdit] = useState<boolean>();
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const [cusForm] = Form.useForm();
  useEffect(() => {
    CustomerService.getByHashId({
      hashId: partnerHashId ?? "",
    }).then((res) => {
      setCusInfo(res);
      setPartnerId(res.id ? parseInt(res.id) : 0);
      cusForm.setFieldsValue(res);
    });
  }, [partnerHashId, mainStore.refreshDataState]);

  useEffect(() => {
    if (partnerId && partnerId > 0)
      CustomerService.getSpendingInformation({
        partnerId: partnerId,
      }).then((res) => {
        setSpendingInfo(res);
      });
  }, [partnerId]);
  const onSave = async () => {
    try {
      const data = await cusForm.validateFields();
      UiUtils.setBusy();
      try {
        CustomerService.createOrUpdate({
          body: {
            ...cusInfo,
            ...data,
            id: cusInfo?.id,
          },
        }).then((result) => {
          if (result) {
            UiUtils.showSuccess(
              t("updateSuccess", {
                ...result.data,
              })
            );
            CustomerService.getByHashId({
              hashId: partnerHashId ?? "",
            }).then((res) => {
              setCusInfo(res);
              setPartnerId(res.id ? parseInt(res.id) : 0);
              cusForm.resetFields();
              cusForm.setFieldsValue(res);
              setIsEdit(false);
            });
          }
        });
      } catch (e) {
      } finally {
        UiUtils.clearBusy();
      }
    } catch (errorInfo) {
      UiUtils.showCommonValidateForm();
    }
  };

  const topActions: IActionBtn[] = [
    {
      title: t("actionBtn.CustomerGroup"),
      permission: PERMISSION_APP.customer.customerGroup,
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
    {
      permission: "Partner.Customer.Create",
      content: (
        <>
          {isEdit ? (
            <Button type="primary" onClick={onSave}>
              <SaveOutlined></SaveOutlined>
              {t("save")}
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                mainStore.openUpdateModal(cusInfo);
                // setIsEdit(true)
              }}
            >
              <Space>
                <EditOutlined />
                {t("actionBtn.edit")}
              </Space>
            </Button>
          )}
        </>
      ),
    },
  ];
  const LazyModalCruCustomer = lazy(
    () => import("@pages/Customer/ModalCruCustomer")
  );
  const extraTab: TabBarExtraContent = {
    left: (
      <div style={{ marginTop: "20px" }} className={"text-center"}>
        <PartnerClassWithAvatar
          partnerClass={spendingInfo?.accountClass ?? 0}
        ></PartnerClassWithAvatar>
        <p className="uppercase style-name">{cusInfo?.name}</p>
      </div>
    ),
  };
  const itemTab: TabsProps["items"] = [
    {
      icon: <ProfileIcon />,
      key: "1",
      label: t("customerInfo"),
      children: (
        <Card title={t("customerInfo")} style={{ border: "none" }}>
          <div className="flex gap-6">
            <div className="grow ">
              <Row gutter={[16, 8]} className="mb-2.5">
                <Col lg={24} md={24}>
                  <div className="text-xl font-bold">{cusInfo?.code}</div>
                  {cusInfo?.isActived ? (
                    <Tag color="#EFFFEF">
                      <span className="text-[#1AB01A]">{t("isActived")}</span>
                    </Tag>
                  ) : (
                    <Tag color="red">{t("notActived")}</Tag>
                  )}
                  {cusInfo?.debtAmount ? (
                    <Tag color="#EEEEEE">
                      <span className="text-[#45494E]">
                        {t("debtAmount")} :
                        {formatter.format(cusInfo?.debtAmount ?? 0)}
                      </span>
                    </Tag>
                  ) : (
                    ""
                  )}
                </Col>
                <Col lg={12} md={24}>
                  <Card
                    bordered={true}
                    className="card-detail card-detail-debt border-[#FFCAD3]"
                  >
                    <Statistic
                      title={
                        <div className="text-[#45494E] font-bold text-[16px]">
                          {t("spentAmount")}
                        </div>
                      }
                      value={spendingInfo?.spentAmount}
                      precision={2}
                      valueStyle={{
                        color: "#ee0034",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                      suffix={
                        <div className="text-[#45494E] text-[16px] font-normal">
                          VNĐ
                        </div>
                      }
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: t("info_upgrade", {
                          value:
                            formatter.format(
                              spendingInfo?.spentAmountNeedUpgrade ?? 0
                            ) + " VNĐ",
                        }),
                      }}
                    ></div>
                    <Progress
                      showInfo={false}
                      strokeColor={"#ff9294"}
                      percent={spendingInfo?.percentSpentAmount ?? 0}
                      type="line"
                    />
                  </Card>
                </Col>
                <Col lg={12} md={24}>
                  <Card
                    bordered={true}
                    className="card-detail card-detail-order border-[#FFCAD3]"
                  >
                    <Statistic
                      title={
                        <div className="text-[#45494E] font-bold text-[16px]">
                          {t("numberOfOrders")}
                        </div>
                      }
                      value={spendingInfo?.numberOfOrders}
                      precision={0}
                      valueStyle={{
                        color: "#ee0034",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                      suffix={
                        <div className="text-[#45494E] text-[16px] font-normal">
                          {t("order")}
                        </div>
                      }
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: t("info_orderUpgrade", {
                          value: spendingInfo?.percentNumberOfOrders ?? 0,
                        }),
                      }}
                    ></div>
                    <Progress
                      showInfo={false}
                      strokeColor={"#ff9294"}
                      percent={spendingInfo?.percentNumberOfOrders ?? 0}
                      type="line"
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 8]}>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("type")}:</div>
                    <div className="grow ">
                      <strong>{tEnum(cusInfo?.strType ?? "")}</strong>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("dateOfBirth")}:</div>
                    <div className="grow ">
                      <strong>
                        {cusInfo?.dateOfBirth
                          ? DateUtil.toFormat(
                            cusInfo?.dateOfBirth,
                            "DD/MM/YYYY"
                          )
                          : "-"}
                      </strong>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("name")}:</div>
                    <div className="grow ">
                      <strong>{cusInfo?.name}</strong>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("taxCode")}:</div>
                    <div className="grow ">
                      <strong>{cusInfo?.taxCode}</strong>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("phone")}:</div>
                    <div className="grow ">
                      <strong>
                        {" "}
                        {Utils.transformPhoneNumber(cusInfo?.phone ?? "")}
                      </strong>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("taxBranch")}:</div>
                    <div className="grow ">
                      <strong>{cusInfo?.taxBranch}</strong>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("gender")}:</div>
                    <div className="grow ">
                      <strong>
                        {cusInfo?.genderStr ? tEnum(cusInfo?.genderStr) : "-"}
                      </strong>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("groupId")}:</div>
                    <div className="grow ">
                      <strong>{cusInfo?.groupName}</strong>
                    </div>
                  </div>
                </Col>
                <Col lg={24} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("address")}:</div>
                    <div className="grow ">
                      <span>{cusInfo?.fullAddress}</span>
                    </div>
                  </div>
                </Col>
                <Col lg={24} md={24}>
                  <div className="flex gap-6">
                    <div className="flex-none w-56">{t("notes")}:</div>
                    <div className="grow ">
                      <span>{cusInfo?.notes}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      ),
    },
    {
      icon: <Wallet2Icon />,
      key: "2",
      label: t("transactionHistory"),
      children: (
        <Card title={t("transactionHistory")} style={{ border: "none" }}>
          {partnerId && (
            <CustomerPayinfo
              store={transactionStore} partnerInfo={cusInfo as any}
              type={1} debtStore={debtStore}
              partnerId={partnerId}
            ></CustomerPayinfo>
          )}
        </Card>
      ),
    },
    {
      icon: <WorkIcon />,
      key: "3",
      label: t("debtInfo"),
      children: (
        <Card title={t("debtInfo")} style={{ border: "none" }}>
          {partnerId && <DebtInfo partnerId={partnerId} store={debtStore} type={1}></DebtInfo>}
        </Card>
      ),
    },
    {
      icon: <Discount2Icon />,
      key: "4",
      label: t("membershipVoucher"),
      children: (
        <Card title={t("membershipVoucher")} style={{ border: "none" }}>
          {partnerId && (
            <MembershipVoucher partnerId={partnerId}></MembershipVoucher>
          )}
        </Card>
      ),
    },
  ];
  return (
    <div>
      <PageTopTitleAndAction
        usingCustom={true}
        mainTitle={t("pageTitle")}
        items={[t("pageTitleLvl2")]}
      >
        <TopAction topActions={topActions} />
      </PageTopTitleAndAction>
      <Tabs
        className="detail-partner-tabs"
        defaultActiveKey="1"
        tabPosition={"left"}
        tabBarExtraContent={extraTab}
        style={{
          minHeight: 450,
          backgroundColor: "#FFF",
          border: "none",
        }}
        items={itemTab.map((item) => {
          return {
            className: "tab-styles",
            icon: item.icon,
            key: String(item.key),
            label: `${item.label}`,
            children: item.children,
          };
        })}
      />
      <Suspense fallback={<Spin />}>
        {mainStore.createOrUpdateModal.visible && (
          <LazyModalCruCustomer stored={mainStore}></LazyModalCruCustomer>
        )}
      </Suspense>
    </div>
  );
}

export default observer(CusDetails);
