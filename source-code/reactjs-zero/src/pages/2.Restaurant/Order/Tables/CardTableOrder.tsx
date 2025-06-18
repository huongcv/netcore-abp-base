import React, {memo, useState} from 'react';
import {Button, Checkbox, Modal, Popover, Space, Tooltip} from "antd";
import {UserIcon2} from "@ord-components/icon/UserIcon2";
import {TableGridDto} from "@api/index.defs";
import {colorClassMap, getSysNoFromOrderCode, prefixNewOrderCode} from "@pages/2.Restaurant/Order/Utils/Util";
import OrderIcon2 from "@ord-components/icon/OrderIcon2";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {DateIcon} from "@ord-components/icon/DateIcon";
import MoneyIcon from "@ord-components/icon/MoneyIcon";
import {useTranslation} from "react-i18next";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import OrderList from "@pages/2.Restaurant/Order/OrderViews/OrderList";
import ReservationViewModal from "@pages/2.Restaurant/Order/Tables/ReservationViewModal";
import {CloseOutlined} from "@ant-design/icons";
import {PlusIcon2} from "@ord-components/icon/PlusIcon2";
import {orderStateStore} from "@ord-store/Restaurant/Order/OrderStateStore";
import {observer} from "mobx-react-lite";
import ReservationIcon2 from "@ord-components/icon/ReservationIcon2";

type CardTableOrderProps = {
    data: TableGridDto
}

const CardTableOrder = (props: CardTableOrderProps) => {
    const {data} = props;
    const {t} = useTranslation('order');
    const [isOpenOrderList, setIsOpenOrderList] = useState(false);
    const [isOpenReservation, setIsOpenReservation] = useState(false);
    const color = colorClassMap[data.status!];
    const order = orderStateStore.orders?.find(o => o.tableId === data.tableId);

    const popoverContent = <div>
        <div> Khách hàng: <span className='font-semibold'> {data.partnerName} </span></div>
        <div> Số điện thoại: <span className='font-semibold'> {data.partnerPhone} </span></div>
        <div> Ngày giờ: <span className='font-semibold'> {data.reservationDateStr || data.orderDateStr} </span></div>
        <div> Số lượng: <span className='font-semibold'> {data.numberOfCustomer || ''} </span></div>
    </div>

    const viewReservation = () => {
        setIsOpenReservation(true);
    }

    const viewOrder = () => {
        setIsOpenOrderList(true);
    }

    const checkTable = () => {
        //Nếu đã có thông tin đặt bàn rồi thì hiện pop-confirm để xác nhận
        if (order && !!order.details?.length) {
            const {confirm} = Modal;
            confirm({
                title: t('Đóng đơn hàng'),
                type: "warning",
                content: t('Bàn này đã gọi món, bạn có chắc chắn muốn đóng thông tin gọi món của bàn này?'),
                onOk() {
                    orderStateStore.deleteOrder(+order.tableId!)
                }
            });
            return;
        }

        orderStateStore.setOrders([]);

        if (order) {
            orderStateStore.deleteOrder(+data.tableId!);
            return;
        }

        //CreateSaleOrderDto
        const sysNo = getSysNoFromOrderCode(orderStateStore.orders);
        const newOrder: any = {
            id: 0, //orderId
            tableId: data.tableId,
            tableName: data.tableName,
            orderCode: prefixNewOrderCode + sysNo,
            checked: true,
            details: []
        }

        orderStateStore.addOrder(newOrder);
        orderStateStore.setOrderSelected(newOrder);
    };

    const checkTable2 = (e: any) => {
        if (e.target !== e.currentTarget) {
            return;
        }

        checkTable();
    }

    const addTable = () => {
        const sysNo = getSysNoFromOrderCode(orderStateStore.orders);
        const newOrder: any = {
            id: 0,
            tableId: new Date().getTime() * 1_000_000,
            isNewTableWhenClickButtonAdd: true,
            reservationId: null,
            orderCode: prefixNewOrderCode + sysNo,
            checked: true,
            details: []
        }

        orderStateStore.addOrder(newOrder);
        orderStateStore.setOrderSelected(newOrder);
        setIsOpenOrderList(false);
    }

    return (
        <>
            <div onClick={checkTable2}
                 className='shadow min-w-[200px] py-3 text-center rounded-[6px] cursor-pointer border-[1px] border-solid flex flex-col h-full'>
                <div onClick={checkTable2} className='inline-flex flex-col items-center relative'>
                    <div className='absolute left-4 top-0'>
                        <div className='flex items-center'>
                            <Popover content={popoverContent} title="Thông tin đặt bàn">
                                <div
                                    className='border-[1px] border-solid border-[#989898] rounded-2xl px-2 py-[2px] mr-2'>
                                    <UserIcon2 className='text-lg text-[#757575] mr-1'/>
                                    <span className='font-medium text-[#2D2D2D]'>{data.numberOfCustomer}</span>
                                </div>
                            </Popover>
                            {
                                !!data.reservationId &&
                                <Tooltip title='Bấm để xem danh sách đặt bàn'>
                                    <div onClick={viewReservation}
                                         className='border-[1px] border-solid border-[#989898] rounded-2xl px-2 py-[2px] cursor-pointer'>
                                        <ReservationIcon2 className='text-lg text-[#757575] mr-1'/>
                                        <span className='font-medium text-[#2D2D2D]'>{data.numberOfReservation}</span>
                                    </div>
                                </Tooltip>
                            }
                        </div>
                    </div>
                    <Checkbox className='absolute right-4 top-0' checked={order?.checked} onChange={(e) => checkTable()}
                              style={{transform: 'scale(1.3)'}}/>

                    <div className='mb-[6px] inline-block w-fit mt-10'>
                            <span className='text-base text-[#2D2D2D] bg-[#FFF7E6] rounded-2xl px-2 py-1 inline-block'
                                  style={{backgroundColor: color}}>
                                {data.statusStr}
                            </span>
                    </div>

                    <div className='text-lg text-[#2D2D2D] font-semibold inline-block  w-fit'>
                        {data.tableName}
                    </div>

                    <div className='text-sm text-[#2D2D2D] mb-[6px] inline-block  w-fit'>
                        {data.areaName}
                    </div>

                    <div className='text-md inline-block  w-fit'>
                        <Tooltip title='Bấm để xem danh sách đơn hàng' placement='right'>
                                     <span onClick={viewOrder}
                                           className='border-[1px] border-solid border-[#989898] rounded-2xl px-5 py-[2px] mr-2 mb-1 cursor-pointer inline-block'>
                                                <OrderIcon2 className='text-[#757575]'/> {data.numberOfOrder}
                                     </span>
                        </Tooltip>
                        <div>
                            <Tooltip title='Tổng tiền thanh toán của các đơn hàng' placement='right'>
                                <MoneyIcon className='text-[#757575]'/> <PriceCell value={data.totalAmountOrder}/>
                            </Tooltip>
                        </div>
                        <div>
                            <Tooltip title='Tổng thời gian của các đơn hàng' placement='right'>
                                <DateIcon className='text-[#757575]'/> {data.totalDateDisplay}
                            </Tooltip>
                        </div>
                    </div>
                </div>
                {/*<div className='mt-auto text-[#163422] font-medium italic'>*/}
                {/*    <Tooltip title='Mã đơn hàng' placement='right'>*/}
                {/*        {data.orderCode}*/}
                {/*    </Tooltip>*/}
                {/*</div>*/}
            </div>

            <Modal title={t('orderList')}
                   open={isOpenOrderList}
                   onOk={() => {
                   }}
                   destroyOnClose={true}
                   maskClosable={false}
                   width={'90%'}
                   onCancel={() => setIsOpenOrderList(false)}
                   footer={
                       <>
                           <div className="flex items-center crud-modal-footer-btn-group justify-end">
                               <Button className='me-2' onClick={() => setIsOpenOrderList(false)}>
                                   <Space.Compact><Space><CloseOutlined
                                       className="me-1"/></Space>{t('Đóng')}
                                   </Space.Compact>
                               </Button>
                               <Button type='primary' onClick={addTable}>
                                   <Space.Compact> <Space><PlusIcon2
                                       className="me-1"/></Space>{t('Tạo mới hoá đơn')}</Space.Compact>
                               </Button>
                           </div>
                       </>
                   }>
                <OrderList setIsOpen={setIsOpenOrderList} tableId={+data.tableId!}/>
            </Modal>

            <Modal title={t('reservationList')}
                   open={isOpenReservation}
                   onOk={() => {
                   }}
                   destroyOnClose={true}
                   maskClosable={false}
                   width={'90%'}
                   onCancel={() => setIsOpenReservation(false)}
                   footer={<FooterCrudModal hiddenOk={true} onOk={() => {
                   }} onCancel={() => setIsOpenReservation(false)}/>}>
                <ReservationViewModal setIsOpenReservation={setIsOpenReservation} tableId={+data.tableId!}/>
            </Modal>
        </>
    );
};

export default memo(observer(CardTableOrder));