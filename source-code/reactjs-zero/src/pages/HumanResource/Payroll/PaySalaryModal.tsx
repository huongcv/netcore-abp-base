import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { AccountMoveService } from "@api/AccountMoveService";
import { AccountMoveDto, ComboOptionDto, EmployeePayrollDetailDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {
    useSelectAccountMovePartnerType
} from "@ord-components/forms/select/selectDataSource/useSelectAccountMovePartnerType";
import { useSelectMoveReasonType } from "@ord-components/forms/select/selectDataSource/useSelectMoveReasonType";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import { default as dateUtil, default as DateUtil } from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";
import { PaymentMethodEnum } from "@pages/SalesInvoice/Form/paymentMethodForm";
import ShopBankAccountInput from "@pages/SalesInvoice/Form/shopBankAccountInput";
import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Space
} from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import uiUtils from "@ord-core/utils/ui.utils";


const { TextArea } = Input;
const formatterNumber = Utils.formatterNumber;
const formatterNumberInput = Utils.formatterNumberInput;

enum ACCOUNT_MOVE_TYPE {
    PhieuThu = 1,
    PhieuChi = 2,
}

export enum ACCOUNT_MOVE_PARTNER_TYPE {
    Customer = 1,
    Supplier = 2,
    Employee = 4,
    Doctor = 6,
    Other = 999
}

const parseNumber = (value: string | undefined) => value?.replace(/\\s?|(,*)/g, '') as unknown as number;
const PaySalaryModal = (props: {
    onSuccess: () => void
}) => {
    const { t } = useTranslation(['cashbook',
        'customer',
        'reason-type', 'customer-supplier', 'payroll_detail']);
    const [form] = Form.useForm<any>();
    const { payrollDetailStore: stored } = useStore();
    const w_paymentMethod = Form.useWatch('paymentMethod', form);
    const [maxSalaryPay, setMaxSalaryPay] = useState<number>(0);

    const reasonMoveTypeDatasource = useSelectMoveReasonType(ACCOUNT_MOVE_TYPE.PhieuChi)

    useEffect(() => {
        if (stored.isOpenPaySalaryModal) {
            const data = stored.entityUpdateData as EmployeePayrollDetailDto;
            form.setFieldsValue({
                partnerId: data.employeeId,
                partnerName: data.employeeName,
                totalSalaryAmount: (data.totalSalaryAmount ?? 0),
                paymentTotalSalary: (data.paymentTotalSalary ?? 0),
                amount: (data.totalSalaryAmount ?? 0) - (data.paymentTotalSalary ?? 0),
                relatedMoveId: data.id,
                relatedMoveDate: dateUtil.getNow(),
                relatedMoveType: 115 as any // Phiếu chi trả lương
            })
            setMaxSalaryPay((data.totalSalaryAmount ?? 0) - (data.paymentTotalSalary ?? 0));
        }
    }, [stored.isOpenPaySalaryModal]);

    useEffect(() => {
        const dataSource = reasonMoveTypeDatasource.data as ComboOptionDto[];
        if (dataSource.length) {
            const reasonTypePayRollFilter = dataSource.filter(x => x.data.reasonTypeEnumId == 1500);
            if (reasonTypePayRollFilter) {
                const reasonTypePayRoll = reasonTypePayRollFilter[0];
                form.setFieldsValue({
                    accountMoveReasonName: reasonTypePayRoll.data.reasonTypeName,
                    accountMoveReasonTypeId: reasonTypePayRoll.data.id,
                })
            }
        }
    }, [reasonMoveTypeDatasource.data])


    const onChangePaymentMethod = (val: any, option: any) => {
        form.setFieldValue('bankCode', option.data?.bankCode); 
        form.setFieldValue('bankAccountCode', option.data?.accountCode);
        form.setFieldValue('bankAccountName', option.data?.accountName); 
        form.setFieldValue('bankVirtualCode', option.data?.virtualUserName); 
    }

    const onOkModal = async () => {
        try {
            let data: any;
            try {
                data = await form.validateFields();
            } catch (error: any) {
                console.log("Chi tiết lỗi:", error.errorFields);
                return;
            }

            const input: AccountMoveDto = {
                ...data,
                accountMoveType: ACCOUNT_MOVE_TYPE.PhieuChi

            };
            uiUtils.setBusy();
            AccountMoveService.createOrUpdate({
                body: input
            }).then(res => {
                uiUtils.clearBusy();
                if (res.isSuccessful) {
                    uiUtils.showSuccess("Thanh toán lương thành công");
                    props.onSuccess();
                    stored.closePaySalaryModal();
                } else {
                    uiUtils.showSuccess("Thanh toán thất bại. Vui lòng thử lại sau");
                }
            }).finally(() => {
                uiUtils.clearBusy();
            })
        } catch (errorInfo) {
            uiUtils.showCommonValidateForm()
        }
    }

    const FormPay = observer(() => {
        return <>
            <Form form={form}
                layout={'vertical'}>
                <Row gutter={[16, 0]}>
                    <Col lg={12} sm={12}>
                        <FloatLabel label={t('accountMoveDateReceipt')}>
                            <Form.Item name='accountMoveDate' initialValue={new Date()}>
                                <OrdDateInput
                                    disabledDate={DateUtil.disableAfterNow}
                                    format={{
                                        format: 'DD/MM/YYYY HH:mm',
                                        type: 'mask'
                                    }}
                                    showTime={true}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={12} sm={12}>
                        <FloatLabel label={t('accountMoveReasonReceipt')}
                            required>
                            <Form.Item name='accountMoveReasonTypeId' rules={[ValidateUtils.required]}>
                                <OrdSelect
                                    disabled={true}
                                    datasource={reasonMoveTypeDatasource}
                                    reason_move_type={2}
                                />
                            </Form.Item>
                            <Form.Item hidden noStyle name='accountMoveReasonName' />
                            <Form.Item hidden name="isPayDebt" />
                        </FloatLabel>
                    </Col>
                </Row>
                <Row gutter={[12, 0]}>
                    <Col lg={12} sm={12}>
                        <FloatLabel label={t('receiptPartnerType')}>
                            <Form.Item name="partnerType" initialValue={ACCOUNT_MOVE_PARTNER_TYPE.Employee}>
                                <OrdSelect datasource={useSelectAccountMovePartnerType()} disabled={true} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={12} sm={12}>
                        <FloatLabel label={t('partnerPaymentVoucherName')} required>
                            <Form.Item
                                name='partnerId'
                            >
                                <PartnerInput disabled={true}
                                    partner_type={4}></PartnerInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
                <Row gutter={[12, 0]}>
                    <Col lg={12} sm={12}>
                        <FloatLabel label={t('Tổng tiền lương')}>
                            <Form.Item name="totalSalaryAmount">
                                <PriceNumberInput
                                    isOnlyNumberInput
                                    step={1000}
                                    formatter={formatterNumberInput}
                                    precision={0}
                                    min={0}
                                    disabled
                                    parser={parseNumber}
                                    style={{ width: '100%' }}></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={12} sm={12}>
                        <FloatLabel label={t('Đã thanh toán')}>
                            <Form.Item
                                name='paymentTotalSalary'
                            >
                                <PriceNumberInput
                                    isOnlyNumberInput
                                    step={1000}
                                    formatter={formatterNumberInput}
                                    precision={0}
                                    min={0}
                                    disabled
                                    parser={parseNumber}
                                    style={{ width: '100%' }}></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
                <Row gutter={[12, 0]}>
                    <Col lg={12} sm={12}>
                        <FloatLabel label={t('paymentMethod')} required>
                            <Form.Item name='paymentMethod' rules={[ValidateUtils.required]}>
                                <OrdSelect datasource={useSelectPaymentMethod()}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={12} sm={12} hidden={w_paymentMethod != PaymentMethodEnum.CHUYEN_KHOAN}>
                        <Form.Item name="shopBankAccountId" style={{ width: '100%' }}>
                            <ShopBankAccountInput onChange={(val: any, option: any) => onChangePaymentMethod(val, option)} />
                        </Form.Item>
                    </Col>
                    <Col lg={w_paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN ? 24 : 12} sm={w_paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN ? 24 : 16}>
                        <FloatLabel label={t('pay')} required>
                            <Form.Item name='amount' rules={[ValidateUtils.required, ValidateUtils.max(maxSalaryPay)]}>
                                <PriceNumberInput
                                    autoFocus
                                    isOnlyNumberInput
                                    step={1000}
                                    formatter={formatterNumberInput}
                                    precision={0}
                                    min={0}
                                    parser={parseNumber}
                                    style={{ width: '100%' }}></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={24} sm={24}>
                        <FloatLabel label={t('notes')}>
                            <Form.Item name='notes' rules={[ValidateUtils.maxLength(200, 'notes')]}>
                                <TextArea rows={2}></TextArea>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>

                <Form.Item hidden name='bankCode' />
                <Form.Item hidden name='bankAccountCode' />
                <Form.Item hidden name='bankAccountName' />
                <Form.Item hidden name='bankVirtualCode' />
                <Form.Item hidden name='relatedMoveId' />
                <Form.Item hidden name='relatedMoveType' />
                <Form.Item hidden name='relatedMoveDate' />
                <Form.Item hidden name='isIncludedFinancialReport' valuePropName="checked" initialValue={true} />
            </Form>
        </>
    });

    return (
        <>
            {stored.isOpenPaySalaryModal &&
                <Modal title={t("Phiếu chi trả lương")}
                    open={stored.isOpenPaySalaryModal}
                    width={550}
                    maskClosable={false}
                    style={{ top: '30px' }}
                    onClose={() => stored.closePaySalaryModal()}
                    onCancel={() => stored.closePaySalaryModal()}
                    destroyOnClose
                    footer={
                        <div
                            className="flex flex-wrap items-center justify-end  max-sm:flex-col">
                            <div className="flex items-center">
                                <Button className='me-2' onClick={() => stored.closePaySalaryModal()}>
                                    <Space.Compact><Space><CloseOutlined
                                        className="me-1" /></Space>{t('cancelModal')}
                                    </Space.Compact>
                                </Button>
                                <Button
                                    type='primary' onClick={debounce(onOkModal, 250)}>
                                    <Space.Compact> <Space><SaveOutlined
                                        className="me-1" /></Space>{t('Thanh toán')}
                                    </Space.Compact>
                                </Button>
                            </div>
                        </div>
                    }
                >
                    <FormPay
                    ></FormPay>
                </Modal>}
        </>
    );
}
export default observer(PaySalaryModal);
