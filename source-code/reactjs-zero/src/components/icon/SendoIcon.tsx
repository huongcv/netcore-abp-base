import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const SendoSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/sendo.svg"
            alt="image"
        />
    </>
);
export const SendoIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={SendoSvg} {...props} />
);
