
import React, {lazy, Suspense, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@ord-store/index';
import {useSelectGolfCourse} from "@ord-components/forms/select/selectDataSource/useSelectGolfCourse";
import {Card, Col, Row, Spin, Splitter} from "antd";
import {useTranslation} from "react-i18next";
import {HotkeysProvider} from "react-hotkeys-hook";
import TeeTimeGroup from "@pages/1.Golf/TeeSheet/Valet/Scheduler/TeeTimeGroup";
import UiUtils from "@ord-core/utils/ui.utils";
import QuickAccessInfoModal from '../../Booking/components/QuickAccessInfoModal';
import CardRelease from './CardRelease';
import { IViewTeeTimeBottomProps } from '../../Booking/ViewTeeTimeBottom/ViewTeeTimeBottom';
import { ValetService } from '@api/ValetService';
import ValetBookingInforModal from './ValetBookingInforModal';


const TeeTimeWrapper = (
    props: {
        headerHeight?: number
    }
) => {
    const {
        golfBookingStore: mainStore,
        paymentCentralBillingStore,
        golfCheckInOutStore,
        sessionStore,
        saleInvoiceStore,
        invoiceSettingStore,
        golfValetStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {flight, rowIdx, boardIdx} = mainStore?.viewTeeTimeBottomModal?.entityData ?? {} as IViewTeeTimeBottomProps;
    const {t: tEnum} = useTranslation('enum');
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);

    const lstCourse = useSelectGolfCourse();


    const courseCount = Object.entries(mainStore.teeTimeMap).length;
    const basisClass = {
        1: 'basis-full',
        2: 'basis-1/2',
        3: 'basis-1/3',
        4: 'basis-1/4',
        5: 'basis-1/5',
        6: 'basis-1/6',
    }[courseCount] || 'basis-full';

    const scopeId = React.useMemo(() => `crudPageScope-${Math.random().toString(36).substring(2, 15)}`, []);

    const handleSlotClick = async(boardIdx: number, rowIdx: number, slotIndex: number) => {
        const flight = mainStore.teeTimeMap[boardIdx]?.[rowIdx];
        
        if (flight?.listSlot?.[slotIndex]) {
            const clickedSlot = flight.listSlot[slotIndex];
            try {
            
                UiUtils.setBusy();
                const res = await ValetService.valetGetCheckInInfoByCustomer({
                    body: {
                        bookingId: clickedSlot.bookingId,
                        bookingPlayerId: clickedSlot.bookingPlayerId
                        // checkInTime: new Date(),
                    }
                });
    
                if (res.isSuccessful && res.data) {
                    const bookingInfo = res.data.bookingInfo;
                    const memberInfo = res.data.memberInfo;
    
    
                    golfValetStore.opencloseCheckAccessCardModal({
                        memberCardInfo: res.data
                    })
                } else {

                    UiUtils.showError(res.message);
                }
    
            } catch (error) {
                UiUtils.showCommonValidateForm();
            } finally {
                UiUtils.clearBusy();
            }
            console.log("Clicked Slot Details:", {
                boardIdx,
                rowIdx,
                slotIndex,
                playerNo: clickedSlot.playerNo,
                partnerName: clickedSlot.partnerName,
                partnerId: clickedSlot.partnerId,
                sourceType: clickedSlot.sourceType,
                status: clickedSlot.status,
                bookingId: clickedSlot.bookingId,
                bookingPlayerId: clickedSlot.bookingPlayerId,
                bookingGorupId: clickedSlot.bookingGroupId
            });
        }
    };

    useEffect(() => {
        invoiceSettingStore.getSettingInfo();
    }, []);

    const LazyValetManagerCardModal = lazy(() => import('./ValetBookingInforModal'));
    return (
        <div>
            <HotkeysProvider initiallyActiveScopes={[scopeId]}>
                <Row gutter={16} className='!mr-0'>
                    <Col span={18}>
                        <div className="flex gap-4">
                            {Object.entries(mainStore.teeTimeMap).map(
                                ([boardIdx, teeTimeList]) => {
                                    const key = Number(boardIdx);

                                    return (
                                        <div
                                            // onClick={() => handleSlotClick(key, rowIdx, slotIndex)}
                                            key={`group-${key}`}
                                            className={`${basisClass} min-w-[300px]`} // optional: đặt min-width tránh bị quá nhỏ
                                        >
                                            <TeeTimeGroup
                                                boardIdx={key}
                                                lstCourse={lstCourse}
                                                onSlotClick={handleSlotClick}
                                            />
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </Col>
                    <Col span={6} className='!pr-0'>
                        <Card title={t("cardReleased")} bordered={false} className="pt-4 shadow-md rounded-xl">
                            <CardRelease />
                        </Card>
                    </Col>
                </Row>

                <div className='hidden'>
                    {/*Obs Modal đặt ở đây */}

                    {/*<SaleInvoiceSetting></SaleInvoiceSetting>*/}
                    <Suspense fallback={<Spin/>}>
                        {golfValetStore.checkAccessCardModal.visible &&
                            <LazyValetManagerCardModal />}
                    </Suspense>
                </div>
            </HotkeysProvider>
        </div>
    );
}
export default observer(TeeTimeWrapper);
