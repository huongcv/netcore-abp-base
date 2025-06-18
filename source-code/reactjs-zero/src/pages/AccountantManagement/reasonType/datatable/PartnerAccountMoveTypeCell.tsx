import {useSelectCustomerGroupType} from "@ord-components/forms/select/selectDataSource/useSelectCustomerGroupType";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import { useSelectAccountMovePartnerType } from "@ord-components/forms/select/selectDataSource/useSelectAccountMovePartnerType";

export const PartnerAccountMoveTypeCell = (props: {
    value: number
}) => {
    const selectAccountMovePartnerType = useSelectAccountMovePartnerType();
    return <DisplayTextFormSelectDataSource
        datasource={selectAccountMovePartnerType}
        value={props.value}/>
}
