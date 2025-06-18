import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {TimeSpan} from "@api/index.defs";
import {Button, Col, Form, Modal, Row, Space, Steps} from "antd";
import {useStore} from "@ord-store/index";
import {CheckOutlined, CloseOutlined, SaveOutlined, StepBackwardOutlined, StepForwardOutlined} from "@ant-design/icons";
import {debounce} from "lodash";
import BookingServiceInfo, {} from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/BookingServiceInfo";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import UiUtils from "@ord-core/utils/ui.utils";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import Utils from "@ord-core/utils/utils";
import BookingGroupDetailForm from "@pages/1.Golf/TeeSheet/Booking/Crud/GroupBooking/BookingGroupDetailForm";
import GroupBookingPaymentInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/GroupBooking/GroupBookingPaymentInfo";
import {PaymentModeEnum} from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";
import GroupPlayerInfo, {fieldListPlayer} from "@pages/1.Golf/TeeSheet/Booking/Crud/GroupBooking/GroupPlayerInfo";

import PaymentBookingGroupInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/GroupBooking/PaymentBookingGroupInfo";
import {
    extraService,
    serviceUsingFieldName
} from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/fieldConst";

export interface ICreateGroupBookingProps {
    boardId: number
    courseId: string | undefined
    playerNo: number | undefined
    playDate: Date | undefined
    startTime: TimeSpan | undefined
}

function CreateGroupBooking() {
    const {
        golfBookingStore: mainStore,
        sessionStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const [form] = Form.useForm();
    const [formInvoice] = Form.useForm();
    const [sourceTeeTime, setSourceTeeTime] = useState<SelectDataSource>({
        data: [],
        isPending: true
    });
    const [discountPercentMain, setDiscountPercentMain] = useState<number>();

    const [sourceGameTypeAllow, setSourceGameTypeAllow] = useState<SelectDataSource>({
        data: [],
        isPending: true
    });
    const mode = mainStore.groupBookingModal.mode;
    const {
        boardId,
        courseId,
        playerNo,
        playDate,
        startTime,
    } = mainStore.groupBookingModal.entityData as ICreateGroupBookingProps
    useEffect(() => {
        const fetchFlightInfo = async () => {
            UiUtils.setBusy();
            const isCreate = mode === "addNew";
            const res = await mainStore.getFlightInfoByFilter(courseId, playDate as Date, false);

            const teeTimeData: IOrdSelectOption[] = res.listTeeTime?.map(x => ({
                value: x.value,
                label: (
                    <div className='flex justify-between'>
                        <span>{x.displayName}</span>
                        <span>Còn {x.data.availableSlots} chỗ</span>
                    </div>
                ),
                fts: Utils.toLowerCaseNonAccentVietnamese(x.displayName),
                data: x.data
            })) || [];

            const gameTypeAllowData: IOrdSelectOption[] = res.gameTypeAllow?.map(x => ({
                value: x.value,
                label: tEnum(x.displayName ?? ""),
                fts: Utils.toLowerCaseNonAccentVietnamese(x.displayName),
            })) || [];

            setSourceTeeTime({data: teeTimeData, isPending: false});
            setSourceGameTypeAllow({data: gameTypeAllowData, isPending: false});

            if (isCreate) {
                form.setFieldsValue({
                    courseId,
                    playDate: res.playDate,
                    gameType: res.gameType,
                    teeTime: startTime,
                });
                formInvoice.setFieldsValue({
                    paymentMode: PaymentModeEnum.PayLater,
                    // saleInvoiceDetails: res.saleInvoiceDetails ?? [],
                });
            }
            UiUtils.clearBusy();
        };
        fetchFlightInfo();
    }, [mode, courseId]);

    const onOkModal = async (createMode: "save" | "saveAndComfirm" | "saveAndCheckIn") => {
        try {
            const data = await form.validateFields();
            const dataInvoice = await formInvoice.validateFields();
            UiUtils.setBusy();
            formInvoice
            mainStore.createGroupBooking({
                ...data,
                courseId: courseId,
                playerNo: playerNo,
                createInvoice: dataInvoice,
                createMode: createMode,
                extraService: dataInvoice[extraService] || [],
            })
                .then(res => {
                    if (res.isSuccessful) {
                        UiUtils.showSuccess(res.message);
                        mainStore.closeGroupBookingModal(true, boardId);
                    } else {
                        UiUtils.showError(res.message);
                    }
                    UiUtils.clearBusy();
                }, (e) => {
                    UiUtils.clearBusy();
                    UiUtils.showCatchError(e);
                })

        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }
    const [currentStep, setCurrentStep] = useState(0);
    const w_TotalPlayers = Form.useWatch('totalPlayers', form);
    useEffect(() => {
        if (currentStep == 1) {
            UiUtils.setBusy();
            mainStore.getServiceInitDefaultByFilter({
                courseId: courseId,
                gameType: form.getFieldValue('gameType'),
                listPlayer: form.getFieldValue(fieldListPlayer) || [],
            }).then(res => {
                if (res) {
                    setDiscountPercentMain(res.discountMainPercent);
                    formInvoice.setFieldValue(serviceUsingFieldName, res.saleInvoiceDetails || []);
                }
                UiUtils.clearBusy();
            }, (e) => {
                UiUtils.clearBusy();
                UiUtils.showCatchError(e);
            })
        }
    }, [currentStep]);
    const onGoStepPayment = async (valueNext: number) => {
        // if (valueNext == 1 && currentStep == 0) {
        //     try {
        //         const data = await form.validateFields();
        //         setCurrentStep(1)
        //     } catch (error) {
        //         UiUtils.showCommonValidateForm();
        //     }
        // } else
        {
            setCurrentStep(valueNext);
        }

    }
    return (
        <Modal
            title={
                <span>{mainStore.groupBookingModal.mode == 'addNew' ? t("newGroupBooking") : t('editGroupBooking')}</span>}
            open={mainStore.groupBookingModal.visible}
            width='1024px'
            onCancel={() => {
                mainStore.closeGroupBookingModal();
            }}
            footer={<div
                className="flex flex-wrap items-center justify-between  max-sm:flex-col">
                <div>
                </div>
                <div className="flex items-center crud-modal-footer-btn-group">
                    <Button className='me-2' onClick={() => mainStore.closeGroupBookingModal()}>
                        <Space.Compact><Space><CloseOutlined className="me-1"/></Space>{t('cancelModal')} (F10)
                        </Space.Compact>
                    </Button>
                    {mainStore.groupBookingModal.mode === 'addNew' && <>
                        {currentStep === 0 && <>
                            <Button type='primary' onClick={() => {
                                onGoStepPayment(1);
                            }}>
                                <StepForwardOutlined/>
                                {t('nextStep')}
                            </Button>
                        </>}
                        {currentStep === 1 && <>
                            <Button type='default' className='me-2' onClick={() => {
                                setCurrentStep(0);
                            }}>
                                <StepBackwardOutlined/>
                                {t('previousStep')}
                            </Button>

                            <Button className='me-2 btn-secondary' type='primary' onClick={debounce(() => {
                                onOkModal("save")
                            }, 50)}>
                                <Space.Compact> <Space><SaveOutlined
                                    className="me-1"/></Space>{t('save')}</Space.Compact>
                            </Button>
                            <Button type='primary' onClick={debounce(() => {
                                onOkModal('saveAndComfirm')
                            }, 50)}>
                                <Space.Compact> <Space><CheckOutlined
                                    className="me-1"/></Space>{t('saveAndConfirm')} (F8)
                                </Space.Compact>
                            </Button>
                        </>}

                        {/*<Button className={`me-2 btn-secondary`} type='primary' onClick={debounce(() => {*/}
                        {/*    onOkModal('saveAndCheckIn')*/}
                        {/*}, 50)}>*/}
                        {/*    <Space.Compact> <Space><BookOutlined*/}
                        {/*        className="me-1"/></Space>{t('saveAndCheckin')} </Space.Compact>*/}
                        {/*</Button>*/}

                    </>}
                    {mainStore.groupBookingModal.mode === 'update' && <>
                        <Button className='me-2' type='primary' onClick={debounce(() => {
                            onOkModal("save")
                        }, 50)}>
                            <Space.Compact> <Space><SaveOutlined
                                className="me-1"/></Space>{t('save')} (F8)</Space.Compact>
                        </Button>
                    </>}

                </div>
            </div>}
            // okText={t('actionBtn.save')}
            // onOk={() => onOkModal()}
        >
            <Steps
                type="navigation"
                size="small"
                current={currentStep}
                onChange={(value: number) => {
                    onGoStepPayment(value);
                }}
                className="site-navigation-steps"
                items={[
                    {
                        title: t('bookingStepInfo1'),
                    },
                    {
                        title: t('bookingStepInfo2'),
                    },
                    {
                        disabled: true,
                        title: t('bookingStepInfo3'),
                    },
                ]}
            />
            <Form hidden={currentStep != 0} layout="vertical" form={form}>
                <Row gutter={[16, 8]}>
                    <Col span={24}>
                        {/* Thông tin đặt lịch */}
                        <BookingGroupDetailForm
                            sourceGameTypeAllow={sourceGameTypeAllow}
                            dataSourceTeeTime={sourceTeeTime}></BookingGroupDetailForm>
                    </Col>
                    <Col span={24}>
                        {/* Thông tin Golfer */}
                        <GroupPlayerInfo
                            dataSourceTeeTime={sourceTeeTime}
                        ></GroupPlayerInfo>
                    </Col>
                </Row>
            </Form>
            <Form form={formInvoice}>
                {currentStep === 1 && <Row gutter={16}>
                    <Col span={16}>
                        <BookingServiceInfo
                            fieldName={serviceUsingFieldName}
                            title={t('serviceInfo')} allowCru={false}></BookingServiceInfo>
                        <BookingServiceInfo
                            discountPercent={discountPercentMain}
                            fieldName={extraService}
                            title={t('extraServices')} allowCru={true}></BookingServiceInfo>
                    </Col>
                    <Col span={8}>
                        {/*<GroupBookingPaymentInfo></GroupBookingPaymentInfo>*/}
                        <PaymentBookingGroupInfo></PaymentBookingGroupInfo>
                    </Col>
                </Row>}
            </Form>

        </Modal>
    );
}

export default CreateGroupBooking;
