import {useSelectAccountMoveType} from "@ord-components/forms/select/selectDataSource/useSelectAccountMoveType";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";

export const AccountMoveTypeCell = (props: {
    value: number
}) => {
    const selectAccountMoveType = useSelectAccountMoveType();
    return <DisplayTextFormSelectDataSource
        datasource={selectAccountMoveType}
        value={props.value}/>
}
