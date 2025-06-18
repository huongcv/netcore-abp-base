import React, {memo, Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import SubTractIcon2 from "@ord-components/icon/SubTractIcon2";
import AddIcon2 from "@ord-components/icon/AddIcon2";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {Button, Col, Drawer, Dropdown, Form, Input, MenuProps, Modal, Row, Space, Tooltip} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrderIcon2 from "@ord-components/icon/OrderIcon2";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import DeleteIcon2 from "@ord-components/icon/DeleteIcon2";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import '../index.scss';
import CloseIcon2 from "@ord-components/icon/CloseIcon2";
import {CreateSaleOrderDto, TableTreeDto, UpdateOrderDto} from "@api/index.defs";
import {useForm} from "antd/lib/form/Form";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import {WalletIcon} from "@ord-components/icon/WalletIcon";
import ProductOrderDetailModal from "@pages/2.Restaurant/Order/OrderViews/ProductOrderDetailModal";
import {IProductOrderListItem} from "@pages/2.Restaurant/Order/Foods/CardFoodOrder";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";
import TableTreeSelect from "@pages/2.Restaurant/Reservation/Utils/TableTreeSelect";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";
import UiUtils from "@ord-core/utils/ui.utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import HorizontalScrollList from "@ord-components/common/scroll/HorizontalScroll";
import {PlusIcon2} from "@ord-components/icon/PlusIcon2";
import PaymentOrder from "@pages/2.Restaurant/Order/OrderViews/PaymentOrder";
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import Notifications from "@ord-core/layout/Header/Notifications";
import {ArrowLeftOutlined, MenuOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {orderStateStore} from "@ord-store/Restaurant/Order/OrderStateStore";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {getSysNoFromOrderCode, prefixNewOrderCode} from '../Utils/Util';
import {observer} from "mobx-react-lite";
import GolfPlayerPartnerInput from "@pages/1.Golf/shared/components/GolfPlayerPartnerInput";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {PARTNER_PER} from "@ord-core/config/permissions/partner.permission";
import {useStore} from "@ord-store/index";

const getTotalAmount = (values?: any) => {
    return values?.reduce((cur: any, item: any) => cur + (item?.subTotalAmount || 0), 0) || 0
}

const convertDataFromState = (orderSelected: any) => {
    const result = {
        tableId: orderSelected?.tableId,
        isNewTableWhenClickButtonAdd: orderSelected?.isNewTableWhenClickButtonAdd,
        partnerId: orderSelected?.partnerId,
        reservationId: orderSelected?.reservationId,
        details: orderSelected?.details || []
    };

    const isCreate = !orderSelected?.id;
    if (isCreate) {
        return result;
    }

    return {
        ...result,
        id: orderSelected?.id,
        orderCode: orderSelected?.orderCode,
        orderDate: orderSelected?.orderDate,
        status: orderSelected?.status,
        discountType: orderSelected?.discountType,
        discountPercent: orderSelected?.discountPercent,
        discountAmount: orderSelected?.discountAmount,
        depositAmount: orderSelected?.depositAmount,
        debtAmount: orderSelected?.debtAmount,
        deliveryAmount: orderSelected?.deliveryAmount,
        paymentMethod: orderSelected?.paymentMethod,
        paymentStatus: orderSelected?.paymentStatus,
        shopBankAccountId: orderSelected?.shopBankAccountId,
        notes: orderSelected?.notes,
        numberOfCustomer: orderSelected?.numberOfCustomer,
    }
}

const convertDataBeforeSave = (values: any) => {
    const isCreate = !values?.id;
    const result = {
        partnerId: values.partnerId,
        tableId: values.tableId,
        reservationId: values.reservationId,
        orderDate: new Date(),
        details: values?.details?.map((detail: any, index: any) => ({
            id: detail.id,
            productId: detail.productId,
            productUnitId: detail.productUnitId,
            qty: detail.qty,
            convertRate: detail.convertRate,
            price: detail.productPrice,
            discountType: detail.discountType,
            discountPercent: detail.discountPercent,
            discountAmount: detail.discountAmount,
            taxPercent: detail.taxPercent,
            taxCode: detail.taxCode,
            notes: detail.notes,
        })),
    }

    if (isCreate) {
        return result as CreateSaleOrderDto;
    }

    return {
        ...result,
        id: values?.id,
        orderCode: values?.orderCode,
        status: values?.status
    } as UpdateOrderDto
}

const NotificationComp = memo(() => {
    const navigate = useNavigate();
    const {t} = useTranslation('order');

    const menuClose: MenuProps["items"] = [
        {
            label: (
                <a onClick={() => navigate("/")} type={"text"}>
                    <Space>
                        <ArrowLeftOutlined/> {t("Trở về trang quản lý")}
                    </Space>
                </a>
            ),
            key: "0",
        }]

    return <>
        <Notifications className="mr-4 notification scale-[1.12]"/>
        <Dropdown menu={{items: menuClose}} trigger={["hover"]}>
            <Button className="mb-[2px] border-[#45494E] scale-[1.12]">
                <MenuOutlined/>
            </Button>
        </Dropdown>
    </>
})

const MenuList = () => {
    const {t} = useTranslation('order');
    const [form] = useForm();
    const [isOpenPayment, setIsOpenPayment] = useState(false);
    const productOrderDetailRef = useRef();
    const {sessionStore} = useStore();

    const openProductOrderForm = (product: any) => {
        const value = {...product} as IProductOrderListItem;
        // @ts-ignore
        const callBack = productOrderDetailRef?.current?.showModal;
        callBack && callBack(value);
    };

    const removeTable = (e: any, order: CreateSaleOrderDto) => {
        e.stopPropagation();

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

        if (order) {
            orderStateStore.deleteOrder(+order.tableId!)
        }
    }

    useEffect(() => {
        const values = convertDataFromState(orderStateStore.orderSelected);
        form.setFieldsValue({
            ...values,
            tableId: values.isNewTableWhenClickButtonAdd ? null : values.tableId
        });
    }, [orderStateStore.orderSelected]);

    const decrease = (name: number, productId: number) => {
        const qty = form.getFieldValue(['details', name, 'qty']);
        updateSubTotalAmount(productId, qty - 1);
    };

    const increase = (name: number, productId: number) => {
        const qty = form.getFieldValue(['details', name, 'qty']);
        updateSubTotalAmount(productId, qty + 1);
    };

    const onChangeQty = (productId: number, qty: number) => {
        updateSubTotalAmount(productId, qty);
    }

    const updateSubTotalAmount = (productId: number, qty: number) => {
        if (qty < 1) {
            return;
        }

        const subTotalAmount = getSubTotalAmount(productId, qty);

        const productUpdate = orderStateStore.orderSelected?.details?.find((x: any) => x.productId === productId);
        if (productUpdate) {
            productUpdate.subTotalAmount = subTotalAmount;
            productUpdate.qty = qty;
            const details = orderStateStore.orderSelected?.details.map((product: any, index: any) => {
                return product.productId === productId ? {...productUpdate} : product;
            });

            orderStateStore.updateOrder({
                ...orderStateStore.orderSelected,
                details: details
            })
        }
    }

    const getSubTotalAmount = (productId: number, qty: number) => {
        const product = orderStateStore.orderSelected?.details.find((x: any) => x.productId === productId);
        return CalculatorCurrencyUtil.calculateSubTotalAmount(product.productPrice,
            qty, product.discountAmount, product.taxPercent);
    }

    const onChangeTable = (tableId: number, option: TableTreeDto) => {
        // const exist = orders?.some(x => x.tableId === tableId) && orderSelected.tableId !== tableId;
        // if (exist) {
        //     UiUtils.showError('Không thể chọn bàn này vì bàn đã được chọn');
        //     form.setFieldValue('tableId', orderSelected.tableId); //set lại giá trị cũ
        //     return;
        // }

        form.setFieldValue('tableId', tableId);
        orderStateStore.changeTableOrder(tableId, {
            ...orderStateStore.orderSelected,
            tableName: option.title
        });
    }

    const onChangePartner = (partnerId: number, option: any) => {
        orderStateStore.updateOrder({
            ...orderStateStore.orderSelected,
            partnerId,
            partnerName: option.data?.name
        })
    }

    const onChangeNote = (e: any, productId: number) => {
        const notes = e.target.value;
        const productUpdate = orderStateStore.orderSelected?.details?.find((x: any) => x.productId === productId);

        if (productUpdate) {
            productUpdate.notes = notes;
            orderStateStore.updateOrder({
                ...orderStateStore.orderSelected,
                details: orderStateStore.orderSelected?.details.map((product: any, index: any) => {
                    return product.productId === productId ? {...productUpdate} : product;
                })
            })
        }
    }

    const orderSubmit = async () => {
        await form.validateFields().then(async (values) => {
            try {
                UiUtils.setBusy();
                const body = convertDataBeforeSave(values) as any;

                if (!body?.details?.length) {
                    UiUtils.showError('Vui lòng chọn món ăn');
                    return;
                }

                const isCreate = !values?.id;
                if (isCreate) {
                    const response = await OrderRestaurantService.createOrder({body: body as CreateSaleOrderDto});
                    if (!response.isSuccessful) {
                        UiUtils.showError(response.message)
                        return;
                    }

                    UiUtils.showSuccess('Tạo đơn hàng thành công');
                    orderFilterStore.setTimeStampTableFilter(new Date().getMilliseconds());
                    orderFilterStore.setTimeStampOrderListFilter(new Date().getMilliseconds());
                    form.setFieldsValue({});
                    orderStateStore.deleteOrder(orderStateStore?.orderSelected?.tableId);
                    return;
                }

                const response = await OrderRestaurantService.updateOrder({body: body as UpdateOrderDto});
                if (!response.isSuccessful) {
                    UiUtils.showError(response.message)
                    return;
                }

                UiUtils.showSuccess('Cập nhật thành công đơn hàng ' + orderStateStore.orderSelected.orderCode);
                orderFilterStore.setTimeStampTableFilter(new Date().getMilliseconds());
                orderFilterStore.setTimeStampOrderListFilter(new Date().getMilliseconds());
                form.setFieldsValue({});
                orderStateStore.deleteOrder(orderStateStore?.orderSelected?.tableId);
            } catch (ex) {
                console.error(ex)
                UiUtils.showError('Có lỗi xảy ra, vui lòng thử lại sau');
            } finally {
                UiUtils.clearBusy();
            }
        }).catch(() => {
            UiUtils.showError('Vui lòng kiểm tra lại thông tin');
        });
    }

    const paymentSubmit = async () => {
        if (orderStateStore.orderSelected == null) {
            UiUtils.showError('Vui lòng chọn đơn hàng để thanh toán')
            return;
        }

        if (!orderStateStore.orderSelected?.details?.length) {
            UiUtils.showError('Vui lòng chọn món ăn trước khi thanh toán')
            return;
        }

        try {
            UiUtils.setBusy();
            await form.validateFields();
            setIsOpenPayment(true);

            // console.log('orderSelected: ', orderSelected)
        } catch (ex) {
            UiUtils.showError('Vui lòng kiểm tra lại thông tin')
        } finally {
            UiUtils.clearBusy();
        }
    }

    const onClosePayment = () => {
        setIsOpenPayment(false);
    }

    const addTable = () => {
        const sysNo = getSysNoFromOrderCode(orderStateStore.orders);
        const newOrder: any = {
            tableId: new Date().getTime() * 1_000_000,
            isNewTableWhenClickButtonAdd: true,
            reservationId: null,
            orderCode: prefixNewOrderCode + sysNo,
            checked: true,
            details: []
        }

        orderStateStore.addOrder(newOrder);
        orderStateStore.setOrderSelected(newOrder);
    }

    const render = useCallback((order: any) => {
        const isActive = (order?.tableId && orderStateStore.orderSelected?.tableId === order?.tableId)

        return <div key={order?.tableId}
                    onClick={() => orderStateStore.setOrderSelected && orderStateStore.setOrderSelected(order)}
                    className={`cursor-pointer flex items-center flex-shrink-0 px-4 py-[10px] bg-[#EEE] rounded-[6px] text-[#636363] font-semibold text-base inline-block mr-[10px] 
                                  ${isActive ? '!bg-[#36A261] !text-white' : ''}`}>
            {order.orderCode}

            <span onClick={(e) => removeTable(e, order)}>
                                    <CloseIcon2 className='text-xl ml-[10px] '/>
                                  </span>
        </div>
    }, [orderStateStore.orderSelected?.tableId]);

    // console.log('OrderListComp')
    const isShowDropdownPartner = checkPermissionUser(sessionStore.appSession, PARTNER_PER.viewCustomerList);
    return (
        <>
            <div className='p-4 bg-white rounded-[6px] order-selected'>
                <div className='h-[44px] flex'>
                    <div className='flex-1 ' style={{maxWidth: 'calc(100% - 134px)'}}>
                        <div className='flex items-center' style={{width: '100%'}}>
                            <div style={{width: 'calc(100% - 30px)'}}>
                                {
                                    orderStateStore.orders && orderStateStore.orders.length > 0 &&
                                    <HorizontalScrollList hiddenControls={true} initialActiveId={0} render={render}
                                                          data={orderStateStore.orders}/>
                                }
                            </div>
                            <div onClick={addTable}
                                 className='inline-flex !cursor-pointer ml-1 flex-shrink-0 items-center justify-center h-[44px] w-[44px] rounded-[6px] bg-[#00A660]'>
                                <PlusIcon2 className='text-[24px] text-white'/>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-end w-full'>
                        <NotificationComp/>
                    </div>
                </div>
                <div className='bg-white mt-6' style={{minHeight: 'calc(100vh - 186px)'}}>
                    {
                        <Form form={form} style={{display: !!orderStateStore.orderSelected ? 'block' : 'none'}}>
                            <Row gutter={8}>
                                <Col span={16}>
                                    <FloatLabel label='Khách hàng' required>
                                        <Form.Item name='partnerId' rules={[ValidateUtils.required]}>
                                            {sessionStore.isGolfShop ?
                                                <GolfPlayerPartnerInput partner_type={1}
                                                                        onChange={(value: any, option) => onChangePartner(value, option)}/>
                                                : <PartnerInput partner_type={1}
                                                                onChange={(value: any, option) => onChangePartner(value, option)}>
                                                </PartnerInput>}
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={8}>
                                    <FloatLabel label='Bàn' required>
                                        <Form.Item name='tableId' rules={[ValidateUtils.required]}>
                                            <TableTreeSelect
                                                onChangeValue={(value: any, option: any) => onChangeTable(value, option)}/>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                            </Row>

                            <div
                                className='py-4 border-t-[1px] border-solid border-[#DDD] flex items-center justify-between'>
                                <h3 className='text-black font-semibold text-xl'>
                                    {t('Đã chọn')}
                                    <span
                                        className='text-base font-semibold text-white rounded-full px-2 py-1 bg-[#157E3F] ml-2'>
                                {orderStateStore.orderSelected?.details?.length || 0}
                            </span>
                                </h3>
                                <p className='text-lg font-semibold text-[#157E3F] italic mr-1'>{t('Tổng tiền')}:
                                    <PriceCell className='ml-2'
                                               value={getTotalAmount(orderStateStore.orderSelected?.details)}/> vnđ
                                </p>
                            </div>

                            <div style={{maxHeight: 'calc(100vh - 330px)'}}>
                                <div className='overflow-y-scroll scrollbar-hide' style={{maxHeight: 'inherit'}}>
                                    <Form.List name="details">
                                        {(fields, {add, remove}) => {
                                            const tableId = form.getFieldValue('tableId');

                                            return <>
                                                {fields.map(({key, name, ...restField}, index) => {
                                                    const productId = form.getFieldValue(['details', name, 'productId']);
                                                    const imageUrl = form.getFieldValue(['details', name, 'imageUrl']);
                                                    const productName = form.getFieldValue(['details', name, 'productName']);
                                                    const subTotalAmount = form.getFieldValue(['details', name, 'subTotalAmount']);
                                                    const product = form.getFieldValue(['details', name]);

                                                    return (
                                                        <div
                                                            className='flex items-center justify-between py-2 border-b border-solid border-[#e9e9e9]'
                                                            key={key}>
                                                            <div
                                                                onClick={() => openProductOrderForm(product)}
                                                                className='w-14 h-14 overflow-hidden rounded-[6px] mr-[6px] cursor-pointer'>
                                                                <img loading='lazy'
                                                                     src={imageUrl ? GetFileUrl(imageUrl) : "/images/product-placeholder.png"}
                                                                     className='object-cover w-full h-full'/>
                                                            </div>
                                                            <div className='flex-grow ord-input-bottom-line'>
                                                                <div className='cursor-pointer'
                                                                     onClick={() => openProductOrderForm(product)}>
                                                                    <TextLineClampDisplay rows={1}
                                                                                          className='text-[#44494D] h-[24px] !text-base'
                                                                                          content={productName}/>
                                                                </div>
                                                                <Form.Item noStyle name={[name, 'notes']}
                                                                           rules={[ValidateUtils.maxLength(200, 'Ghi chú')]}>
                                                                    <Input placeholder='Nhập ghi chú' onChange={(e) =>
                                                                        onChangeNote(e, productId)}
                                                                           className='!border-0 !shadow-none'/>
                                                                </Form.Item>
                                                            </div>
                                                            <div className='ml-4 h-[70px] flex flex-col'>
                                                                <div className='flex items-center flex-grow'>
                                                <span onClick={() => decrease(name, productId)}>
                                                    <Tooltip title={t('Giảm')}>
                                                        <SubTractIcon2
                                                            className='text-[#00A660] text-[20px] cursor-pointer'/>
                                                    </Tooltip>
                                                </span>
                                                                    <Form.Item name={[name, 'qty']}>
                                                                        <PriceNumberInput
                                                                            onChange={(qty: any) => onChangeQty(productId, qty)}
                                                                            min={0}
                                                                            step={1}
                                                                            integerLimit={20}
                                                                            decimalLimit={5}
                                                                            controls={false}
                                                                            className='inline-block border-0 mx-2 w-[60px] font-medium text-[#2D2D2D] price-input'/>
                                                                    </Form.Item>
                                                                    <span onClick={() => increase(name, productId)}>
                                                         <Tooltip title={t('Tăng')}>
                                                         <AddIcon2
                                                             className='text-[#00A660] text-[20px] cursor-pointer'/>
                                                    </Tooltip>
                                                    </span>
                                                                </div>
                                                                <div
                                                                    className='text-right mt-auto flex items-center justify-end'>
                                                                    <PriceCell
                                                                        className='font-semibold text-base text-black'
                                                                        value={subTotalAmount}/>
                                                                    <div onClick={() => {
                                                                        orderStateStore.deleteProductFromOrder(tableId, productId)
                                                                    }}>
                                                                        <Tooltip title={t('Xoá')}>
                                                                            <DeleteIcon2
                                                                                className='text-[20px] cursor-pointer text-[#FF0101] ml-2'/>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div hidden>
                                                                <Form.Item name='priceListId'/>
                                                                <Form.Item name='productUnitId'/>
                                                                <Form.Item name='productPrice'/>
                                                                <Form.Item name='productPriceWithTax'/>
                                                                <Form.Item name='isProductPriceIncludeTax'/>
                                                                <Form.Item name='taxPercent'/>
                                                                <Form.Item name='taxCode'/>
                                                                <Form.Item name='discountType'/>
                                                                <Form.Item name='discountAmount'/>
                                                                <Form.Item name='discountInput'/>
                                                                <Form.Item name='productUnitName'/>
                                                                <Form.Item name='convertRate'/>

                                                                {/*Thông tin cần thêm khi edit*/}
                                                                <Form.Item name='id'/>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }}
                                    </Form.List>
                                </div>
                            </div>

                            <div hidden>
                                <Form.Item name='reservationId'/>

                                {/*Thông tin cần thêm khi edit*/}
                                <Form.Item name='id'/>
                                <Form.Item name='orderCode'/>
                                <Form.Item name='status'/>
                            </div>
                        </Form>
                    }
                    {
                        !orderStateStore.orderSelected &&
                        <div style={{minHeight: 'calc(100vh - 186px)'}}
                             className='flex flex-col items-center justify-center'>
                            <img src="/icon-svg/empty.svg" alt="image"/>
                            <span className='text-lg font-semibold inline-block mt-2'>{t('Chưa có đơn hàng')}</span>
                        </div>
                    }
                </div>
            </div>
            <Row gutter={12}>
                <Col span={8}>
                    <Button icon={<WalletIcon/>} onClick={paymentSubmit}
                            className='w-full px-4 py-2 text-base font-semibold mt-4 rounded-[6px] '>
                        Thanh toán
                    </Button>
                </Col>
                <Col span={16}>
                    <Button icon={<OrderIcon2/>} onClick={orderSubmit}
                            className='text-white bg-[#15713A] w-full px-4 py-2 text-base font-semibold mt-4 rounded-[6px] '>
                        Order
                    </Button>
                </Col>
            </Row>

            {/*Thông tin chi tiết sản phẩm*/}
            <ProductOrderDetailModal ref={productOrderDetailRef}/>

            {/*Thanh toán đơn hàng*/}
            <Suspense fallback={<></>}>
                <Drawer
                    title={<div className='flex items-center justify-between'>
                        <div> {t('Thanh toán đơn hàng')}</div>
                        <p className='text-base italic font-normal'> {t('Khách hàng')}: <span
                            className='font-semibold'>{orderStateStore.orderSelected?.partnerName}</span> - <span
                            className='font-semibold'>{orderStateStore.orderSelected?.tableName}</span>
                        </p>
                    </div>}
                    placement={'right'}
                    width={'40%'}
                    closable={{'aria-label': 'Close Button'}}
                    onClose={onClosePayment}
                    open={isOpenPayment}
                    key={'right'}
                >
                    <PaymentOrder onClosePayment={onClosePayment}/>
                </Drawer>
            </Suspense>
        </>
    );
};

export default memo(observer(MenuList));
