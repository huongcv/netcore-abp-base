import {FormListFieldData} from "antd";
import {FormInstance} from "antd/es/form/hooks/useForm";

export interface IRightBoxProp {
    onSave: (isDraft: boolean) => void,
    formProductItems?: FormInstance,
}

export interface ProductItemFormProps {
    field: FormListFieldData,
    remove: (index: number | number[]) => void;
    formMoveTicket: FormInstance<any>;
}
export interface ProductShopItemFormProps extends ProductItemFormProps{
    fieldShop: FormListFieldData,
}
