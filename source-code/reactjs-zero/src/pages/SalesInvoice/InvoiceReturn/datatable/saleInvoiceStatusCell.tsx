import {Tag} from "antd";
import {useTranslation} from "react-i18next";
export const SaleInvoiceStatusCell = (prop: {
    status?: number | null
}) => {
    const {t:tEnum} = useTranslation('enum');
    const status = () => {
        switch (prop.status) {
            case 1 :
                return (<Tag className="min-w-[100px] text-center text-[#636363] bg-[#EEEEEE]" bordered={false}>
                    {tEnum('SaleInvoiceStatus.Draft')}
                </Tag>);
            case 3:
                return (<Tag className="me-0 ord-cell-inactived" bordered={false}>
                    {tEnum('SaleInvoiceStatus.Canceled')}
                </Tag>);
            case 4:
                return (<Tag className="me-0 ord-cell-actived" bordered={false}>
                    {tEnum('SaleInvoiceStatus.Completed')}
                </Tag>);
            default:
        }
    }
    return (<>{status()}</>);
}
