import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {
    CruPrivateBookingDto,
    MemberInfoByCardBookingOutputDto,
    MemberInfoByCardMemberOutputDto,
    MemberInfoByCardOutputDto, SaleInvoiceDto
} from "@api/index.defs";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Descriptions,
    Empty,
    Form,
    Input,
    InputRef,
    Modal,
    QRCode,
    Row,
    Select,
    Space
} from "antd";
import UiUtils from "@ord-core/utils/ui.utils";
import {CloseOutlined, QrcodeOutlined, SaveOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {
    useGolfAccessCardAvailable
} from "@ord-components/forms/select/selectDataSource/golf/useGolfAccessCardAvailable";
import {observer} from "mobx-react-lite";
import {useHotkeys} from "react-hotkeys-hook";
import {CardIcon} from "@ord-components/icon/CardIcon";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {CheckInService} from "@api/CheckInService";
import ValidateUtils from "@ord-core/utils/validate.utils";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";
import BookingDetailForm from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/BookingDetailForm";
import BookingServiceInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/BookingServiceInfo";
import PaymentInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/PaymentInfo";
import DateUtil from "@ord-core/utils/date.util";
import {BookIcon} from "@ord-components/icon/BookIcon";
import {
    AccessCardStatusEnum,
    BookingStatusEnum,
    CheckInStatusEnum,
    formatTime
} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import NotFoundPage from "@ord-components/common/NotFoundPage";
import {NotFoundIcon} from "@ord-components/icon/NotFoundIcon";
import {GolfTeeSheetService} from "@api/GolfTeeSheetService";
import {IGolfCheckoutInputProps} from "@ord-store/Golf/TeeSheet/Booking/GolfCheckInOutStore";
import {extShowAfterCheckOutModal} from "@pages/1.Golf/TeeSheet/Booking/checkout/FunctionComfirmCheckOutModal";

function GolfCheckInModal(props: {
    hotkeyScopes: string,
}) {
    const {
        golfBookingStore: mainStore,
        golfCheckInOutStore,
        paymentCentralBillingStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const [form] = Form.useForm();
    const [checkInForm] = Form.useForm();
    const mode = mainStore.checkInModal.mode;
    const {entityData} = mainStore.checkInModal
    const inputRef = useRef<InputRef | null>(null);
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus(); // focus sau khi popover render
        }, 100);
        const fetchFlightInfo = async () => {
        };
        form.setFieldValue('checkInNow', sessionStorage.getItem("checkInNow") === 'true');
        fetchFlightInfo();
    }, [mode, entityData])
    const [isLoading, setIsLoading] = useState<boolean>();
    const [allowCheckIn, setAllowCheckin] = useState<boolean>(false);
    const [allowCheckOut, setAllowCheckout] = useState<boolean>(false);
    const [findCardStatus, setFindCardStatus] = useState<number>(0);
    const [info, setInfo] = useState<MemberInfoByCardOutputDto | null>();
    const {memberInfo, bookingInfo} = info ?? {};
    //#region Tab Player
    const onCheckInNow = (bookingPlayerId: number) => {
        if (bookingPlayerId) {
            setIsLoading(true);
            UiUtils.setBusy();
            golfCheckInOutStore.playerCheckIn(bookingPlayerId)
                .then(res => {
                    if (res.isSuccessful) {
                        UiUtils.showSuccess(t("checkinSuccess"));
                        Object.entries(mainStore.teeTimeMap)
                            .forEach(([key, value]) => {
                                mainStore.refreshTeeTimeData(parseInt(key));
                            })
                        mainStore.closeCheckInModal();
                        UiUtils.clearBusy()
                        setIsLoading(false);
                    } else {
                        UiUtils.clearBusy()
                        setIsLoading(false);
                        UiUtils.showError(res.message);
                    }
                })
        } else {
            UiUtils.showError(t("checkInNotAllowed"));
        }
    }

    function showCheckoutModal(_bookingInfo: MemberInfoByCardBookingOutputDto,   _memberInfo?: MemberInfoByCardMemberOutputDto) {
        if(_bookingInfo)
            extShowAfterCheckOutModal({
                bookingGroupId: _bookingInfo?.bookingGroupId,
                bookingPlayerId: _bookingInfo.bookingPlayerId,
                bookingId: _bookingInfo.id,
                partnerName: _memberInfo?.partnerName,
                checkInOutStore: golfCheckInOutStore,
                centralBillingStore: paymentCentralBillingStore,
                partnerId: _bookingInfo.partnerId,
                mainInvoiceId: _bookingInfo?.tempInvoiceId,
                callBackTimeCheckout: (timeCheckOut)=>{
                    mainStore.refreshTeeTimeAll();
                }
            });
    }

    const onStartCheckCard = async () => {
        try {
            const data = await form.validateFields();
            UiUtils.setBusy();
            setIsLoading(true);

            const res = await CheckInService.getMemberInfoByCard({ body: data });

            // setTimeout(()=>{
            //     form.setFieldsValue({ cardCode: '' });
            // })
            if (res.isSuccessful && res.data) {
                UiUtils.showSuccess(t("checkSuccess"));
                // form.resetFields(['cardCode']);
                setInfo(res.data);
                setFindCardStatus(1);

                const bookingInfo = res.data.bookingInfo;
                const memberInfo = res.data.memberInfo;

                if (!bookingInfo || !memberInfo) {
                    UiUtils.showError(t("notFoundBookingInfo"));
                    return;
                }

                const canCheckIn = bookingInfo.status !== BookingStatusEnum.Cancelled
                    && memberInfo.accessStatus === AccessCardStatusEnum.Assigned
                    && bookingInfo.checkInStatus === CheckInStatusEnum.Notcheckedin;

                const canCheckOut = bookingInfo.status !== BookingStatusEnum.Cancelled
                    && memberInfo.accessStatus === AccessCardStatusEnum.Assigned
                    && bookingInfo.checkInStatus === CheckInStatusEnum.Checkedin;
                setAllowCheckin(canCheckIn);
                setAllowCheckout(canCheckOut);

                console.log("dataCheck",data )
                if(data.checkInNow){
                    if (canCheckIn) {
                        onCheckInNow(parseInt(bookingInfo.bookingPlayerId??""));
                    } else if (canCheckOut) {
                        showCheckoutModal(bookingInfo);
                    } else {
                        UiUtils.showError(t("checkInNotAllowed"));
                    }
                }
            } else {
                setInfo(null);
                setFindCardStatus(2);
                UiUtils.showError(res.message);
            }

        } catch (error) {
            UiUtils.showCommonValidateForm();
        } finally {
            setIsLoading(false);
            UiUtils.clearBusy();
        }
    };

    const debouncedFetch = useMemo(() => debounce(onStartCheckCard, 600), []);
    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);
    //
    function openCheckinCheckOut() {
        if(bookingInfo){
            if (allowCheckIn) {
                onCheckInNow(parseInt(bookingInfo.bookingPlayerId??""))
            } else {
                if (allowCheckOut)
                    showCheckoutModal(bookingInfo);
            }
        }
    }

    useHotkeys('F8', (event) => {
        openCheckinCheckOut();
        event.preventDefault();
    }, {scopes: [props.hotkeyScopes], enableOnFormTags: true})
    useHotkeys('F10', (event) => {
        mainStore.closeCheckInModal()
        event.preventDefault();
    }, {scopes: [props.hotkeyScopes], enableOnFormTags: true})
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedFetch();
    };
    return (
        <div>
            <Modal
                title={<span>{t("titleCheckinModal")}</span>}
                open={mainStore.checkInModal.visible}
                width={800}
                onCancel={() => {
                    mainStore.closeCheckInModal();
                }}
                footer={<div
                    className="flex flex-wrap items-center justify-between  max-sm:flex-col">
                    <div>
                    </div>
                    <div className="flex items-center crud-modal-footer-btn-group">
                        <Button className='me-2' onClick={() => mainStore.closeCheckInModal()}>
                            <Space.Compact><Space><CloseOutlined className="me-1"/></Space>{t('cancelModal')} (F10)
                            </Space.Compact>
                        </Button>
                        <Button loading={isLoading} type='primary'
                                disabled={(!allowCheckIn && !allowCheckOut) || !memberInfo}
                                onClick={debounce(() => {
                                    openCheckinCheckOut();
                                }, 250)}>
                            <Space.Compact> <Space><SaveOutlined
                                className="me-1"/></Space>
                                {allowCheckOut ? t('checkout') : t('checkin')} (F8)
                            </Space.Compact>
                        </Button>
                    </div>
                </div>}
            >
                <Form layout="vertical" form={form}
                      onFinish={debouncedFetch}
                      initialValues={{
                          checkInTime: new Date()
                      }}
                >
                    <Row gutter={16}>
                        <Col span={14}>
                            <FloatLabel
                                required
                                label={t('checkInTime')}>
                                <Form.Item name='checkInTime' rules={[ValidateUtils.required]}>
                                    <OrdDateInput allowClear={false}></OrdDateInput>
                                </Form.Item>
                            </FloatLabel>

                        </Col>
                        <Col span={10}>
                            <Form.Item  name='checkInNow' valuePropName="checked">
                                <Checkbox onChange={(e)=>{
                                    sessionStorage.setItem("checkInNow", e.target.checked.toString());
                                }}>{t('checkInCheckoutNow')}</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <FloatLabel required
                                label={t('memberCardInformation')}>
                        <Form.Item name='cardCode' rules={[ValidateUtils.required]}>
                            <Space.Compact style={{width: '100%'}}>
                                <Input
                                    autoFocus
                                    onChange={handleChange}
                                    prefix={<QrcodeOutlined/>}></Input>
                                <Button
                                    loading={isLoading} htmlType='submit' type="primary">
                                    <SearchOutlined></SearchOutlined>
                                </Button>
                            </Space.Compact>
                        </Form.Item>
                    </FloatLabel>

                </Form>
                {!info && findCardStatus == 0 && <Empty description={t("pleaseEnterCardIdToCheckIn")}
                                                        image={<CardIcon width={100} height={100}></CardIcon>}/>}
                {findCardStatus == 2 && <Empty description={t("notFoundCardId")}
                                               image={<NotFoundIcon width={100} height={100}></NotFoundIcon>}/>}

                {memberInfo && <div className="p-4 space-y-4">
                    <Card title="Thông tin thành viên" className="shadow-md rounded-xl">
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Tên">{memberInfo.name}</Descriptions.Item>
                            <Descriptions.Item
                                label="Giới tính">{tEnum("GENDER." + memberInfo.gender) ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{memberInfo.phone ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="Mã thẻ">{memberInfo.code}</Descriptions.Item>
                            <Descriptions.Item label="UID">{memberInfo.uid}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian hiệu lực">
                                <div>{memberInfo.startDate ? DateUtil.toFormat(memberInfo.startDate, "DD/MM/YYYY") : '—'} →
                                    {memberInfo.endDate ? DateUtil.toFormat(memberInfo.endDate, "DD/MM/YYYY") : '—'}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>


                    {bookingInfo && <Card title="Thông tin booking" className="shadow-md rounded-xl">
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Ngày đặt">
                                <div>{bookingInfo.bookingDate ? DateUtil.toFormat(bookingInfo.bookingDate, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng số người chơi">{bookingInfo.totalPlayers}</Descriptions.Item>

                            <Descriptions.Item label="TeeTime">
                                <div>{formatTime(bookingInfo.teeTime)}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Sân">{bookingInfo.courseName}</Descriptions.Item>

                            <Descriptions.Item label="Chơi chung flight">
                                {bookingInfo.isSharedFlight ? 'Có' : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Loại game">{tEnum("GameTypeEnum." + bookingInfo.gameType)}</Descriptions.Item>
                            <Descriptions.Item
                                label="Người yêu cầu">{bookingInfo.requestedBy ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="SĐT liên hệ">{bookingInfo.contactNo ?? '—'}</Descriptions.Item>
                            <Descriptions.Item span={2} label="Ghi chú">{bookingInfo.note ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái booking">
                                {tEnum("BookingStatusEnum." + bookingInfo.status)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian xác nhận">
                                <div>{bookingInfo.comfirmedDate ? DateUtil.toFormat(bookingInfo.comfirmedDate, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái Checkin">
                                {tEnum("CheckinStatusEnum." + bookingInfo.checkInStatus)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian checkin">
                                <div>{bookingInfo.checkInTime && bookingInfo.checkInStatus == CheckInStatusEnum.Checkedin ? DateUtil.toFormat(bookingInfo.checkInTime, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái Checkout">
                                {bookingInfo.checkOutTime ? t('isCheckout') : t('isNotCheckout')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian Checkout">
                                <div>{bookingInfo.checkOutTime ? DateUtil.toFormat(bookingInfo.checkOutTime, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>}
                    {!bookingInfo && <Empty description={t("notFoundBookingInfo")}
                                            image={<BookIcon width={100} height={100}></BookIcon>}/>}
                </div>}
            </Modal>

        </div>
    );
}

export default observer(GolfCheckInModal);
