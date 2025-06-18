import React, {useEffect, useRef, useState} from 'react';
import {Table, TableColumnsType, Tooltip} from 'antd';
import {BookingInvoiceTempDto, FlightSlot, InfoPrivateInvoiceSimple} from '@api/index.defs';
import {useStore} from '@ord-store/index';
import {useTranslation} from 'react-i18next';
import Utils from '@ord-core/utils/utils';
import {observer} from 'mobx-react-lite';
import {NewIcon} from '@ord-components/icon/NewIcon';
import UiUtils from '@ord-core/utils/ui.utils';
import {PriceCell} from "@ord-components/table/cells/priceCell";
import TableUtil from "@ord-core/utils/table.util";
import {PAYMENT_STATUS} from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";
import {DollarCircleOutlined} from "@ant-design/icons";

interface ICardProductItem extends InfoPrivateInvoiceSimple {
    isNew: boolean
}

const CardProduct = ({slot}: { slot: FlightSlot }) => {
    const {
        golfBookingStore: mainStore,
        golfCheckInOutStore,
        paymentCentralBillingStore,
        golfSelectProductStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const [isLoading, setIsLoading] = useState(true);
    const [infoBooking, setInfoBooking] = useState<BookingInvoiceTempDto>();
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        refreshData();
    }, [slot]);

    async function refreshData() {
        if (slot.bookingPlayerId) {
            setIsLoading(true);
            const data = await mainStore.getBookingInvoiceTemp(parseInt(slot.bookingPlayerId));
            setIsLoading(false);
            if (data?.isSuccessful) {
                setInfoBooking(data.data);
                golfSelectProductStore.setTempInvoice(data.data?.invoiceId);
            } else {
                UiUtils.showError(data.message || t('getBookingInfoError'));
            }
        }
    }

    useEffect(() => {
        const playerId = slot.bookingPlayerId;
        if (!playerId) return;
        const list = golfSelectProductStore.productAddTempData?.listProduct;
        if (list?.length > 0) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({behavior: 'smooth'});
            }, 100);
        }
    }, [slot.bookingPlayerId, golfSelectProductStore.productAddTempData?.listProduct?.length]);

    const columns: TableColumnsType<ICardProductItem> = TableUtil.getColumns(
        [
            {
                title: t('Product'),
                dataIndex: 'productName',
                key: 'productName',
                width: 300,
                render: (text: string, data) => {
                    return <>
                        {text} {data.isNew && <NewIcon height={16} width={16} className='pl-1'></NewIcon>}
                    </>
                },
            },
            {
                dataIndex: 'qty',
                title: t('Qty'),
                width: 100,
                align: 'center',
            },
            // {
            //     dataIndex: 'basicUnitName',
            //     title: t('Unit'),
            //     align: 'center',
            //     width: 120,
            // },
            {
                title: t('Amount'),
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                align: 'right',
                render: (v, product) => (
                    <>
                        <PriceCell value={v}/>
                        {product.paymentStatus == PAYMENT_STATUS.DA_THANH_TOAN ?
                            <Tooltip title={t('isPaid')}>
                                <DollarCircleOutlined className='pl-1'
                                                      style={{color: 'green'}}/>
                            </Tooltip>

                            : <Tooltip title={t('noPaid')}>
                                            <span
                                                className="ml-1 inline-block w-4 h-4 border border-blue-900 rounded-full"></span>
                            </Tooltip>
                        }
                    </>
                ),
                width: 110,
            },
        ],
        {
            ns: mainStore.getNamespaceLocale(),
            widthRowIndexCol: 50,
        }
    );

    const dataSource = [
        ...(infoBooking?.viewInvoice || []).map((p, idx) => ({
            key: `paid_${idx}`,
            ...p,
            isNew: false
        } as ICardProductItem)),
        ...(golfSelectProductStore.productAddTempData?.listProduct || []).map((p, idx) => ({
                key: `new_${idx}`,
                ...p,
                totalAmount: (p.qty ?? 0) * (p.productPrice ?? 0),
                isNew: true
            } as ICardProductItem
        ))
    ];

    return (
        <Table<ICardProductItem>
            size="small"
            bordered={false}
            footer={() => {
                const extra = golfSelectProductStore.productAddTempData?.totalAmount ?? 0;
                return (
                    <div className="pt-2 flex justify-between items-center text-base  w-full px-2">
                        <span className="font-bold">{t('SubTotalDue')}</span>
                        <span className="font-bold">
                                  {Utils.formatterNumber((infoBooking?.debtAmount ?? 0) + extra)}
                                </span>
                    </div>
                );
            }}
            pagination={false}
            loading={isLoading}
            columns={columns}
            dataSource={dataSource}
            rowKey="key"
        />
    );
};

export default observer(CardProduct);
