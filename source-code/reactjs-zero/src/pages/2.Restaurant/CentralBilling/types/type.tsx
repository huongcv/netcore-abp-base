import { ProductSearchWithUnitDto } from "@api/index.defs";
import {FormListFieldData} from "antd";
import {FormInstance} from "antd/es/form/hooks/useForm";

export interface IRightBoxProp {
    formProductItems: FormInstance,
}

export interface ProductItemFormProps {
    field: FormListFieldData,
    remove: (index: number | number[]) => void;
    formInfo: FormInstance<any>;
}
export interface ProductShopItemFormProps extends ProductItemFormProps{
    fieldShop: FormListFieldData,
}

export interface IProductIItemFormInputProp {
    field: FormListFieldData,
    productItem: ProductSearchWithUnitDto,
    disabled?: boolean,
}