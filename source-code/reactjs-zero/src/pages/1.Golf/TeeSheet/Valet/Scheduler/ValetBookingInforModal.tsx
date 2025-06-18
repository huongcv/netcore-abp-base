import {
  CloseOutlined,
  CreditCardOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { BookIcon } from "@ord-components/icon/BookIcon";
import { CardIcon } from "@ord-components/icon/CardIcon";
import { NotFoundIcon } from "@ord-components/icon/NotFoundIcon";
import {
  Modal,
  Button,
  Space,
  Empty,
  Card,
  Descriptions,
  Form,
  Input,
  Table,
  TableColumnsType,
  Row,
  Col,
} from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { info } from "sass";
import {
  formatTime,
  CheckInStatusEnum,
  AccessCardTypeEnum,
  AccessCardStatusEnum,
} from "../../Booking/Scheduler/ExtFunction";
import { useStore } from "@ord-store/index";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";
import DateUtil from "@ord-core/utils/date.util";
import FloatLabel from "@ord-components/forms/FloatLabel";
import InputAccessCard from "@pages/1.Golf/Category/MemberShipCard/InputAccessCard/InputAccessCard";
import form from "antd/es/form";
import { useGolfAccessCardAvailable } from "@ord-components/forms/select/selectDataSource/golf/useGolfAccessCardAvailable";
import UiUtils from "@ord-core/utils/ui.utils";
import {
  AccessCardUseByBookingPlayerDto,
  ConfirmAccessCardLoseAndIssueDto,
} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import { AccessCardService } from "@api/AccessCardService";
import TextArea from "antd/es/input/TextArea";
import { MemberInfoCard } from "./ValetManagementModal/MemberInfoCard";
import { BookingInfoCard } from "./ValetManagementModal/BookingInfoCard";

const ValetBookingInforModal = () => {
  const {
    golfBookingStore: mainStore,
    golfAccessCardStore,
    golfValetStore,
  } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tEnum } = useTranslation("enum");
  const { t: tAc } = useTranslation("golf_access_card");
  const [form] = Form.useForm();
  const [formCancel] = Form.useForm();

  const { memberCardInfo: info } =
    golfValetStore.checkAccessCardModal.entityData ?? {};
  const { teeTimeMap } = mainStore;
  const { memberInfo, bookingInfo } = info ?? {};
  const sourceCardTemp = useGolfAccessCardAvailable(
    AccessCardTypeEnum.Temporary
  );
  const [dataSource, setDataSource] =
    useState<AccessCardUseByBookingPlayerDto[]>();
  const [lostCardData, setLostCardData] =
    useState<AccessCardUseByBookingPlayerDto>();
  const [activeTabKey2, setActiveTabKey2] = useState<string>("issueRfId");
  const [isShowLostCard, setShowLostCard] = useState<boolean>(false);

  const onIssueRfid = async () => {
    try {
      const data = await form.validateFields();
      
      UiUtils.setBusy();

      const res = await mainStore.issueRfid({
        ...data,
        bookingPlayerId: bookingInfo?.bookingPlayerId,
      });

      if (res.isSuccessful) {
        UiUtils.showSuccess(res.message ?? "IssueRfidSuccess");
        form.resetFields();
        formCancel.resetFields();
        // if (boardId) {
        //   mainStore.refreshTeeTimeData(boardId);
        // }
        mainStore.refreshGridData();
        golfValetStore.closeCheckAccessCardModal();
      } else {
        UiUtils.showError(res.message);
      }
    } catch (error) {
      UiUtils.showCatchError(error);
    } finally {
      UiUtils.clearBusy();
    }
  };

  const onReturnCardSave = async () => {
    try {
      const dataForm = await formCancel.validateFields();
      UiUtils.setBusy();
      try {
        const par: ConfirmAccessCardLoseAndIssueDto = {
          accessCardIdNew: dataForm.accessCardIdNew,
          note: dataForm.note,
          accessCardIdOld: lostCardData?.accessCardId,
          idRecord: lostCardData?.id,
          bookingPlayerId: bookingInfo?.bookingPlayerId,
        };
        AccessCardService.confirmAccessCardLoseAndIssue({ body: par }).then(
          (res) => {
            if (res.isSuccessful) {
              UiUtils.showSuccess(res.message ?? "IssueRfidSuccess");
              // mainStore.closeManagerCardPlayerModalModal(true, entityData?.boardId);
              form.resetFields();
              formCancel.resetFields();
              mainStore.refreshGridData();
              golfValetStore.closeCheckAccessCardModal();
            } else {
              UiUtils.showError(res.message);
            }
          }
        );
      } catch (e) {
        UiUtils.clearBusy();
      } finally {
        // clearDataCloseModal();
        UiUtils.clearBusy();
      }
    } catch (errorInfo) {
      UiUtils.showCommonValidateForm();
    }
  };

  const handleRecallCard = (d: AccessCardUseByBookingPlayerDto) => {
    UiUtils.showConfirm({
      title: tAc("confirmRecallTitle"),
      content: (
        <Trans
          ns={"golf_access_card"}
          i18nKey="confirmRecall"
          values={{
            code: d.uid,
          }}
          components={{ italic: <i />, bold: <strong /> }}
        />
      ),
      onOk: async () => {
        UiUtils.setBusy();
        try {
          if (d.accessCardId === "" || d.accessCardId == undefined) return;

          const update = await AccessCardService.revokeCardByAccessCardId({
            body: {
              accessCardId: d.accessCardId,
              bookingPlayerId: bookingInfo?.bookingPlayerId,
              note: "Thu hồi thẻ player",
            },
          });

          if (update.isSuccessful) {
            UiUtils.showSuccess(tAc(`recallSuccess`));
            // if (boardId) {
            //   mainStore.refreshTeeTimeData(boardId);
            // }
            // mainStore.closeManagerCardPlayerModalModal(true, boardId);
            mainStore.refreshGridData();
            golfValetStore.closeCheckAccessCardModal();
          } else {
            UiUtils.showError(tAc(`recallFaild`));
          }
        } catch (err: any) {
          UiUtils.showError(tAc(`updateIsActiveFaildErr500`) + err?.Message);
        } finally {
          UiUtils.clearBusy();
        }
      },
      onCancel: () => {},
      isDanger: true,
    });
  };

  const columns: TableColumnsType<AccessCardUseByBookingPlayerDto> =
    TableUtil.getColumns(
      [
        {
          title: tAc("code"),
          dataIndex: "code",
          align: "left",
          width: 100,
        },
        {
          title: t("dateStartUsingCard"),
          dataIndex: "startDate",
          align: "left",
          width: 100,
          render: (v) => (v != null ? DateUtil.toFormat(v) : <></>),
        },
        {
          title: t("dateReturnCard"),
          dataIndex: "endDate",
          align: "left",
          width: 100,
          render: (v) => (v != null ? DateUtil.toFormat(v) : <></>),
        },
      ],
      {
        actions: [
          {
            title: "recoverCard",
            icon: <RollbackOutlined />,
            hiddenIf: (d: AccessCardUseByBookingPlayerDto) => {
              return (
                d.accessStatus !== AccessCardStatusEnum.Assigned ||
                d.endDate != null
              );
            },
            onClick: (d: AccessCardUseByBookingPlayerDto) => {
              handleRecallCard(d);
            },
          },
          {
            title: "lost-issue",
            icon: <CreditCardOutlined />,
            isDanger: true,
            hiddenIf: (record: AccessCardUseByBookingPlayerDto) =>
              !!record.endDate ||
              record.accessStatus == AccessCardStatusEnum.Lost,
            onClick: (d: AccessCardUseByBookingPlayerDto) => {
              setLostCardData(d);
              setShowLostCard(true);
            },
          },
        ],
        ns: golfAccessCardStore.getNamespaceLocale(),
      }
    );

  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
    if (key === "issueRfId") {
      setShowLostCard(false);
      setLostCardData(undefined);
    }
  };

  const contentListNoTitle: Record<string, React.ReactNode> = {
    issueRfId: (
      <Form layout="vertical" form={form} initialValues={{}}>
        <FloatLabel label={t("selectRfidCode")}>
          <Form.Item name="accessCardId">
            <InputAccessCard autoFocus datasource={sourceCardTemp} />
          </Form.Item>
        </FloatLabel>
        <FloatLabel label={t("BagTag No")}>
          <Form.Item name="bagTagNo">
            <Input />
          </Form.Item>
        </FloatLabel>
      </Form>
    ),
    issueRfIdList: (
      <>
        <Table<AccessCardUseByBookingPlayerDto>
          size="small"
          bordered
          scroll={{ x: 300 }}
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowClassName="editable-row"
          className="mb-5"
        />
        {isShowLostCard && (
          <>
            <Descriptions
              title="Thông tin thẻ cũ"
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="Mã thẻ">
                {lostCardData?.code || "-"}
              </Descriptions.Item>
              {/*<Descriptions.Item label="UID">{lostCardData?.uid || '-'}</Descriptions.Item>*/}
              <Descriptions.Item label="Ngày bắt đầu">
                {lostCardData?.startDate
                  ? DateUtil.toFormat(
                      lostCardData?.startDate,
                      "DD/MM/YYYY HH:mm"
                    )
                  : "-"}
              </Descriptions.Item>
              {/*<Descriptions.Item label="Loại thẻ">{tEnum(`.${lostCardData?.cardType}`) ?? '-'}</Descriptions.Item>*/}
              <Descriptions.Item label="Trạng thái">
                {lostCardData?.accessStatus ?? "-"}
              </Descriptions.Item>
            </Descriptions>
            <Form layout="vertical" form={formCancel} initialValues={{}}>
              <FloatLabel>
                <span className="pt-2">
                  Chọn thẻ cấp phát bên dưới để hoàn thành việc xác nhận báo mất
                  thẻ và cấp phát thẻ mới
                </span>
              </FloatLabel>
              <FloatLabel label={t("selectNewRfidCode")}>
                <Form.Item name="accessCardIdNew">
                  <InputAccessCard datasource={sourceCardTemp} />
                </Form.Item>
              </FloatLabel>
              <FloatLabel label={tAc("notes")}>
                <Form.Item name="note">
                  <TextArea rows={2} />
                </Form.Item>
              </FloatLabel>
            </Form>
          </>
        )}
      </>
    ),
  };

  const tabListNoTitle = [
    {
      key: "issueRfId",
      label: t("issueRfId"),
    },
    {
      key: "issueRfIdList",
      label: t("issueRfIdList"),
    },
    // {
    //     key: 'cancelRfId',
    //     label: t('cancelRfId'),
    //     disabled: !lostCardData
    // },
  ];
  const fetchAccessCardHis = async () => {
    try {
      if (!bookingInfo?.bookingPlayerId) return;

      const res =
        await AccessCardService.getListAccessCardHistoryByBookingPlayerId(
          { bookingPlayerId: Number(bookingInfo.bookingPlayerId) },
          {}
        );
      setDataSource([...res]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (golfValetStore.checkAccessCardModal.visible) {
      fetchAccessCardHis();
    }
  }, [golfValetStore.checkAccessCardModal.visible]);

  useEffect(() => {
    if (golfValetStore.checkAccessCardModal.visible) {
      setActiveTabKey2("issueRfId");
    }
  }, [golfValetStore.checkAccessCardModal.visible]);

  return (
    <>
      <Modal
        title={<span>{t("valetCardManagement")}</span>}
        open={golfValetStore.checkAccessCardModal.visible}
        width={1300}
        onCancel={() => {
          golfValetStore.closeCheckAccessCardModal();
        }}
        footer={
          <div className="flex flex-wrap items-center justify-between  max-sm:flex-col">
            <div></div>
            <div className="flex items-center crud-modal-footer-btn-group">
              <Button
                className="me-2"
                onClick={() => golfValetStore.closeCheckAccessCardModal()}
              >
                <Space.Compact>
                  <Space>
                    <CloseOutlined className="me-1" />
                  </Space>
                  {t("cancelModal")} (F10)
                </Space.Compact>
              </Button>
              {activeTabKey2 == "issueRfId" && (
                <Button
                  type="primary"
                  onClick={debounce(() => {
                    onIssueRfid();
                  }, 250)}
                >
                  <Space.Compact>
                    {" "}
                    <Space>
                      <SaveOutlined className="me-1" />
                    </Space>
                    {t("issueRfId")} (F8)
                  </Space.Compact>
                </Button>
              )}
              {isShowLostCard && (
                <Button
                  type="primary"
                  onClick={debounce(() => {
                    onReturnCardSave();
                  }, 250)}
                >
                  <Space.Compact>
                    {" "}
                    <Space>
                      <SaveOutlined className="me-1" />
                    </Space>
                    {t("cancelRfId")} (F8)
                  </Space.Compact>
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* {!info && findCardStatus == 0 && <Empty description={t("pleaseEnterCardIdToCheckIn")}
                                                        image={<CardIcon width={100} height={100}></CardIcon>}/>}
                {findCardStatus == 2 && <Empty description={t("notFoundCardId")}
                                               image={<NotFoundIcon width={100} height={100}></NotFoundIcon>}/>} */}

        <Row gutter={16}>
          <Col span={12}>
            <div className="p-4 space-y-4">
              {memberInfo && (
                <MemberInfoCard memberInfo={memberInfo} tEnum={tEnum} />
              )}
              <BookingInfoCard bookingInfo={bookingInfo} t={t} tEnum={tEnum} />
            </div>
          </Col>
          <Col span={12}>
            <div className="p-4 space-y-4">
                <Card
                style={{ width: "100%" }}
                tabList={tabListNoTitle}
                activeTabKey={activeTabKey2}
                onTabChange={onTab2Change}
                tabProps={{
                  size: "small",
                }}
                className="shadow-md rounded-xl"
              >
                {contentListNoTitle[activeTabKey2]}
            </Card>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default observer(ValetBookingInforModal);
