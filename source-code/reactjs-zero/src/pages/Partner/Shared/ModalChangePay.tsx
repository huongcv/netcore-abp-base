import { PayCircleOutlined } from "@ant-design/icons";
import { AccountMoveService } from "@api/AccountMoveService";
import { DebtInfo_DetailsDto, DebtInfoDto, PARTNER_TYPE } from "@api/index.defs";
import { PartnerService } from "@api/PartnerService";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import {
    Col,
    Form,
    FormInstance,
    GetRef,
    Input,
    InputNumber,
    InputNumberProps,
    Modal,
    Row,
    Table,
    TableProps
} from "antd";
import dayjs from "dayjs";
import { debounce, sumBy } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const {TextArea} = Input;
const formatterNumber = Utils.formatterNumber;
const formatterNumberInput = Utils.formatterNumberInput;
const parseNumber = (value: string | undefined) => value?.replace(/\\s?|(,*)/g, '') as unknown as number;
const ModalChangePay = (prop: {
    onSaveSuccess?: Function,
    partnerType: number, 
}) => {
    const {t} = useTranslation(['partner_transaction']);
    const {partnerTransactionStore: mainStore} = useStore();
    const {changePayModal: modalData} = mainStore;
    const [cusForm] = Form.useForm<any>();
    const {partnerType} = prop;

    useEffect(() => {
        cusForm.resetFields();
        if (modalData.entityData) {
            cusForm.setFieldsValue(modalData.entityData);
            cusForm.setFieldValue("moveDate", null);
            cusForm.setFieldValue("paymentMethod", 1);
            cusForm.setFieldValue("partnerType", partnerType);
        }
    }, [modalData.entityData?.debtDetails])

    const onOkModal = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {

                PartnerService.payDebt({
                    body: {
                        ...data,
                        partnerId: modalData.entityData?.partnerId,
                    }
                }).then(res => {
                    if (res) {
                        if (res.isSuccessful) {
                            UiUtils.showSuccess(t('addNewSuccess'));
                            mainStore.closeViewChangePayModal(false);
                            if (prop.onSaveSuccess)
                                prop.onSaveSuccess();
                        } else
                            UiUtils.showError(res.message);
                    }
                    UiUtils.clearBusy()
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
    }) => {
        let {dataForm: entityData, form: cusForm} = prop;
        const [dataSource, setDataSource] =
            useState<DebtInfo_DetailsDto[]>(entityData?.debtDetails ?? []);

            const onChangeDebtAmount: InputNumberProps['onChange'] = (value) => {
                const currentDebt = modalData.entityData?.currentDebt ?? 0; 
                let adjustedValue = value as number;
                //   cusForm.setFieldValue('debtLater', currentDebt - adjustedValue);
            
                let isPayAll = false; 
                let debtLater = currentDebt - adjustedValue; 
                if(debtLater <= 0) {
                    isPayAll = true; 
                }
                
                let noSau = adjustedValue;
                dataSource.forEach(item => {
                    const debtAmount = item.debtAmount ?? 0;
                    if(isPayAll) {
                        item.customerPays = debtAmount;
                    }
                    else {
                        if (debtAmount > 0) {
                            if (debtAmount >= noSau) {
                                item.customerPays = noSau;
                                noSau = 0;
                                return false;
                            } else {
                                const clTong = noSau - debtAmount;
                                if (clTong === 0) {
                                    item.customerPays = debtAmount;
                                    noSau = 0;
                                    return false;
                                } else if (clTong > 0) {
                                    item.customerPays = debtAmount;
                                    noSau -= debtAmount;
                                } else {
                                    item.customerPays = noSau;
                                    noSau = 0;
                                }
                            }
                        }
                    }
                    
                });
            
                setDataSource([...dataSource]);
            };
        useEffect(() => {
            cusForm.setFieldValue('debtDetails', [...dataSource]);
        }, [dataSource])
        
        ///#region TablePay
        const TablePay = () => {

            // type FormInstance<T> = GetRef<typeof Form<T>>;

            // const EditableContext = React.createContext<FormInstance<any> | null>(null);

            // interface EditableRowProps {
            //     index: number;
            // }

            // const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
            //     const [form] = Form.useForm();
            //     return (
            //         <Form form={form} component={false}>
            //             <EditableContext.Provider value={form}>
            //                 <tr {...props} />
            //             </EditableContext.Provider>
            //         </Form>
            //     );
            // };

            // interface EditableCellProps {
            //     title: React.ReactNode;
            //     editable: boolean;
            //     dataIndex: keyof DebtInfo_DetailsDto;
            //     record: DebtInfo_DetailsDto;
            //     handleSave: (record: DebtInfo_DetailsDto) => void;
            // }

            // const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
            //     title,
            //     editable,
            //     children,
            //     dataIndex,
            //     record,
            //     handleSave,
            //     ...restProps
            // }) => {
            //     const [editing, setEditing] = useState(false);
            //     const inputRef = useRef<any>(null);
            //     const form = useContext(EditableContext)!;
            //     useEffect(() => {
            //         if (editing) {
            //             inputRef.current?.focus();
            //         }
            //     }, [editing]);

            //     const toggleEdit = () => {
            //         setEditing(!editing);
            //         form.setFieldsValue({[dataIndex]: record[dataIndex]});
            //     };

            //     const save = async () => {
            //         try {
            //             const values = await form.validateFields();
            //             toggleEdit();
            //             handleSave({...record, ...values});
            //         } catch (errInfo) {
            //             console.log('Save failed:', errInfo);
            //         }
            //     };

            //     let childNode = children;

            //     if (editable) {
            //         childNode = editing ? (
            //             <Form.Item
            //                 style={{margin: 0}}
            //                 name={dataIndex}
            //             >
            //                 <InputNumber
            //                     step={1000}
            //                     max={record.debtAmount}
            //                     ref={inputRef}
            //                     onPressEnter={save} onBlur={save}
            //                     formatter={formatterNumberInput}
            //                     parser={parseNumber}
            //                     style={{width: '100%'}}></InputNumber>
            //                 {/*<Input ref={inputRef} onPressEnter={save} onBlur={save}/>*/}
            //             </Form.Item>
            //         ) : (
            //             <div
            //                 className="editable-cell-value-wrap"
            //                 style={{paddingInlineEnd: 0}}
            //                 onClick={toggleEdit}
            //             >
            //                 {children}
            //             </div>
            //         );
            //     }

            //     return <td {...restProps}>{childNode}</td>;
            // };

            type ColumnTypes = Exclude<TableProps['columns'], undefined>;
            const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
                {
                    title: t('moveCode'),
                    dataIndex: 'moveCode',
                    width: '200px',
                    render: (v: string, record: DebtInfo_DetailsDto) => {
                        return <>
                            <div>{v}</div>
                        </>;
                    },
                },
                {
                    title: t('moveDate'),
                    dataIndex: 'moveDate',
                    width: '200px',
                    render: (v: any) => {
                        return <>
                            {DateUtil.toFormat(v, 'DD/MM/YYYY HH:mm')}
                        </>;
                    },
                },
                {
                    title: t('creatorShopName'),
                    dataIndex: 'shopName',
                    width: '200px',
                },
                // {
                //     title: t('totalAmount'),
                //     dataIndex: 'totalAmount',
                //     align: 'right',
                //     render: (v) => formatterNumber(v)
                // },
                // {
                //     title: t('paymentAmount'),
                //     dataIndex: 'paymentAmount',
                //     align: 'right',
                //     render: (v) => formatterNumber(v)
                // },
                {
                    title: t('customerPays'),
                    dataIndex: 'customerPays',
                    editable: true,
                    width: 250,
                    align: 'right',
                    render: (v: string, record: DebtInfo_DetailsDto) => {
                        return <>
                            {`${formatterNumber(v ?? 0, 0)} / ${formatterNumber(record.debtAmount ?? 0, 0)}`}
                        </>;
                    },
                },
            ];

            const handleSave = (row: DebtInfo_DetailsDto) => {
                const newData = [...dataSource];
                const index = newData.findIndex((item) => `${row.stockInventoryMoveId}_${row.invoiceId}` ===
                    `${item.stockInventoryMoveId}_${item.invoiceId}`);
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setDataSource(newData);

                const tong = sumBy(newData, x => x.customerPays ?? 0)
                cusForm.setFieldValue('amount', tong);
                cusForm.setFieldValue('debtLater', (modalData.entityData?.currentDebt ?? 0) - (tong as number))
            };

            // const components = {
            //     body: {
            //         row: EditableRow,
            //         cell: EditableCell,
            //     },
            // };

            // const columns = defaultColumns.map((col) => {
            //     if (!col.editable) {
            //         return col;
            //     }

            //     return {
            //         ...col,
            //     };
            // });

            return <>
                <Table
                    pagination={false}
                    rowKey={(d) => `${d.stockInventoryMoveId}_${d.invoiceId}`}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={defaultColumns}
                />
            </>
        }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = e.key.charCodeAt(0);
        // Chỉ cho phép số (0-9) và dấu chấm (.)
        if (charCode < 48 || charCode > 57) {
            e.preventDefault();
        }
    };

///#endregion end TablePay

        return <>
            <Form form={cusForm}
                layout={'vertical'}>
                <Row gutter={16}>
                    <Col span={12}>
                        <FloatLabel label={partnerType == 1 ? t('customerName') : t('supplierName')}><Input value={entityData?.partnerName} disabled /></FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('currentDebt')}>
                            <Form.Item name='currentDebt' rules={[ValidateUtils.required]}>
                                <InputNumber
                                    formatter={formatterNumberInput}
                                    parser={parseNumber}
                                    style={{ width: '100%' }} disabled></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t('paymentDate')} >
                            <Form.Item name='moveDate' >
                                <OrdDateTimeInput
                                    format={{
                                        format: 'DD/MM/YYYY HH:mm',
                                        type: 'mask'
                                    }}
                                    disabledDate={(current) => {
                                        return current && current.isAfter(dayjs(), "day")
                                    }}></OrdDateTimeInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('paymentMethod')}>
                            <Form.Item name='paymentMethod'>
                                <OrdSelect datasource={useSelectPaymentMethod()}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('pay')} required>
                            <Form.Item name='amount' rules={[ValidateUtils.required]}>
                                <InputNumber
                                    autoFocus
                                    step={1000}
                                    formatter={formatterNumberInput}
                                    onChange={debounce(onChangeDebtAmount, 200)}
                                    parser={parseNumber}
                                    style={{ width: '100%' }}
                                    onKeyPress={handleKeyPress}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t('notes')}>
                            <Form.Item name='notes'>
                                <TextArea rows={1}></TextArea>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Form.Item hidden name='debtDetails'>
                        <TextArea rows={2}></TextArea>
                    </Form.Item>
                    <Form.Item hidden name='partnerType'>
                    </Form.Item>
                </Row>
            </Form>
            <TablePay></TablePay>
        </>
    });
    ///#endregion End FormPay

    const titleModal = t('titleChangePay.' + partnerType)
    return (
        <>
            {
                modalData.visible &&
                <Modal title={titleModal}
                       open={modalData.visible}
                       width={modalData.width || 550}
                       maskClosable={false}
                       style={{top: '30px'}}
                       onCancel={() => mainStore.closeViewChangePayModal()}
                       destroyOnClose
                       footer={<FooterCrudModal
                           hiddenOk={modalData.mode === 'viewDetail'}
                           okBtn={<>
                               <PayCircleOutlined/>
                               <span className='ml-1'>{t('pay')}</span>
                           </>}
                           onOk={onOkModal} onCancel={() => {
                           mainStore.closeViewChangePayModal()
                       }}/>}
                >
                    <FormPay dataForm={modalData.entityData}
                             form={cusForm}
                    ></FormPay>
                </Modal>}
        </>
    );
}
export default observer(ModalChangePay);
