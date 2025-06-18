import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const ShoppeSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/shoppe.svg"
            alt="image"
        />
    </>
);
export const ShoppeIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={ShoppeSvg} {...props} />
);
