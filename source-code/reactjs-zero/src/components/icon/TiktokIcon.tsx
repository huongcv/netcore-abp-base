import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const TiktokSvg = (data: any) => (
    <>
        <img
            width={24} height={24}
            src="/icon-svg/tiktok.svg"
            alt="image"
        />
    </>
);
export const TiktokIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={TiktokSvg} {...props} />
);
