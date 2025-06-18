import {StockMovePagedOutputDto} from "@api/index.defs";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";

export const InventoryCell = (props: {
    record: StockMovePagedOutputDto
}) => {
    const {record} = props;
    const renderDisplay = (item: any) => {
        const data = item?.data;
        return (<>{data?.inventoryName}</>);
    }

    return (<>
        {
            record.inventoryId &&
            <DisplayTextFormSelectDataSource value={record.inventoryId}
                                             renderDisplay={renderDisplay}
                                             datasource={useSelectStock()}></DisplayTextFormSelectDataSource>

        }
    </>);

}


