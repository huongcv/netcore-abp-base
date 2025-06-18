import {useCallback, useEffect, useState} from "react";
import {InvoiceReturnService} from "@api/InvoiceReturnService";
import {InvoiceReturnDetailSampleDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {ProductUitCell} from "@pages/SalesInvoice/InvoiceReturn/datatable/productUnitCell";
import {Tag} from "antd";

export const PopoverDetailInvoiceReturn = (props: {
    invoiceId: string;
}) => {
    const [details, setDetails] = useState<InvoiceReturnDetailSampleDto[]>([]);

    const updateDetails = useCallback((val:InvoiceReturnDetailSampleDto[]) => {
        setDetails(val)
        console.log('set', val);
        console.log(details);
    }, [details])

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        console.log('useEffect', details);
    }, [details]);

    const getList = () => {
        InvoiceReturnService.getDetailByInvoiceId({invoiceId: props.invoiceId}).then(rsp => {
            if(rsp.isSuccessful) {
                updateDetails(rsp.data || []);
                console.log(details)
            }
        })
    }

    return (<div className="flex flex-col w-[450px] gap-2">
        {details?.map((item, index) => (<>
            <div key={index} className="flex gap-3">
                <div>{DateUtil.toFormat(item.invoiceDate)}</div>
                <div>({item.invoiceCode})</div>
                <div className="flex gap-2 flex-1 justify-end">{item.productName}: {item.qty} <Tag color={'green'} style={{fontSize: 10}}><ProductUitCell productId={item.productId} value={item.productUnitId}></ProductUitCell></Tag></div>
            </div>
        </>))}
    </div>)
}