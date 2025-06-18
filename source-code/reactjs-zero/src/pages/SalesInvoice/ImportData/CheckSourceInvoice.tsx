import {ImportSaleInvoiceInputDto, ImportSaleInvoiceOutputDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import {Select, Table, TableProps} from "antd";
import {Option} from "antd/lib/mentions";
import {useState} from "react";
import DateUtil from "@ord-core/utils/date.util";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectEmployee} from "@ord-components/forms/select/selectDataSource/useSelectEmployee";

const CheckSourceInvoice = ({ result }: any) => {
    const resultImport = result as ImportSaleInvoiceOutputDto;
    const [dataSource, setDataSource] = useState<ImportSaleInvoiceInputDto[]>(result.errorImportList ?? []);
    //console.log(resultImport, dataSource);
    const {t} = useTranslation('sale-invoice');
    const {t: tCommon} = useTranslation('common');
    
    const handleDataSourceChange = (value : any) => {
        if (value === 'error') {
            setDataSource(resultImport?.errorImportList ?? []);
        } else if (value === 'success') {
            setDataSource(resultImport?.successImportList ?? []);
        }
    };
    const paymentMethods = useSelectPaymentMethod();
    const employees = useSelectEmployee();   
    // const clearModal = () => {
    //     setDataSource([]);
    // };
    // useEffect(() => {
    //     clearModal();
    // }, []);
    const columns: TableProps<ImportSaleInvoiceInputDto>['columns'] = [
        {
            title: t('stt'),
            dataIndex: 'stt',
            key: 'stt',
            width: 50,
            align: 'center',
        },
        {
            title: t('invoiceDate'),
            dataIndex: 'invoiceDate',
            width: 120,
            align: 'center',
            render: (v)=>{
                return DateUtil.toFormat(v);
            },
        },
        {
            title: t('paymentMethod'),
            dataIndex: 'paymentMethod',
            width: 120,
            align: 'center',
            render: v =>{
                return  (<><DisplayTextFormSelectDataSource value={v} datasource={paymentMethods} /></>)
            }
        },        
        {
            title: t('salePartner'),
            dataIndex: 'salePartnerId',
            width: 180,
            align: 'left',
            render: v =>{
                return  (<><DisplayTextFormSelectDataSource value={v} datasource={employees} /></>)
            }
        },
        {
            title: t('totalAmount'),
            dataIndex: 'totalAmount',
            width: 130,
            align: 'end',
            render: v => (<PriceCell value={v} />),
        },
        {
            title: t('strError'),
            dataIndex: 'strError',
            width: 200,
            align: 'left',
            render: (text) => <p style={{color:"red"}}>{text}</p>
        }
    ]
    return (
        <>
            <p style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: "600",
                color: "#3BB54A",
            }}>{t('fileExcel.checkErrorTitle')}</p>
            <div className={'py-3'} style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{
                    display: 'flex',
                    alignItems: 'end',
                    fontSize: 14,
                    fontWeight: "600"
                }}>
                    <p style={{
                        color: '#3BB54A',
                        marginRight: 5
                    }}>{tCommon('excelAlert.selectCheck.success')}: {resultImport.succesImportCount}</p>
                    <p style={{
                        color: 'red',
                        marginLeft: 5
                    }}>{tCommon('excelAlert.selectCheck.error')}: {resultImport.errorImportCount}</p>
                </div>
                <Select defaultValue="error" style={{width: 200}} onChange={handleDataSourceChange}>
                    <Option value="success">{tCommon('excelAlert.selectCheck.success')}</Option>
                    <Option value="error">{tCommon('excelAlert.selectCheck.error')}</Option>
                </Select>
            </div>
            <Table<ImportSaleInvoiceInputDto> columns={columns} dataSource={dataSource}/>
        </>
    );
};

export default CheckSourceInvoice;
