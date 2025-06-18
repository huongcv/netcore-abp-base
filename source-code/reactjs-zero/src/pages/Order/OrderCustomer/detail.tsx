import { InfoCircleTwoTone } from "@ant-design/icons";
import { SaleInvoiceDto } from "@api/index.defs";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";
import { InvoiceRowItem } from "@pages/SalesInvoice/Form/invoiceRowItem";
import { ProductUitCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/productUnitCell";
import { SaleInvoiceStatusCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";
import {
    Col,
    Divider,
    Flex,
    List,
    Modal,
    QRCode,
    Row,
    Tag,
    Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../index.scss";
import FooterButtons from "../shared/FooterButtons";

export const OrderDetailForm = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { t: tCommon } = useTranslation("common");
    const { t } = useTranslation("sale-invoice");
    const [saleInvoice, setSaleInvoice] = useState<SaleInvoiceDto>();
    const [qrCode, setQrCode] = useState<string>();
    // @ts-ignore

    const handleOk = () => {
        printPdf(saleInvoice!);
    };

    useEffect(() => {
        if (isOpen) {
            let dto = JSON.parse(`{
    "invoiceCode": "OD10000",
    "partnerId": 6964093762928640,
    "creatorEmployeeId": 0,
    "invoiceDate": "2025-03-24T10:50:00",
    "status": 4,
    "totalAmountBeforeDiscount": 89000.00000,
    "discountType": null,
    "discountPercent": null,
    "discountAmount": null,
    "totalAmountBeforeTax": null,
    "taxPercent": null,
    "taxAmount": 0.00000,
    "totalAmount": 89000.00000,
    "paymentAmount": 50000.00000,
    "debtAmount": 39000.00000,
    "paymentMethod": 1,
    "paymentBankCode": null,
    "paymentBankAccountCode": null,
    "paymentBankAccountName": null,
    "paymentStatus": null,
    "notes": null,
    "inventoryId": 98,
    "canceledEmployeeId": null,
    "canceledDate": null,
    "canceledReason": null,
    "totalQty": 1.00000,
    "totalReturnQty": null,
    "salePartnerId": null,
    "einvoiceNo": null,
    "einvoiceIssuedDate": null,
    "einvoiceCanceledDate": null,
    "einvoiceReservationCode": null,
    "einvoiceStatus": null,
    "einvoiceTransactionID": null,
    "einvoiceTransactionUuid": null,
    "eInvoiceBuyerName": null,
    "eInvoiceCompany": null,
    "eInvoiceTaxCode": null,
    "eInvoiceBuyerAddress": null,
    "eInvoiceBuyerPhone": null,
    "eInvoiceBuyerEmail": null,
    "isActived": true,
    "moveType": 107,
    "lotInventoryJson": null,
    "relatedInvoiceId": null,
    "relatedInvoiceCode": null,
    "totalQtyConvert": 1.00000,
    "totalReturnQtyConvert": null,
    "paymentMethodJson": null,
    "shopBankAccountId": null,
    "saleChannelTypeId": 0,
    "saleChannelTypeName": "channelType.Direct.Sales",
    "saleInvoiceDetails": [
        {
            "invoiceId": 6964378051805184,
            "invoiceCode": "HD2503011",
            "productId": 441,
            "productUnitId": 580,
            "productTypeId": 1,
            "productCategoryId": null,
            "productSubCategoryId": null,
            "isProductUseLotNumber": true,
            "qty": 1,
            "convertRate": 1.00000,
            "price": 89000.00000,
            "priceBeforeTax": 89000.00000,
            "totalAmountBeforeDiscount": 89000.00000,
            "discountType": null,
            "discountPercent": 0.00000,
            "discountAmount": null,
            "totalAmountAfterDiscount": 89000.00000,
            "discountAmountAllocation": 0.00000,
            "totalAmountBeforeTax": 89000.00000,
            "taxPercent": 0.00000,
            "taxAmount": null,
            "totalAmount": 89000.00000,
            "notes": null,
            "status": 4,
            "returnTotalAmount": null,
            "creatorEmployeeId": 0,
            "isActived": true,
            "moveType": 107,
            "qtyConvert": 1.00000,
            "returnQtyConvert": null,
            "lotInventoryJson": null,
            "costPrice": 80000.00000,
            "totalCostAmount": 80000.00000,
            "productPriceBeforeTax": 89000.00000,
            "productCode": null,
            "productName": "Mực khô giòn vị phô mai 25g ",
            "imageUrl": "15ca183a-0b27-ad02-086e-cb3f48ac8588",
            "basicUnitName": "gói",
            "productPrice": 89000.00000,
            "purchasedQty": null,
            "qtyByUnit": null,
            "lotNumber": null,
            "lotExpiryDate": null,
            "sReturnQtyConvert": null,
            "idHash": "Y01rNmFVVWQ0enlsNTYwVjFTclBNbnQ2Wm02S09aZ25NTTNCSFRGUm02ZTRpc0Q0dW5LMTl0TFVZMmljc1hMeko4TGcxSmgwd3VxWEhwMVFKWCtSM1E9PQ==",
            "publishViewId": 6964378051805185,
            "id": 6964378051805185
        }
    ],
    "isPrescription": false,
    "prescriptionInfo": {
        "invoiceId": null,
        "invoiceCode": null,
        "prescriptionId": null,
        "dateIssued": "0001-01-01T00:00:00",
        "prescribingDoctorId": 0,
        "medicalFacility": null,
        "diagnosis": null,
        "patientName": null,
        "patientId": null,
        "dateOfBirth": null,
        "yearOfBirth": 0,
        "monthOld": null,
        "age": null,
        "weight": null,
        "address": null,
        "guardian": null,
        "identityCardNumber": null,
        "phoneNumber": null,
        "healthInsuranceCard": null,
        "id": 0
    },
    "partnerName": "Trần Thị Hương",
    "customerPhone": "0334630722",
    "email": null,
    "customerAddress": "Số nhà 88, Thường Tín, Hà Nội",
    "creatorEmployeeName": null,
    "creatorSalePartnerName": null,
    "invoiceTimeStr": "10:50",
    "inventoryName": null,
    "relatedInvoiceIdHash": null,
    "paymentMethodObjDto": null,
    "partnerCode": null,
    "parnerType": null,
    "isExportEInvoice": null,
    "paymentMethodName": "paymentMethod.TienMat",
    "idHash": "WGdCTWJsNmxyOVl4QnlZRTdXY0t4NlBPZGFndjgweUlPc29pK25ERDhPV2pZNDA0cjAvR2YrVzRsZUE3aVlCQ01qd2htUUsrMUlYQjg0bXIyOHNEeVRxQU13V1lHK3Fmd3VmYk5QdDltUUk9",
    "publishViewId": 6964378051805184,
    "id": 6964378051805184
}`)
            setSaleInvoice(dto)
        }
    }, [isOpen])

    const printPdf = async (d: SaleInvoiceDto) => {
    };

    const handleCancel = () => {
        onClose();
    };

    const footerButtons = (
        <FooterButtons
            handleCancel={handleCancel}
            handleOk={handleOk}
        />
    );

    const maskText = (text?: string): string => {
        if(!text) {
            return "";
        }
        if(text.length < 3) {
            return "**"; 
        }
        return `${text[0]}${'*'.repeat(text.length - 2)}${text[text.length - 1]}`;
    };

    return (
        <>
            <Modal
                wrapClassName={
                    "modal-invoice"
                }
                title={t("invoiceDetailForm") + saleInvoice?.invoiceCode}
                open={isOpen}
                onClose={() => onClose()}
                destroyOnClose
                onOk={handleOk}
                okText={tCommon("actionBtn.print")}
                confirmLoading={confirmLoading}
                width={1200}
                style={{ top: "10px" }}
                maskClosable={false}
                onCancel={handleCancel}
                footer={footerButtons}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={12} lg={16} xl={16}>
                        <Flex className="flex-col gap-1">
                            <div className="flex justify-between">
                                <h4 className="text-xl mb-3">
                                    {t("orderInformation")}
                                </h4>
                                <span className="mr-[-8px]">
                                    <SaleInvoiceStatusCell status={saleInvoice?.status} />
                                </span>
                            </div>
                            <div className="flex justify-between relative">
                                <div className="flex gap-5">
                                    <div>
                                        {t("invoiceNo")}:{" "}
                                        <strong className="mr-4">
                                            {saleInvoice?.invoiceCode}
                                        </strong>
                                    </div>
                                    <div>
                                        {t("invoiceDate")}:{" "}
                                        {DateUtil.toFormat(saleInvoice?.invoiceDate)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {t("partnerName")}:{" "}
                                <strong>{maskText(saleInvoice?.partnerName)}</strong>
                            </div>
                            <div className="flex gap-4">
                                <div className=' whitespace-nowrap'>
                                    {t("customerPhone")}: {maskText(saleInvoice?.customerPhone)}
                                </div>
                                <div style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}>
                                    {t("customerAddress")}: {maskText(saleInvoice?.customerAddress)}
                                </div>
                            </div>
                            {/* thêm ghi chú cho chi tiết hoá đơn */}
                            <div className="flex gap-4">
                                <div>
                                    {t("notes")}:{" "}
                                    <Tooltip title={saleInvoice?.notes}>
                                        <b
                                            className="min-w-[40px] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[300px]"
                                            style={{
                                                display: "inline-block",
                                                verticalAlign: "middle",
                                                marginBottom: "3px",
                                                fontWeight: "normal",
                                            }}
                                        >
                                            {saleInvoice?.notes}
                                        </b>
                                    </Tooltip>
                                </div>
                            </div>
                        </Flex>
                        <Divider className="my-5" />
                        <Flex className="flex-col gap-1">
                            <div className="flex justify-between">
                                <h4 className="text-xl mb-3">
                                    {t("Địa chỉ giao hàng")}
                                </h4>
                            </div>
                            <div>
                                {t("Người nhận hàng")}:{" "}
                                <strong>{maskText(saleInvoice?.partnerName)}</strong>
                            </div>
                            <div className="flex gap-4">
                                <div className=' whitespace-nowrap'>
                                    {t("customerPhone")}: {maskText(saleInvoice?.customerPhone)}
                                </div>
                                <div style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}>
                                    {t("customerAddress")}: {maskText(saleInvoice?.customerAddress)}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    {t("notes")}:{" "}
                                    <Tooltip title={saleInvoice?.notes}>
                                        <b
                                            className="min-w-[40px] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[300px]"
                                            style={{
                                                display: "inline-block",
                                                verticalAlign: "middle",
                                                marginBottom: "3px",
                                                fontWeight: "normal",
                                            }}
                                        >
                                            {saleInvoice?.notes}
                                        </b>
                                    </Tooltip>
                                </div>
                            </div>
                        </Flex>
                        <Divider className="my-5" />
                        <h4 className="text-xl mb-3">Sản phẩm</h4>
                        <List
                            className="pl-4"
                            itemLayout="vertical"
                            size="default"
                            dataSource={saleInvoice?.saleInvoiceDetails}
                            renderItem={(item) => (
                                <List.Item key={item.invoiceCode}>
                                    <Flex className="w-full gap-4">
                                        <img
                                            className="rounded-xl w-auto h-32 object-cover"
                                            alt="logo"
                                            src={"https://api.vpos.com.vn/api/pos/upload-file/get-file/15ca183a-0b27-ad02-086e-cb3f48ac8588"}
                                        />
                                        <div className="flex-1">
                                            <div className="grid grid-cols-2 gap-3 items-end">
                                                <List.Item.Meta
                                                    style={{ marginBlockEnd: 1 }}
                                                    title={
                                                        <>
                                                            <strong className="mb-[-10px]">
                                                                {item.productName}
                                                            </strong>
                                                            {item.lotNumber && (
                                                                <div className="ml-[-5px]">
                                                                    <Tag
                                                                        style={{ marginInlineEnd: 0 }}
                                                                        bordered={false}
                                                                        color={"green"}
                                                                    >
                                                                        Số lô: {item.lotNumber}
                                                                    </Tag>
                                                                    <Tag color={"orange"} bordered={false}>
                                                                        Hạn:{" "}
                                                                        {DateUtil.toFormat(
                                                                            item.lotExpiryDate,
                                                                            "DD/MM/YYYY"
                                                                        )}
                                                                    </Tag>
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                    description={
                                                        <span>
                                                            ĐTV:{" "}
                                                            <ProductUitCell
                                                                value={item.productUnitId}
                                                                productId={item.productId}
                                                            />
                                                        </span>
                                                    }
                                                />
                                                <div>
                                                    <InvoiceRowItem
                                                        label={<>
                                                            {item.taxPercent ? <Tooltip placement="leftBottom" title={'Đã bao gồm VAT'}>
                                                                Đơn giá
                                                                <InfoCircleTwoTone className='ml-1' />
                                                            </Tooltip> : "Đơn giá"}
                                                        </>}
                                                        val={item.productPrice || 0}
                                                    />
                                                    <InvoiceRowItem
                                                        label={
                                                            "Thuế VAT" +
                                                            (item.taxPercent
                                                                ? ` (${item.taxPercent}%)`
                                                                : "")
                                                        }
                                                        val={item.taxAmount || 0}
                                                    />
                                                    <InvoiceRowItem
                                                        label={
                                                            "Giảm giá" +
                                                            (item.discountPercent
                                                                ? ` (${item.discountPercent}%)`
                                                                : "")
                                                        }
                                                        val={
                                                            (item.discountAmount ?? 0) +
                                                            (item.discountAmountAllocation ?? 0)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <Flex className="w-full flex-col">
                                                <InvoiceRowItem
                                                    label={"Số lượng"}
                                                    val={item.qty}
                                                    hiddenCurrency={true}
                                                />
                                                <InvoiceRowItem
                                                    label={"Thành tiền"}
                                                    val={item.totalAmount}
                                                />
                                            </Flex>
                                        </div>
                                    </Flex>
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Flex className="flex-col gap-3">
                            <h4 className="text-xl">{t("orderDetail")}</h4>
                            <InvoiceRowItem
                                label={
                                    "Tổng tiền"
                                }
                                val={saleInvoice?.totalAmountBeforeDiscount || 0}
                            />
                            <InvoiceRowItem
                                label={
                                    "Giảm giá" +
                                    (saleInvoice?.discountPercent
                                        ? ` (${saleInvoice.discountPercent}%)`
                                        : "")
                                }
                                val={saleInvoice?.discountAmount || 0}
                            />

                            <InvoiceRowItem
                                label={"Thành tiền"}
                                infoLabel={
                                    saleInvoice?.taxAmount ? (
                                        <>
                                            Đã bao gồm thuế VAT:{" "}
                                            {Utils.formatterNumber(saleInvoice?.taxAmount, 0)}
                                        </>
                                    ) : undefined
                                }
                                val={saleInvoice?.totalAmount}
                            />
                            <InvoiceRowItem
                                label={("Khách hàng trả")
                                }
                                val={saleInvoice?.paymentAmount}
                            />

                            <InvoiceRowItem
                                label={"Công nợ"}
                                val={saleInvoice?.debtAmount}
                            />
                            <InvoiceRowItem
                                label={"Phương thức thanh toán"}
                                val={
                                    <DisplayTextFormSelectDataSource
                                        value={saleInvoice?.paymentMethod}
                                        datasource={useSelectPaymentMethod()}
                                    />
                                }
                                hiddenCurrency={true}
                            />
                        </Flex>
                        <Flex align="center" justify="right" className="mt-2">
                            {qrCode && (
                                <QRCode size={100} bordered={false} value={qrCode} />
                            )}
                        </Flex>
                    </Col>
                </Row>
            </Modal>
        </>
    );
}
