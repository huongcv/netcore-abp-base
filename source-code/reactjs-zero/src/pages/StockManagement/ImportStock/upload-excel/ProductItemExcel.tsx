import React, {memo, useEffect} from 'react';
import {Form, Space, Table, TableColumnsType, Tag} from "antd";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import TableUtil from "@ord-core/utils/table.util";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import StockDisplayEllipsisTextLong from "@ord-components/displays/StockDisplayEllipsisTextLong";
import DateUtil from "@ord-core/utils/date.util";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import UpsertFormUtil from '@pages/StockManagement/Shared/utils/UpsertForm.util';
import Utils from "@ord-core/utils/utils";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import NumberUtil from "@ord-core/utils/number.util";
import {SumIcon} from "@ord-components/icon/SumIcon";
import {TaxCodeNotUse} from "@ord-core/AppConst";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const ProductItemExcel = (props: { formMoveTicket: any }) => {
    const {stockMoveStore} = useStore();
    const {productItemsFromExcel: dataSource} = stockMoveStore;
    const {formMoveTicket} = props;

    const totalAmountBeforeDiscount_w = Form.useWatch("totalAmountBeforeDiscount", formMoveTicket);
    const discountAmountMove_w = Form.useWatch("discountAmount", formMoveTicket);
    const totalAmountBeforeTax_w = Form.useWatch("totalAmountBeforeTax", formMoveTicket);
    const taxAmount_w = Form.useWatch("taxAmount", formMoveTicket);
    const taxDiscountPercent_w = Form.useWatch("taxDiscountPercent", formMoveTicket);
    const totalAmount_w = Form.useWatch("totalAmount", formMoveTicket);
    const totalAmountRound_w = Form.useWatch("totalAmountRound", formMoveTicket);
    const paymentAmount_w = Form.useWatch("paymentAmount", formMoveTicket);
    const discountValue_w = Form.useWatch("discountValue", formMoveTicket);
    const discountType_w = Form.useWatch("discountType", formMoveTicket);
    const moveType_w = Form.useWatch("moveType", formMoveTicket);

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "productName",
                dataIndex: "productName",
                width: 220,
                render: (value, dto) =>
                    <>
                        <TextLineClampDisplay className='!text-[#505050] !font-medium !text-base'
                                              content={dto.productName!}/>

                        {
                            !!dto.lotNumber &&
                            <Space.Compact className='mt-2 inline-flex items-center'>
                                <Tag color="#87d068">
                                    <StockDisplayEllipsisTextLong text={dto.lotNumber}
                                                                  className='text-base inline-flex' maxWidth={120}/>
                                </Tag>
                                <Tag className='h-fit'>{DateUtil.showWithFormat(dto.expiryDate)} </Tag>
                            </Space.Compact>
                        }
                    </>
            },
            {
                title: "qty",
                dataIndex: "qty",
                align: 'center',
                width: 110
            },
            {
                title: "unit",
                dataIndex: "unitName",
                width: 100
            },
            {
                title: "Giá nhập",
                dataIndex: "price",
                align: 'right',
                width: 150,
                render: (value, dto) => <>
                    <PriceCell value={dto.price}/>

                    {dto.totalAmountBeforeDiscount > 0 && (
                        <div>
                            <SumIcon className={"me-1"}/>
                            <PriceCell value={dto.totalAmountBeforeDiscount}/>
                        </div>
                    )}
                </>
            },
            {
                title: "discount",
                dataIndex: "discountAmount",
                align: 'right',
                width: 150,
                render: (value, dto) => <>
                    <div>
                        {dto.discountPercent || 0}%
                    </div>
                    <div>
                        <PriceCell value={dto.discountAmount || 0}/> VNĐ
                    </div>
                </>
            },
            {
                title: "vat",
                dataIndex: "taxCode",
                align: 'center',
                width: 150,
                render: (value, dto) => <>
                    <div>
                        {dto.taxCode === TaxCodeNotUse ? 'Không thuế' : dto.taxCode}
                    </div>
                    {dto.subTaxAmount > 0 && (
                        <>
                            <SumIcon className={"me-1"}/>
                            <PriceCell value={dto.subTaxAmount}/>
                        </>
                    )}
                </>
            },
            {
                title: "totalAmountDetail",
                dataIndex: "totalAmountAfterDiscount",
                align: 'right',
                width: 150,
                render: (value, dto) => <>
                    <PriceCell fixed={2} value={dto.totalAmountAfterDiscount}/>
                </>
            },
        ],
        {
            widthRowIndexCol: 50,
            ns: 'stock'
        });

    //Tính giảm giá phân bổ cho sản phẩm
    useEffect(() => {
        const discountAmountMove = UpsertFormUtil.calculatorDiscountAmount(
            discountType_w,
            discountValue_w,
            totalAmountBeforeDiscount_w
        );

        if (dataSource?.length > 0) {
            let idx = 0;
            let totalAfterDiscountItems = 0;
            dataSource.forEach((it) => {
                totalAfterDiscountItems += it.totalAmountAfterDiscount || 0;
            });
            let amountAllocation = 0;
            dataSource.forEach((it) => {
                if (idx + 1 === dataSource.length) {
                    const amountAllocationFinal =
                        discountAmountMove - amountAllocation || 0;

                    it.discountAmountAllocation = amountAllocationFinal;

                    const totalAmountBeforeTax =
                        (it.totalAmountAfterDiscount || 0) - amountAllocationFinal;

                    it.totalAmountBeforeTax = totalAmountBeforeTax;
                    return;
                }

                if (discountAmountMove == 0 || totalAfterDiscountItems == 0) {
                    it.discountAmountAllocation = 0;
                } else {
                    const percentAllocation =
                        (it.totalAmountAfterDiscount || 0) / totalAfterDiscountItems;
                    const discountAmountAllocation =
                        Utils.parseFloatWithFixed(
                            percentAllocation * discountAmountMove,
                            2
                        ) || 0;

                    it.discountAmountAllocation = discountAmountAllocation;

                    const totalAmountBeforeTax =
                        (it.totalAmountAfterDiscount || 0) - discountAmountAllocation;

                    it.totalAmountBeforeTax = totalAmountBeforeTax;

                    amountAllocation =
                        amountAllocation + (discountAmountAllocation || 0);
                }

                idx++;
            });
        }
    }, [discountAmountMove_w, totalAmountBeforeDiscount_w, discountValue_w]);

    useEffect(() => {
        //tong chiet khau cua phieu
        const discountAmountMove = UpsertFormUtil.calculatorDiscountAmount(
            discountType_w,
            discountValue_w,
            totalAmountBeforeDiscount_w
        );
        //thue chiet khau cua phieu
        const taxDiscountAmount =
            Utils.parseFloatWithFixed(
                ((discountAmountMove || 0) * (taxDiscountPercent_w || 0)) / 100,
                2
            ) || 0;

        let totalAmountBeforeDiscount = 0;
        let taxAmount = 0;
        let amountAllocation = 0;

        dataSource.forEach((it, index) => {
            it.totalAmountBeforeDiscount = (it.qty || 0) * (it.price || 0);
            //tinh lai giam gia khi so luong, tien thay doi
            if (it.discountType === DiscountTypeEnum.Percent) {
                it.discountAmount = UpsertFormUtil.calculatorDiscountAmount(
                    it.discountType,
                    it.discountPercent,
                    it.totalAmountBeforeDiscount
                );
            }
            //neu giam gia > tien truoc chiet khau => gia gia = tien truoc chiet khau
            else if (
                (it.discountAmount || 0) > (it.totalAmountBeforeDiscount || 0)
            ) {
                it.discountAmount = it.totalAmountBeforeDiscount;
            }

            //Tính thuế chiết khấu phân bổ
            if (dataSource.length === index + 1) {
                it.taxDiscountAmountAllocation =
                    taxDiscountAmount - amountAllocation || 0;
            } else {
                it.taxDiscountAmountAllocation =
                    Utils.parseFloatWithFixed(
                        ((it.totalAmountAfterDiscount || 0) /
                            totalAmountBeforeDiscount_w) *
                        (taxDiscountAmount || 0),
                        2
                    ) || 0;

                amountAllocation += it.taxDiscountAmountAllocation;
            }

            const totalAmountBeforeDiscountRaw = (it.price || 0) * (it.qty || 0);
            const totalAmountAfterDiscountRaw =
                totalAmountBeforeDiscountRaw - (it.discountAmount || 0);

            it.totalAmountAfterDiscount = Utils.parseFloatWithFixed(totalAmountAfterDiscountRaw, 2);
            it.subTaxAmount =
                Utils.parseFloatWithFixed(
                    (totalAmountAfterDiscountRaw * (it.taxPercent || 0)) / 100,
                    2
                ) || 0;
            it.subTotalAmount = Utils.setPriceWithFixed(
                (it.subTaxAmount || 0) + (it.totalAmountAfterDiscount || 0)
            )

            const taxAmountItem =
                Utils.parseFloatWithFixed(
                    (it.subTaxAmount || 0) - (it.taxDiscountAmountAllocation || 0),
                    2
                ) || 0;

            it.taxAmount = taxAmountItem;

            const totalAmount = (it.totalAmountBeforeTax || 0) + taxAmountItem;

            it.totalAmount = Utils.parseFloatWithFixed(totalAmount > 0 ? totalAmount : 0, 2);

            if (it.totalAmountAfterDiscount && it.totalAmountAfterDiscount > 0) {
                totalAmountBeforeDiscount += it.totalAmountAfterDiscount;
            }

            taxAmount += (it.taxAmount || 0);
        });

        if (taxAmount < 0) {
            taxAmount = 0;
        }

        formMoveTicket.setFieldValue(
            "totalAmountBeforeDiscount",
            Utils.parseFloatWithFixed(totalAmountBeforeDiscount, 2)
        );

        formMoveTicket.setFieldValue(
            "taxAmount",
            Utils.parseFloatWithFixed(taxAmount, 2)
        );
    }, [dataSource, taxDiscountPercent_w, discountValue_w]);

    useEffect(() => {
        const totalAmount =
            dataSource?.reduce(
                (total: number, x: any) => total + x.totalAmount || 0,
                0
            ) || 0;
        formMoveTicket.setFieldValue(
            "totalAmount",
            Utils.parseFloatWithFixed(totalAmount, 2)
        );

        const totalAmountRound = NumberUtil.ceil(totalAmount);
        formMoveTicket.setFieldValue("totalAmountRound", totalAmountRound);

        //tong tien thay doi thi so tien thanh toan thay doi theo
        if (moveType_w == MoveType.PhieuNhapNhaCungCap || moveType_w == MoveType.PhieuXuatTraNhaCungCap) {
            formMoveTicket.setFieldValue("paymentAmount", totalAmountRound);
            formMoveTicket.setFieldValue("debtAmount", 0);
        }
    }, [
        totalAmountBeforeTax_w,
        taxAmount_w,
        taxDiscountPercent_w,
        discountValue_w,
    ]);

    useEffect(() => {
        const paymentAmount = paymentAmount_w ?? 0;
        const totalAmountRound = totalAmountRound_w ?? 0;
        let debtAmount = totalAmountRound - paymentAmount;
        debtAmount = debtAmount < 0 ? 0 : debtAmount;
        formMoveTicket.setFieldValue("debtAmount", debtAmount ?? 0);
    }, [totalAmount_w, paymentAmount_w]);

    return (
        <>
            <Table rowKey={'productId'}
                   dataSource={dataSource}
                   columns={columns}/>
        </>
    );
};

export default memo(observer(ProductItemExcel));