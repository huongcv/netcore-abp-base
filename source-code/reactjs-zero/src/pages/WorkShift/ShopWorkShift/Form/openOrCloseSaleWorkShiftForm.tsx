import { Card, Collapse, Flex, Form, Input, Modal, Space } from "antd";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShopWorkShiftService } from "@api/ShopWorkShiftService";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { NumericFormat } from "react-number-format";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { SaleWorkShiftDetailDto, SummaryTotalClosingShiftDto } from "@api/index.defs";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import { CheckOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

export enum WorkShiftDetailsType {
    NhapHang = 101,
    HangTra = 103,
    XuatTra = 104,
    BanHang = 107,
    PhieuThu = 111,
    PhieuChi = 112
}

export enum WorkShiftPaymentMethod {
    TienMat = 1,
    ChuyenKhoan = 2,
    CongNo = 3
}

export const OpenOrCloseSaleWorkShiftForm = forwardRef((props: any, ref: any) => {
    const [form] = Form.useForm();
    const { Panel } = Collapse;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation('work-shift')
    const { shopWorkShiftStore: mainStore } = useStore();
    const [summary, setSummary] = useState<SummaryTotalClosingShiftDto>();

    const [isViewDetailMode, setViewDetailMode] = useState(false);

    const differenceAmount = Form.useWatch((values) => {
        values.differenceCash = (values.closingCash ?? 0) - (values.expectedCash ?? 0);
        return (values.closingCash ?? 0) - (values.expectedCash ?? 0);
    }, form)

    useEffect(() => {
        if (open) {

        }
    }, [open]);



    const getSummary = (input: any) => {
        ShopWorkShiftService.getCurrentSaleWorkShift({
            body: input
        }).then(data => {
            if (data.isSuccessful) {
                setSummary(data.data);
                form.setFieldsValue(data.data);
            }
        })
    }

    const onChangeClosingCash = (value: any) => {
        const values = form.getFieldsValue();
        const value1 = (value || 0) - (values.expectedCash || 0);
        form.setFieldValue('differenceCash', value1);
    }

    const reSummary = (value: any) => {
        let id = form.getFieldValue("id");
        if (id == null || id == undefined) {
            id = 0;
        }
        if (id > 0) {
            const input = {
                shopWorkShiftId: id,
                endDate: value
            }

            console.log('input: ', input)
            getSummary(input);
        }
    }

    const onFinish = (values: any) => {
        setConfirmLoading(true);
        if (summary?.id) {
            const newObj = {
                ...summary,
                ...values,
            }

            ShopWorkShiftService.closing({ body: newObj as any }).then(data => {
                if (data.isSuccessful) {
                    UiUtils.showSuccess("Lưu thành công");
                    setConfirmLoading(false);
                    handleCancel();
                    mainStore.closeModal(true);
                } else {
                    setConfirmLoading(false);
                    UiUtils.showError(data.errorDetail?.message)
                }
            })
        }
        else {
            ShopWorkShiftService.createOrUpdate({ body: values }).then(data => {
                if (data.isSuccessful) {
                    UiUtils.showSuccess("Lưu thành công");
                    setConfirmLoading(false);
                    handleCancel();
                    mainStore.closeModal(true);
                } else {
                    setConfirmLoading(false);
                    UiUtils.showError(data.errorDetail?.message)
                }
            })
        }
    }

    const showModal = (d: any) => {
        setOpen(true);
        let input = {
            shopWorkShiftId: 0,
            endDate: new Date()
        }
        if (d != null) {
            input.shopWorkShiftId = d.id,
                input.endDate = d.endDate
            setViewDetailMode(true);
        }
        getSummary(input);
        form.setFieldsValue(d);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.setFieldValue("id", "0");
        setConfirmLoading(false);
        setOpen(false);
    };

    const getSaleWorkShiftDetail = (details: SaleWorkShiftDetailDto[], type: number) => {
        let retString = "";
        details.filter(out => out.detailsType).forEach((detail) => {
            if (detail.detailsPaymentMethod == 1) {
                retString += <><Flex className="pl-5">
                    <span>Tiền mặt</span>
                    <span
                        className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                    <span><NumericFormat value={summary?.invoiceQty} displayType={'text'}
                        thousandSeparator={true} /> đ</span>
                </Flex></>
            }
            else if (detail.detailsPaymentMethod == 2) {
                retString += <><Flex className="pl-5">
                    <span>Ngân hàng</span>
                    <span
                        className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                    <span><NumericFormat value={summary?.invoiceQty} displayType={'text'}
                        thousandSeparator={true} /> đ</span>
                </Flex></>
            }
        });
        return retString;
    };

    useImperativeHandle(ref, () => ({
        showModal
    }));

    return (<>
        <Modal
            title={summary?.id != "0" ? t('shopWorkShiftClosingForm') : "Vào ca của tôi"}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            width={1200}
            style={{ top: '10px' }}
            maskClosable={false}
            okText={summary?.id != "0" ? "Kết thúc ca" : "Vào ca của tôi"}
            cancelText={"Đóng"}
            onCancel={handleCancel}
            okButtonProps={{ hidden: isViewDetailMode }}
        >
            <div>
                <Form form={form} onFinish={onFinish} autoComplete="off">
                    <Form.Item name="id" hidden><Input /></Form.Item>
                    <Card title={"Ca làm việc " + " " + (summary?.name != null ? summary?.name : "")} size="small">

                        <div className={summary?.id == "0" || summary?.id == null || summary?.id == undefined ? "mt-[5px] w-full grid grid-cols-3 gap-3" : "mt-[5px] w-full grid grid-cols-4 gap-4"} >
                            <div className="flex flex-col">
                                <FloatLabel label={"Người bàn giao"} >
                                    <Form.Item name='employeeId' >
                                        <OrdSelect datasource={useSelectEmployee()} readOnly={summary?.id != "0"} disabled={summary?.id != "0"} ></OrdSelect>
                                    </Form.Item>
                                </FloatLabel>
                            </div>

                            <div className="flex flex-col">
                                <FloatLabel label={t('startDate')} required>
                                    <Form.Item name='startDate' rules={[ValidateUtils.required]}>
                                        <OrdDateInput showTime format="DD/MM/YYYY HH:mm" disabledDate={(current) => {
                                            if (!summary?.startDate) return true;
                                            const selectedDate = dayjs(summary.startDate);
                                            return !current.isSame(selectedDate, 'day');
                                        }} disabled={summary?.id != "0"}></OrdDateInput>
                                    </Form.Item>
                                </FloatLabel>
                            </div>
                            <div className={summary?.id == "0" || summary?.id == null || summary?.id == undefined ? "hidden flex flex-col" : "flex flex-col"} >
                                <FloatLabel label={t('endDate')}>
                                    <Form.Item name='endDate'>
                                        <OrdDateTimeInput showTime format="DD/MM/YYYY HH:mm" disabledDate={(current) => {
                                            if (!summary?.endDate) return true;
                                            const selectedDate = dayjs(summary.endDate);
                                            return !current.isSame(selectedDate, 'day');
                                        }}
                                            disabled={isViewDetailMode} onChange={reSummary} ></OrdDateTimeInput>
                                    </Form.Item>
                                </FloatLabel>
                            </div>
                            <div className="flex flex-col">
                                <FloatLabel label={t('openingCash')}>
                                    <Form.Item name='openingCash'>
                                        <PriceNumberInput step={1000} min={0} readOnly={summary?.id != "0"} disabled={summary?.id != "0"} className="text-right w-full" />
                                    </Form.Item>
                                </FloatLabel>
                            </div>
                            <div className={summary?.id == "0" || summary?.id == null || summary?.id == undefined ? "hidden flex flex-col" : "flex flex-col"}>
                                <FloatLabel label={"Người nhận bàn giao"} >
                                    <Form.Item name='closingEmployeeId' >
                                        <OrdSelect datasource={useSelectEmployee()} disabled={isViewDetailMode}></OrdSelect>
                                    </Form.Item>
                                </FloatLabel>
                            </div>
                            <div className={summary?.id == "0" || summary?.id == null || summary?.id == undefined ? "hidden flex flex-col" : "flex flex-col"}>
                                <FloatLabel label={t('expectedCash')}>
                                    <Form.Item name='expectedCash'>
                                        <PriceNumberInput step={1000} min={0} readOnly={true} disabled className="text-right w-full" />
                                    </Form.Item>
                                </FloatLabel>
                            </div>

                            <div className={summary?.id == "0" || summary?.id == null || summary?.id == undefined ? "hidden flex flex-col" : "flex flex-col"}>
                                <FloatLabel label={t('closingCash')} required>
                                    <Form.Item name='closingCash' rules={[ValidateUtils.required]} >
                                        <PriceNumberInput step={1000} min={0} onChange={onChangeClosingCash} disabled={isViewDetailMode} className="text-right w-full" />
                                    </Form.Item>
                                </FloatLabel>
                            </div>
                            <div className={summary?.id == "0" || summary?.id == null || summary?.id == undefined ? "hidden flex flex-col" : "flex flex-col"}>
                                <FloatLabel label={"Chênh lệch"}>
                                    <Form.Item name='differenceCash'>
                                        <PriceNumberInput disabled={true} className="text-right w-full" ></PriceNumberInput>
                                    </Form.Item>

                                </FloatLabel>
                            </div>

                        </div>

                        <div className="w-full grid grid-cols-1 gap-1">
                            <FloatLabel label={"Ghi chú"}>
                                <Form.Item name='notes'>
                                    <Input></Input>
                                </Form.Item>
                            </FloatLabel>
                        </div>

                    </Card>


                    <div className={summary?.id == "0" || summary?.id == null || summary?.id == undefined ? "hidden w-full grid grid-cols-2 gap-2" : "w-full grid grid-cols-2 gap-2"}  >
                        <div className="flex flex-col">
                            <Card title="Bán hàng" size="small" className="mt-3">
                                <Space direction="vertical" className="w-full">
                                    <Flex>
                                        <span>Số lượng</span>
                                        <span
                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                        <span>{summary?.invoiceQty}</span>
                                    </Flex>

                                    <Collapse bordered={false} expandIconPosition="end" >
                                        <Panel key="-1" header={<>

                                            <Flex>
                                                <span>Tổng tiền</span>
                                                <span
                                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                <span><NumericFormat name="invoiceAmount" value={summary?.invoiceAmount} displayType={'text'}
                                                    thousandSeparator={true} /></span>

                                            </Flex></>} >
                                            {
                                                summary?.details?.filter(x => x.detailsType === WorkShiftDetailsType.BanHang).map((detail, index) => {
                                                    return <Flex className="pl-5" key={index}>
                                                        <span>{detail.detailsPaymentMethod == WorkShiftPaymentMethod.TienMat ? 'Tiền mặt' : detail.detailsPaymentMethod == WorkShiftPaymentMethod.ChuyenKhoan ? 'Ngân hàng' :
                                                            detail.detailsPaymentMethod == WorkShiftPaymentMethod.CongNo ? 'Chưa thanh toán' : 'Khác'} </span>
                                                        <span
                                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                        <span><NumericFormat value={detail.detailsAmount} displayType={'text'}
                                                            thousandSeparator={true} /></span>
                                                    </Flex>
                                                })
                                            }

                                        </Panel>
                                    </Collapse>
                                </Space>
                            </Card>
                            <Card title="Hàng trả" size="small" className="mt-3">
                                <Space direction="vertical" className="w-full">
                                    <Flex>
                                        <span>Số lượng</span>
                                        <span
                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                        <span><NumericFormat value={summary?.returnInvoiceQty} displayType={'text'}
                                            thousandSeparator={true} /></span>
                                    </Flex>

                                    <Collapse bordered={false} expandIconPosition="end">
                                        <Panel
                                            key="1"
                                            header={<><Flex>
                                                <span>Tổng tiền</span>
                                                <span
                                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                <span><NumericFormat value={summary?.returnInvoiceAmount} displayType={'text'}
                                                    thousandSeparator={true} /> </span>
                                            </Flex></>} >
                                            {
                                                summary?.details?.filter(x => x.detailsType === WorkShiftDetailsType.HangTra).map((detail, index) => {
                                                    return <Flex className="pl-5" key={index}>
                                                        <span>{detail.detailsPaymentMethod == WorkShiftPaymentMethod.TienMat ? 'Tiền mặt' : detail.detailsPaymentMethod == WorkShiftPaymentMethod.ChuyenKhoan ? 'Ngân hàng' :
                                                            detail.detailsPaymentMethod == WorkShiftPaymentMethod.CongNo ? 'Chưa thanh toán' : 'Khác'} </span>
                                                        <span
                                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                        <span><NumericFormat value={detail.detailsAmount} displayType={'text'}
                                                            thousandSeparator={true} /></span>
                                                    </Flex>
                                                })
                                            }
                                        </Panel>
                                    </Collapse>
                                </Space>
                            </Card>

                        </div>
                        <div className="flex flex-col">
                            <Card title="Nhập hàng" size="small" className="mt-3">
                                <Space direction="vertical" className="w-full">
                                    <Flex>
                                        <span>Số lượng</span>
                                        <span
                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                        <span>{summary?.importStockQty}</span>
                                    </Flex>

                                    <Collapse bordered={false} expandIconPosition="end">
                                        <Panel
                                            key="1"
                                            header={<><Flex>
                                                <span>Tổng tiền</span>
                                                <span
                                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                <span><NumericFormat value={summary?.importStockAmount} displayType={'text'}
                                                    thousandSeparator={true} /> </span>
                                            </Flex></>} >
                                            {
                                                summary?.details?.filter(x => x.detailsType === WorkShiftDetailsType.NhapHang).map((detail, index) => {
                                                    return <Flex className="pl-5" key={index}>
                                                        <span>{detail.detailsPaymentMethod == WorkShiftPaymentMethod.TienMat ? 'Tiền mặt' : detail.detailsPaymentMethod == WorkShiftPaymentMethod.ChuyenKhoan ? 'Ngân hàng' :
                                                            detail.detailsPaymentMethod == WorkShiftPaymentMethod.CongNo ? 'Chưa thanh toán' : 'Khác'} </span>
                                                        <span
                                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                        <span><NumericFormat value={detail.detailsAmount} displayType={'text'}
                                                            thousandSeparator={true} /></span>
                                                    </Flex>
                                                })
                                            }
                                        </Panel>
                                    </Collapse>
                                </Space>
                            </Card>
                            <Card title="Xuất trả" size="small" className="mt-3">
                                <Space direction="vertical" className="w-full">
                                    <Flex>
                                        <span>Số lượng</span>
                                        <span
                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                        <span>{summary?.returnImportStockQty}</span>
                                    </Flex>

                                    <Collapse bordered={false} expandIconPosition="end">
                                        <Panel
                                            key="1"
                                            header={<><Flex>
                                                <span>Tổng tiền</span>
                                                <span
                                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                <span><NumericFormat value={summary?.returnImportStockAmount} displayType={'text'}
                                                    thousandSeparator={true} /> </span>
                                            </Flex></>} >
                                            {
                                                summary?.details?.filter(x => x.detailsType === WorkShiftDetailsType.XuatTra).map((detail, index) => {
                                                    return <Flex className="pl-5" key={index}>
                                                        <span>{detail.detailsPaymentMethod == WorkShiftPaymentMethod.TienMat ? 'Tiền mặt' : detail.detailsPaymentMethod == WorkShiftPaymentMethod.ChuyenKhoan ? 'Ngân hàng' :
                                                            detail.detailsPaymentMethod == WorkShiftPaymentMethod.CongNo ? 'Chưa thanh toán' : 'Khác'} </span>
                                                        <span
                                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                        <span><NumericFormat value={detail.detailsAmount} displayType={'text'}
                                                            thousandSeparator={true} /></span>
                                                    </Flex>
                                                })
                                            }
                                        </Panel>
                                    </Collapse>
                                </Space>
                            </Card>

                        </div>

                        <div className="flex flex-col">
                            <Card title="Thu khác" size="small" className="h-[100%] mt-3" >
                                <Space direction="vertical" className="w-full">
                                    <Collapse bordered={false} expandIconPosition="end">
                                        <Panel
                                            key="1"
                                            header={<><Flex>
                                                <span>Tổng </span>
                                                <span
                                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                <span><NumericFormat value={summary?.otherReceiptAmount} displayType={'text'}
                                                    thousandSeparator={true} /> </span>
                                            </Flex></>} >
                                            {
                                                summary?.details?.filter(x => x.detailsType === WorkShiftDetailsType.PhieuThu).map((detail, index) => {
                                                    return <Flex className="pl-5" key={index}>
                                                        <span>{detail.detailsPaymentMethod == WorkShiftPaymentMethod.TienMat ? 'Tiền mặt' : detail.detailsPaymentMethod == WorkShiftPaymentMethod.ChuyenKhoan ? 'Ngân hàng' :
                                                            detail.detailsPaymentMethod == WorkShiftPaymentMethod.CongNo ? 'Chưa thanh toán' : 'Khác'} </span>
                                                        <span
                                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                        <span><NumericFormat value={detail.detailsAmount} displayType={'text'}
                                                            thousandSeparator={true} /></span>
                                                    </Flex>
                                                })
                                            }
                                        </Panel>
                                    </Collapse>
                                </Space>
                            </Card>
                        </div>
                        <div className="flex flex-col">
                            <Card title="Chi khác" size="small" className="h-[100%] mt-3" >
                                <Space direction="vertical" className="w-full">
                                    <Collapse bordered={false} expandIconPosition="end">
                                        <Panel
                                            key="1"
                                            header={<><Flex>
                                                <span>Tổng</span>
                                                <span
                                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                <span><NumericFormat value={summary?.otherPaymentAmount} displayType={'text'}
                                                    thousandSeparator={true} /> </span>
                                            </Flex></>} >
                                            {
                                                summary?.details?.filter(x => x.detailsType === WorkShiftDetailsType.PhieuChi).map((detail, index) => {
                                                    return <Flex className="pl-5" key={index}>
                                                        <span>{detail.detailsPaymentMethod == WorkShiftPaymentMethod.TienMat ? 'Tiền mặt' : detail.detailsPaymentMethod == WorkShiftPaymentMethod.ChuyenKhoan ? 'Ngân hàng' :
                                                            detail.detailsPaymentMethod == WorkShiftPaymentMethod.CongNo ? 'Chưa thanh toán' : 'Khác'} </span>
                                                        <span
                                                            className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                                        <span><NumericFormat value={detail.detailsAmount} displayType={'text'}
                                                            thousandSeparator={true} /></span>
                                                    </Flex>
                                                })
                                            }
                                        </Panel>
                                    </Collapse>
                                </Space>
                            </Card>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
        <style>
            {`
            .ant-space-item>.ant-collapse>.ant-collapse-item>.ant-collapse-header, .ant-space-item>.ant-collapse>.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box{
            padding: 0 !important;
            }
            .ant-space-item>.ant-collapse>.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box{
            padding-right: 23px !important;
            }
            .ant-space-item>.ant-collapse>.ant-collapse-item{
                background-color: white;
            }
            .ant-input-number:hover .ant-input-number-handler-wrap, .ant-input-number-focused .ant-input-number-handler-wrap{
                width: 15px !important;
            }
            .ant-input-number .ant-input-number-input{
               padding: 6.5px 19px !important;    
            }
        `}
        </style>
    </>)
})
