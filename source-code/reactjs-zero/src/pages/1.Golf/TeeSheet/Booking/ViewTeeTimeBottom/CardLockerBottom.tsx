import {
  CheckCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  PlusSquareOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useStore } from "@ord-store/index";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite/src/observer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Meta from "antd/es/card/Meta";
import UiUtils from "@ord-core/utils/ui.utils";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectGolfLockerGroup } from "@ord-components/forms/select/selectDataSource/useSelectGolfLockerGroup";
import { GolfLockerService } from "@api/GolfLockerService";
import { useWatch } from "antd/es/form/Form";
import {
  FlightSlot,
  GolfFlightOutputDto,
  GolfLockerChangeHistoryDto,
  GolfLockerDto,
  GolfLockerPageDto,
  OrdPagedRequestDto,
} from "@api/index.defs";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import dateUtil from "@ord-core/utils/date.util";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

export interface ConfirmCheckoutLockerInBooking {
  isOpen: boolean;
  lockerId?: string;
  lockerCode?: string;
  partnerName?: string;
}

const CardLockerBottom = (props: {
  boardIdx: number;
  flight: GolfFlightOutputDto;
  slotInfo: FlightSlot;
  lockerAssigned?: GolfLockerChangeHistoryDto;
  onChangeLockerAssignedInrowIdx?: (lAs: any) => void;
}) => {
  const { slotInfo } = props;
  const { golfBookingStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalConfirmCheckout, setIsOpenModalConfirmCheckout] =
    useState<ConfirmCheckoutLockerInBooking>({ isOpen: false });
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [activeLocker, setActiveLocker] =
    useState<GolfLockerChangeHistoryDto>();

  const [lockerAssigned, setLockerAssigned] =
    useState<GolfLockerChangeHistoryDto>();

  const [fromSeach] = Form.useForm();
  const groupId_w = useWatch("groupId", fromSeach);

  const gridStyle: React.CSSProperties = {
    width: "25%",
    textAlign: "center",
    cursor: "pointer",
    height: 100,
    padding: 10,
  };

  const clearDataCloseModal = () => {
    setIsOpenModal(false);
    setIsLoading(false);
    setActiveLocker(undefined);
    fromSeach.resetFields();
  };
  const handleOkModal = async () => {
    if (!activeLocker) return;

    const rentStartDate = new Date();
    const body: GolfLockerChangeHistoryDto = {
      ...activeLocker,
      rentStartDate,
    };

    try {
      UiUtils.setBusy();
      const res = await GolfLockerService.provideLockerForCustomer({ body });
      if (res.isSuccessful) {
        UiUtils.showSuccess("Cấp phát tủ cho khách hàng thành công");
        setLockerAssigned({ ...activeLocker, rentStartDate });
        clearDataCloseModal();
        mainStore.refreshGridData(true);
      }
    } catch (error) {
      console.error("Assign locker failed:", error);
    } finally {
      UiUtils.clearBusy();
    }
  };

  const fetchDataLocker = useCallback(async (body?: OrdPagedRequestDto) => {
    try {
      UiUtils.setBusy();
      const res = await GolfLockerService.getListLockerByLockerGroupPublic({
        body,
      });
      setDataSource(res.items ?? []);
    } catch (error) {
      console.error("Fetch lockers failed:", error);
    } finally {
      UiUtils.clearBusy();
      setActiveLocker({});
    }
  }, []);

  useEffect(() => {
    if (isOpenModal) {
      fetchDataLocker({ type: groupId_w });
    }
  }, [isOpenModal, groupId_w, fetchDataLocker]);
  useEffect(() => {
    setLockerAssigned(props.lockerAssigned);
    if (props.lockerAssigned) {
    }
  }, [props.lockerAssigned]);

  const handleSubmitSearch = (value: any) => {
    fetchDataLocker(value);
  };

  const handleOkModalConfirmCheckout = async () => {
    if (!isOpenModalConfirmCheckout?.lockerId) return;
    UiUtils.setBusy();
    await GolfLockerService.checkedOutLocker({
      lockerId: Number(isOpenModalConfirmCheckout.lockerId),
    })
      .then((res) => {
        if (res.isSuccessful) {
          setLockerAssigned({});
          setIsOpenModalConfirmCheckout({ isOpen: false });
          fromSeach.submit();
          props.onChangeLockerAssignedInrowIdx?.(
            isOpenModalConfirmCheckout.lockerId
          );
          UiUtils.showSuccess("Thu hồi tủ thành công");
        }
      })
      .catch((err) => {
        UiUtils.showError("Xảy ra lỗi trong quá trình thu hồi tủ");
      })
      .finally(() => {
        UiUtils.clearBusy();
      });
  };
  const debouncedHandleOkModal = useMemo(
    () => debounce(handleOkModal, 250),
    [handleOkModal]
  );
  const debouncedHandleSearchSubmit = useMemo(
    () => debounce(handleSubmitSearch, 250),
    [handleSubmitSearch]
  );
  const debouncedHandleOkModalConfirmCheckout = useMemo(
    () => debounce(handleOkModalConfirmCheckout, 250),
    [handleOkModalConfirmCheckout]
  );

  return (
    <>
      <Card
        size={"small"}
        loading={isLoading}
        style={{
          borderRadius: 0,
          // height: props.height,
          height: 375,
          display: "flex",
          flexDirection: "column",
        }}
        styles={{
          body: {
            flex: 1,
            overflowY: "auto",
          },
        }}
        title={
          <>
            <Avatar className="mr-1.5" icon={<UserOutlined></UserOutlined>} />
            {slotInfo.groupName ? (
              <span>
                {slotInfo.groupName}
                {/* <span className='text-sm'>{infoBooking?.isGuest ? infoBooking.guestName : infoBooking?.partnerName}</span> */}
              </span>
            ) : (
              <span>{slotInfo.partnerName}</span>
            )}
          </>
        }
        extra={
          <>
            {/* {isGuest ? <Tag>{t('isGuest')}</Tag> : <Tag className='ml-1' color="green">{t('member')}</Tag>} */}
            {/* {isCardMember && <Tag className='ml-1' color="blue">{t('cardMember')}</Tag>} */}
          </>
        }
      >
        <div className="space-y-2 pt-4">
          <Card
            styles={{
              body: {
                flex: 1,
                overflowY: "auto",
                minHeight: "100px",
              },
            }}
            actions={[
              <Button
                disabled={
                  lockerAssigned === undefined ||
                  lockerAssigned?.lockerId === undefined
                }
                icon={<LogoutOutlined />}
                onClick={() =>
                  setIsOpenModalConfirmCheckout({
                    isOpen: true,
                    lockerId: lockerAssigned?.lockerId,
                    lockerCode: lockerAssigned?.lockerCode,
                    partnerName:
                      lockerAssigned?.partnerName ?? slotInfo.partnerName,
                  })
                }
              >
                Thu hồi tủ
              </Button>,
              <Button
                disabled={
                  lockerAssigned !== undefined &&
                  lockerAssigned?.lockerId !== undefined
                }
                icon={<PlusSquareOutlined />}
                onClick={() => setIsOpenModal(true)}
              >
                Chọn tủ đồ
              </Button>,
            ]}
          >
            <Meta
              title={
                lockerAssigned && lockerAssigned.lockerCode
                  ? `Mã tủ: ${lockerAssigned.lockerCode}`
                  : ""
              }
              description={
                lockerAssigned && lockerAssigned.rentStartDate ? (
                  `Thời gian cấp: ${dateUtil.toFormat(
                    lockerAssigned.rentStartDate
                  )}`
                ) : (
                  <p className="text-center italic">
                    {"chưa sử dụng dịch vụ tủ"}
                  </p>
                )
              }
            />
          </Card>
        </div>
      </Card>
      <Modal
        title={
          <span>{`Cấp phát tủ đồ cho khách hàng : ${slotInfo.partnerName}`}</span>
        }
        open={isOpenModal}
        width={700}
        onCancel={clearDataCloseModal}
        footer={
          <div className="flex flex-wrap items-center justify-between  max-sm:flex-col">
            <div></div>
            <div className="flex items-center crud-modal-footer-btn-group">
              <Button className="me-2" onClick={clearDataCloseModal}>
                <Space.Compact>
                  <Space>
                    <CloseOutlined className="me-1" />
                  </Space>
                  {t("cancelModal")}
                </Space.Compact>
              </Button>
              <Button
                disabled={!activeLocker || !activeLocker?.lockerId}
                type="primary"
                onClick={debouncedHandleOkModal}
              >
                <Space.Compact>
                  <Space>
                    <SaveOutlined className="me-1" />
                  </Space>
                  {t("save")}
                </Space.Compact>
              </Button>
            </div>
          </div>
        }
      >
        <Form
          form={fromSeach}
          layout="vertical"
          onFinish={debouncedHandleSearchSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <FloatLabel label={t("Nhóm tủ đồ")}>
                <Form.Item name="type">
                  <OrdSelect
                    datasource={useSelectGolfLockerGroup(true)}
                    allowClear
                    placeholder={t("Nhóm tủ đồ...")}
                  />
                </Form.Item>
              </FloatLabel>
            </Col>
            <SearchFilterText
              span={12}
              placeHolder={t("Mã tủ...")}
              onSubmit={fromSeach.submit}
            />
          </Row>
        </Form>
        <Card title={"Danh sách tủ đồ"} className="max-h-60 overflow-y-auto">
          {dataSource && dataSource.length > 0 ? (
            dataSource.map((locker: GolfLockerPageDto) => {
              const isActive = activeLocker?.lockerId === locker.id;

              return locker.status === 1 ? (
                <Card.Grid
                  key={locker.id}
                  style={gridStyle}
                  onClick={() =>
                    setIsOpenModalConfirmCheckout({
                      isOpen: true,
                      lockerId: locker.id,
                      lockerCode: locker.code,
                      partnerName: locker.partnerName,
                    })
                  }
                >
                  <Tooltip
                    title={
                      <>
                        <div>
                          {locker.partnerName
                            ? `Khách hàng: ${locker.partnerName}`
                            : ""}
                        </div>
                        <div>
                          {locker.rentStartDate
                            ? `Thời gian: ${dateUtil.toFormat(
                                locker.rentStartDate
                              )}`
                            : ""}
                        </div>
                      </>
                    }
                  >
                    <div>{locker.code}</div>
                    <CheckCircleOutlined />
                    <span className="ml-2">Đang sử dụng</span>
                  </Tooltip>
                </Card.Grid>
              ) : (
                <Card.Grid
                  key={locker.id}
                  onClick={() =>
                    setActiveLocker({
                      lockerId: locker.id,
                      bookingPlayerId: slotInfo.bookingPlayerId,
                      lockerCode: locker.code,
                    })
                  }
                  style={gridStyle}
                  className={isActive ? "text-white bg-green-950" : ""}
                >
                  {locker.code}
                </Card.Grid>
              );
            })
          ) : (
            <Empty />
          )}
        </Card>
      </Modal>
      <Modal
        title={<span>{`Xác nhận thu hồi tủ`}</span>}
        open={isOpenModalConfirmCheckout?.isOpen}
        width={500}
        onCancel={() => setIsOpenModalConfirmCheckout({ isOpen: false })}
        footer={
          <div className="flex flex-wrap items-center justify-between  max-sm:flex-col">
            <div></div>
            <div className="flex items-center crud-modal-footer-btn-group">
              <Button
                className="me-2"
                onClick={() => setIsOpenModalConfirmCheckout({ isOpen: false })}
              >
                <Space.Compact>
                  <Space>
                    <CloseOutlined className="me-1" />
                  </Space>
                  {t("cancelModal")}
                </Space.Compact>
              </Button>
              <Button
                type="primary"
                onClick={debouncedHandleOkModalConfirmCheckout}
              >
                <Space.Compact>
                  <Space>
                    <SaveOutlined className="me-1" />
                  </Space>
                  {t("save")}
                </Space.Compact>
              </Button>
            </div>
          </div>
        }
      >
        <Row align="middle">
          <Col flex="0 1 100px" className="text-center">
            <InfoCircleOutlined style={{ fontSize: 80, color: "#e9890a" }} />
          </Col>
          <Col
            flex="1 1 200px"
            style={{
              fontSize: 20,
              paddingLeft: 12,
              paddingRight: 6,
            }}
          >
            <span>
              Bạn có chắc muốn thu hồi tủ{" "}
              {isOpenModalConfirmCheckout.lockerCode ? (
                <span className="text-bold">
                  {isOpenModalConfirmCheckout.lockerCode}
                </span>
              ) : null}{" "}
              của{" "}
              {isOpenModalConfirmCheckout.partnerName
                ? ` khách hàng : ${isOpenModalConfirmCheckout.partnerName}`
                : null}{" "}
              không?
            </span>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default observer(CardLockerBottom);
