import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";

export interface SelectDataSource {
    data: IOrdSelectOption[],
    isPending: boolean,
    clearValue?: number
}
