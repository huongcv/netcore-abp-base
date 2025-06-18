import {ProductInventoryMoveDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {FilterOutlined} from "@ant-design/icons";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React from "react";
import {useSelectMoveType} from "@ord-components/forms/select/selectDataSource/useSelectMoveType";

export const MoveCodeCell = (props: {
    record: ProductInventoryMoveDto,
}) => {
    const {record} = props;
    return (<>
        <a className={'font-bold row-move-type-' + record.moveType}>{record.moveCode}</a>
        {/*<div className={'italic'}>
            {DateUtil.showWithFormat(record.moveDate, 'dd/MM/yyyy HH:mm')}
        </div>*/}
    </>);
}

export const MoveTypeWithAddFilter = (props: {
    record: ProductInventoryMoveDto,
    addFilterMoveType: (moveType: any) => void
})=>{
    const {record, addFilterMoveType} = props;
    const moveType_Ds = useSelectMoveType();
    return (<>
        <DisplayTextFormSelectDataSource value={record.moveType} datasource={moveType_Ds}/>
        {/*<a className={'ms-2 text-blue-600'} onClick={() => addFilterMoveType(record.moveType)}>*/}
        {/*    <FilterOutlined/>*/}
        {/*</a>*/}
    </>);
}
