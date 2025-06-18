import {FormListFieldData} from "antd";
import {ProductSearchWithUnitDto} from "@api/index.defs";

export interface IProductIItemFormInputProp {
    field: FormListFieldData,
    productItem: ProductSearchWithUnitDto,
    enableAddNewEntity?: boolean,
    disabled?: boolean,
}
