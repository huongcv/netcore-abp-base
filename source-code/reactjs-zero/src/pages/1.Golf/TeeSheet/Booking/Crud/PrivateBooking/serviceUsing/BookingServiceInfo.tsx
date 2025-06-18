import React, {useRef} from 'react';
import {Button, Card, Form, Table, TableColumnsType} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import SelectServiceForBooking
    from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/SelectServiceForBooking";
import FormList from "antd/es/form/FormList";
import {SaleInvoiceDetailDto} from '@api/index.defs';
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import TableUtil from "@ord-core/utils/table.util";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {useTranslation} from "react-i18next";


const BookingServiceInfo = (props: {
    allowCru: boolean,
    title: string,
    fieldName: string,
    discountPercent?: number
}) => {

    const form = Form.useFormInstance();
    const {
        golfBookingStore: bookingStore,
        entityModalStore
    } = useStore();

    const {t} = useTranslation(bookingStore.getNamespaceLocale());
    const tempSelectedRef = useRef<SaleInvoiceDetailDto[]>([]);

    const clickAdd = () => {
        const modalId = "selectServiceModal";
        const selectedRecords = form.getFieldValue(props.fieldName);
        entityModalStore.openModalForm({
            entity: {},
            modal: {
                width: 1024,
                hiddenOk: true,
                otherBtn: <>
                    <Button type='primary' onClick={() => {
                        entityModalStore.closeModal(modalId);
                        console.log(" tempSelectedRef.current", tempSelectedRef.current)
                        form.setFieldValue(props.fieldName, tempSelectedRef.current);
                    }}>
                        Áp dụng
                    </Button>
                </>,
                ignoreFormEntity: true,
                title: t("selectServiceModal"),
            },

            formContent: () => (
                <SelectServiceForBooking
                    discountPercent={props.discountPercent}
                    onSelectedChange={(ids, records, action, record) => {
                        tempSelectedRef.current = records; //  cập nhật tức thì vào ref
                        console.log("records", records)
                        // form.setFieldValue(selectedServiceName, records);
                    }}
                    selectedRecords={selectedRecords}/>
            ),
            onSave: async (saveData) => {
                return true;
            },
            onClose: () => {
                // setTempSelected([]);
            },
        }, modalId);
    };
    const removeRowRef = useRef<(index: number) => void | undefined>();
    const handleRemoveRow = (index: number) => {
        if (removeRowRef.current) {
            removeRowRef.current(index);
        }
    };
    const columns: TableColumnsType<SaleInvoiceDetailDto> = TableUtil.getColumns(
        [
            {
                title: 'name',
                dataIndex: 'productName',
                width: 300,
                render: (t: string) => {
                    return <TextLineClampDisplay content={t}></TextLineClampDisplay>
                }
            },
            {
                dataIndex: 'qty',
                title: 'qty',
                width: 100,
                align: 'center',
                render: (v: number) => {
                    return <span>{v}</span>
                }
            },
            {
                dataIndex: 'discountPercent',
                title: 'discountPercent',
                width: 100,
                align: 'center',
                render: (v: number) => {
                    return <span>{v}%</span>
                }
            },
            // {
            //     dataIndex: 'productUnitName',
            //     title: 'productUnitName',
            //     align: 'center',
            //     width: 120,
            // },
            // {
            //     dataIndex: 'productPrice',
            //     title: 'productPrice',
            //     align: 'end',
            //     render: (v, dto) => (<>
            //         <PriceCell value={v}/>
            //     </>),
            //     width: 110,
            // },
            {
                dataIndex: 'totalAmount',
                title: 'totalAmount',
                align: 'end',
                render: (v, dto) => (<>
                    <PriceCell value={v} />
                </>),
                width: 110,
            },
            {
                title: '',
                hidden: !props.allowCru,
                dataIndex: 'delete',
                align: 'center',
                width: 40,
                render: (_, record, idx) => {
                    return (
                        <Button type='link' danger onClick={() => handleRemoveRow(idx)}>
                            <DeleteOutlined></DeleteOutlined>
                        </Button>
                    );
                },
            },
        ],
        {
            ns: bookingStore.getNamespaceLocale(),
            widthRowIndexCol: 50,
        }
    );
    return (
        <Card title={<strong>{props.title}</strong>}
              className='mb-4'
              styles={
                  {
                      header: {
                          borderBottom: "none",
                          marginTop: "10px"
                      },
                  }
              }
              extra={<>
                  {props.allowCru &&  <Button onClick={() => clickAdd()}>
                      <PlusOutlined></PlusOutlined>
                      {t('addService')}
                  </Button>}

              </>}
        >
            <FormList name={props.fieldName}>
                {(fields, {add, remove}) => {
                    // addRowRef.current = add;
                    removeRowRef.current = remove;
                    return <Table<SaleInvoiceDetailDto>
                        dataSource={fields.map((field, index) => {
                            return {
                                ...form.getFieldValue([props.fieldName, index]),
                                rowKey: "" + field.key,
                            }
                        })}
                        columns={columns}
                        pagination={false}
                        rowKey={(d) => `${d.productId}`}
                    />
                }}
            </FormList>
        </Card>
    );
};


export default observer(BookingServiceInfo);
