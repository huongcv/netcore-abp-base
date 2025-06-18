import {
    Button, Checkbox,
    Col,
    Form,
    FormInstance,
    GetRef,
    Input,
    InputNumber,
    InputNumberProps,
    Modal,
    Radio,
    Row,
    Space,
    Table,
    TableProps,
    Tag
} from "antd";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import UiUtils from "@ord-core/utils/ui.utils";
import {AccountMoveDto, DebtInfo_DetailsDto, DebtInfoDto, MoveReasonTypeDto, PARTNER_TYPE} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {debounce, sumBy} from "lodash";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";
import CashbookStore from "@ord-store/Accountant/cashbookStore";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectPartnerType} from "@ord-components/forms/select/selectDataSource/useSelectPartnerType";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import MoveReasonTypeInput from "@pages/AccountantManagement/Shared/forms/MoveReasonTypeInput";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";
import {StatusAccMoveElm} from "@pages/AccountantManagement/cashbook/TableCashbook";
import Utils from "@ord-core/utils/utils";
import OrdRadio from "@ord-components/forms/select/OrdRadio";
import {
    useSelectAccountMovePartnerType
} from "@ord-components/forms/select/selectDataSource/useSelectAccountMovePartnerType";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {AccountMoveService} from "@api/AccountMoveService";
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import ShopBankAccountInput from "@pages/SalesInvoice/Form/shopBankAccountInput";

const {TextArea} = Input;
const formatterNumber = Utils.formatterNumber;
const formatterNumberInput = Utils.formatterNumberInput;

// const  formatterNumber = (value: string)=>  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const parseNumber = (value: string | undefined) => value?.replace(/\\s?|(,*)/g, '') as unknown as number;
const ModalCruReceipt = (props: {
    stored: CashbookStore,
    onSaveSuccess: () => void;
}) => {
    const {t} = useTranslation(['cashbook',
        'customer',
        'reason-type', 'customer-supplier']);
    const {createOrUpdateModal: modalData} = props.stored;
    const {accountMoveType: cruType} = modalData.entityData ?? {};
    const [cusForm] = Form.useForm<any>();
    const isDisableForm = () => {
        return props.stored.createOrUpdateModal.mode !== "addNew";
    }
    const w_paymentMethod = Form.useWatch('paymentMethod', cusForm);

    useEffect(() => {
        if (!modalData.visible) {
            cusForm.resetFields();
            return;
        }

        const {entityData} = modalData;
        const {mode} = props.stored.createOrUpdateModal;

        if (entityData) {
            fetchData(modalData.entityData?.id ?? "0");
        } else {
            cusForm.setFieldsValue(props.stored.getInitModal().entityData);
        }

        if (mode === "addNew") {
            cusForm.setFieldValue("accountMoveDate", null);
            cusForm.setFieldValue("isIncludedFinancialReport", true);
            cusForm.setFieldValue("paymentMethod", PaymentMethodEnum.TIEN_MAT);

        }

    }, [modalData.visible]);

    const fetchData = async (id: string) => {

        const findId = parseInt(id);
        if (findId == 0) {
            return;
        }

        try {
            const result = await AccountMoveService.getById({id: findId});
            cusForm.setFieldsValue(result);
            console.log(cusForm.getFieldsValue());
        } catch {
            cusForm.resetFields();
        }
    };

    const onChangePaymentMethod = (val: any, option: any) => {
        cusForm.setFieldValue('bankCode', option.data?.bankCode); 
        cusForm.setFieldValue('bankAccountCode', option.data?.accountCode);
        cusForm.setFieldValue('bankAccountName', option.data?.accountName); 
        cusForm.setFieldValue('bankVirtualCode', option.data?.virtualUserName); 
    }

    const onOkModal = async () => {
        try {
            let data: any; 
            try {
                data = await cusForm.validateFields();
              } catch (error: any) {
                console.log("Chi tiết lỗi:", error.errorFields);
                return;
              }
            
            UiUtils.setBusy();
            try {
                const isCreate = modalData.mode === 'addNew';
                const input: AccountMoveDto = {
                    ...data,
                    accountMoveType: cruType
                };
                await props.stored.createEntity(input).then(result => {
                    if (result) {
                        let key = cruType == 1 ? "Payer" : "Receive";
                        UiUtils.showSuccess(t(isCreate ? key + 'AddNewSuccess' : key + 'UpdateSuccess', {
                            ...data
                        }) as any);
                        cusForm.resetFields();
                        props.stored.closeModal(true)
                        props.onSaveSuccess();
                    }
                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }

    ///#region FormPay
    const FormPay = observer((prop: {
        dataForm: DebtInfoDto | undefined | null,
        form: FormInstance,
        onDataSourceChange: (val: DebtInfo_DetailsDto[]) => void;
    }) => {
        let {form: cusForm} = prop;
        const [dataSource, setDataSource] =
            useState<DebtInfo_DetailsDto[]>(modalData.entityData?.debtDetails ?? []);
        const [partnerType, setPartnerType] =
            useState<PARTNER_TYPE>();


        useEffect(() => {
            prop.onDataSourceChange(dataSource);
        }, [dataSource])


        useEffect(() => {
            if (props.stored.createOrUpdateModal.entityData?.partnerType) {
                setPartnerType(props.stored.createOrUpdateModal.entityData?.partnerType);
            }
        }, [props.stored.createOrUpdateModal.entityData?.partnerType])

        useEffect(() => {
            if (modalData.mode === 'addNew') {
                cusForm.setFieldValue("partnerId", null);
                cusForm.setFieldValue("partnerName", null);
            }
        }, [Form.useWatch("partnerType", cusForm)])

        const partnerType_w = Form.useWatch("partnerType", cusForm);

        const onChangeDebtAm: InputNumberProps['onChange'] = (value) => {
            cusForm.setFieldValue('debtLater', (cusForm.getFieldValue('currentDebt')) - (value as number));
            let val = value as number;
            dataSource.forEach(item => {
                const debtAmount = item.debtAmount ?? 0;
                if (debtAmount > 0) {
                    if (debtAmount >= val) {
                        item.customerPays = val;
                        val = 0;
                        return false;
                    } else {
                        const clTong = val - debtAmount;
                        if (clTong == 0) {
                            return false;
                        } else if (clTong > 0) {
                            item.customerPays = item.debtAmount;
                            val -= (item.customerPays ?? 0)
                        } else {
                            item.customerPays = clTong;
                            val -= (item.customerPays ?? 0)
                        }
                    }
                }
            })
            setDataSource([...dataSource]);
        };
        ///#region TablePay
        const TablePay = () => {
            type FormInstance<T> = GetRef<typeof Form<T>>;
            const EditableContext = React.createContext<FormInstance<any> | null>(null);

            interface EditableRowProps {
                index: number;
            }

            const EditableRow: React.FC<EditableRowProps> = ({index, ...propsRow}) => {
                const [form] = Form.useForm();
                return (
                    <Form form={form}
                          disabled={isDisableForm()}
                          component={false}>
                        <EditableContext.Provider value={form}>
                            <tr {...propsRow} />
                        </EditableContext.Provider>
                    </Form>
                );
            };

            interface EditableCellProps {
                title: React.ReactNode;
                editable: boolean;
                dataIndex: keyof DebtInfo_DetailsDto;
                record: DebtInfo_DetailsDto;
                handleSave: (record: DebtInfo_DetailsDto) => void;
            }

            const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                            title,
                                                                                            editable,
                                                                                            children,
                                                                                            dataIndex,
                                                                                            record,
                                                                                            handleSave,
                                                                                            ...restProps
                                                                                        }) => {
                const [editing, setEditing] = useState(false);
                const inputRef = useRef<any>(null);
                const form = useContext(EditableContext)!;
                useEffect(() => {
                    if (editing) {
                        inputRef.current?.focus();
                    }
                }, [editing]);

                const toggleEdit = () => {
                    if (!isDisableForm()) {
                        setEditing(!editing);
                        form.setFieldsValue({[dataIndex]: record[dataIndex]});
                    }
                };

                const save = async () => {
                    try {
                        const values = await form.validateFields();
                        toggleEdit();
                        handleSave({...record, ...values});
                    } catch (errInfo) {
                        console.log('Save failed:', errInfo);
                    }
                };

                let childNode = children;

                if (editable) {
                    childNode = editing ? (
                        <Form.Item
                            style={{margin: 0}}
                            name={dataIndex}
                        >
                            <InputNumber
                                step={1000}
                                max={record.debtAmount}
                                ref={inputRef}
                                precision={2}
                                onPressEnter={save} onBlur={save}
                                formatter={formatterNumberInput}
                                parser={parseNumber}
                                style={{width: '100%'}}></InputNumber>
                        </Form.Item>
                    ) : (
                        <div
                            className={isDisableForm() ? '' : 'editable-cell-value-wrap'}
                            style={{paddingInlineEnd: 0}}
                            onClick={toggleEdit}
                        >
                            {children}
                        </div>
                    );
                }

                return <td {...restProps}>{childNode}</td>;
            };
            type ColumnTypes = Exclude<TableProps['columns'], undefined>;
            const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
                {
                    title: t('moveCode'),
                    dataIndex: 'moveCode',
                    width: '30%',
                    render: (v: string, record: DebtInfo_DetailsDto) => {
                        return <>
                            <div>{v}</div>

                        </>;
                    },
                    //
                },
                {
                    title: t('moveDate'),
                    dataIndex: 'moveDate',
                    align: 'right',
                    render: (v) => DateUtil.toFormat(v, 'DD/MM/YYYY HH:mm')
                },
                {
                    title: t('customerPays'),
                    dataIndex: 'customerPays',
                    editable: true,
                    width: 250,
                    align: 'right',
                    render: (v: string, record: DebtInfo_DetailsDto) => {
                        return <>
                            {v ? formatterNumber(v, 0) : "-"}
                        </>;
                    },
                },
            ];


            const handleSave = (row: DebtInfo_DetailsDto) => {
                const newData = [...dataSource];
                const index = newData.findIndex((item) => row.stockInventoryMoveId === item.stockInventoryMoveId);
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setDataSource(newData);

                const tong = sumBy(newData, x => x.customerPays ?? 0)
                cusForm.setFieldValue('amount', tong);
                cusForm.setFieldValue('debtLater', (cusForm.getFieldValue('currentDebt')) - (tong as number))
            };

            const components = {
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            };

            const columns = defaultColumns.map((col) => {
                if (!col.editable) {
                    return col;
                }
                return {
                    ...col,
                    onCell: (record: DebtInfo_DetailsDto) => ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave,
                    }),
                };
            });


            return <>
                <Table
                    pagination={false}
                    components={components}
                    rowKey={(d) => `${d.stockInventoryMoveId}_${d.invoiceId}`}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                />
            </>
        }
        ///#endregion end TablePay

        return <>
            <Form form={cusForm}
                  layout={'vertical'}>
                <Row gutter={[16, 0]}>
                    <Col lg={10} sm={24}>
                        <FloatLabel label={cruType == 1 ? t('accountMoveDatePayper') : t('accountMoveDateReceipt')}>
                            <Form.Item name='accountMoveDate'>
                                <OrdDateInput
                                    disabledDate={DateUtil.disableAfterNow}
                                    disabled={isDisableForm()}
                                    format={{
                                        format: 'DD/MM/YYYY HH:mm',
                                        type: 'mask'
                                    }}
                                    showTime={true}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={14} sm={24}>
                        <div className="flex items-center gap-1">
                            <Form.Item name='isIncludedFinancialReport' valuePropName="checked">
                                <Checkbox disabled={isDisableForm()}>{t('isIncludedFinancialReport')}</Checkbox>
                            </Form.Item>
                            <Form.Item>
                                {modalData.entityData?.status ? (
                                    <StatusAccMoveElm
                                        status={modalData.entityData?.status}
                                        txt={modalData.entityData?.strStatus ?? ''}
                                    />
                                ) : (
                                    <Tag color={'default'}>{t('statusDraft')}</Tag>
                                )}
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
                <Row gutter={[12, 0]}>
                    <Col lg={24} sm={24}>
                        <FloatLabel label={cruType == 1 ? t('accountMoveReasonPayer') : t('accountMoveReasonReceipt')}
                                    required>
                            <Form.Item name='accountMoveReasonTypeId' rules={[ValidateUtils.required]}>
                                <MoveReasonTypeInput
                                    disabled={isDisableForm()}
                                    autoFocus
                                    onChange={(data, dataSelected) => {
                                        const temp: MoveReasonTypeDto = (dataSelected as IOrdSelectOption).data;
                                        // cusForm.setFieldValue('isPayDebt', temp.partnerType == 1 || temp.partnerType == 2);
                                        cusForm.setFields([
                                            {name: 'accountMoveReasonName', value: temp.reasonTypeName}
                                        ]);
                                    }}
                                    reason_move_type={cruType ?? 1}
                                    is_only_other_type={!isDisableForm()}
                                />
                            </Form.Item>
                            <Form.Item hidden noStyle name='accountMoveReasonName'/>
                            <Form.Item hidden name="isPayDebt"/>
                            <Form.Item hidden name="id"/>
                        </FloatLabel>
                    </Col>
                    <Col lg={8} sm={24}>
                        <FloatLabel label={cruType == 1 ? t('payerPartnerType') : t('receiptPartnerType')}>
                            <Form.Item name="partnerType" initialValue={1}>
                                <OrdSelect datasource={useSelectAccountMovePartnerType()} disabled={isDisableForm()}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={16} sm={24}>
                        <FloatLabel label={cruType == 1 ? t('partnerReceiptName') : t('partnerPaymentVoucherName')} required>
                            <Form.Item
                                name='partnerId'
                                hidden={isDisableForm() || partnerType_w == 999}
                                rules={(!isDisableForm() && partnerType_w !== 999) ? [ValidateUtils.required] : []}>
                                <PartnerInput disabled={isDisableForm()}
                                    onChange={(_, dataSelected) => {
                                        cusForm.setFields([
                                            { name: 'partnerName', value: dataSelected.data.name }
                                        ]);
                                    }}
                                    partner_type={Form.useWatch("partnerType", cusForm)}></PartnerInput>
                            </Form.Item>
                            <Form.Item name='partnerName' hidden={!isDisableForm() && partnerType_w !== 999} rules={[ValidateUtils.required]}>
                                <Input disabled={isDisableForm()} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
                <Row gutter={[12, 0]}>
                    <Col lg={8} sm={24}>
                        <FloatLabel label={t('paymentMethod')} required>
                            <Form.Item name='paymentMethod' rules={[ValidateUtils.required]}>
                                <OrdSelect datasource={useSelectPaymentMethod()} disabled={isDisableForm()}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={16} hidden={w_paymentMethod != PaymentMethodEnum.CHUYEN_KHOAN}>
                        <Form.Item name="shopBankAccountId" style={{ width: '100%' }}>
                            <ShopBankAccountInput onChange={(val: any, option: any) => onChangePaymentMethod(val, option)}/>
                        </Form.Item>
                    </Col>
                    <Col lg={w_paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN ? 24 : 16} sm={w_paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN ? 24 : 16}>
                        <FloatLabel label={t('pay')} required>
                            <Form.Item name='amount' rules={[ValidateUtils.required]}>
                                <PriceNumberInput
                                    isOnlyNumberInput
                                    disabled={isDisableForm()}
                                    step={1000}
                                    formatter={formatterNumberInput}
                                    precision={0}
                                    min={0}
                                    onChange={debounce(onChangeDebtAm, 200)}
                                    parser={parseNumber}
                                    style={{width: '100%'}}></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={24} sm={24}>
                        <FloatLabel label={t('notes')}>
                            <Form.Item name='notes' rules={[ValidateUtils.maxLength(200,'notes')]}>
                                <TextArea rows={2}></TextArea>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>

                <Form.Item hidden name='bankCode' />
                <Form.Item hidden name='bankAccountCode' />
                <Form.Item hidden name='bankAccountName' />
                <Form.Item hidden name='bankVirtualCode' />
            </Form>
            {Form.useWatch('isPayDebt', cusForm) && <TablePay></TablePay>}
        </>
    });
    ///#endregion End FormPay
    const titleModalCru = cruType == 1 ? t("titleCruReceipt") : t("titleCruPaymentVoucher")
    const titleModalView = cruType == 1 ? t("titleViewReceipt") : t("titleViewPaymentVoucher")
    return (
        <>
            {
                modalData.visible &&
                <Modal title={modalData.mode == 'viewDetail' ? titleModalView : titleModalCru}
                       open={modalData.visible}
                       width={modalData.width || 550}
                       maskClosable={false}
                       style={{top: '30px'}}
                       onCancel={() => props.stored.closeModal()}
                       destroyOnClose
                       footer={
                           <div
                               className="flex flex-wrap items-center justify-end  max-sm:flex-col">
                               <div className="flex items-center">
                                   <Button className='me-2' onClick={() => props.stored.closeModal()}>
                                       <Space.Compact><Space><CloseOutlined
                                           className="me-1"/></Space>{t('cancelModal')}
                                       </Space.Compact>
                                   </Button>
                                   <Button
                                       type='primary' onClick={debounce(onOkModal, 250)}>
                                       <Space.Compact> <Space><SaveOutlined
                                           className="me-1"/></Space>{t('saveModal')}
                                       </Space.Compact>
                                   </Button>
                               </div>
                           </div>
                       }
                >
                    <FormPay dataForm={modalData.entityData}
                             onDataSourceChange={(data) => {
                                 cusForm.setFieldValue('debtDetails', data);
                             }}
                             form={cusForm}
                    ></FormPay>
                    <Form form={cusForm}>
                        <Form.Item name='debtDetails' noStyle hidden>
                        </Form.Item>
                    </Form>
                </Modal>}
        </>
    );
}
export default observer(ModalCruReceipt);
