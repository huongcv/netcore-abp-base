import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tabs,
} from "antd";
import { useStore } from "@ord-store/index";
import { useNavigate } from "react-router-dom";
import {
  BookOutlined,
  CheckOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import BookingDetailForm from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/BookingDetailForm";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import OrdSelect, {
  IOrdSelectOption,
} from "@ord-components/forms/select/OrdSelect";
import BookingServiceInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/BookingServiceInfo";
import UiUtils from "@ord-core/utils/ui.utils";
import PaymentInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/PaymentInfo";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { ComboOptionDto, CruPrivateBookingDto } from "@api/index.defs";
import { debounce } from "lodash";
import { CardIcon } from "@ord-components/icon/CardIcon";
import InvoiceOfPlayer from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/InvoiceOfPlayer";
import { PaymentModeEnum } from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";
import GolfPlayerPartnerInput from "@pages/1.Golf/shared/components/GolfPlayerPartnerInput";
import { checkPermissionUser } from "@ord-core/utils/auth.utils";
import { PARTNER_PER } from "@ord-core/config/permissions/partner.permission";
import { useSelectCountry } from "@ord-components/forms/select/selectDataSource/useSelectCountry";
import { CodeCountryVietNam } from "@ord-core/AppConst";

const CruNewBooking = (props: {}) => {
  const { golfBookingStore: mainStore, sessionStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tEnum } = useTranslation("enum");
  const navigate = useNavigate();
  const [updateDto, setUpdateDto] = useState<CruPrivateBookingDto>({});
  const [form] = Form.useForm();
  const [formInvoice] = Form.useForm();
  const mode = mainStore.createOrUpdateModal.mode;
  const {
    bookingTeeTimeId,
    boardId,
    courseId,
    playerNo,
    playDate,
    startTime,
    partnerId,
    isAutoGetTeeTime, // stage cho việc booking icon user ở header indexFull
    flightId,
  } = mainStore.createOrUpdateModal.entityData;
  const [sourceTeeTime, setSourceTeeTime] = useState<SelectDataSource>({
    data: [],
    isPending: true,
  });
  const [sourceGameTypeAllow, setSourceGameTypeAllow] =
    useState<SelectDataSource>({
      data: [],
      isPending: true,
    });
  const [srcGroupBooking, setSrcGroupBooking] = useState<SelectDataSource>({
    data: [],
    isPending: true,
  });
  const srcCountry = useSelectCountry();

  const isGuest_w = Form.useWatch("isGuest", form);
  const isShowDropdownPartner = checkPermissionUser(
    sessionStore.appSession,
    PARTNER_PER.viewCustomerList
  );
  useEffect(() => {
    const fetchFlightInfo = async () => {
      UiUtils.setBusy();
      const isCreate = mode === "addNew";
      const res = await mainStore.getFlightInfoByFilter(
        courseId,
        playDate,
        isCreate
      );

      const teeTimeData: IOrdSelectOption[] =
        res.listTeeTime?.map((x) => ({
          value: x.value,
          label: (
            <div className="flex justify-between">
              <span>{x.displayName}</span>
              <span>Còn {x.data.availableSlots} chỗ</span>
            </div>
          ),
          fts: Utils.toLowerCaseNonAccentVietnamese(x.displayName),
        })) || [];

      const gameTypeAllowData: IOrdSelectOption[] =
        res.gameTypeAllow?.map((x) => ({
          value: x.value,
          label: tEnum(x.displayName ?? ""),
          fts: Utils.toLowerCaseNonAccentVietnamese(x.displayName),
        })) || [];
      const grBooking: IOrdSelectOption[] =
        res.listGoflerGroup?.map((x) => ({
          value: parseInt(x.value),
          label: tEnum(x.displayName ?? ""),
          fts: Utils.toLowerCaseNonAccentVietnamese(x.displayName),
        })) || [];

      setSourceTeeTime({ data: teeTimeData, isPending: false });
      setSourceGameTypeAllow({ data: gameTypeAllowData, isPending: false });
      setSrcGroupBooking({ data: grBooking, isPending: false });

      if (isCreate) {
        form.setFieldsValue({
          courseId,
          playDate: res.playDate,
          gameType: res.gameType,
          teeTime: isAutoGetTeeTime
            ? getNextAvailableTeeTime(res.listTeeTime ?? [])
            : startTime,
        });
        formInvoice.setFieldsValue({
          paymentMode: PaymentModeEnum.PayLater,
          saleInvoiceDetails: res.saleInvoiceDetails ?? [],
        });
      } else {
        const booking = await mainStore.getPrivateBooking(bookingTeeTimeId);
        setUpdateDto(booking);
        form.setFieldsValue(booking);
        formInvoice.setFieldsValue({
          paymentMode: PaymentModeEnum.PayLater,
          saleInvoiceDetails: [],
        });
      }
      UiUtils.clearBusy();
    };

    fetchFlightInfo();
  }, [mode, courseId]);
  useEffect(() => {
    if (partnerId) form.setFieldValue("partnerId", partnerId);
  }, [partnerId]);

  function getNextAvailableTeeTime(
    listTeeTime: ComboOptionDto[]
  ): string | null {
    const now = new Date();
    const nowSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    //Lọc và sắp xếp danh sách teeTime >= thời gian hiện tại
    const sortedFutureTeeTimes = listTeeTime
      .map((item) => ({
        ...item,
        seconds: timeStrToSeconds(item.value),
      }))
      .filter((item) => item.seconds >= nowSeconds)
      .sort((a, b) => a.seconds - b.seconds);

    // Tìm teeTime đầu tiên có slot trống
    for (const tee of sortedFutureTeeTimes) {
      const { listAvailableSlots, availableSlots } = tee.data;

      if (availableSlots > 0 && listAvailableSlots.trim() !== "")
        return tee.value;
    }

    return null; // Không tìm thấy teeTime phù hợp
  }

  // Helper chuyển "HH:mm:ss" thành giây
  function timeStrToSeconds(timeStr: string): number {
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  }

  //#region Tab Player
  const onOkModal = async (
    createMode: "save" | "saveAndComfirm" | "saveAndCheckIn"
  ) => {
    try {
      const data = await form.validateFields();
      const dataInvoice = await formInvoice.validateFields();
      UiUtils.setBusy();
      mainStore
        .createOrUpdate({
          ...updateDto,
          ...data,
          courseId: courseId,
          playerNo: playerNo,
          createInvoice: dataInvoice,
          paymentMode: dataInvoice.paymentMode,
          createMode: createMode,
        })
        .then(
          (res) => {
            if (res.isSuccessful) {
              UiUtils.showSuccess(res.message);
              // navigate(-1)
              mainStore.closeModal();
              mainStore.refreshTeeTimeData(boardId);
              if (
                createMode === "saveAndCheckIn" &&
                res.data &&
                res.data.bookingPlayerId &&
                !res.data.memberAccessCardId
              ) {
                UiUtils.showConfirm({
                  title: t("checkDontHaveAccessCard"),
                  icon: "custome",
                  customIcon: <CardIcon width={100} height={100} />,
                  content: (
                    <>
                      Khách hàng chưa được cấp thẻ RFID, bạn có muốn cập nhật
                      thẻ RFID cho khách hàng này ngay không?
                    </>
                  ),
                  // okLabel: "Checkin",
                  onOk: (d) => {
                    if (res.data?.bookingPlayerId)
                      mainStore.openManagerCardPlayerModalModal(
                        boardId,
                        res.data?.bookingPlayerId
                      );
                  },
                  onCancel: () => {},
                });
              }
            } else {
              UiUtils.showError(res.message);
            }
          },
          (err) => {
            UiUtils.showCatchError(err);
            UiUtils.clearBusy();
          }
        );
    } catch (errorInfo) {
      UiUtils.showCommonValidateForm();
      UiUtils.clearBusy();
    }
  };

  return (
    <div>
      <Modal
        title={
          <span>
            {mainStore.createOrUpdateModal.mode == "addNew"
              ? t("newBooking")
              : t("editBooking")}
          </span>
        }
        open={mainStore.createOrUpdateModal.visible}
        width="1024px"
        onCancel={() => {
          mainStore.closeModal();
        }}
        footer={
          <div className="flex flex-wrap items-center justify-between  max-sm:flex-col">
            <div></div>
            <div className="flex items-center crud-modal-footer-btn-group">
              <Button className="me-2" onClick={() => mainStore.closeModal()}>
                <Space.Compact>
                  <Space>
                    <CloseOutlined className="me-1" />
                  </Space>
                  {t("cancelModal")} (F10)
                </Space.Compact>
              </Button>
              {mainStore.createOrUpdateModal.mode === "addNew" && (
                <>
                  <Button
                    className={`me-2 btn-secondary`}
                    type="primary"
                    onClick={debounce(() => {
                      onOkModal("saveAndCheckIn");
                    }, 50)}
                  >
                    <Space.Compact>
                      {" "}
                      <Space>
                        <BookOutlined className="me-1" />
                      </Space>
                      {t("saveAndCheckin")}{" "}
                    </Space.Compact>
                  </Button>
                  <Button
                    className="me-2 btn-secondary"
                    type="primary"
                    onClick={debounce(() => {
                      onOkModal("save");
                    }, 50)}
                  >
                    <Space.Compact>
                      {" "}
                      <Space>
                        <SaveOutlined className="me-1" />
                      </Space>
                      {t("save")}
                    </Space.Compact>
                  </Button>
                  <Button
                    type="primary"
                    onClick={debounce(() => {
                      onOkModal("saveAndComfirm");
                    }, 50)}
                  >
                    <Space.Compact>
                      {" "}
                      <Space>
                        <CheckOutlined className="me-1" />
                      </Space>
                      {t("saveAndConfirm")} (F8)
                    </Space.Compact>
                  </Button>
                </>
              )}
              {mainStore.createOrUpdateModal.mode === "update" && (
                <>
                  <Button
                    className="me-2"
                    type="primary"
                    onClick={debounce(() => {
                      onOkModal("save");
                    }, 50)}
                  >
                    <Space.Compact>
                      {" "}
                      <Space>
                        <SaveOutlined className="me-1" />
                      </Space>
                      {t("save")} (F8)
                    </Space.Compact>
                  </Button>
                </>
              )}
            </div>
          </div>
        }
        // okText={t('actionBtn.save')}
        // onOk={() => onOkModal()}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            customers: [{}], // bắt đầu với 1 khách mặc định
          }}
        >
          <Row gutter={[16, 8]}>
            <Col span={8}>
              {/* Thông tin Golfer */}
              <Card
                title={<strong>{t("golferInfo")}</strong>}
                styles={{
                  header: {
                    borderBottom: "none",
                    marginTop: "10px",
                  },
                }}
              >
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <FloatLabel label={t("code")}>
                      <Form.Item name="code">
                        <Input disabled></Input>
                      </Form.Item>
                    </FloatLabel>
                  </Col>

                  <Col span={24}>
                    <FloatLabel label={t("partnerName")} required={true}>
                      {!isGuest_w && (
                        <Form.Item
                          name="partnerId"
                          rules={[ValidateUtils.required]}
                        >
                          <GolfPlayerPartnerInput
                            autoFocus
                            placeholder={t("searchInputCustomerPlaceholder")}
                            //usingqrsearch={true}
                            partner_type={1}
                            onChange={(val, op) => {
                                if (op && op)
                                    form.setFieldsValue({
                                        requestedBy: op?.name,
                                        contactNo: op?.phone,
                                    })
                            }}
                            // onChange={(op) => {
                            //   if (op)
                            //     form.setFieldsValue({
                            //       requestedBy: op?.name,
                            //       contactNo: op?.phone,
                            //     });
                            // }}
                          ></GolfPlayerPartnerInput>
                        </Form.Item>
                      )}
                      {isGuest_w && (
                        <Form.Item
                          name="guestName"
                          rules={[ValidateUtils.required]}
                        >
                          <Input></Input>
                        </Form.Item>
                      )}
                    </FloatLabel>
                  </Col>
                  {/*<Col span={24}>*/}
                  {/*    <FloatLabel label={t('partnerType')}>*/}
                  {/*        <Form.Item name='partnerType'>*/}
                  {/*            <Input disabled></Input>*/}
                  {/*        </Form.Item>*/}
                  {/*    </FloatLabel>*/}
                  {/*</Col>*/}
                  {!isGuest_w && (
                    <Col span={24}>
                      <FloatLabel label={t("nationId")}>
                        <Form.Item
                          name="nationId"
                          initialValue={CodeCountryVietNam}
                        >
                          <OrdSelect datasource={srcCountry}></OrdSelect>
                          {/*<OrdSelect datasource={}> </OrdSelect>*/}
                        </Form.Item>
                      </FloatLabel>
                    </Col>
                  )}

                  <Col span={24}>
                    <FloatLabel label={t("memberGustOf")} required={false}>
                      <Form.Item name="memberGustOf">
                        <Input></Input>
                        {/*<PartnerInput hiddenAddNewBtn={true} partner_type={1}></PartnerInput>*/}
                      </Form.Item>
                    </FloatLabel>
                  </Col>

                  {/*<Col span={12}>*/}
                  {/*    <FloatLabel>*/}
                  {/*        <Form.Item name="isVip" valuePropName="checked">*/}
                  {/*            <Checkbox>{t('isVip')}</Checkbox>*/}
                  {/*        </Form.Item>*/}
                  {/*    </FloatLabel>*/}
                  {/*</Col>*/}
                  {mainStore.createOrUpdateModal.mode !== "addNew" && (
                    <Col span={12}>
                      <FloatLabel>
                        <Form.Item name="isGuest" valuePropName="checked">
                          <Checkbox>{t("isGuest")}</Checkbox>
                        </Form.Item>
                      </FloatLabel>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>

            <Col span={16}>
              {/* Thông tin đặt lịch */}
              <BookingDetailForm
                srcGroupBooking={srcGroupBooking}
                sourceGameTypeAllow={sourceGameTypeAllow}
                dataSourceTeeTime={sourceTeeTime}
              ></BookingDetailForm>
            </Col>
          </Row>
        </Form>
        <Form form={formInvoice}>
          <Row gutter={16}>
            {mainStore.createOrUpdateModal.mode === "addNew" && (
              <>
                <Col span={16}>
                  <BookingServiceInfo totalPlayers={1}></BookingServiceInfo>
                </Col>
                <Col span={8}>
                  <PaymentInfo></PaymentInfo>
                </Col>
              </>
            )}
          </Row>
          {mainStore.createOrUpdateModal.mode !== "addNew" && (
            <>
              <Tabs
                className="w-full"
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: t("chargeInfo"),
                    children: (
                      <InvoiceOfPlayer
                        viewInvoice={updateDto.viewInvoice ?? []}
                      ></InvoiceOfPlayer>
                    ),
                  },
                  {
                    key: "2",
                    label: t("registerService"),
                    children: (
                      <Row gutter={16}>
                        <Col span={16}>
                          <BookingServiceInfo totalPlayers={1}></BookingServiceInfo>
                        </Col>
                        <Col span={8}>
                          <PaymentInfo></PaymentInfo>
                        </Col>
                      </Row>
                    ),
                  },
                ]}
              />
            </>
          )}
        </Form>
      </Modal>

      {/*<InvoiceDetailForm modalKey={'modalViewInvoiceGolf'}*/}
      {/*                   ref={invoiceDetailRef} />*/}
    </div>
  );
};

export default CruNewBooking;
