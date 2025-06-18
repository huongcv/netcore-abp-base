import Icon from "@ant-design/icons";
import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";

const MinusSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/minus.svg"
            alt="image"/>
    </>
);
export const MinusIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={MinusSvg} {...props} />
);
