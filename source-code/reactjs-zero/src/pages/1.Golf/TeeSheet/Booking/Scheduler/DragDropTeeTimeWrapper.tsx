// TeeTimeWrapper.tsx - DND-Kit Version (Hỗ trợ nhiều sân và kéo thả giữa các sân)
import React, {lazy, Suspense, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@ord-store/index';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {restrictToWindowEdges} from '@dnd-kit/modifiers';
import TeeTimeGroup from './TeeTimeGroup';
import {useSelectGolfCourse} from "@ord-components/forms/select/selectDataSource/useSelectGolfCourse";
import {Affix, Button, Spin, Splitter} from "antd";
import {BlockOutlined, LockOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import {GolfBookingService} from "@api/GolfBookingService";
import {uniq} from "lodash";
import {IGolfPlayerSlotItemProps} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/GolfPlayerSlotItem";
import ViewTeeTimeBottom from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ViewTeeTimeBottom";
import GolfCheckInModal from "@pages/1.Golf/TeeSheet/Booking/checkin/GolfCheckInModal";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import CheckoutModalForm from "@pages/2.Restaurant/CentralBilling/form/CheckoutModalForm";
import {PrintInvoice} from "@pages/SalesInvoice/Utils/printInvoice";
import {SaleInvoiceDto} from "@api/index.defs";
import {InvoiceHelperService} from "@api/InvoiceHelperService";
import SaleInvoiceSetting from "@pages/SalesInvoice/Sell/components/settings/saleInvoiceSetting";
import QuickAccessInfoModal from "@pages/1.Golf/TeeSheet/Booking/components/QuickAccessInfoModal";
import ViewDetailPlayer from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/ViewDetailPlayer";


const DragDropTeeTimeWrapper = (
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
        invoiceSettingStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');

    const [activeId, setActiveId] = useState<string | number>("");
    const [dragActiveData, setDragActiveData] = useState<any>(null);
    const lstCourse = useSelectGolfCourse();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const onDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;
        const src = dragActiveData;
        const desc = over?.data?.current as IGolfPlayerSlotItemProps;

        const rowSrc = src.flight
        const colSrc = src.slot;
        const rowDest = desc.flight;
        const colDest = desc.slot;

        UiUtils.setBusy();
        GolfBookingService.moveOneTeeTime({
            body: {
                from: [
                    {
                        bookingId: colSrc?.bookingId,
                        bookingTeeTimeId: colSrc?.bookingTeeTimeId,
                        bookingPlayerId: colSrc?.bookingPlayerId,
                        teeTimeId: rowSrc?.teeTimeId,
                        courseId: src.flight.courseId,
                        playDate: rowSrc?.playDate,
                        startTime: rowSrc?.startTime,
                        playerNo: colSrc?.playerNo
                    }
                ],
                to: {
                    bookingId: colDest?.bookingId,
                    bookingTeeTimeId: colDest?.bookingTeeTimeId,
                    bookingPlayerId: colDest?.bookingPlayerId,
                    teeTimeId: rowDest?.teeTimeId,
                    courseId: desc.flight.courseId,
                    playDate: rowDest?.playDate,
                    startTime: rowDest?.startTime,
                    playerNo: colDest?.playerNo
                }
            }
        }).then(res => {
            if (res.isSuccessful) {
                UiUtils.showSuccess(t('actionBtn.moveSuccess'));
                const lstBoardId = uniq([src.boardIdx, desc.boardIdx]);
                if (src.boardIdx == desc.boardIdx) {
                    Object.entries(mainStore.teeTimeMap).forEach(([keyBoardId, value]) => {
                        const firstItem = value[0];
                        if (firstItem && firstItem.courseId == src.flight.courseId && firstItem.playDate == src.flight.playDate) {
                            lstBoardId.push(keyBoardId);
                        }
                    })
                }
                const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
                const refreshSequentially = async () => {
                    for (const boardId of lstBoardId) {
                        mainStore.refreshTeeTimeData(boardId);
                        await delay(300); // delay 300ms giữa các lần gọi
                    }
                };
                refreshSequentially();

            } else {
                UiUtils.showError(res.message);
            }
            setDragActiveData(null);
            UiUtils.clearBusy()
        })

        // const srcList = [...golfBookingStore.teeTimeMap[srcCourseId][srcRowIdx].listSlot ?? []];
        // const dstList = [...golfBookingStore.teeTimeMap[dstCourseId][dstRowIdx].listSlot ?? []];
        //
        // const moved = srcList[srcSlotIdx];
        // const replaced = dstList[dstSlotIdx];
        //
        // // Thực hiện hoán đổi giá trị
        // srcList[srcSlotIdx] = replaced;
        // dstList[dstSlotIdx] = moved;
        //
        // // Cập nhật vào store
        // golfBookingStore.updateListSlotWithCourse(srcCourseId, srcRowIdx, srcList);
        // golfBookingStore.updateListSlotWithCourse(dstCourseId, dstRowIdx, dstList);
    };

    const onDragStart = (event: DragStartEvent) => {
        setDragActiveData(event.active.data.current);
        setActiveId(event.active.id);
    };
    const courseCount = Object.entries(mainStore.teeTimeMap).length;
    const basisClass = {
        1: 'basis-full',
        2: 'basis-1/2',
        3: 'basis-1/3',
        4: 'basis-1/4',
        5: 'basis-1/5',
        6: 'basis-1/6',
    }[courseCount] || 'basis-full';
    const LazyCruNewBooking = lazy(() => import('@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/CruNewBooking'));
    const LazyCreateGroupBooking = lazy(() => import('@pages/1.Golf/TeeSheet/Booking/Crud/GroupBooking/CreateGroupBooking'));
    const LazyUserBlockModal = lazy(() => import('../userBlock/UserBlockModal'));
    const LazyGolfCheckInModal = lazy(() => import('../checkin/GolfCheckInModal'));

    const LazyCheckoutModalForm = lazy(() => import('../checkout/GolfCheckoutModal'));
    const LazyPaymentFullModal = lazy(() => import('@pages/2.Restaurant/CentralBilling/form/CheckoutModalForm'));
    const LazyInvoiceDetailForm = lazy(() => import('@pages/SalesInvoice/Form/invoiceDetailForm'));
    // const LazySettingInvoice = lazy(() => import('@pages/SalesInvoice/Sell/components/settings/saleInvoiceSetting'));
    const selectedCellsCount = Object.entries(mainStore.selectedCells).length;
    const AffixAdjustMode = observer(() => {

        if (mainStore.selectSlotMode) {
            return <Affix offsetBottom={0}>
                <div className='flex justify-between items-center bg-gray-200 w-full border-4 h-[47px]'>
                    {selectedCellsCount == 0 && <span>{t('pleaseSelectTeeTime')}</span>}
                    {selectedCellsCount > 0 && <>
                        <div>{selectedCellsCount} {t('SelectedDepartureTimes')}
                            <Button type='link' onClick={() => {
                                mainStore.clearSelectedCells();
                                mainStore.setSelectSlotMode(false);
                            }}>
                                {t('actionBtn.removeSelectedAndClose')}
                            </Button>
                        </div>

                        <div>
                            <Button onClick={() => {
                                mainStore.openUserBlockModal();
                            }}>
                                <LockOutlined></LockOutlined>
                                {t('actionBtn.block')}</Button>
                            <Button className='ml-2' onClick={() => {
                                mainStore.unBlockSelected()

                            }}>
                                <BlockOutlined></BlockOutlined>
                                {t('actionBtn.unBlock')}
                            </Button>
                            {/*<Button className='mr-1'>*/}
                            {/*    <LockOutlined></LockOutlined>*/}
                            {/*    {t('actionBtn.lock')}*/}
                            {/*</Button>*/}

                            {/*<Button>{t('actionBtn.Insert')}</Button>*/}
                            {/*<Button className='mr-1'>{t('actionBtn.Delete')}</Button>*/}
                            {/*<Button>{t('actionBtn.Promote')}</Button>*/}
                        </div>
                    </>}
                </div>

            </Affix>
        } else {
            return <></>
        }

    });


    const scopeId = React.useMemo(() => `crudPageScope-${Math.random().toString(36).substring(2, 15)}`, []);
    useEffect(() => {
        invoiceSettingStore.getSettingInfo();
    }, []);
    return (
        <div>
            <HotkeysProvider initiallyActiveScopes={[scopeId]}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                    onDragStart={onDragStart}
                    modifiers={[restrictToWindowEdges]}
                >
                    <div className="flex gap-4">
                        {Object.entries(mainStore.teeTimeMap).map(
                            ([boardIdx, teeTimeList]) => {
                                const key = Number(boardIdx);

                                return (
                                    <div
                                        key={`group-${key}`}
                                        className={`${basisClass} min-w-[300px]`} // optional: đặt min-width tránh bị quá nhỏ
                                    >
                                        <TeeTimeGroup
                                            boardIdx={key}
                                            lstCourse={lstCourse}
                                        />
                                    </div>
                                );
                            }
                        )}
                    </div>
                    <DragOverlay>
                        {activeId ? (
                            <div className="p-2 border rounded bg-white shadow-md opacity-90">
                                Item
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
                {/*<Splitter layout="vertical" style={{height: `calc(100vh - ${props.headerHeight ?? 0}px)`}}>*/}
                {/*    /!* Phần trên: nội dung chính, scroll được *!/*/}
                {/*    <Splitter.Panel collapsible style={{overflow: 'auto'}}>*/}
                {/*        */}
                {/*    </Splitter.Panel>*/}
                {/*    {mainStore.viewTeeTimeBottomModal.visible &&*/}
                {/*        <Splitter.Panel*/}
                {/*            collapsible*/}
                {/*            // max={431}*/}
                {/*            style={{flexShrink: 0, overflow: 'scroll', borderTop: '1px solid #eee'}}*/}
                {/*        >*/}
                {/*            <ViewTeeTimeBottom height={420}></ViewTeeTimeBottom>*/}
                {/*        </Splitter.Panel>*/}
                {/*    }*/}
                {/*</Splitter>*/}
                <ViewDetailPlayer></ViewDetailPlayer>
                <AffixAdjustMode></AffixAdjustMode>
                <div className='hidden'>
                    <Suspense fallback={<Spin/>}>
                        {mainStore.createOrUpdateModal.visible && <LazyCruNewBooking/>}
                    </Suspense>

                    <Suspense fallback={<Spin/>}>
                        {mainStore.groupBookingModal.visible && <LazyCreateGroupBooking/>}
                    </Suspense>
                    <Suspense fallback={<Spin/>}>
                        {mainStore.userBlockModal.visible && <LazyUserBlockModal/>}
                    </Suspense>
                    <Suspense fallback={<Spin/>}>
                        {mainStore.checkInModal.visible && <LazyGolfCheckInModal hotkeyScopes={scopeId}/>}
                    </Suspense>

                    <Suspense fallback={<Spin/>}>
                        {golfCheckInOutStore.createOrUpdateModal.visible &&
                            <LazyCheckoutModalForm hotkeyScopes={scopeId}/>}
                    </Suspense>
                    <Suspense fallback={<Spin/>}>
                        {paymentCentralBillingStore.createOrUpdateModal.visible &&
                            <LazyPaymentFullModal/>}
                    </Suspense>
                    <Suspense fallback={<Spin/>}>
                        {saleInvoiceStore.viewInvoiceModal.visible && <LazyInvoiceDetailForm/>}
                    </Suspense>
                    <SaleInvoiceSetting></SaleInvoiceSetting>
                    <QuickAccessInfoModal hotkeyScopes={scopeId}></QuickAccessInfoModal>
                </div>
                <PrintInvoice pdfUrl={golfCheckInOutStore.pdfUrl}/>

            </HotkeysProvider>
        </div>
    );
}
export default observer(DragDropTeeTimeWrapper);
