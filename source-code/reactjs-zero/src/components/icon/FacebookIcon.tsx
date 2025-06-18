import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const FacebookSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/facebook.svg"
            alt="image"
        />
    </>
);
export const FacebookIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={FacebookSvg} {...props} />
);
