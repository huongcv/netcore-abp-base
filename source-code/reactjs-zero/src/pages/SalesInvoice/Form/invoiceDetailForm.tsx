import {SaleInvoiceDetailDto, SaleInvoiceDto} from "@api/index.defs";
import {InvoiceHelperService} from "@api/InvoiceHelperService";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import OrdDisplayEllipsisTextLong from "@ord-components/displays/OrdDisplayEllipsisTextLong";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import validateUtils from "@ord-core/utils/validate.utils";
import {useStore} from "@ord-store/index";
import {InvoiceRowItem} from "@pages/SalesInvoice/Form/invoiceRowItem";
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";
import {SaleInvoiceStatusCell} from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {
    Checkbox,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    Modal,
    QRCode,
    Row,
    Space,
    Table,
    TableColumnsType,
    Tooltip
} from "antd";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {NumericFormat} from "react-number-format";
import {useNavigate} from "react-router-dom";
import {PrintInvoice} from "../Utils/printInvoice";
import {SaleUrlParamMode} from "../Utils/saleCommon";
import FooterButtons from "./footerButtonForm";
import "./modal.scss";
import {observer} from "mobx-react-lite";
import {debounce} from "lodash";

const InvoiceDetailForm =()=>{
    const {sessionStore, saleInvoiceStore: mainStore} = useStore();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);
    const {t: tCommon} = useTranslation("common");
    const {t} = useTranslation("sale-invoice");
    const [saleInvoice, setSaleInvoice] = useState<SaleInvoiceDto>();
    const [qrCode, setQrCode] = useState<string>();


    const [formExportEInvoice] = Form.useForm();
    const isExportedEinvoice = saleInvoice?.moveType === MoveType.HoaDon && (saleInvoice?.einvoiceStatus == 3 || saleInvoice?.einvoiceStatus == 2);
    const isExportEInvoice_w = Form.useWatch('isShowInfoExportEInvoice', formExportEInvoice);

    const onFinish = (values: any) => {
        setConfirmLoading(false);
        handleCancel();
    };

    const {isInvoiceReturn, data} = mainStore.viewInvoiceModal.entityData ?? {}

    const [pdfUrl, setPdfUrl] = React.useState("");
    const navigate = useNavigate();




    const showModal = (d: SaleInvoiceDto) => {
        // openModal(props.modalKey);
        setIsShowModal(true);
        console.log("showModal", d);
        setQrCode("");
        if (d.idHash) {
            UiUtils.setBusy();
            SaleInvoiceService.getById({
                findId: d.idHash,
            }).then((data) => {
                if (data) {
                    setSaleInvoice(data);
                    showQrCode(data);
                    formExportEInvoice.setFieldValue('isShowInfoExportEInvoice', mainStore.isShowInfoExportEinvoice);
                }
                UiUtils.clearBusy();
            });
        } else if (d.id) {
            UiUtils.setBusy();
            SaleInvoiceService.viewById({
                id: Number(d.id),
            }).then((data) => {
                if (data) {
                    setSaleInvoice(data);
                    showQrCode(data);
                    formExportEInvoice.setFieldValue('isShowInfoExportEInvoice', mainStore.isShowInfoExportEinvoice);
                }
                UiUtils.clearBusy();
            });
        }
    };
    useEffect(() => {
        if (mainStore.viewInvoiceModal.visible && mainStore.viewInvoiceModal.entityData?.data) {
            debouncedFetch(mainStore.viewInvoiceModal.entityData?.data);
        }else{
            setIsShowModal(false);
        }

    }, [mainStore.viewInvoiceModal.visible]);

    const debouncedFetch = useMemo(() => debounce(showModal, 300), []);
    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);

    const closeModal = () => {
        mainStore.closeViewInvoiceModal();
    }

    const handleOnSucess = () => {
        mainStore.searchData({});
    }

    const showQrCode = (d: SaleInvoiceDto) => {
        if (
            d.shopBankAccountId &&
            d.paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN
        )
            SaleInvoiceService.getQrSaleOrder({
                body: {
                    deviceTokenId: sessionStore.firebaseToken,
                    invoiceId: d.id,
                    totalAmount: d.paymentAmount,
                    invoiceCode: d.invoiceCode,
                    shopBankAccountId: d.shopBankAccountId,
                },
            }).then(
                (res) => {
                    if (res.isSuccessful) setQrCode(res.data?.qrCode);
                    else {
                        setQrCode("");
                        UiUtils.showError(res.notification?.message);
                    }
                },
                () => {
                    setQrCode("");
                }
            );
    };

    const handleOk = () => {
        printPdf(saleInvoice!);
    };

    const printPdf = async (d: SaleInvoiceDto) => {
        UiUtils.setBusy();
        try {
            if (d.id === undefined) return;
            const resultBlob = await InvoiceHelperService.printInvoiceV2(
                {
                    body: {
                        id: d.id,
                        deviceTokenId: sessionStore?.firebaseToken,
                    }
                },
                {responseType: "blob"}
            );
            setPdfUrl(URL.createObjectURL(resultBlob));
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            UiUtils.clearBusy();
        }
    };

    const handleCancel = () => {
        formExportEInvoice.setFieldValue('isShowInfoExportEInvoice', false);
        mainStore.isShowInfoExportEinvoice = false;
        closeModal();
    };

    const handleCopy = (d: any) => {
        Modal.destroyAll();
        navigate(
            `/sales-invoice/sell?mode=${SaleUrlParamMode.COPY}&id=${d.idHash}`
        );
    };

    const handleEdit = (d: any) => {
        Modal.destroyAll();
        navigate("/sales-invoice/sell?id=" + d.idHash);
    };

    // useImperativeHandle(ref, () => ({
    //     showModal,
    // }));

    const footerButtons = (
        <FooterButtons
            saleInvoice={saleInvoice}
            handleCopy={(invoice) => handleCopy(invoice)}
            handleCancel={handleCancel}
            handleOk={handleOk}
            handleEdit={handleEdit}
            onSuccess={() => handleOnSucess()}
            isEnableExportEInvoice={isExportEInvoice_w}
            formExportEInvoice={formExportEInvoice}
        />
    );

    React.useEffect(() => {
        if (isExportEInvoice_w) {
            formExportEInvoice.setFieldsValue({
                eInvoiceBuyerName: saleInvoice?.eInvoiceBuyerName ?? saleInvoice?.partnerName,
                eInvoiceTaxCode: saleInvoice?.eInvoiceTaxCode ?? saleInvoice?.customerTaxCode,
                eInvoiceBuyerAddress: saleInvoice?.eInvoiceBuyerAddress ?? saleInvoice?.customerAddress,
                eInvoiceBuyerPhone: saleInvoice?.eInvoiceBuyerPhone ?? saleInvoice?.customerPhone,
                eInvoiceBuyerEmail: saleInvoice?.eInvoiceBuyerEmail,
            });
        }
    }, [isExportEInvoice_w]);

    const columns: TableColumnsType<SaleInvoiceDetailDto> =
        [
            {
                title: t('stt'),
                width: 50,
                align: 'center',
                render: (v, dto, idx) => <>{idx + 1}</>
            },
            {
                title: t('imageUrl'),
                dataIndex: 'imageUrl',
                width: 50,
                align: "center",
                render: (value, dto) => {
                    return (<div className="w-10 h-10">
                        <img
                            className="w-full h-full rounded-sm object-cover"
                            src={
                                value
                                    ? GetFileUrl(value)
                                    : "/images/product-placeholder.png"
                            }
                        />
                    </div>)
                }
            },
            {
                title: t('productName'),
                dataIndex: 'productName',
                width: 200,
                align: 'left',
                className: "ant-table-cell-custome-p0",
                render: (v, record: SaleInvoiceDetailDto) => (<Row>
                        <Col span={24} className="px-2">
                            <OrdDisplayEllipsisTextLong
                                text={v ?? ""}
                                maxWidth={200}
                            />
                        </Col>
                        {!!record.lotNumberSummary &&
                            <Col className="border-t border-solid py-2 px-2" span={24}>
                                {record.lotNumberSummary}
                            </Col>
                        }
                    </Row>
                ),
            },
            {
                title: t('qty_c'),
                dataIndex: 'qty',
                width: 50,
                align: 'center',
            },
            {
                title: t('productUnitName'),
                dataIndex: 'productUnitName',
                width: 50,
                align: 'center',
            },
            {
                title: t('productPrice'),
                dataIndex: 'productPrice',
                width: 100,
                align: 'right',
                render: v => (<NumericFormat value={Utils.formatterNumber(v, 2)} displayType={'text'}
                                             thousandSeparator={true}/>),
            },
            {
                title: t('discountAmount_c'),
                dataIndex: 'discountAmount',
                width: 100,
                align: 'right',
                render: v => (<NumericFormat value={Utils.formatterNumber(v, 0)} displayType={'text'}
                                             thousandSeparator={true}/>),
            },
           /* {
                title: t('subTaxAmount'),
                dataIndex: 'subTaxAmount',
                width: 100,
                align: 'right',
                render: v => (<NumericFormat value={Utils.formatterNumber(v, 0)} displayType={'text'}
                                             thousandSeparator={true}/>),
            },*/
            {
                title: t('subTotalPrice'),
                dataIndex: 'totalAmountAfterDiscount',
                width: 140,
                align: 'right',
                render: v => (
                    <NumericFormat value={Utils.formatterNumber(v, 0)} displayType={'text'}
                                   thousandSeparator={true}/>
                ),
            },
        ]

    return (
        <>
            <Modal
                wrapClassName={
                    isInvoiceReturn ? "modal-return" : "modal-invoice"
                }
                title={t("invoiceDetailForm") + saleInvoice?.invoiceCode}
                open={isShowModal}
                onOk={handleOk}
                okText={tCommon("actionBtn.print")}
                confirmLoading={confirmLoading}
                width={'88%'}
                style={{top: "10px"}}
                maskClosable={false}
                onCancel={handleCancel}
                onClose={handleCancel}
                footer={footerButtons}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={12} lg={16} xl={16}>
                        <Flex className="flex-col gap-1" style={{position: 'relative'}}>
                            {qrCode && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translate(0, -35%)'
                                }}><QRCode size={100} bordered={false} value={qrCode}/></div>
                            )}
                            <div className="flex justify-between">
                                <h4 className="text-xl mb-3">
                                    {isInvoiceReturn
                                        ? t("invoiceReturnInfo")
                                        : t("invoiceInformation")}
                                </h4>
                                <span className="mr-[-8px]">
                                        <SaleInvoiceStatusCell status={saleInvoice?.status}/>
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
                            <div className="flex gap-5">
                                {!isInvoiceReturn && (
                                    <>
                                        <div>
                                            {t("creatorEmployeeName")}:{" "}
                                            {saleInvoice?.creatorEmployeeName}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                {t("partnerName")}:{" "}
                                <strong>{saleInvoice?.partnerName || "Khách lẻ"}</strong>
                            </div>
                            <div className="flex gap-4">
                                <div className=" whitespace-nowrap">
                                    {t("customerPhone")}: {saleInvoice?.customerPhone}
                                </div>
                                <div
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {t("customerAddress")}: {saleInvoice?.customerAddress}
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
                            {saleInvoice?.status == 3 && <div className="flex gap-4">
                                <div>
                                    {t("canceledReason")}:{" "}
                                    <Tooltip title={saleInvoice?.canceledReason}>
                                        <b
                                            className="min-w-[40px] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[300px]"
                                            style={{
                                                display: "inline-block",
                                                verticalAlign: "middle",
                                                marginBottom: "3px",
                                                fontWeight: "normal",
                                            }}
                                        >
                                            {saleInvoice?.canceledReason}
                                        </b>
                                    </Tooltip>
                                </div>
                            </div>}
                        </Flex>

                        {/* thông tin đơn thuốc */}
                        {Number(saleInvoice?.prescriptionType) > 0 && (
                            <>
                                <Divider className="my-5"/>
                                <Flex className="flex-col gap-1">
                                    <div className="flex justify-between">
                                        <h4 className="text-xl mb-3">
                                            {t("Thông tin đơn thuốc")}
                                        </h4>
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            {t("Mã đơn thuốc")}:{"    "}
                                            <strong>
                                                {saleInvoice?.prescriptionInfo?.prescriptionId?.trim()}
                                            </strong>
                                        </div>
                                        <div>
                                            {t("dateIssued")}:{"    "}
                                            <strong>
                                                {DateUtil.toFormat(
                                                    saleInvoice?.prescriptionInfo?.dateIssued
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {t("cusotmerPatiantInfo")}:{"    "}
                                            <strong>
                                                {saleInvoice?.prescriptionInfo?.patientName}
                                            </strong>
                                        </div>
                                        <div>
                                            {t("yearOfBirth")}:{"    "}
                                            <strong>
                                                {saleInvoice?.prescriptionInfo?.yearOfBirth}
                                            </strong>
                                        </div>
                                    </div>
                                    {saleInvoice?.prescriptionInfo?.prescribingDoctorName &&
                                    saleInvoice?.prescriptionInfo?.prescribingDoctorName !==
                                    "" ? (
                                        <div>
                                            {t("doctorName")}:{"    "}
                                            <strong>
                                                {saleInvoice?.prescriptionInfo?.prescribingDoctorName}
                                            </strong>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    <div className="flex gap-4">
                                        <div
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {t("medicalFacility")}:{"    "}
                                            <strong>
                                                {saleInvoice?.prescriptionInfo?.medicalFacility}
                                            </strong>
                                        </div>
                                        {saleInvoice?.prescriptionInfo?.diagnosis && (
                                            <div>
                                                {t("diagnosis")}:{"    "}
                                                <strong>
                                                    {saleInvoice?.prescriptionInfo?.diagnosis}
                                                </strong>
                                            </div>
                                        )}
                                    </div>
                                </Flex>
                            </>
                        )}

                        <h4 className="text-xl mb-2">Sản phẩm ({saleInvoice?.saleInvoiceDetails?.length})</h4>
                        {/* <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"> */}
                        {/* <List
                                    className="pl-4"
                                    itemLayout="vertical"
                                    size="default"
                                    dataSource={saleInvoice?.saleInvoiceDetails}
                                    renderItem={(item) => (
                                    <List.Item key={item.invoiceCode}>
                                        <Flex className="w-full gap-4">
                                            <div className="w-20 h-20">
                                                <img
                                                    className="w-full h-full rounded-xl object-cover"
                                                    alt="logo"
                                                    src={
                                                        item.imageUrl
                                                        ? GetFileUrl(item.imageUrl)
                                                        : "/images/product-placeholder.png"
                                                    }
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className={"space-y-2"}>
                                                    <div className="flex items-baseline">
                                                        <OrdDisplayEllipsisTextLong
                                                            text={item.productName ?? ""}
                                                            maxWidth={200}
                                                            className={"font-bold"}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-x-4">
                                                        <InvoiceRowItem
                                                            label={"Số lượng"}
                                                            val={item.qty}
                                                            hiddenCurrency={true}
                                                        />
                                                        <InvoiceRowItem
                                                            label={"Đơn giá"}
                                                            val={item.productPrice || 0}
                                                            roundNumber={2}
                                                        />
                                                        <InvoiceRowItem
                                                            label={"ĐVT"}
                                                            val={item.productUnitName}
                                                            hiddenCurrency={true}
                                                        />
                                                        <InvoiceRowItem
                                                            label={"Giảm giá" + (item.discountPercent ? ` (${item.discountPercent}%)` : "")}
                                                            val={item.discountAmount ?? 0}
                                                            roundNumber={2}
                                                        />
                                                        <InvoiceRowItem
                                                            label={"Số lô"}
                                                            val={(item.lotNumber ? item.lotNumber: "")}
                                                            hiddenCurrency={true}
                                                        />
                                                        <InvoiceRowItem
                                                            label={"Thuế"}
                                                            val={item.subTaxAmount || 0}
                                                            roundNumber={2}
                                                        />
                                                        <InvoiceRowItem
                                                            label={"Hạn sử dụng"}
                                                            val={(item.lotNumber ? DateUtil.toFormat(item.lotExpiryDate, "DD/MM/YYYY") : "")}
                                                        />
                                                        <InvoiceRowItem
                                                            label={"Thành tiền"}
                                                            val={item.subTotalAmount}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Flex>
                                    </List.Item>
                                )}
                                /> */}
                        {saleInvoice?.saleInvoiceDetails &&
                            <Table
                                columns={columns}
                                dataSource={saleInvoice?.saleInvoiceDetails}
                                scroll={{x: 'max-content', y: 300}}
                                pagination={false}
                                bordered
                                rowKey={"id"}
                                sticky={{offsetHeader: 1}}
                            />
                        }

                        {/* </div> */}
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Flex className="flex-col gap-3">
                            <h4 className="text-xl">{t("paymentInfo")}</h4>
                            <InvoiceRowItem
                                label={"Tổng tiền"}
                                val={saleInvoice?.totalAmountBeforeDiscount || 0}
                            />
                            <InvoiceRowItem
                                label={
                                    "Chiết khấu" +
                                    (saleInvoice?.discountPercent
                                        ? ` (${saleInvoice.discountPercent}%)`
                                        : "")
                                }
                                val={saleInvoice?.discountAmount || 0}
                            />
                            <InvoiceRowItem
                                label={"Tổng thuế"}
                                val={saleInvoice?.taxAmount || 0}
                            />
                            <InvoiceRowItem
                                label={"Thành tiền"}
                                val={saleInvoice?.totalAmountRound}
                            />
                            <InvoiceRowItem
                                label={
                                    isInvoiceReturn
                                        ? t("returnCustomerPayment")
                                        : t("customerPayment")
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
                        {isExportedEinvoice &&
                            (
                                <>
                                    <h4 className="text-xl">
                                        {t("EinvoiceInfo")}
                                        {saleInvoice.einvoiceTransactionMerge ? <span> (gộp)</span> : <span></span>}
                                    </h4>

                                    <div className="my-2">
                                        <InvoiceRowItem
                                            label={t("eInvoiceBuyerName")}
                                            val={saleInvoice?.eInvoiceBuyerName}
                                        />
                                    </div>
                                    <div className="my-2">
                                        <InvoiceRowItem
                                            label={t("eInvoiceCompany")}
                                            val={saleInvoice?.eInvoiceCompany}
                                        />
                                    </div>
                                    <div className="my-2">
                                        <InvoiceRowItem
                                            label={t("eInvoiceTaxCode")}
                                            val={saleInvoice?.eInvoiceTaxCode}
                                        />
                                    </div>
                                    <div className="my-2">
                                        <InvoiceRowItem
                                            label={t("eInvoiceBuyerAddress")}
                                            val={saleInvoice?.eInvoiceBuyerAddress}
                                        />
                                    </div>
                                    <div className="my-2">
                                        <InvoiceRowItem
                                            label={t("eInvoiceBuyerPhone")}
                                            val={saleInvoice?.eInvoiceBuyerPhone}
                                        />
                                    </div>
                                    <div className="my-2">
                                        <InvoiceRowItem
                                            label={t("eInvoiceBuyerEmail")}
                                            val={saleInvoice?.eInvoiceBuyerEmail}
                                        />
                                    </div>
                                    <div className="my-2">
                                        {saleInvoice?.einvoiceNo && <InvoiceRowItem
                                            label={t("Số HDĐT")}
                                            val={saleInvoice?.einvoiceNo}
                                        />}
                                    </div>


                                    <div className="my-2">
                                        {saleInvoice?.einvoiceTaxAuthorityCode && <InvoiceRowItem
                                            label={t("Mã CQT")}
                                            val={saleInvoice?.einvoiceTaxAuthorityCode}
                                        />}
                                    </div>

                                    <div className="my-2">
                                        {saleInvoice?.einvoiceReservationCode && <InvoiceRowItem
                                            label={t("Mã tra cứu")}
                                            val={saleInvoice?.einvoiceReservationCode}
                                        />}
                                    </div>
                                </>
                            )}

                        <Form form={formExportEInvoice}>
                            <Space.Compact style={{width: "100%", margin: '10px 0 -4px'}}>
                                <Form.Item
                                    name="isShowInfoExportEInvoice"
                                    valuePropName="checked"
                                    initialValue={false}
                                    hidden={isExportedEinvoice}
                                >
                                    <Checkbox>{t("exportEInvoice")}</Checkbox>
                                </Form.Item>
                            </Space.Compact>

                            {isExportEInvoice_w && !isExportedEinvoice && <div className="mb-1">
                                <div className="flex justify-between items-center ">
                                    <div>
                                        {t("eInvoiceBuyerName")}
                                        <span className="text-red"> *</span>
                                    </div>
                                    <Flex className="items-center cs-input" style={{flex: 1}}>
                                        <Form.Item
                                            rules={[validateUtils.required]}
                                            name={"eInvoiceBuyerName"}
                                            style={{width: '100%'}}
                                        >
                                            <Input
                                                placeholder={t("eInvoiceBuyerName")}
                                                className="border-none w-full"
                                            ></Input>
                                        </Form.Item>
                                    </Flex>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <div>{t("eInvoiceCompany")}</div>
                                    <Flex className="items-center cs-input" style={{flex: 1}}>
                                        <Form.Item name={"eInvoiceCompany"} style={{width: '100%'}}>
                                            <Input
                                                placeholder={t("eInvoiceCompany")}
                                                className="border-none w-full"
                                            ></Input>
                                        </Form.Item>
                                    </Flex>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <div>{t("eInvoiceTaxCode")}</div>
                                    <Flex className="items-center cs-input" style={{flex: 1}}>
                                        <Form.Item name={"eInvoiceTaxCode"} style={{width: '100%'}}>
                                            <Input
                                                placeholder={t("eInvoiceTaxCode")}
                                                className="border-none w-full"
                                            ></Input>
                                        </Form.Item>
                                    </Flex>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <div>
                                        {t("eInvoiceBuyerAddress")}
                                    </div>
                                    <Flex className="items-center cs-input" style={{flex: 1}}>
                                        <Form.Item
                                            name={"eInvoiceBuyerAddress"}
                                            style={{width: '100%'}}
                                        >
                                            <Input
                                                placeholder={t("eInvoiceBuyerAddress")}
                                                className="border-none w-full"
                                            ></Input>
                                        </Form.Item>
                                    </Flex>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <div>{t("eInvoiceBuyerPhone")}</div>
                                    <Flex className="items-center cs-input" style={{flex: 1}}>
                                        <Form.Item name={"eInvoiceBuyerPhone"} style={{width: '100%'}}>
                                            <Input
                                                placeholder={t("eInvoiceBuyerPhone")}
                                                className="border-none w-full"
                                            ></Input>
                                        </Form.Item>
                                    </Flex>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <div>{t("eInvoiceBuyerEmail")}</div>
                                    <Flex className="items-center cs-input" style={{flex: 1}}>
                                        <Form.Item name={"eInvoiceBuyerEmail"} style={{width: '100%'}}>
                                            <Input
                                                placeholder={t("eInvoiceBuyerEmail")}
                                                className="border-none w-full"
                                            ></Input>
                                        </Form.Item>
                                    </Flex>
                                </div>
                            </div>}
                        </Form>
                    </Col>
                </Row>
            </Modal>
            <PrintInvoice pdfUrl={pdfUrl}/>
        </>
    );
}
export default observer(InvoiceDetailForm);
