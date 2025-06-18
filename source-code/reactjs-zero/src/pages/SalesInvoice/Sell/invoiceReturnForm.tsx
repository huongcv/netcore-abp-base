import "./sellForm.scss";
import {Alert, Button, Collapse, CollapseProps, Flex, Form, FormInstance, Input, Space, Tag,} from "antd";
import React, {memo, useEffect, useMemo, useRef} from "react";
import {CloseOutlined, MinusOutlined, PlusOutlined, SaveOutlined,} from "@ant-design/icons";
import {DiscountForm} from "@pages/SalesInvoice/Sell/discountForm";
import {NumericFormat} from "react-number-format";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import UiUtils from "@ord-core/utils/ui.utils";
import {CustomerSelectForm} from "@pages/SalesInvoice/Form/CustomerSelectForm";
import DateUtil from "@ord-core/utils/date.util";
import {PrescriptionTypeEnum, SaleInvoiceDetailDto, SaleInvoiceDto} from "@api/index.defs";
import {SaleInvoiceStatusEnum} from "@pages/SalesInvoice/Utils/saleCommon";
import {SearchInvoiceIcon} from "@ord-components/icon/SearchInvoiceIcon";
import {InvoiceSelectSearchApi} from "@pages/SalesInvoice/Form/invoiceSelectSearchApi";
import {DeleteIcon} from "@ord-components/icon/DeleteIcon";
import {WalletIcon} from "@ord-components/icon/WalletIcon";
import {PaymentMethodForm} from "@pages/SalesInvoice/Form/paymentMethodForm";
import {InvoiceInfoForm} from "@pages/SalesInvoice/Form/InvoiceInfoForm";
import {currencyDefault} from "@ord-core/AppConst";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectChannelType} from "@ord-components/forms/select/selectDataSource/useSelectChannelType";
import Utils from "@ord-core/utils/utils";
import {round} from "lodash";
import {IProductSaleDto} from "@pages/SalesInvoice/Sell/index";
import OrdDisplayEllipsisTextLong from "@ord-components/displays/OrdDisplayEllipsisTextLong";
// @ts-ignore
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {useTranslation} from "react-i18next";
import {CalculatorCurrencyUtil, CalculatorDiscountAllocationInputDto} from "@ord-core/utils/calculatorCurrency.util";

export const InvoiceReturnForm = (props: {
    form: FormInstance;
    products: IProductSaleDto[];
    refreshDate: Date;
    removeProductHandler: React.EventHandler<any>;
    upOrDownProductHandler: React.EventHandler<any>;
    refreshProductHandler: Function;
    openListInvoiceHandler: React.EventHandler<any>;
    selectInvoiceHandler: React.EventHandler<any>;
}) => {
    const {t} = useTranslation("sale-invoice");
    const [collapsePrice, setCollapsePrice] = React.useState<boolean>(true);
    const relatedInvoiceId_w = Form.useWatch("relatedInvoiceId", props.form);
    const taxDiscountAmount_w = Form.useWatch("taxDiscountAmount", props.form) ?? 0;
    const paymentAmount_w = Form.useWatch("paymentAmount", props.form) ?? 0;
    const discountAmount_w = Form.useWatch("discountAmount", props.form) ?? 0;

    const {
        totalAmountBeforeDiscount_w = 0,
        taxAmountFromProduct_w = 0,
        totalProduct_w = 0,
    } = useMemo(() => {
        let totalSubTax = 0;

        props.products.forEach((p) => {
            totalSubTax += p.subTaxAmount ?? 0;
        });

        return {
            totalAmountBeforeDiscount_w: CalculatorCurrencyUtil.summaryTotalAmountBeforeDiscount(props.products?.map(x => x.totalAmountAfterDiscount || 0) || []),
            taxAmountFromProduct_w: round(totalSubTax, CalculatorCurrencyUtil.decimalRound),
            totalProduct_w: props.products.length
        }
    }, [props.products, props.refreshDate])

    useEffect(() => {
        const discountType = props.form.getFieldValue("discountType") ||
                            DiscountTypeEnum.Percent;

        const discountPercent = props.form.getFieldValue("discountPercent");
        const discountAmount = props.form.getFieldValue("discountAmount");
        const taxDiscountPercent = props.form.getFieldValue("taxDiscountPercent");
        const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(
                discountType, discountPercent, discountAmount, totalAmountBeforeDiscount_w)

        const taxDiscountAmount = CalculatorCurrencyUtil.summaryTaxDiscountAmount(
                    calculateDiscount.discountAmount, taxDiscountPercent);

        props.form.setFieldsValue({
            discountAmount: calculateDiscount.discountAmount,
            discountPercent: calculateDiscount.discountPercent,
            taxDiscountAmount: taxDiscountAmount,
        });

    }, [totalAmountBeforeDiscount_w,]);

    useEffect(() => {
        if (totalProduct_w === 0) {
            props.form.setFieldsValue({
                taxDiscountAmount: 0,
                discountAmount: 0,
                discountPercent: 0
            });
        }

    }, [totalProduct_w,]);

    const totalTax = useMemo(() => {
        return round(taxAmountFromProduct_w - taxDiscountAmount_w, CalculatorCurrencyUtil.decimalRound);
    }, [taxAmountFromProduct_w, taxDiscountAmount_w]);

    const totalAmountBeforeTax = useMemo(() => {
        return CalculatorCurrencyUtil.summaryTotalAmountBeforeTax2(totalAmountBeforeDiscount_w, discountAmount_w);  //- Khuyến mại nếu có
    }, [totalAmountBeforeDiscount_w, discountAmount_w]);

    const totalNeedPayment = useMemo(() => {
        const totalAmountSummary = CalculatorCurrencyUtil.summaryTotalAmount2(totalAmountBeforeTax, totalTax);
        return CalculatorCurrencyUtil.summaryTotalAmountRound(totalAmountSummary);
    }, [totalAmountBeforeTax, totalTax]);

    const debtAmount = useMemo(() => {
        return CalculatorCurrencyUtil.summaryDebtAmount(totalNeedPayment, paymentAmount_w);
    }, [paymentAmount_w, totalNeedPayment]);

    useEffect(() => {
        props.form.setFieldValue("paymentAmount", totalNeedPayment);
    }, [totalNeedPayment]);

    useEffect(() => {
        props.form.setFieldValue("moveDate", new Date());
    }, []);

    useEffect(() => {
        productPriceOnChange();

        // case khác với trường hợp trả hàng
        // đặt vấn đề => khi trả hàng thì giá trả ít hàng hơn so với đơn => trả hàng thành công => sinh ra 1 phiếu mới (phiếu trả thiếu) và phiếu cũ vẫn
        // giữ nguyên totalAmountAfterDiscount cũ mà không trừ đi returnTotalAmount của phiếu trả thiếu trên
        // props.products.map((p: SaleInvoiceDetailDto) => {
        //   if (
        //     p.returnTotalAmount &&
        //     p.totalAmountAfterDiscount &&
        //     p.returnTotalAmount > 0
        //   ) {
        //     console.log(1);
        //     p.totalAmountAfterDiscount =
        //       p.totalAmountAfterDiscount - p.returnTotalAmount;
        //   }
        // });
    }, [props.products, props.refreshDate]);

    const upProduct = (item: any) => {
        if (!item.purchasedQty || item.purchasedQty > item.qty) {
            props.upOrDownProductHandler({item: item, num: 1});
        } else if (item.purchasedQty) {
            UiUtils.showError("Tối đa là: " + item.purchasedQty);
        }
    };
    const changeNumProduct = (e: any, item: any) => {
        const newNum = e - item.qty;
        props.upOrDownProductHandler({item: item, num: newNum ?? 1});
    };

    const downProduct = (item: any) => {
        props.upOrDownProductHandler({item: item, num: -1});
    };

    const removeProduct = (item: any) => {
        props.removeProductHandler(item);
    };

    // const refreshProduct = () => {
    //     props.refreshProductHandler();
    // };
    //
    // const totalProduct = () => {
    //     return props.products.reduce(
    //         (total: number, participant: any) => total + participant.qty,
    //         0
    //     );
    // };

    // const taxFormRef = useRef();
    // const openTaxForm = () => {
    //     // @ts-ignore
    //     taxFormRef.current.showModal();
    // };

    // const productFormRef = useRef();
    // const openProductOrderForm = (product: any) => {
    //     // @ts-ignore
    //     productFormRef.current.showModal(product);
    // };

    const productPriceOnChange = () => {
        const discountPercent = props.form.getFieldValue("discountPercent");
        const discountAmount = props.form.getFieldValue("discountAmount");
        const discountType = props.form.getFieldValue("discountType") || DiscountTypeEnum.Percent;
        const taxDiscountPercent = props.form.getFieldValue("taxDiscountPercent");

        const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(
                discountType, discountPercent, discountAmount, totalAmountBeforeDiscount_w)

        const taxDiscountAmount = CalculatorCurrencyUtil.summaryTaxDiscountAmount(
            calculateDiscount.discountAmount, taxDiscountPercent);

        props.form.setFieldValue("discountAmount", calculateDiscount.discountAmount);
        props.form.setFieldValue("discountPercent", calculateDiscount.discountPercent);

        let totalDiscountAmountAllocation = 0;
        let totalTaxDiscountAmountAllocation = 0;
        const itemTotalCount = props.products.length;

        props.products.forEach((product: SaleInvoiceDetailDto, index: number) => {
            if (!!product?.discountAmount && !!product?.totalAmountBeforeDiscount) {
                //tinh giam gia phan bo
                const discountParams: CalculatorDiscountAllocationInputDto = {
                    itemTotalAmountAfterDiscount: product.totalAmountAfterDiscount,
                    totalAmountBeforeDiscountSummary: totalAmountBeforeDiscount_w,
                    totalDiscountAmountSummary: calculateDiscount.discountAmount,
                    totalTaxDiscountAmountSummary: taxDiscountAmount,
                    totalDiscountAmountAllocation: totalDiscountAmountAllocation,
                    totalTaxDiscountAmountAllocation: totalTaxDiscountAmountAllocation,
                    isLastItem: index === itemTotalCount - 1
                };
                const calculatorDiscountAllocation =
                    CalculatorCurrencyUtil.calculateDiscountAllocation(discountParams);

                product.discountAmountAllocation = calculatorDiscountAllocation.discountAmountAllocation;
                product.taxDiscountAmountAllocation = calculatorDiscountAllocation.taxDiscountAmountAllocation;

                totalDiscountAmountAllocation += product.discountAmountAllocation || 0;
                totalTaxDiscountAmountAllocation += product.taxDiscountAmountAllocation || 0;
            }

            product.promotionAmountAllocation = 0;
            product.taxPromotionAmountAllocation = 0;

            product.taxAmount = CalculatorCurrencyUtil.calculateTaxAmount(
                product.productPrice, product.qty, product.discountAmount, product.taxPercent,
                product.taxDiscountAmountAllocation, product.taxPromotionAmountAllocation);
        });

        const summaryTaxAmount = CalculatorCurrencyUtil.summaryTaxAmount(props.products?.map(x => x.taxAmount) || []);
        props.form.setFieldValue("taxAmount", summaryTaxAmount);
    };

    const relatedInvoiceChange = (item: SaleInvoiceDto | undefined) => {
        props.selectInvoiceHandler(item);
    };

    const collapseItems: CollapseProps["items"] = [
        {
            key: "1",
            forceRender: true,
            label: (
                <Flex justify={"space-between"}>
                      <span className="text-base">
                        <strong>{t("paymentInformation")}</strong>
                          {/*<strong>{props.products.length}</strong> sản phẩm)*/}
                      </span>
                    {collapsePrice && <strong>
                        {props.products.length} sản phẩm
                    </strong>}
                </Flex>
            ),
            children: (
                <>
                    <div className="flex flex-col gap-0 text-[#636363]">
                        <Form.Item name="totalProductPrice" hidden>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="subTaxAmount" hidden>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="totalAmountBeforeDiscount" hidden>
                            <Input/>
                        </Form.Item>
                        <div className="flex justify-between items-center  h-[33px]">
                            <div>{t("channel")}</div>
                            <Flex className="items-center cs-input">
                                <Form.Item name="saleChannelTypeId" initialValue={0}>
                                    <OrdSelect
                                        disabled={true}
                                        placeholder={t("channel")}
                                        datasource={useSelectChannelType()}
                                    ></OrdSelect>
                                </Form.Item>
                            </Flex>
                        </div>
                        <div className="flex justify-between text-md items-center  h-[33px]">
                            <div>
                                Tạm tính : (<strong>{props.products.length}</strong> sản phẩm)
                            </div>
                            <strong>
                                {
                                    <NumericFormat
                                        value={totalAmountBeforeDiscount_w}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                    />
                                }{" "}
                                {currencyDefault}
                            </strong>
                        </div>
                        <DiscountForm disabled={true} form={props.form}></DiscountForm>
                        {/*<div className="flex justify-between text-md items-center  h-[33px]">*/}
                        {/*    <div>*/}
                        {/*        Giảm giá*/}
                        {/*    </div>*/}
                        {/*    <Form.Item name="discountAmountFromProduct" hidden>*/}
                        {/*    </Form.Item>*/}
                        {/*    {Utils.formatterNumber(discountAmountFromProduct_w, 0)} {currencyDefault}*/}
                        {/*</div>*/}
                        <div className="flex justify-between text-md items-center  h-[33px]">
                            <div>
                                Tổng tiền trước thuế
                            </div>
                            <strong>
                                {Utils.formatterNumber(totalAmountBeforeTax, 2)} {currencyDefault}
                            </strong>
                        </div>
                        <div className="flex justify-between text-md items-center  h-[33px]">
                            <div>
                                Tổng tiền thuế
                            </div>
                            {Utils.formatterNumber(totalTax, 2)} {currencyDefault}
                        </div>

                        <div className="flex justify-between text-xl items-center h-[33px] font-bold text-primary ">
                            <strong className=''>{t("totalAmount")}</strong>
                            <strong>
                                {Utils.formatterNumber(totalNeedPayment, 0)} {currencyDefault}
                            </strong>
                        </div>

                        <div>

                            <div className="flex justify-between items-center">
                                <div>
                                    {t("returnCustomerPayment")}
                                    <span
                                        className={
                                            "text-[12px] opacity-80 " +
                                            (debtAmount > 0 ? "text-red-500" : "text-emerald-500")
                                        }
                                    >
                                    {debtAmount > 0 ? (
                                        <>
                                            {" "}
                                            (Còn:{" "}
                                            <NumericFormat
                                                value={debtAmount}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                            />
                                            ){" "}
                                        </>
                                    ) : debtAmount < 0 ? (
                                        <>
                                            {" "}
                                            (Dư:{" "}
                                            <NumericFormat
                                                value={0 - debtAmount}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                            />
                                            ){" "}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                  </span>
                                </div>
                                <Flex className="items-center cs-input">
                                    <Form.Item name="paymentAmount" style={{width: 120}}>
                                        <PriceNumberInput
                                            disabled
                                            className="border-none w-full font-semibold"
                                            step={1000}
                                            min={0}
                                        />
                                    </Form.Item>
                                    &nbsp;<strong>{currencyDefault}</strong>
                                </Flex>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-between items-center mt-2 mb-3">
                            <div>{t("paymentMethod")} </div>
                            <PaymentMethodForm
                                totalPayment={totalNeedPayment}
                            ></PaymentMethodForm>
                        </div>
                        <InvoiceInfoForm/>
                    </div>
                </>
            ),
        },
    ];
    const collapseOnChange = (value: any) => {
        if (value && value.indexOf("1") < 0) setCollapsePrice(true);
        else setCollapsePrice(false);
    };
    const removeCustomerSelect = () => {
        relatedInvoiceChange(undefined);
    };

    const handleDateInvoiceReturn = () => {
        const invoiceDateReturn = props.form.getFieldValue("invoiceDate");
        if (invoiceDateReturn) {
            const invoiceDateHidden = props.form.getFieldValue("invoiceDateHidden");
            if (
                invoiceDateHidden &&
                invoiceDateReturn < new Date(invoiceDateHidden)
            ) {
                UiUtils.showError(t("invoiceDateReturnError"));
                return true;
            }
        }
        return false;
    };
    const PrescriptionInfo = memo((prop: { prescriptionType: PrescriptionTypeEnum }) => {
        const {prescriptionType} = prop;
        // Tránh render nếu w_isPrescription = false
        if (!prescriptionType) return null;

        return (
            <Alert
                message={
                    <>
                        <a onClick={() => {
                        }}>
                            {t("isSalesPrescription")}
                        </a>
                    </>
                }
                type="info"
                showIcon
            />
        );
    });
    return (
        <div className="flex flex-col gap-4 justify-between h-[100%]">
            <div className="relative">
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="invoiceCode" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="partnerId" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="relatedInvoiceCode" hidden>
                    <Input/>
                </Form.Item>
                <Space.Compact style={{width: "100%", marginBottom: 2}}>
                    <Form.Item name="relatedInvoiceId" style={{width: "100%"}}>
                        <InvoiceSelectSearchApi
                            onInvoiceSelected={relatedInvoiceChange}
                        ></InvoiceSelectSearchApi>
                    </Form.Item>
                    {relatedInvoiceId_w ? (
                        <Button onClick={removeCustomerSelect} className="bg-gray-100">
                            <CloseOutlined/>
                        </Button>
                    ) : (
                        <Button
                            onClick={props.openListInvoiceHandler}
                            className="bg-gray-100"
                        >
                            <SearchInvoiceIcon/>
                        </Button>
                    )}
                </Space.Compact>
                <CustomerSelectForm form={props.form}/>
            </div>
            <Form.Item name="prescriptionInfo" hidden>
                <Input/>
            </Form.Item>
            <Form.Item name="prescriptionType" hidden>
                <Input/>
            </Form.Item>
            <PrescriptionInfo
                prescriptionType={Form.useWatch("prescriptionType", props.form)}
            ></PrescriptionInfo>
            <div className="flex-1 overflow-auto mx-[-20px] px-[20px]">
                <div className="product-select mt-3 cursor-pointer">
                    {props.products.map((pro) => {
                        const isDisabledPlus = !!(pro.inventoryCurrentQty && pro.qty === pro.inventoryCurrentQty);
                        const hasDiscount = !!pro.discountAmount;
                        const hasTax = !!pro.taxPercent;

                        const UnitDisplay = () => (
                            pro.basicUnitName ? <>(ĐVT: {pro.basicUnitName})</> : (<></>)
                        );

                        const LotInfo = () => (
                            pro.lotNumber ? (
                                <div>
                                    <Tag style={{marginInlineEnd: 0, lineHeight: "15px", fontSize: "12px"}}
                                         bordered={false} color="green">
                                        Số lô: {pro.lotNumber}
                                    </Tag>
                                    <Tag style={{lineHeight: "15px", fontSize: "12px"}} color="orange" bordered={false}>
                                        Hạn: {DateUtil.toFormat(pro.lotExpiryDate, "DD/MM/YYYY")}
                                    </Tag>
                                </div>
                            ) : <></>
                        );

                        return (
                            <div key={pro.productId} className="w-full mb-1">
                                <div className="flex w-full min-h-[60px] relative">
                                    <Button
                                        onClick={() => removeProduct(pro)}
                                        type="text"
                                        size="small"
                                        icon={<DeleteIcon style={{color: "red"}}/>}
                                        className="absolute top-1 right-0"
                                    />

                                    <img
                                        className="object-cover size-[65px] p-1 border-[1px] rounded-md"
                                        src={pro.imageUrl ? GetFileUrl(pro.imageUrl) : "/images/product-placeholder.png"}
                                    />

                                    <div className="flex-1 flex flex-col justify-between pl-4 py-1">
                                        <div className="flex font-semibold hover:underline line-clamp-2 leading-normal">
                                            <OrdDisplayEllipsisTextLong text={pro.productName ?? ""} maxWidth={300}/>
                                            <span className="text-sm pl-1 pt-[0.15rem]">
                                                <UnitDisplay/>
                                            </span>
                                        </div>

                                        <div className="flex gap-1 items-center">
                                            <Button
                                                size="small"
                                                disabled={(pro.qty ?? 0) <= 1}
                                                onClick={() => downProduct(pro)}
                                                icon={<MinusOutlined/>}
                                            />
                                            <PriceNumberInput
                                                value={pro.qty}
                                                onChange={(e) => changeNumProduct(e, pro)}
                                                min={1}
                                                max={pro.isProductUseInventory ? pro.inventoryCurrentQty : undefined}
                                                integerLimit={6}
                                                decimalLimit={3}
                                                controls={false}
                                                className="border-0 align-center w-[60px]"
                                            />
                                            <Button
                                                size="small"
                                                onClick={() => upProduct(pro)}
                                                icon={<PlusOutlined/>}
                                                disabled={isDisabledPlus}
                                            />
                                        </div>
                                    </div>

                                    <a className="w-[120px] flex flex-col align-center justify-end items-end">
                                        <div className="flex flex-row items-center">
                                            <div
                                                className={`whitespace-nowrap font-semibold text-base ${hasDiscount ? "text-red" : "text-[#45494E]"}`}>
                                                {/*{Utils.formatterNumber(pro.subTotalAmount, 2)}*/}
                                                <NumericFormat value={round(pro.subTotalAmount ?? 0, 2)}
                                                               displayType="text"
                                                               thousandSeparator/>
                                                {" "}{currencyDefault}
                                            </div>
                                            {hasTax && (
                                                <div
                                                    className="ml-1 text-[#636363] leading-3 text-sm font-normal whitespace-nowrap">
                                                    <span>(VAT: {pro.taxPercent}%)</span>
                                                </div>
                                            )}
                                        </div>

                                        {/*{hasDiscount && (*/}
                                        {/*    <div className="leading-3">*/}
                                        {/*  <span className="text-sm text-[#636363] font-semibold line-through whitespace-nowrap">*/}
                                        {/*    <NumericFormat value={Utils.formatterNumber(pro.discountAmount, 0)} displayType="text"*/}
                                        {/*                   thousandSeparator/>*/}
                                        {/*      {" "}{currencyDefault}*/}
                                        {/*  </span>*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </a>
                                </div>

                                <LotInfo/>
                            </div>
                        );
                    })}
                    {/*<ProductOrderForm*/}
                    {/*    disabled={true}*/}
                    {/*    products={props.products}*/}
                    {/*    refreshProductHandler={refreshProduct}*/}
                    {/*    ref={productFormRef}*/}
                    {/*></ProductOrderForm>*/}
                </div>
            </div>

            <div>
                <Collapse
                    onChange={collapseOnChange}
                    items={collapseItems}
                    defaultActiveKey={[]}
                    expandIconPosition="end"
                    className="mx-[-15px] rounded-none border-0"
                ></Collapse>
                {collapsePrice &&
                    <div className="flex justify-between text-xl items-center h-[33px] font-bold text-primary ">
                        <strong className=''>{t("totalAmount")}</strong>
                        <strong>
                            {Utils.formatterNumber(totalNeedPayment, 0)} {currencyDefault}
                        </strong>
                    </div>}
                <div className="flex">
                    <Form.Item name="status"></Form.Item>
                    <div className="flex-1 pr-1 hidden">
                        <Button
                            onClick={() => {
                                props.form.setFieldValue(
                                    "status",
                                    SaleInvoiceStatusEnum.DANG_SOAN
                                );
                                props.form.submit();
                            }}
                            size="large"
                            className="w-full"
                            icon={<SaveOutlined/>}
                        >
                            {t("saveToDaft")}
                        </Button>
                    </div>
                    <div className="flex-1 pl-1">
                        <Button
                            onClick={() => {
                                const checkDate = handleDateInvoiceReturn();
                                if (checkDate) return;
                                props.form.setFieldValue(
                                    "status",
                                    SaleInvoiceStatusEnum.DA_HOAN_THANH
                                );
                                props.form.submit();
                            }}
                            size="large"
                            className="w-full"
                            type="primary"
                            icon={<WalletIcon/>}
                        >
                            {"Hoàn thành"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
