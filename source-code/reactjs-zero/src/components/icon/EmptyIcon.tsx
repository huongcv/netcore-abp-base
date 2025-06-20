import {CustomIconComponentProps} from "./CustomIconComponentProps";
import Icon from "@ant-design/icons";

const Svg = (data: any) => (
    <>
        <img
            src="/icon-svg/empty.svg"
            alt="image"/>
    </>
);
export const EmptyIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
