import {StockMovePagedOutputDto} from "@api/index.defs";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectMoveType} from "@ord-components/forms/select/selectDataSource/useSelectMoveType";

export const MoveTypeCell = (props: {
    record: StockMovePagedOutputDto
}) => {
    const {record} = props;


    return (<>
        {
            record.inventoryId &&
            <DisplayTextFormSelectDataSource value={record.moveType}
                                             datasource={useSelectMoveType()}></DisplayTextFormSelectDataSource>

        }
    </>);

}


export const MoveTypeDisplayText = (props: {
    value?: any
}) => {
    const ds = useSelectMoveType();
    return (<DisplayTextFormSelectDataSource value={props.value}
                                             datasource={ds}></DisplayTextFormSelectDataSource>);
}
