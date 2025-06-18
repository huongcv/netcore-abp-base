import {PrescriptionDetail, SaleInvoiceDetailDto} from "@api/index.defs";
import {ProductSelectSearchApi} from "@ord-components/forms/ProductSelectSearchApi";
import {Form, Input, Table} from "antd";
import {useWatch} from "antd/es/form/Form";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import FormItem from "antd/es/form/FormItem";

interface SalePrescriptionTablePros {
    priceListId?: number;
}
const SalePrescriptionTable = (props: SalePrescriptionTablePros) => {
    const {t} = useTranslation('sale-invoice');
    const [dataSource, setDataSource] = useState<PrescriptionDetail[]>([]);

    const form = Form.useFormInstance();
    const prescriptionDetails_w = useWatch(["prescriptionInfo", "prescriptionDetails"], form);

    useEffect(() => {
        setDataSource(prescriptionDetails_w?.map((item: PrescriptionDetail, index: number) => ({
            ...item,
            key: index
        })) ?? []);
    }, [prescriptionDetails_w]);

    const columns = [
        {
            title: t('stt'),
            dataIndex: 'index',
            render: (_: any, __: any, index: number) => index + 1,
            align: "center",
            key: 'stt',
            width: 20
        },
        {
            title: t('prescriptionMedication'),
            key: 'medicineName',
            dataIndex: 'medicineName',
            align: "left",
            width: 300,
            render: (v: string, dto: PrescriptionDetail) => {
                return <>
                    <p className='font-bold'>{v}</p>
                    <i>Hoạt chất: {dto.tradeName}</i>
                </>
            }
        },
        {
            title: t('usageInstructions'),
            dataIndex: 'usageInstructions',
            key: 'usageInstructions',
            align: "left",
            width: 200
        },
        {
            title: t('qty'),
            key: 'qty',
            align: "right",
            width: 100,
            render: (_: any, dto: PrescriptionDetail) => {
                return <>
                    <p>{dto.quantity} ({dto.unitName})</p>
                </>
            }
        },
        {
            title: t('prescriptionSell'),
            key: 'prescriptionSell',
            align: "left",
            render: (_: any, dto: PrescriptionDetail, index: number) => {
                return <>
                    <FormItem name={['prescriptionInfo', 'prescriptionDetails', index, "productId"]}>
                        <ProductSelectSearchApi
                            allowClear={true}
                            priceListId={props.priceListId}
                            placeholder={"searchInputPlaceholder"}
                            onlyGetProductUsingInventory={false}
                            onProductSelected={data => {
                                form.setFieldValue(['prescriptionInfo', 'prescriptionDetails', index, "productId"], data?.productId);
                                if (data) {
                                    const detail: SaleInvoiceDetailDto = {
                                        ...data,
                                        qty: dto.quantity ?? 1,
                                        notes: dto.usageInstructions,
                                        idHash: data.productHashId,
                                        id: data.productId,
                                        price: data.price ?? 0,
                                        productPrice: data.price ?? 0,
                                        productUnitId: data.productUnitId,
                                        priceWithTax: data.productPriceWithTax ?? 0,
                                        totalAmountAfterDiscount: (dto.quantity ?? 1) * (data.price || 0),
                                    };
                                    form.setFieldValue(['saleInvoiceDetails', index], detail);
                                } else {
                                    const currentSaleDetails = [...(form.getFieldValue('saleInvoiceDetails') || [])];
                                    currentSaleDetails.splice(index, 1);
                                    form.setFieldValue('saleInvoiceDetails', [...currentSaleDetails]);
                                }
                            }}/>
                    </FormItem>
                </>
            }
        }

    ];
    return <Table columns={columns as any} bordered={true} dataSource={dataSource} pagination={false}/>
}

export default SalePrescriptionTable; 
