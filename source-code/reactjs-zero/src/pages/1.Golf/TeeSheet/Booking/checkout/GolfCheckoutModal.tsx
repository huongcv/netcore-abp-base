import React, {useEffect, useRef, useState} from "react";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {GolfInfoBeforeCheckoutOutputDto, SaleInvoiceDto} from "@api/index.defs";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Form,
    InputRef,
    Modal,
    Row,
    Space,
    Table,
    Tag,
} from "antd";
import UiUtils from "@ord-core/utils/ui.utils";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";
import {debounce} from "lodash";
import {observer} from "mobx-react-lite";
import {useHotkeys} from "react-hotkeys-hook";
import DateUtil from "@ord-core/utils/date.util";
import {
    CheckInStatusEnum,
    formatTime,
} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {GolfTeeSheetService} from "@api/GolfTeeSheetService";
import MiscItem from "@pages/1.Golf/TeeSheet/Booking/checkout/MiscItem";
import dateUtil from "@ord-core/utils/date.util";
import "./MiscItem.scss"

function GolfCheckoutModal(props: {
    hotkeyScopes: string
}) {
    const {
        golfCheckInOutStore: mainStore,
        golfBookingStore,
        paymentCentralBillingStore: paymentFullStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const [form] = Form.useForm();
    const [checkInForm] = Form.useForm();
    const mode = mainStore.createOrUpdateModal.mode;
    const {entityData} = mainStore.createOrUpdateModal
    const inputRef = useRef<InputRef | null>(null);
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus(); // focus sau khi popover render
        }, 100);
        const fetchFlightInfo = async () => {
            if (entityData) {
                try {
                    const res = await GolfTeeSheetService.getInfoBeforeCheckout(
                        {
                            body: entityData
                        }
                    );
                    setInfo(res);
                } catch (error) {
                    console.error(error);
                } finally {
                }
            }
        };
        fetchFlightInfo();
    }, [mode, entityData])

    const [isLoading, setIsLoading] = useState<boolean>();
    const [findCardStatus, setFindCardStatus] = useState<number>(0);
    const [info, setInfo] = useState<GolfInfoBeforeCheckoutOutputDto | null>();
    const {playerInfo: memberInfo, bookingInfo, listMiscItem, listPlayer, lockerInfo} = info ?? {};

    useEffect(() => {
        form.setFieldValue("lockerIdCheckOut", lockerInfo?.lockerId ?? null)
    }, [lockerInfo])
    //#region Tab Player
    const returnItemAndCheckout = async () => {
        try {
            const data = await form.validateFields();
            console.log("  listReturnItem: data.listReturnItem", data.listReturnItem);
            if (bookingInfo?.bookingPlayerId) {
                setIsLoading(true);

                GolfTeeSheetService.returnItemAndLocker({
                    body: {
                        bookingId: entityData?.bookingId,
                        bookingGroupId: entityData?.bookingGroupId,
                        bookingPlayerId: entityData?.bookingPlayerId,
                        listReturnItem: data.listReturnItem,
                        lockerIdCheckOut: data.lockerIdCheckOut ?? null
                    },
                }).then(
                    (res) => {
                        if (res.isSuccessful) {
                            mainStore.closeModal();
                            entityData?.onReturnSuccess();
                            // UiUtils.showSuccess(t("checkOutSuccess"));
                        } else {
                            UiUtils.showError(res.message);
                        }
                    },
                    (e) => {
                        UiUtils.showCatchError(e);
                    }
                );
            } else {
                UiUtils.showError(t("checkInNotAllowed"));
            }
        } catch (error) {
            UiUtils.showCommonValidateForm();
        }
    };

    useHotkeys(
        "F8",
        (event) => {
            returnItemAndCheckout();
            event.preventDefault();
        },
        {scopes: [props.hotkeyScopes], enableOnFormTags: true}
    );
    useHotkeys(
        "F10",
        (event) => {
            mainStore.closeModal();
            event.preventDefault();
        },
        {scopes: [props.hotkeyScopes], enableOnFormTags: true}
    );
    return (
        <div>
            <Modal
                title={<span>{t("titleCheckoutModal")}</span>}
                open={mainStore.createOrUpdateModal.visible}
                width={1400}
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
                                        <CloseOutlined className="me-1"/>
                                    </Space>
                                    {t("cancelModal")} (F10)
                                </Space.Compact>
                            </Button>
                            <Button
                                loading={isLoading}
                                type="primary"
                                onClick={debounce(() => {
                                    returnItemAndCheckout();
                                }, 250)}
                            >
                                <Space.Compact>
                                    {" "}
                                    <Space>
                                        <SaveOutlined className="me-1"/>
                                    </Space>
                                    {t("returnAndCheckout")} (F8)
                                </Space.Compact>
                            </Button>
                        </div>
                    </div>
                }
            >
                <Row gutter={[16, 8]}>
                    <Col span={12} className="mb-2">
                        <Row gutter={[16, 8]}>
                            <Col span={24}>
                                {memberInfo && (
                                    <Card
                                        title="Thông tin thành viên"
                                        className="shadow-md rounded-xl"
                                    >
                                        <Descriptions column={2} bordered size="small">
                                            <Descriptions.Item label="Tên">
                                                {memberInfo.partnerName ?? memberInfo.gustName}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Giới tính">
                                                {tEnum("GENDER." + memberInfo.gender) ?? "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Số điện thoại">
                                                {memberInfo.phone ?? "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Loại">
                                                {memberInfo.isGuest ? (
                                                    <Tag>{t("isGuest")}</Tag>
                                                ) : (
                                                    <Tag className="ml-1" color="green">
                                                        {t("member")}
                                                    </Tag>
                                                )}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                )}
                            </Col>
                            <Col span={24}>
                                {bookingInfo && (
                                    <Card
                                        title="Thông tin booking"
                                        className="shadow-md rounded-xl"
                                    >
                                        <Descriptions column={2} bordered size="small">
                                            <Descriptions.Item label="Ngày đặt">
                                                <div>
                                                    {bookingInfo.bookingDate
                                                        ? DateUtil.toFormat(
                                                            bookingInfo.bookingDate,
                                                            "DD/MM/YYYY HH:mm"
                                                        )
                                                        : "—"}
                                                </div>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Tổng số người chơi">
                                                {bookingInfo.totalPlayers}
                                            </Descriptions.Item>

                                            <Descriptions.Item label="TeeTime">
                                                <div>{formatTime(bookingInfo.teeTime)}</div>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Sân">
                                                {bookingInfo.courseName}
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Chơi chung flight">
                                                {bookingInfo.isSharedFlight ? "Có" : "Không"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Loại game">
                                                {tEnum("GameTypeEnum." + bookingInfo.gameType)}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Người yêu cầu">
                                                {bookingInfo.requestedBy ?? "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="SĐT liên hệ">
                                                {bookingInfo.contactNo ?? "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item span={2} label="Ghi chú">
                                                {bookingInfo.note ?? "—"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Trạng thái booking">
                                                {tEnum("BookingStatusEnum." + bookingInfo.status)}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Thời gian xác nhận">
                                                <div>
                                                    {bookingInfo.comfirmedDate
                                                        ? DateUtil.toFormat(
                                                            bookingInfo.comfirmedDate,
                                                            "DD/MM/YYYY HH:mm"
                                                        )
                                                        : "—"}
                                                </div>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Trạng thái Checkin">
                                                {tEnum(
                                                    "CheckinStatusEnum." + bookingInfo.checkInStatus
                                                )}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Thời gian checkin">
                                                <div>
                                                    {bookingInfo.checkInTime &&
                                                    bookingInfo.checkInStatus ==
                                                    CheckInStatusEnum.Checkedin
                                                        ? DateUtil.toFormat(
                                                            bookingInfo.checkInTime,
                                                            "DD/MM/YYYY HH:mm"
                                                        )
                                                        : "—"}
                                                </div>
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} className="mb-2">
                        <Card title="Thông đồ đã thuê" className="shadow-md rounded-xl ant-card-cus-checkout-modal">
                            <Form layout="vertical" form={form}>
                                <MiscItem
                                    value={[]}
                                    onChange={(val) => {
                                    }}
                                    dataSource={listMiscItem ?? []}
                                ></MiscItem>
                                {lockerInfo ? (<>
                                        <Table
                                            columns={[
                                                {
                                                    title: "Mã tủ",
                                                    dataIndex: "lockerCode",
                                                    key: "lockerCode",
                                                },
                                                {
                                                    title: "Thời gian",
                                                    dataIndex: "rentStartDate",
                                                    key: "rentStartDate",
                                                    render: (v) =>
                                                        v != null ? dateUtil.toFormat(v) : <></>,
                                                },
                                                {
                                                    title: "Ghi chú",
                                                    dataIndex: "notes",
                                                    key: "notes",
                                                },
                                            ]}
                                            bordered
                                            title={() => <div className="!px-3 !py-2">{`Tủ đồ`}</div>}
                                            pagination={false}
                                            className="ant-cus-golf-checkout-modal"
                                            dataSource={[{...lockerInfo}]}
                                        />
                                        <Form.Item noStyle hidden name="lockerIdCheckOut"></Form.Item>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}

export default observer(GolfCheckoutModal);
