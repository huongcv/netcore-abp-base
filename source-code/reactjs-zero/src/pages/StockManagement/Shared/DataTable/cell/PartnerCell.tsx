import {PartnerDto, StockMovePagedOutputDto} from "@api/index.defs";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectPartnerSupplier} from "@ord-components/forms/select/selectDataSource/useSelectPartnerSupplier";
import {PhoneOutlined} from "@ant-design/icons";
import {Tag} from "antd";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import Utils from "@ord-core/utils/utils";

export const PartnerSupplierCell = (props: {
    record: StockMovePagedOutputDto
}) => {
    const {record} = props;
    const renderDisplay = (item: any) => {
        const data: PartnerDto = item?.data;
        if (data) {
            const {name, address, phone} = data;
            return (<>{name}
                {/*{*/}
                {/*    phone && <Tag className='ms-1'>*/}
                {/*        <PhoneOutlined></PhoneOutlined> {phone}*/}
                {/*    </Tag>*/}
                {/*}*/}
                {/*{*/}
                {/*    address && <div className='italic'>{address}</div>*/}
                {/*}*/}
            </>);
        }
        return null;
    }
    return (<>
        {
            record.partnerId &&
            <DisplayTextFormSelectDataSource value={record.partnerId}
                                             renderDisplay={renderDisplay}
                                             datasource={useSelectPartnerSupplier()}></DisplayTextFormSelectDataSource>
        }
    </>);

}
export const PartnerSupplierPhoneCell = (props: {
    record: StockMovePagedOutputDto
}) => {
    const {record} = props;
    const renderDisplay = (item: any) => {
        const data: PartnerDto = item?.data;
        if (data) {
            const {name, address, phone} = data;
            return (<>
                <TextLineClampDisplay content={Utils.transformPhoneNumber(phone || '')}/>
            </>);
        }
        return null;
    }
    return (<>
        {
            record.partnerId &&
            <DisplayTextFormSelectDataSource value={record.partnerId}
                                             renderDisplay={renderDisplay}
                                             datasource={useSelectPartnerSupplier()}></DisplayTextFormSelectDataSource>
        }
    </>);

}
