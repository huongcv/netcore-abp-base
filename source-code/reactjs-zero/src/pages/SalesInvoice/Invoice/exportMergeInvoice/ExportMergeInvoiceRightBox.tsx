import { SaleInvoiceDto } from "@api/index.defs";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import dateUtil from "@ord-core/utils/date.util";
import { useStore } from "@ord-store/index";
import { Flex, Form, Input, Table, TableColumnsType } from "antd";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import validateUtils from "@ord-core/utils/validate.utils";
import { SaleInvoiceStatusCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";


const ExportMergeInvoiceRightBox = () => {
    const form = Form.useFormInstance();
    const { exportEInvoiceStore: mainStore } = useStore();
    const { t } = useTranslation('sale-invoice');
    const { selectedRows: dataSource } = mainStore;
    const pageIndexRef = useRef<number>(1);
    const pageSize = 5;

    const columns: TableColumnsType<SaleInvoiceDto> = [
        {
            title: t('invoiceCode'),
            dataIndex: 'invoiceCode',
            width: 240,
            align: 'left',
            render: (v, record: SaleInvoiceDto) => {
                return (
                    <>
                        <p>{record.invoiceCode}</p>
                        <i>{dateUtil.toFormat(record.invoiceDate)}</i>
                    </>
                )
            }
        },

        {
            title: t('partnerName'),
            dataIndex: 'partnerName',
            ellipsis: true,
            align: 'left',
        },
        {
            dataIndex: 'totalAmountRound',
            title: t('productAmount'),
            align: 'end',
            render: v => <PriceCell value={v} />,
            width: 130,
        },
        {
            dataIndex: 'status',
            title: t('status'),
            align: 'center',
            render: (v) => <SaleInvoiceStatusCell status={v} />,
            width: 130,
        },
    ];

    useEffect(() => {
        form.setFieldValue('eInvoiceBuyerName', "Khách không lấy hoá đơn");
    }, [])

    return (<div className='grid-product-item-container'>
       
        <h3 className={'font-bold text-xl'}>{t('Thông tin hoá đơn điện tử')}</h3>
        <div className="flex justify-between items-center ">
            <div>
                {t("eInvoiceBuyerName")}
                <span className="text-red"> *</span>
            </div>
            <Flex className="items-center cs-input" style={{ flex: 1 }}>
                <Form.Item
                    rules={[validateUtils.required]}
                    name={"eInvoiceBuyerName"}
                    style={{ width: '100%' }}
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
            <Flex className="items-center cs-input" style={{ flex: 1 }}>
                <Form.Item name={"eInvoiceCompany"} style={{ width: '100%' }}>
                    <Input
                        placeholder={t("eInvoiceCompany")}
                        className="border-none w-full"
                    ></Input>
                </Form.Item>
            </Flex>
        </div>
        <div className="flex justify-between items-center ">
            <div>{t("eInvoiceTaxCode")}</div>
            <Flex className="items-center cs-input" style={{ flex: 1 }}>
                <Form.Item name={"eInvoiceTaxCode"} style={{ width: '100%' }}>
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
            <Flex className="items-center cs-input" style={{ flex: 1 }}>
                <Form.Item
                    name={"eInvoiceBuyerAddress"}
                    style={{ width: '100%' }}
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
            <Flex className="items-center cs-input" style={{ flex: 1 }}>
                <Form.Item name={"eInvoiceBuyerPhone"} style={{ width: '100%' }}>
                    <Input
                        placeholder={t("eInvoiceBuyerPhone")}
                        className="border-none w-full"
                    ></Input>
                </Form.Item>
            </Flex>
        </div>
        <div className="flex justify-between items-center ">
            <div>{t("eInvoiceBuyerEmail")}</div>
            <Flex className="items-center cs-input" style={{ flex: 1 }}>
                <Form.Item name={"eInvoiceBuyerEmail"} style={{ width: '100%' }}>
                    <Input
                        placeholder={t("eInvoiceBuyerEmail")}
                        className="border-none w-full"
                    ></Input>
                </Form.Item>
            </Flex>
        </div>

        <h3 className={'font-bold text-xl mb-3 mt-[20px]'}>{t('Danh sách đã chọn')}</h3>
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            bordered={true}
            pagination={{
                pageSize: pageSize,
                onChange: (page, pageSize) => {
                    pageIndexRef.current = page;
                },
            }}
        />
    </div>
    )
};
export default ExportMergeInvoiceRightBox;
