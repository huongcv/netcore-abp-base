import {CustomIconComponentProps} from "./CustomIconComponentProps";
import Icon from "@ant-design/icons";

const OutOfStockSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/out-of-stock.svg"
            alt="image"/>
    </>
);
export const OutOfStockIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={OutOfStockSvg} {...props} />
);
